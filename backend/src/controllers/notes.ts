import { RequestHandler } from "express";
import NoteModel from "../models/note";
import createHttpError from "http-errors";
import mongoose from "mongoose";
import { assertIsDefined } from "../util/assertIsDefined";

export const getNotes: RequestHandler = async (req, res, next) => {

  const authenticatedUserId = req.session.userId;
  try {
    assertIsDefined(authenticatedUserId);

    authenticatedUserId
    //  throw createHttpError(401); testing purposes
    const notes = await NoteModel.find({userId: authenticatedUserId}).exec(); // executes find operation, and then exec returns a promise
    res.status(200).json(notes); // sets response status to 200 and returns the notes (response status basically means success), sends in json format.
  } catch (error) {
    next(error);
  }
};


export const getNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;
  const authenticatedUserId = req.session.userId;

  
  try {
    assertIsDefined(authenticatedUserId);


    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid Note Id");
    }

    const note = await NoteModel.findById(noteId).exec(); // executes find operation

// if endpoint is correct but note not found
    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    if (!note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You don't have permission to access this note");
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
  const authenticatedUserId = req.session.userId;


  try {
    assertIsDefined(authenticatedUserId);

    if(!title) {
      throw createHttpError(400, "Note must have a title");
    }

    const newNote = await NoteModel.create({
      userId: authenticatedUserId,
      title: title,
      text: text,
    });
    res.status(201).json(newNote); // sets response status
  } catch (error) {
    next(error);
  }
};


// don't need ? for noteId here, as it wouldn't get to this stage anyway if it was empty.
interface UpdateNoteParams {
  noteId: string,

}

interface UpdateNoteBody {
  title?: string,
  text?: string,
}




export const updateNote: RequestHandler<UpdateNoteParams, unknown, UpdateNoteBody, unknown> = async (req, res, next) => {
  const noteId = req.params.noteId; 
  const newTitle = req.body.title;
  const newText = req.body.text;
  const authenticatedUserId = req.session.userId;

  try {
    assertIsDefined(authenticatedUserId);

     if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid Note Id");
    }

    if(!newTitle) {
      throw createHttpError(400, "Note must have a title");
    }


    const note = await NoteModel.findById(noteId).exec()

    if (!note) {
      throw createHttpError(404, "Note not found");
    }

    if (!note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You don't have permission to access this note");
    }
    
   note.title = newTitle;
   note.text = newText;

    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (error) {
      next(error);
    
  }

};


export const deleteNote: RequestHandler = async (req, res, next) => {
  const noteId = req.params.noteId;
  const authenticatedUserId = req.session.userId;


  try {
    assertIsDefined(authenticatedUserId);

    if (!mongoose.isValidObjectId(noteId)) {
      throw createHttpError(400, "Invalid Note Id");
    }

    const note = await NoteModel.findById(noteId).exec();

    if (!note) {
      throw createHttpError(404, "Note not found");

    }
    if (!note.userId.equals(authenticatedUserId)) {
      throw createHttpError(401, "You don't have permission to access this note");
    }
    
    await note.deleteOne();

    // deletion successfull, sendstatus instead of status here because status itself doesn't send a response, json usuaully is responsible for sending the response, but we don't need to call it here as we don't need access to the body. 
    res.sendStatus(204);

  } catch (error) {
    next(error);
  }


};