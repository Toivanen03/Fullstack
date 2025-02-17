import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./src/reducers/userReducer";
import notesReducer from "./src/reducers/notesReducer";
import notificationReducer from "./src/reducers/notificationReducer";

const store = configureStore({
  reducer: {
    user: userReducer,
    notes: notesReducer,
    notification: notificationReducer,
  },
});

export default store;
