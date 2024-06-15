import express from "express"
import { getMembers } from "../../controllers/members/get-members"
import { borrowBook } from "../../controllers/members/member-borrow"
import { returnBook } from "../../controllers/members/member-return"

const router = express.Router()

router.get("/", getMembers)
router.post("/borrow", borrowBook)
router.post("/return", returnBook)

export default router