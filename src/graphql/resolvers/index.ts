import { garmentResolvers } from "./garmentResolvers";
import { userResolvers } from "./userResolvers";
import { dateTimeResolver } from "./scalarResolvers";

const resolvers = {
  Query: {
    ...garmentResolvers.Query,
    ...userResolvers.Query,
  },
  DateTime: dateTimeResolver,
};

export default resolvers;
