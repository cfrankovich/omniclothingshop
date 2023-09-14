import { gql } from 'apollo-server-express';

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

    type Query {
        allGarments: [Garment]
    }
`;

export default typeDefs;
