import { NextFunction, Request, Response } from "express";
import { borrowBook } from "../../src/controllers/members/member-borrow";
import { Member } from "../../src/controllers/members/types";
import db from "../db";

jest.mock("../db", () => ({
  query: jest.fn(),
}));

describe("POST /members/borrow", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<NextFunction>;

  beforeEach(() => {
    req = {
      body: {
        memberId: 2,
        borrowings: [
          {
            bookTitle: "Twilight",
            startDate: "2024-06-01",
            endDate: "2024-06-15",
          },
          //   {
          //     bookTitle: "A Study in Scarlet",
          //     startDate: "2024-06-01",
          //     endDate: "2024-06-15",
          //   },
          //   {
          //     bookTitle: "Twilight",
          //     startDate: "2024-06-01",
          //     endDate: "2024-06-15",
          //   },
        ],
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return an error if the member is currently penalized", async () => {
    const mockPenalizedMember: Member[] = [
      {
        id: 1,
        code: "M0CK1",
        name: "Mock Fullname",
        borrowed_books: 0,
        is_penalized: "true",
        penalty_end_date: new Date(),
        constructor: { name: "RowDataPacket" },
      },
    ];

    (db.query as jest.Mock).mockResolvedValueOnce([mockPenalizedMember]);

    await borrowBook(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: "Member is currently penalized",
    });
  });

  it("should return an error if the member has reached the borrowing limit", async () => {
    const mockMember: Member[] = [
      {
        id: 1,
        name: "Mock Fullname",
        is_penalized: "false",
        penalty_end_date: null,
        code: "M001",
        borrowed_books: 0,
        constructor: { name: "RowDataPacket" },
      },
    ];

    (db.query as jest.Mock).mockResolvedValueOnce([mockMember]);

    await borrowBook(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: "Borrowing limit exceeded",
    });
  });

  it("should return an error if the book is out of stock", async () => {
    const mockNonPenalizedMember: Member[] = [
      {
        id: 1,
        name: "Mock Fullname",
        is_penalized: "false",
        penalty_end_date: null,
        code: "M001",
        borrowed_books: 0,
        constructor: { name: "RowDataPacket" },
      },
    ];

    (db.query as jest.Mock).mockResolvedValueOnce(mockNonPenalizedMember);

    await borrowBook(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.send).toHaveBeenCalledWith({
      message: "Book out of stock",
    });
  });

  it("should borrow books successfully", async () => {
    const mockMember = {
      id: 1,
      name: "Mock Fullname",
      is_penalized: "false",
      penalty_end_date: null,
      code: "M001",
      borrowed_books: 0,
      constructor: { name: "RowDataPacket" },
    };

    const mockBooks = [
      { id: 1, code: "MB1", title: "Mock Book1", stock: 10 },
      { id: 2, code: "MB2", title: "Mock Book2", stock: 10 },
    ];

    (db.query as jest.Mock)
      // Mock member query
      .mockResolvedValueOnce([mockMember])
      // Mock book queries
      .mockResolvedValueOnce([mockBooks[0]])
      .mockResolvedValueOnce({ affectedRows: 1 })
      .mockResolvedValueOnce({ affectedRows: 1 })
      .mockResolvedValueOnce({ affectedRows: 1 })
      .mockResolvedValueOnce([mockBooks[1]])
      .mockResolvedValueOnce({ affectedRows: 1 })
      .mockResolvedValueOnce({ affectedRows: 1 })
      .mockResolvedValueOnce({ affectedRows: 1 });

    await borrowBook(req as Request, res as Response, next);

    expect(res.send).toHaveBeenCalledWith({
      message: "Books borrowed successfully",
      borrowedBooks: expect.arrayContaining([]),
    });
  });
});
