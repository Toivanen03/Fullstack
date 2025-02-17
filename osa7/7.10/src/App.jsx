import { useSelector } from "react-redux";
import { Routes, Route, Link, Navigate } from "react-router-dom";
import styled from "styled-components";
import { useMatch } from "react-router-dom";
import Home from "./components/Home";
import Notes from "./components/Notes";
import Users from "./components/Users";
import Login from "./components/Login";
import Note from "./components/Note";

const Page = styled.div`
  padding: 1em;
  background: papayawhip;
`;

const Navigation = styled.div`
  background: BurlyWood;
  padding: 1em;
`;

const Footer = styled.div`
  background: Chocolate;
  padding: 1em;
  margin-top: 1em;
`;

const App = () => {
  const user = useSelector((state) => state.user);
  const notification = useSelector((state) => state.notification);
  const notes = useSelector((state) => state.notes);
  const padding = { padding: 5 };

  const match = useMatch("/notes/:id");
  const note = match
    ? notes.find((note) => note.id === Number(match.params.id))
    : null;

  return (
    <div>
      <div>{notification}</div>
      <Page>
        <Navigation>
          <Link style={padding} to="/">
            home
          </Link>
          <Link style={padding} to="/notes">
            notes
          </Link>
          <Link style={padding} to="/users">
            users
          </Link>
          {user ? (
            <em>{user} logged in</em>
          ) : (
            <Link style={padding} to="/login">
              login
            </Link>
          )}
        </Navigation>

        <Routes>
          <Route path="/notes/:id" element={<Note note={note} />} />
          <Route path="/notes" element={<Notes />} />
          <Route
            path="/users"
            element={user ? <Users /> : <Navigate to="/login" />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>

        <Footer>
          <em>Note app, Department of Computer Science 2020</em>
        </Footer>
      </Page>
    </div>
  );
};

export default App;
