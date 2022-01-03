import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {

  const notesInitial = [
    {
      _id: 1,
      title: "First",
      descriptio: "This is the first note"
    },
    {
      _id: 2,
      title: "Second",
      descriptio: "This is the Second note"
    },
    {
      _id: 3,
      title: "Third",
      descriptio: "This is the Third note"
    },
    {
      _id: 4,
      title: "Fourth",
      descriptio: "This is the Fourth note"
    },
    {
      _id: 5,
      title: "Fifth",
      descriptio: "This is the Fifth note"
    },
    {
      _id: 6,
      title: "Sixth",
      descriptio: "This is the Sixth note"
    },
  ]

  const [notes, setNotes] = useState(notesInitial)

  return (
    <NoteContext.Provider value={{ notes, setNotes }}>
      {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState