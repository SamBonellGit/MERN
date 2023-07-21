import express from "express";
import * as NotesController from "../controllers/notes";


const router = express.Router();

router.get("/", NotesController.getNotes); 

router.get("/:noteId", NotesController.getNote); 


//patch request used whenever you want to update a resource
router.patch("/:noteId", NotesController.updateNote); 

router.post("/", NotesController.createNote);

router.delete("/:noteId", NotesController.deleteNote);

export default router;