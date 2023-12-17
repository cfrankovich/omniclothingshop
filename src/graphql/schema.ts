import { gql } from "apollo-server-express";

const typeDefs = gql`
  scalar DateTime

  type Garment {
    id: Int!
    brand: String!
    title: String!
    price: String!
    color: String!
    size: String!
    forSale: Boolean!
    createdAt: DateTime!
  }

  type User {
    id: Int!
    email: String!
    username: String!
    hashedPassword: String!
    lastLoggedIn: DateTime!
  }

  type Query {
    allGarments: [Garment]
    allUsers: [User]
    garmentById(id: Int!): Garment
  }
`;

export default typeDefs;
