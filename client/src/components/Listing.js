import React from "react";

const styles = {
  container: {
    position: "relative",
    width: "fit-content",
  },
  caption: {
    display: "flex",
    justifyContent: "space-between",
  },
  title: {
    textAlign: "left",
  },
  price: {
    textAlign: "right",
  },
  newtag: {},
};

function Listing(props) {
  return (
    <div style={styles.container}>
      {props.isNewForUser && <span style={styles.newtag}>new!</span>}
      <img
        src="/garment-test-image.png"
        alt="Garment Test"
        style={{ width: "20vw", height: "20vw", border: "1px solid white" }}
      />
      <div style={styles.caption}>
        <span style={styles.title}>{props.title}</span>
        <span style={styles.price}>{props.price}</span>
      </div>
    </div>
  );
}

export default Listing;
