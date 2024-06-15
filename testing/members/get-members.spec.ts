import { NextFunction, Request, Response } from "express";
import { getMembers } from "../../src/controllers/members/get-members";
import db from "../../src/config/db";

// Mocked members data
const mockMembers = [
  {
    id: 1,
    code: "M001",
    name: "Angga",
    borrowed_books: 0,
    is_penalized: "false",
    penalty_end_date: null,
  },
  {
    id: 2,
    code: "M002",
    name: "Ferry",
    borrowed_books: 0,
    is_penalized: "false",
    penalty_end_date: null,
  },
  {
    id: 3,
    code: "M003",
    name: "Putri",
    borrowed_books: 0,
    is_penalized: "false",
    penalty_end_date: null,
  },
];

jest.mock("../../src/config/db");

describe("GET /members", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: jest.Mock<NextFunction>;

  beforeEach(() => {
    req = {};
    res = {
      send: jest.fn(),
    };
    next = jest.fn();
    (db.query as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should get members successfully", async () => {
    (db.query as jest.Mock).mockResolvedValueOnce([mockMembers]);

    await getMembers(req as Request, res as Response, next);

    expect(res.send).toHaveBeenCalledWith({
      message: "Success",
      data: mockMembers,
    });

    const expectedQuery = `SELECT * FROM members`;
    expect((db.query as jest.Mock).mock.calls.length).toBe(1);
    expect((db.query as jest.Mock).mock.calls[0][0]).toBe(expectedQuery);
  });
});
