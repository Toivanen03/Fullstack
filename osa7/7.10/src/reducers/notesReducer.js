import { createSlice } from "@reduxjs/toolkit";

const notesSlice = createSlice({
  name: "notes",
  initialState: [
    {
      id: 1,
      content: "HTML is easy",
      important: true,
      user: "Matti Luukkainen",
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      important: false,
      user: "Matti Luukkainen",
    },
    {
      id: 3,
      content: "Most important methods of HTTP-protocol are GET and POST",
      important: true,
      user: "Arto Hellas",
    },
  ],
  reducers: {
    addNote(state, action) {
      state.push(action.payload);
    },
    toggleImportance(state, action) {
      const id = action.payload;
      const note = state.find((note) => note.id === id);
      if (note) {
        note.important = !note.important;
      }
    },
  },
});

export const { addNote, toggleImportance } = notesSlice.actions;
export default notesSlice.reducer;
