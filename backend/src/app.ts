import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import notesRoutes from "./routes/notes";
import morgan from "morgan";
const app = express();

// Setup of Morgan Middleware, this is used for logging purposes
app.use(morgan("dev"));

// Setups express so it accepts json bodies, middleware
app.use(express.json());


app.use("/api/notes", notesRoutes)
// Async because we don't want to wait for the database to be ready



app.use((req, res, next) => {
  next(Error("Endpoint Not Found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An Unknown Error occurred";
  if (error instanceof Error) errorMessage = error.message;
  res.status(500).json({ error: errorMessage }); // sets response status to 500 and returns the error message
});

export default app;
