import { RowDataPacket } from "mysql2";

export interface Book extends RowDataPacket {
  id: number;
  code: string;
  title: string;
  author: string;
  stock: number;
  date: Date;
}

export interface BorrowedBooksCount extends RowDataPacket {
  borrowed_count: number;
}

export interface BorrowingDetail extends RowDataPacket {
  id: number;
  member_id: number;
  book_id: number;
  start_date: Date;
  end_date: Date;
  is_returned: string;
  return_date: Date;
}
