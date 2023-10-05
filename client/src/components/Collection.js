import React from 'react'
const items = Array(9).fill(null); // For now, it's an array of nulls. Later you can replace it with your items.

function Collection() {
    return (
        <div className="collection-grid">
            {items.map((item, idx) => (
                <div key={idx} className="item-placeholder"></div>
            ))}
        </div>
    );
}

export default Collection