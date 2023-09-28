import { gql } from "apollo-server-express";

const typeDefs = gql`
  type Garment {
    id: Int!
    brand: String!
    title: String!
    price: String!
    color: String!
    size: String!
    forSale: Boolean!
  }

  type User {
    id: Int!
    email: String!
    username: String!
    hashedPassword: String!
  }

  type Query {
    allGarments: [Garment]
    allUsers: [User]
  }
`;

export default typeDefs;
