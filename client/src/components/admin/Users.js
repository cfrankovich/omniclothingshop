import React, { useState, useEffect } from "react";
import axios from "axios";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";

const GET_ALL_USERS = gql`
  query GetAllUsers {
    allUsers {
      id
      username
      email
    }
  }
`;

function Users() {
  const { loading, error, data } = useQuery(GET_ALL_USERS);
  const [users, setUsers] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [originalUsers, setOriginalUsers] = useState([]);
  const [edited, setEdited] = useState([]);

  useEffect(() => {
    if (!loading && data) {
      setUsers(data.allUsers);
      setOriginalUsers(JSON.parse(JSON.stringify(data.allUsers)));
    }
  }, [loading, data]);

  const handleNewChange = (e, id) => {
    const { name, value } = e.target;
    const fieldName = name.split("-")[1];

    const updatedUsers = users.map((user) => {
      if (user.id === id) {
        return { ...user, [fieldName]: value };
      }
      return user;
    });

    setUsers(updatedUsers);

    if (!edited.includes(id)) {
      setEdited([...edited, id]);
      const userIndex = users.findIndex((user) => user.id === id);
      if (userIndex !== -1) {
        const updatedOriginalUsers = [...originalUsers];
        updatedOriginalUsers[userIndex] = { ...users[userIndex] };
        setOriginalUsers(updatedOriginalUsers);
      }
    }
  };

  const handleSelectChange = (e, id) => {
    if (selected.includes(id)) {
      const newSelected = selected.filter((i) => i !== id);
      setSelected(newSelected);
    } else {
      const newSelected = [...selected, id];
      setSelected(newSelected);
    }
  };

  const newUser = () => {
    const newRow = {
      id: Date.now() / 100000,
      name: "",
      email: "",
    };

    setUsers([...users, newRow]);
    setSelected([...selected, newRow.id]);
  };

  const removeSelected = () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete the selected rows? This cannot be undone."
    );

    if (!isConfirmed) return;

    const updatedUsers = users.filter((user) => !selected.includes(user.id));

    axios
      .post("/test/deleteusers", { ids: selected })
      .then((response) => {
        console.log("Successfully deleted", response);
        setUsers(updatedUsers);
        setSelected([]);
      })
      .catch((error) => {
        console.log("Delete failed", error);
      });
  };

  const saveChanges = () => {
    let changes = "";

    edited.forEach((id) => {
      const original = originalUsers.find((user) => user.id === id);
      const updated = users.find((user) => user.id === id);

      if (!original || !updated) return;

      changes += `Changes for ID ${id}:\n`;

      Object.keys(updated).forEach((key) => {
        if (updated[key] !== original[key]) {
          changes += `  ${key}: ${original[key]} => ${updated[key]}\n`;
        }
      });
    });

    var confirmed = false;
    if (changes) {
      confirmed = window.confirm("Are you sure you want to save?\n" + changes);
    } else {
      alert("No changes made.");
      return;
    }

    if (!confirmed) return;

    const editedUsers = edited.map((id) =>
      users.find((user) => user.id === id)
    );
    axios
      .post("/test/saveusers", { users: editedUsers })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log("API call failed", error);
      });
  };

  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <h1>USERS TABLE</h1>
      <input
        type="text"
        placeholder="filter..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={newUser}>new</button>
      <button onClick={saveChanges}>save</button>
      <button onClick={removeSelected}>delete</button>
      <form>
        <table style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>select</th>
              <th>username</th>
              <th>email</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr
                key={user.id}
                className={edited.includes(user.id) ? "editedtr" : ""}
              >
                <td>
                  <input
                    name={user.id + "-select"}
                    type="checkbox"
                    checked={selected.includes(user.id)}
                    onChange={(e) => handleSelectChange(e, user.id)}
                  ></input>
                </td>
                <td>
                  <input
                    name={user.id + "-username"}
                    type="text"
                    placeholder="username"
                    value={user.username}
                    onChange={(e) => handleNewChange(e, user.id)}
                    disabled={!selected.includes(user.id)}
                  ></input>
                </td>
                <td>
                  <input
                    name={user.id + "-email"}
                    type="text"
                    placeholder="email"
                    value={user.email}
                    onChange={(e) => handleNewChange(e, user.id)}
                    disabled={!selected.includes(user.id)}
                  ></input>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </form>
    </>
  );
}

export default Users;
