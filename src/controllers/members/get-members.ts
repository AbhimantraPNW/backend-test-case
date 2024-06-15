import { NextFunction, Request, Response } from "express";
import db from "../../config/db";

/**
 * @swagger
 * /members:
 *   get:
 *     summary: Get a list of members
 *     tags: [Members]
 *     responses:
 *       200:
 *         description: A list of members
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Success
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 *                         example: 1
 *                       name:
 *                         type: string
 *                         example: "Angga"
 *                       code:
 *                         type: string
 *                         example: "M001"
 *                       borrowed_books:
 *                         type: integer
 *                         example: 0
 *                       is_penalized:
 *                         type: string
 *                         example: false
 *                       penalty_end_date:
 *                         type: date | null
 *                         example: null
 *       500:
 *         description: Internal server error
 */

export const getMembers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = "SELECT * FROM members";

    const [rows] = await db.query(query);

    res.send({
      message: "Success",
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};
