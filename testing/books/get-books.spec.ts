import { NextFunction, Request, Response } from "express";
import { getBooks } from "../../src/controllers/books/get-books";
import db from "../../src/config/db";

// Mocked books data (no borrowed books)
const mockBooks = [
    {
      author: "J.K Rowling",
      code: "JK-45",
      id: 1,
      stock: 1,
      title: "Harry Potter",
    },
    {
      author: "Arthur Conan Doyle",
      code: "SHR-1",
      id: 2,
      stock: 1,
      title: "A Study in Scarlet",
    },
    {
      author: "Stephenie Meyer",
      code: "TW-11",
      id: 3,
      stock: 1,
      title: "Twilight",
    },
    {
      author: "J.R.R. Tolkien",
      code: "HOB-83",
      id: 4,
      stock: 1,
      title: "The Hobbit, or There and Back Again",
    },
    {
      author: "C.S. Lewis",
      code: "NRN-7",
      id: 5,
      stock: 1,
      title: "The Lion, the Witch and the Wardrobe",
    },
  ];

  jest.mock("../../src/config/db");
  
  describe("GET /books", () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock<NextFunction>;
  
    beforeEach(() => {
      req = {};
      res = {
        send: jest.fn(),
      };
      next = jest.fn();
    });
  
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it("should get books successfully", async () => {
      (db.query as jest.Mock).mockResolvedValueOnce([mockBooks]);
  
      await getBooks(req as Request, res as Response, next);
  
      expect(res.send).toHaveBeenCalledWith({
        message: "Check the book success",
        data: mockBooks,
      });
  
      const expectedQuery = `
        SELECT b.id, b.title, b.code, b.stock 
        FROM books b 
        LEFT JOIN borrowed_books bb ON b.id = bb.book_id AND bb.is_returned = 'false'
        WHERE bb.book_id IS NULL OR bb.is_returned = 'true'
      `;
      const normalizeQuery = (query: string) => query.replace(/\s+/g, ' ').trim();

      const normalizedExpectedQuery = normalizeQuery(expectedQuery);
      const normalizedActualQuery = normalizeQuery((db.query as jest.Mock).mock.calls[0][0]);
  
      expect(normalizedActualQuery).toBe(normalizedExpectedQuery);
    });
  });