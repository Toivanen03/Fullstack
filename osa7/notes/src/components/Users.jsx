import { useSelector } from "react-redux";

const initialUsers = [
  { id: 1, name: "Matti Luukkainen" },
  { id: 2, name: "Juha Tauriainen" },
  { id: 3, name: "Arto Hellas" },
];

const Users = () => {
  const users = useSelector((state) => state.users) || initialUsers;
  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Users;
