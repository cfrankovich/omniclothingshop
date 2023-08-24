import { gql } from 'apollo-server-express';

const typeDefs = gql`
  type User {
    id: Int!
    email: String!
    username: String!
    hashedPassword: String!
    role: Role!
  }

  enum Role {
    USER
    ADMIN
  }

  type Query {
    getUsers: [User]
    getUserByEmail(email: String!): User
  }
`;

export default typeDefs;
