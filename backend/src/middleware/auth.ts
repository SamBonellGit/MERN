import { RequestHandler } from "express";
import createHttpError from "http-errors";


// check if user is loggedin, call next, otherwise throw error
export const requiresAuth: RequestHandler = (req, res, next) => {
    if (req.session.userId) {
         next();
        } else {
            next(createHttpError(401, "User Not Authenticated"));
        }
};