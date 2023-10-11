import React, { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const login = (e) => {
    e.preventDefault();
    setFormData({
      email: "",
      password: "",
    });

    axios
      .post("/login", formData)
      .then((response) => {
        if (response.data.loggedIn) {
          history.push("/account");
        } else {
          // TODO: tell user it was incorrect login info
        }
      })
      .catch((error) => {
        console.log("API call failed", error);
      });
  };

  let history = useHistory();

  return (
    <>
      <h1>LOGIN</h1>
      <form onSubmit={login}>
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
          onClick={() => setFormData({ email: "", password: "" })}
        >
          reset
        </button>
        <button type="submit">submit</button>
      </form>
    </>
  );
}

export default Login;
