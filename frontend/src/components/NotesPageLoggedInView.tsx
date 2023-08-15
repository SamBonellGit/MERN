import { useEffect, useState } from 'react';
import { Button, Col, Row, Spinner } from "react-bootstrap";
import { FaPlus } from "react-icons/fa";
import { Note as NoteModel } from '../models/note';
import * as NotesApi from "../network/notes_api";
import styles from '../styles/NotesPage.module.css';
import styleUtils from '../styles/utils.module.css';
import AddEditNoteDialog from "./AddEditNoteDialog";
import Note from './Note';





const NotesPageLoggedInView = () => {


     // create state
  const [notes, setNotes] = useState<NoteModel[]>([]);
  const [notesLoading, setNotesLoading] = useState(true);
  const [showNotesLoadingError, setShowNotesLoadingError] = useState(false);
  // create state
  const [showAddNoteDialog, setshowAddNoteDialog] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel|null>(null);

  useEffect(() => {
    async function loadNotes(){
      try {
        setShowNotesLoadingError(false);
        setNotesLoading(true);
        const notes = await NotesApi.fetchNotes();
      setNotes(notes); // update state, so whenever we use the notes in UI, it gets updated by React.
        
      } catch (error) {
        console.error(error);
        setShowNotesLoadingError(true);
      } finally {
        setNotesLoading(false);
      }

    }
    loadNotes();
  }, []);  // dependency array for useEffect [] - This means that the useEffect will only render once at the beginning. If we don't add the array it will execute on every single render. 

 

  // deletes note through delete endpoint, if successful it filters existing nodes and removes the one we just deleted.
async function deleteNote(note: NoteModel) {
  try {
    await NotesApi.deleteNote(note._id);
    setNotes(notes.filter(existingNote => existingNote._id !== note._id));
  } catch (error) {
    console.error(error);
    alert(error);
    
  }
}

const notesGrid = 
<Row xs={1} md={2} xl={3} className= {`"g-4" ${styles.noteGrid}`}>
{notes.map(note => (
  <Col key={note._id}>
  <Note note={note}
   className={styles.note} 
   onNoteClicked={setNoteToEdit}
    onDeleteNoteClicked={deleteNote}/>
  </Col>
))}
</Row>




    return ( 
        
        <>
        
        <Button 
      className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
      onClick={() => setshowAddNoteDialog(true)}>
        <FaPlus />
        Add new note
      </Button>
{notesLoading && <Spinner animation='border' variant='primary'/>}
{showNotesLoadingError && <p>Something went wrong, please refresh the page.</p>}

{!notesLoading && !showNotesLoadingError && 
<> 
{ notes.length > 0 // If notes loading is false and there  are no loading erros, then display notesGrid, else display error message to user.
  ? notesGrid
  :<p>There aren't any notes yet.</p>

}
</>}
     
      
      { showAddNoteDialog && // conditionally show a component
      <AddEditNoteDialog 
      onDismiss={() => setshowAddNoteDialog(false)}
      onNoteSaved={(newNote) => {
        setNotes([...notes, newNote]);
        setshowAddNoteDialog(false);
      } }
        />
      }

      {noteToEdit &&
      <AddEditNoteDialog
      noteToEdit={noteToEdit}
      onDismiss={() => setNoteToEdit(null)}
      onNoteSaved={(updatedNote) => {
        setNotes(notes.map(existingNote => existingNote._id === updatedNote._id ? updatedNote : existingNote));
        setNoteToEdit(null);
      }}
      />
      }
        
        </>
    )};
export default NotesPageLoggedInView;