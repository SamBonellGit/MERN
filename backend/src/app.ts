import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import NoteModel from "./models/note";

const app = express();

// Async because we don't want to wait for the database to be ready

app.get("/", async (req, res, next) => {
  try {
    // throw Error("UNKNWON ERROR); - Used for error testing
    const notes = await NoteModel.find().exec(); // executes find operation, and then exec returns a promise
    res.status(200).json(notes); // sets response status to 200 and returns the notes (response status basically means success), sends in json format.
  } catch (error) {
    next(error);
  }
});

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
