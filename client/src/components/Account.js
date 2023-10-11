import React, { useState, useEffect } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

function Account() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const updateUser = () => {
    axios
      .post("/api/update-user", { newUser: user })
      .then((response) => {
        console.log("Updated");
      })
      .catch((error) => {
        console.error("Error: ", error);
      });
  };

  const deleteAccount = () => {
    axios
      .post("/api/delete-account")
      .then((response) => {
        console.log(response);
        history.push("/login");
      })
      .catch((error) => {
        console.error(error);
      });
    axios
      .post("/logout")
      .then((response) => {
        console.log(response);
        history.push("/login");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    axios
      .get("/api/current-user")
      .then((response) => {
        if (response.data.loggedIn) {
          setUser(response.data);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!user) {
    history.push("/login");
    return null;
  }

  return (
    <>
      <h1>Welcome {user.username}</h1>
      <input
        name="username"
        type="text"
        value={user.username}
        placeholder="username"
        onChange={(e) => handleChange(e)}
      ></input>
      <button onClick={updateUser}>save changes</button>
      <button onClick={deleteAccount}>delete account</button>
    </>
  );
}

export default Account;
