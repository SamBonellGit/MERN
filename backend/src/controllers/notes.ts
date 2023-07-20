import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";

export const getNotes: RequestHandler = async (req, res, next) => {
  try {
    // throw Error("UNKNWON ERROR"); - Used for error testing
    const notes = await NoteModel.find().exec(); // executes find operation, and then exec returns a promise
    res.status(200).json(notes); // sets response status to 200 and returns the notes (response status basically means success), sends in json format.
  } catch (error) {
    next(error);
  }
};


export const getNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;
  
  try {
    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid Note Id");
    }

    const note = await NoteModel.findById(noteId).exec(); // executes find operation

// if endpoint is correct but note not found
    if (!note) {
      throw createHttpError(404, "Note not found");
    }
    res.status(200).json(note); // sets response status to 200 and returns
  } catch (error) {
    next(error);
  }
};

// prefer to use interfaces more often as they are more flexible, sometimes you have to  use types instead.

interface createNoteBody {
  title?: string,
  text?: string, // ? means optional, but even for required fields it may be missing due to an error, so we include for all fields.
}


// Use unknown instead of any as it's more secure and restrictive. any would allow literally anything
export const createNote: RequestHandler<unknown, unknown, createNoteBody, unknown> = async (req, res, next) => {
  const title = req.body.title;
  const text = req.body.text;

  try {
    if(!title) {
      throw createHttpError(400, "Note must have a title");
    }

    const newNote = await NoteModel.create({
      title: title,
      text: text,
    });
    res.status(201).json(newNote); // sets response status
  } catch (error) {
    next(error);
  }
};
