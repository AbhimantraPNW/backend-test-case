import { NextFunction, Request, Response } from "express";
import db from "../../config/db";
import { Member } from "./types";
import { Book, BorrowedBooksCount } from "../books/types";

interface Borrowing {
  bookTitle: string;
  startDate: string;
  endDate: string;
}

export const borrowBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { memberId, borrowings }: { memberId: number; borrowings: Borrowing[] } = req.body;

    // Validate borrowings array
    if (!Array.isArray(borrowings) || borrowings.length === 0) {
      return res.status(400).send({ message: "No borrowings provided" });
    }

    // Check if member is penalized
    const memberQuery = "SELECT * FROM members WHERE id = ?";
    const [memberRows] = await db.query<Member[]>(memberQuery, [memberId]);
    const member = memberRows[0];

    if (member.is_penalized && member.penalty_end_date) {
      const today = new Date().toISOString().slice(0, 10);
      const penaltyEndDate = member.penalty_end_date.toISOString().slice(0, 10);
      if (today < penaltyEndDate) {
        return res.status(400).send({ message: "Member is currently penalized" });
      }
    }

    // Check if member has reached the borrowing limit
    const borrowedBooksQuery =
      "SELECT COUNT(*) as borrowed_count FROM borrowed_books WHERE member_id = ? AND is_returned = 'false'";
    const [borrowedBooksCount] = await db.query<BorrowedBooksCount[]>(borrowedBooksQuery, [memberId]);

    const currentBorrowedCount = borrowedBooksCount[0].borrowed_count

    // Calculate total number of books including new borrowings
    const totalBorrowings = currentBorrowedCount + borrowings.length;

    if (totalBorrowings > 2) {
        return res.status(400).send({ message: "Borrowing limit exceeded" });
    }

    const borrowedBooks = [];
    for (const borrowing of borrowings) {
      const { bookTitle, startDate, endDate } = borrowing;

      // Check if the book exists and is available
      const bookQuery = "SELECT * FROM books WHERE title = ? AND stock > 0";
      const [bookRows] = await db.query<Book[]>(bookQuery, [bookTitle]);

      if (bookRows.length === 0) {
        return res.status(400).send({ message: `Book out of stock` });
      }

      // Extract book details
      const book = bookRows[0];

      // Insert borrowing details
      const borrowBookQuery = `INSERT INTO borrowed_books (member_id, book_id, start_date, end_date) VALUES (?, ?, ?, ?)`;
      await db.query(borrowBookQuery, [memberId, book.id, startDate, endDate]);

      // Update book stock
      const bookUpdateQuery = `UPDATE books SET stock = stock - 1 WHERE id = ?`;
      await db.query(bookUpdateQuery, [book.id]);

      // Update members borrowed book
      const updateMemberQuery = `UPDATE members SET borrowed_books = borrowed_books + 1 WHERE id = ?`
      await db.query(updateMemberQuery, [memberId])

      borrowedBooks.push({
        id: book.id,
        code: book.code,
        title: book.title,
        borrowed_by: member.name,
        borrowed_date: startDate,
      });
    }

    // Send response after all borrowings are processed
    res.send({
      message: "Books borrowed successfully",
      borrowedBooks,
    });
    
  } catch (error) {
    next(error);
  }
};
