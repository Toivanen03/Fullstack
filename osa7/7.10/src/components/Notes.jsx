import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Notes = () => {
  const notes = useSelector((state) => state.notes);

  return (
    <div>
      <h2>Notes</h2>
      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            <Link to={`/notes/${note.id}`}>{note.content}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notes;
