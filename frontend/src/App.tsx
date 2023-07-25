import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { Container, Row, Col } from 'react-bootstrap';
import { Note as NoteModel } from './models/note';
import Note from './components/Note';
import styles from './styles/NotesPage.module.css';


function App() {
  const [notes, setNotes] = useState<NoteModel[]>([]);

  useEffect(() => {
    async function loadNotes(){
      try {
      const response = await fetch("/api/notes", {method: "GET"});
      const notes = await response.json();
      setNotes(notes); // update state, so whenever we use the notes in UI, it gets updated by React.
        
      } catch (error) {
        console.error(error);
        alert(error);
      }

    }
    loadNotes();
  }, []);  // dependency array for useEffect [] - This means that the useEffect will only render once at the beginning. If we don't add the array it will execute on every single render. 

 


  return (
    <Container>
      <Row xs={1} md={2} xl={3} className= "g-4">
      {notes.map(note => (
        <Col key={note._id}>
        <Note note={note} className={styles.note}  />
        </Col>
      ))}
      </Row>
    </Container>
  );
}

 

export default App;