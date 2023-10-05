import React from "react";
import { useQuery } from "@apollo/client";
import gql from "graphql-tag";


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

const Home = () => {
  const { loading, error, data } = useQuery(GET_ALL_GARMENTS);

  if (loading) return <p className="text-center mt-8">Loading...</p>;
  if (error) return <p className="text-center mt-8">Error: {error.message}</p>;

  return (
    <div className="container mx-auto p-8">
      {/* Sidebar */}
      <div className="w-1/4 float-left pr-8">
        <h2 className="text-2xl mb-6">Filters</h2>
        {/* Place filter components/elements here */}
        {/* ... */}
      </div>

      {/* Main Content */}
      <div className="w-3/4 float-right">
        <div className="grid grid-cols-3 gap-12">
          {data.allGarments.map((garment) => (
            <div key={garment.id} className="border p-4 transform transition-transform duration-200 hover:scale-105">
              <img className="w-full h-48 object-cover mb-4" src={garment.imageURL} alt={garment.title} />
              <h4 className="text-lg font-semibold">{garment.brand}</h4>
              <p className="text-gray-600">{garment.title}</p>
              <span className="block mt-2 text-xl">${garment.price}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Clear float */}
      <div className="clear-both"></div>
    </div>
  );
};

export default Home;
