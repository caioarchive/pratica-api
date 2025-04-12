import express, { NextFunction, Request, Response } from "express";
import setupSwagger from './swagger/swagger';
import cors from "cors";
import { AppError } from "./shared/errors/AppError";
import pessoaRoutes from "./routes/pessoaRoutes";

const app = express();

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true
  })
);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


setupSwagger(app)

app.use("/api/pessoas", pessoaRoutes);

app.use((request, response) => {
  response.status(404).json({ message: "Rota não encontrada" });
});

app.use(
  (
    error: Error,
    request: Request,
    response: Response,
    nextFunction: NextFunction
  ) => {
    if (error instanceof AppError) {
      response.status(error.statusCode).json({
        error: "error",
        message: error.message
      });
      return;
    } else {
      response.status(500).json({
        error: "error",
        message: "Internal server error"
      });
      return;
    }
  }
);

export default app;
