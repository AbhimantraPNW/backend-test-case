import { NextFunction, Request, Response } from "express";
import { returnBook } from "../../src/controllers/members/member-return";
import db from "../db";

jest.mock("../db", () => ({
  query: jest.fn(),
}));

describe("POST /members/return", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<NextFunction>;

  beforeEach(() => {
    req = {
      body: {
        memberId: 1,
        bookId: 1,
        returnDate: "2024-06-20", // it depend end date borrowed book
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

  it("should apply a penalty if the book is returned late", async () => {
    const mockBorrowing = [
      {
        end_date: "2024-06-15",
        constructor: { name: "RowDataPacket" },
      },
    ];

    const mockMember = [
      {
        penalty_end_date: null,
        constructor: { name: "RowDataPacket" },
      },
    ];

    (db.query as jest.Mock)
      .mockResolvedValueOnce([mockBorrowing])
      .mockResolvedValueOnce([mockMember])
      .mockResolvedValueOnce({});

    await returnBook(req as Request, res as Response, next);
    expect(res.send).toHaveBeenCalledWith({
      message: "Book returned success",
      penaltyApplied: true,
    });
  });

  it("should not apply penalty if the book is returned on time", async () => {
    const mockBorrowing = [
      {
        end_date: "2024-06-20",
        constructor: { name: "RowDataPacket" },
      },
    ];

    const mockMember = [
      {
        penalty_end_date: null,
        constructor: { name: "RowDataPacket" },
      },
    ];

    (db.query as jest.Mock)
      .mockResolvedValueOnce([mockBorrowing])
      .mockResolvedValueOnce([mockMember])
      .mockResolvedValueOnce({});

    await returnBook(req as Request, res as Response, next);

    expect(res.status).toHaveBeenCalledTimes(0);
    expect(res.send).toHaveBeenCalledWith({
      message: "Book returned success",
      penaltyApplied: false,
    });
  });
});
