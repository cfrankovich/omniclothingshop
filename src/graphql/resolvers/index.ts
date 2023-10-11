import { garmentResolvers } from "./garmentResolvers";
import { userResolvers } from "./userResolvers";

const resolvers = {
  Query: {
    ...garmentResolvers.Query,
    ...userResolvers.Query,
  },
};

export default resolvers;
