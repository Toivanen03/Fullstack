import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

const Note = () => {
  const { id } = useParams();
  const note = useSelector((state) =>
    state.notes.find((note) => note.id === Number(id))
  );

  if (!note) {
    return <div>Note not found!</div>;
  }

  return (
    <div>
      <h2>{note.content}</h2>
      <p>{note.important ? "Important" : "Not Important"}</p>
      <p>Author: {note.user}</p>
    </div>
  );
};

export default Note;
