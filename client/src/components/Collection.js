import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import Listing from "./Listing";

// query all listings (garments that have forsale = true)
// display them using the listing component

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
      {garments
        .filter((garment) => garment.forSale)
        .map((garment) => (
          <Listing title={garment.title} price={garment.price} />
        ))}
    </>
  );
}

export default Collection;
