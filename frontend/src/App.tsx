import React, { useEffect, useState } from 'react';
import logo from './logo.svg';

import { Container, Row, Col, Button } from 'react-bootstrap';
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import styles from './styles/NotesPage.module.css';
import styleUtils from './styles/utils.module.css';
import * as NotesApi from "./network/notes_api";
import AddEditNoteDialog from './components/AddEditNoteDialog';
import { FaPlus } from "react-icons/fa";


function App() {

  // create state
  const [notes, setNotes] = useState<NoteModel[]>([]);
  // create state
  const [showAddNoteDialog, setshowAddNoteDialog] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<NoteModel|null>(null);

  useEffect(() => {
    async function loadNotes(){
      try {
        const notes = await NotesApi.fetchNotes();
      setNotes(notes); // update state, so whenever we use the notes in UI, it gets updated by React.
        
      } catch (error) {
        console.error(error);
        alert(error);
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

  return (
    <Container>
      <Button 
      className={`mb-4 ${styleUtils.blockCenter} ${styleUtils.flexCenter}`}
      onClick={() => setshowAddNoteDialog(true)}>
        <FaPlus />
        Add new note
      </Button>
      <Row xs={1} md={2} xl={3} className= "g-4">
      {notes.map(note => (
        <Col key={note._id}>
        <Note note={note}
         className={styles.note} 
         onNoteClicked={setNoteToEdit}
          onDeleteNoteClicked={deleteNote}/>
        </Col>
      ))}
      </Row>
      
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
    </Container>
  );
}

 

export default App;