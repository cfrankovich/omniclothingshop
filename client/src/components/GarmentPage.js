import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import gql from "graphql-tag";
import { useQuery } from "@apollo/client";

const GET_GARMENT_BY_ID = gql`
  query GetGarmentById($id: Int!) {
    garmentById(id: $id) {
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

function GarmentPage() {
  const { garmentId } = useParams();
  const [garment, setGarment] = useState();
  const { loading, error, data } = useQuery(GET_GARMENT_BY_ID, {
    variables: { id: parseInt(garmentId) },
  });

  useEffect(() => {
    if (!loading && data) {
      setGarment(data.garmentById);
    }
  }, [loading, data]);

  if (!garment) return <p>loading...</p>;
  else if (!garment.forSale) return <p>garment not for sale!</p>;

  return (
    <>
      <img
        src="/garment-test-image.png"
        alt="Garment Test"
        style={{ width: "20vw", height: "20vw" }}
      />
      <p>Title: {garment.title}</p>
      <p>Designer: {garment.brand}</p>
      <p>Price: {garment.price}</p>
      <p>Color: {garment.color}</p>
      <p>Sizing: {garment.size}</p>
    </>
  );
}

export default GarmentPage;
