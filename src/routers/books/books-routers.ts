import express from "express"
import { getBooks } from "../../controllers/books/get-books"

const router = express.Router()

router.get("/", getBooks)

export default router