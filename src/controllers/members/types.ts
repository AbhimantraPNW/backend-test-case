import { RowDataPacket } from "mysql2";

export interface Member extends RowDataPacket {
  id: number;
  code: string;
  name: string;
  borrowed_books: number;
  is_penalized: "true" | "false";
  penalty_end_date: Date | null;
}