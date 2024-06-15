import { NextFunction, Request, Response } from "express";
import db from "../../config/db";

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
