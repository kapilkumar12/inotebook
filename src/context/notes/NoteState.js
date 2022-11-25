import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:7000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  // All Notes
  const getNotes = async (title, description, tag) => {
    // API call
    const response = await fetch(`${host}/api/notes/fetchallnotes`, {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjM3MGJjNzdiODRlODM4NDI4NTUxYzkyIiwiaWF0IjoxNjY4MzMyNzIyfQ.lT_CpQ_Rj-FCfyaC17Jx8sCHTeO2S-hsKEqhu40AYwQ",
      },
    });
    const json = await response.json();

    // console.log(json);

    setNotes(json);
  };

  //   Add note
  const addNote = async (title, description, tag) => {
    // API call
    const response = await fetch(`${host}/api/notes/addnote`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjM3MGJjNzdiODRlODM4NDI4NTUxYzkyIiwiaWF0IjoxNjY4MzMyNzIyfQ.lT_CpQ_Rj-FCfyaC17Jx8sCHTeO2S-hsKEqhu40AYwQ",
      },

      body: JSON.stringify({ title, description, tag }),
    });
    const note = await response.json();

    setNotes(notes.concat(note));
  };

  // Delete Note
  const deleteNote = async (id) => {
    // API call
    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: "DELETE",

      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjM3MGJjNzdiODRlODM4NDI4NTUxYzkyIiwiaWF0IjoxNjY4MzMyNzIyfQ.lT_CpQ_Rj-FCfyaC17Jx8sCHTeO2S-hsKEqhu40AYwQ",
      },
    });
    const json = await response.json();

    console.log(json);

    const newNotes = notes.filter((note) => {
      return note._id !== id;
    });
    setNotes(newNotes);
  };

  // Edit Note
  const editNote = async (id, title, description, tag) => {
    // API call
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: "PUT",

      headers: {
        "Content-Type": "application/json",
        "auth-token":
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjoiNjM3MGJjNzdiODRlODM4NDI4NTUxYzkyIiwiaWF0IjoxNjY4MzMyNzIyfQ.lT_CpQ_Rj-FCfyaC17Jx8sCHTeO2S-hsKEqhu40AYwQ",
      },

      body: JSON.stringify({ title, description, tag }),
    });
    const json = await response.json();

    console.log(json);

    // Login to edit client
    let newNote = JSON.parse(JSON.stringify(notes));
    for (let index = 0; index < newNote.length; index++) {
      const element = newNote[index];
      if (element._id === id) {
        newNote[index].title = title;
        newNote[index].description = description;
        newNote[index].tag = tag;
        break;
      }
    }
    setNotes(newNote);
  };

  return (
    <NoteContext.Provider
      value={{ notes, getNotes, addNote, deleteNote, editNote }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
