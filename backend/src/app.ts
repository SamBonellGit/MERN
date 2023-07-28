import "dotenv/config";
import express, { NextFunction, Request, Response } from "express";
import notesRoutes from "./routes/notes";
import userRoutes from "./routes/users";
import morgan from "morgan";
import createHttpError, { isHttpError } from "http-errors";
const app = express();
import session from "express-session";
import env from "./util/validateEnv"; 
import MongoStore from "connect-mongo";

// Setup of Morgan Middleware, this is used for logging purposes (Adds enhanced logging functionality)
app.use(morgan("dev"));

// Setups express so it accepts json bodies, middleware
app.use(express.json());

app.use(session({
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 60 * 60 * 1000,
  },

  rolling: true, 
  store: MongoStore.create({
    mongoUrl: env.MONGO_CONNECTION_STRING
  }),
}));



app.use("/api/users", userRoutes);


app.use("/api/notes", notesRoutes)
// Async because we don't want to wait for the database to be ready



app.use((req, res, next) => {
  next(createHttpError(404, "Endpoint Not Found"));
  
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(error);
  let errorMessage = "An Unknown Error occurred";
  let statusCode = 500;
  if (isHttpError(error)) {
    statusCode = error.status;
    errorMessage = error.message;
  }
  res.status(statusCode).json({ error: errorMessage }); // sets response status to 500 and returns the error message
});

export default app;
