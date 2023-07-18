import { RequestHandler } from "express";
import NoteModel from "../models/note";

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
    const note = await NoteModel.findById(noteId).exec(); // executes find operation
    res.status(200).json(note); // sets response status to 200 and returns
  } catch (error) {
    next(error);
  }
};



export const createNote: RequestHandler = async (req, res, next) => {
  const title = req.body.title;
  const text = req.body.text;

  try {
    const newNote = await NoteModel.create({
      title: title,
      text: text,
    });
    res.status(201).json(newNote); // sets response status
  } catch (error) {
    next(error);
  }
};
