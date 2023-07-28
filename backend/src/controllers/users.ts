import { RequestHandler } from "express";
import createHttpError from "http-errors";
import UserModel from "../models/user";
import bcrypt from "bcrypt";

//setup of endpoint for user creation

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    const authenticatedUserId = req.session.userId;

    try {
        if (!authenticatedUserId) {
            throw createHttpError(401, "User not authenticated");
        }

        const user = await UserModel.findById(authenticatedUserId).select("+email").exec();
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
};


interface SignUpBody {
    username?: string, 
    email?: string,
    password?: string,
}

export const signUp: RequestHandler<unknown, unknown, SignUpBody, unknown> = async (req, res, next) => {
    const username = req.body.username; 
    const email = req.body.email;
    const passwordRaw = req.body.password; // we never want to store raw password info, it will need to be hashed - Explicit naming here makes it easier to distinguish between before and after hashed password whenever we handle this data.

    try {
        if (!username || !email || !passwordRaw) {
            throw createHttpError(400, "Parameters missing");
        }

        const existingUsername = await UserModel.findOne({ username: username }).exec();

        if (existingUsername) {
            throw createHttpError(409, "Username already exists, please choose a different one.");
        } 

        const existingEmail = await UserModel.findOne( {email: email }).exec();

        if (existingEmail) {
            throw createHttpError(409, "A user with this email address already exists, please login instead.");
        }
        const passwordHashed = await bcrypt.hash(passwordRaw, 10); // second argument is for salting the password so it can't be descrypted
        const newUser = await UserModel.create({
            username: username,
            email: email,
            password: passwordHashed,
        });

        req.session.userId = newUser._id;

        res.status(201).json(newUser)
    } catch (error) {
        next(error);
    }
};

interface LoginBody {
    username?: string,
    password?: string,
}

export const login: RequestHandler<unknown, unknown, LoginBody, unknown> = async (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;


    try {
        if (!username || !password) {
            throw createHttpError(400, "parameters missing");
        }
        // we add password and email using select because we don't inclUde them by default for security purposes.
        const user = await UserModel.findOne({username: username}).select("+password +email").exec();

        if (!user){
            throw createHttpError(401, "Invalid Credentials");
        }


        const passwordMatch = await bcrypt.compare(password, user.password);


        if (!passwordMatch) {
            throw createHttpError(401, "Invalid Credentials");
            
        }

        req.session.userId = user._id;
        res.status(201).json(user);

    } catch (error) {
        next(error);
    }
};

export const logout: RequestHandler = (req, res, next) => { 
    req.session.destroy(error => {
        if (error) {
            next(error);
            
        } else {
            res.sendStatus(200);
        }
    });
};