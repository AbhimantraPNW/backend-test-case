import { NextFunction, Request, Response } from "express";
import db from "../../config/db";
import { BorrowingDetail } from "../books/types";
import { Member } from "./types";

export const returnBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { memberId, bookId, returnDate } = req.body;

    // Get borrowing details
    const borrowingQuery =
      "SELECT * FROM borrowed_books WHERE member_id = ? AND book_id = ? AND is_returned = 'false' AND return_date IS NULL";
    const [borrowingRows] = await db.query<BorrowingDetail[]>(borrowingQuery, [
      memberId,
      bookId,
    ]);

    // Check if borrowingRows has elements
    if (borrowingRows.length === 0) {
      return res.status(404).send({
        message: "No active borrowing found for this member and book",
      });
    }

    const borrowing = borrowingRows[0];

    // Calculate penalty (if return is late)
    const end_date = new Date(borrowing.end_date);
    const return_date = new Date(returnDate);

    const millisecondsPerDay = 24 * 60 * 60 * 1000;
    const daysDifference = Math.floor(
      (return_date.getTime() - end_date.getTime()) / millisecondsPerDay
    );

    let penaltyApplied = false;

    if (daysDifference > 0) {
      penaltyApplied = true;
      // Get current penalty end date
      const memberQuery = "SELECT penalty_end_date FROM members WHERE id = ?";
      const [memberRows] = await db.query<Member[]>(memberQuery, [memberId])

      let penaltyEndDate: Date;
      if (memberRows.length > 0 && memberRows[0].penalty_end_date) {
        penaltyEndDate = new Date(memberRows[0].penalty_end_date)
      } else {
        penaltyEndDate = new Date(return_date)
      }

      //Extend penalty end date
      penaltyEndDate.setDate(penaltyEndDate.getDate() + 3);

      const updateMemberQuery =
        "UPDATE members SET is_penalized = 'true', penalty_end_date = ? WHERE id = ?";
      await db.query(updateMemberQuery, [penaltyEndDate, memberId]);
    }

    // Update borrowed_books and books tables
    const updateBorrowedBookQuery =
      "UPDATE borrowed_books SET is_returned = 'true', return_date = ? WHERE id = ?";
    await db.query(updateBorrowedBookQuery, [
      return_date.toISOString().slice(0, 10),
      borrowing.id,
    ]);

    const updateBookStockQuery =
      "UPDATE books SET stock = stock + 1 WHERE id = ?";
    await db.query(updateBookStockQuery, [bookId]);

    // Update member's borrowed_books count
    const updateMemberQuery =
      "UPDATE members SET borrowed_books = borrowed_books - 1 WHERE id = ?";
    await db.query(updateMemberQuery, [memberId]);

    res.send({ message: "Book returned success", penaltyApplied });
  } catch (error) {
    next(error);
  }
};
