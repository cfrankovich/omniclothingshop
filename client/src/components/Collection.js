import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";
import Listing from "./Listing";
import { Link } from "react-router-dom";
import axios from "axios";

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
      createdAt
    }
  }
`;

function Collection() {
  const [garments, setGarments] = useState([]);
  const { loading, error, data } = useQuery(GET_ALL_GARMENTS);
  const [userLastLoggedInDate, setUserLastLoggedInDate] = useState(
    new Date("2099-12-31")
  );

  useEffect(() => {
    if (!loading && data) {
      setGarments(data.allGarments);
    }
  }, [loading, data]);

  useEffect(() => {
    axios
      .get("/api/current-user")
      .then((response) => {
        if (response.data.loggedIn) {
          const date = new Date(response.data.lastLoggedIn);
          setUserLastLoggedInDate(date);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <h1>COLLECTION</h1>
      <div style={{ display: "flex", flexWrap: "wrap" }}>
        {garments
          .filter((garment) => garment.forSale)
          .map((garment) => {
            const garmentDate = new Date(garment.createdAt);
            console.log(garment.createdAt);

            const isNewForUser = garmentDate >= userLastLoggedInDate;
            console.log(
              `${isNewForUser} = ${garmentDate} >= ${userLastLoggedInDate}`
            );

            return (
              <Link to={`/collection/${garment.id}`}>
                <Listing
                  isNewForUser={isNewForUser}
                  title={garment.title}
                  price={garment.price}
                />
              </Link>
            );
          })}
      </div>
    </>
  );
}

export default Collection;
