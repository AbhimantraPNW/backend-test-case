import express, { NextFunction, Request, Response } from "express";
import membersRouter from "./routers/members/members-routers";
import booksRouter from "./routers/books/books-routers";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./utils/swaggerDefinition";

const PORT = 8000;

const app = express();

app.use(express.json());

app.use("/members", membersRouter);
app.use("/books", booksRouter);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  res.status(400).send(err);
});

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
