import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav>
      <Link to="/about">about </Link>
      <Link to="/collection">collection </Link>
      <Link to="/lookbook">lookbook </Link>
      <Link to="/appointment">book an appointment </Link>
      <Link to="/signup">signup </Link>
      <Link to="/login">login </Link>
      <Link to="/logout">logout </Link>
      <Link to="/account">account </Link>
      <Link to="/test">test </Link>
      <Link to="/checkout">checkout </Link>
    </nav>
  );
}

export default Navbar;
