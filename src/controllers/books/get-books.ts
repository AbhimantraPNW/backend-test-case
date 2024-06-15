import { NextFunction, Request, Response } from "express";
import db from "../../config/db";

export const getBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = `
    SELECT b.id, b.title, b.code, b.stock 
    FROM books b 
    LEFT JOIN borrowed_books bb ON b.id = bb.book_id AND bb.is_returned = 'false'
    WHERE bb.book_id IS NULL OR bb.is_returned = 'true'
  `;

    const [rows] = await db.query(query);

    res.send({
      message: "Check the book success",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};
