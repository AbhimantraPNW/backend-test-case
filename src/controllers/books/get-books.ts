import { NextFunction, Request, Response } from "express";
import db from "../../config/db";

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Get a list of books
 *     tags: [Books]
 *     responses:
 *       200:
 *         description: A list of books
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Check the book success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       title:
 *                         type: string
 *                         example: "Harry Potter and the Sorcerer's Stone"
 *                       code:
 *                         type: string
 *                         example: "HP1"
 *                       stock:
 *                         type: integer
 *                         example: 1
 *       500:
 *         description: Internal server error
 */

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
