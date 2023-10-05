// src/components/ClothesGrid.js
import React from 'react';

function ClothesGrid({ items }) {
  return (
    <div className="grid-container">
      {items.map(item => (
        <div key={item.id} className="grid-item">
          <img src={item.imageUrl} alt={item.name} />
          <h3>{item.name}</h3>
          <p>{item.description}</p>
        </div>
      ))}
    </div>
  );
}

export default ClothesGrid;
