// src/components/OrbPage.js
import React from 'react';

function OrbPage() {
  return (
    <div className="orb-container">
      <div className="orb">
        <a href="/about">ABOUT</a>
        <a href="/collection">COLLECTION</a>
        <a href="/lookbook">LOOKBOOK</a>
        {/* Add more links as needed */}
      </div>
    </div>
  );
}

export default OrbPage;
