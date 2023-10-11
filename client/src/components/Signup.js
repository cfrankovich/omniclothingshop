import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

function Signup() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const history = useHistory();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const signup = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    axios
      .post("/auth/signup", formData)
      .then((response) => {
        console.log(response.data);
        setFormData({
          username: "",
          email: "",
          password: "",
        });
        history.push("/account");
      })
      .catch((error) => {
        console.log("API call failed", error);
      });
  };

  return (
    <>
      <h1>SIGNUP</h1>
      <form onSubmit={signup}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            placeholder="username"
            value={formData.username}
            onChange={handleChange}
          />
        </label>
        <label>
          Email:
          <input
            type="text"
            name="email"
            placeholder="email"
            value={formData.email}
            onChange={handleChange}
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            placeholder="password"
            value={formData.password}
            onChange={handleChange}
          />
        </label>
        <button
          type="reset"
          onClick={() => setFormData({ username: "", email: "", password: "" })}
        >
          reset
        </button>
        <button type="submit">submit</button>
      </form>
    </>
  );
}

export default Signup;
