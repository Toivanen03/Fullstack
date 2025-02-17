import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUser } from "../reducers/userReducer";
import {
  setNotification,
  removeNotification,
} from "../reducers/notificationReducer";
import styled from "styled-components";

const Button = styled.button`
  background: ${(props) => (props.$primary ? "Chocolate" : "Bisque")};
  font-size: 1em;
  margin: 1em;
  padding: 0.25em 1em;
  border: 2px solid Chocolate;
  border-radius: 3px;
`;

const Input = styled.input`
  margin: 0.25em;
`;

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = (event) => {
    event.preventDefault();
    const user = "mluukkai";
    dispatch(setUser(user));
    dispatch(setNotification(`welcome ${user}`));
    setTimeout(() => {
      dispatch(removeNotification());
    }, 10000);
    navigate("/");
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={onSubmit}>
        <div>
          Username: <Input />
        </div>
        <div>
          Password: <Input type="password" />
        </div>
        <Button $primary>login</Button>
      </form>
    </div>
  );
};

export default Login;
