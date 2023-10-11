import React, { useEffect } from "react";
import axios from "axios";

function Logout() {
  useEffect(() => {
    axios
      .post(
        "/logout",
        {},
        {
          withCredentials: true,
        }
      )
      .then(() => {
        console.log("logged out");
      })
      .catch((error) => {
        console.error(error);
      });
  });

  return <h1>Logged out.</h1>;
}

export default Logout;
