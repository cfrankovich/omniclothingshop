import React from 'react';

function Navbar() {
  return (
    <nav className="nav">
      <a href="/about" className="nav-item">about</a>
      <a href="/collection" className="nav-item">collection</a>
      <a href="/lookbook" className="nav-item">lookbook</a>
      <a href="/book-appointment" className="nav-item">book an appointment</a>
      <a href="/signup" className="nav-item">signup</a>
      <a href="/test" className="nav-item">test</a>
      <a href="/" className="nav-item">home</a>
    </nav>
  );
}

export default Navbar;