import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import Listing from "./Listing";
import { Link } from "react-router-dom";

const GET_ALL_GARMENTS = gql`
  query GetAllGarments {
    allGarments {
      id
      brand
      title
      price
      color
      size
      forSale
    }
  }
`;

function Collection() {
  const [garments, setGarments] = useState([]);
  const { loading, error, data } = useQuery(GET_ALL_GARMENTS);

  useEffect(() => {
    if (!loading && data) {
      setGarments(data.allGarments);
    }
  }, [loading, data]);

  return (
    <>
      <h1>COLLECTION</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {garments
          .filter((garment) => garment.forSale)
          .map((garment) => (
            <Link to={`/collection/${garment.id}`}>
              <Listing title={garment.title} price={garment.price} />
            </Link>
          ))}
      </div>
    </>
  );
}

export default Collection;
