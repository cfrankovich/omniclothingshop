import { GraphQLScalarType, Kind } from "graphql";

export const dateTimeResolver = new GraphQLScalarType({
  name: "DateTime",
  description:
    "Custom DateTime scalar type for representing date and time values.",
  serialize(value: any) {
    return value.toISOString(); // value sent to the client
  },
  parseValue(value: any) {
    return new Date(value); // value from the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new Date(ast.value); // ast value is always in string format
    }
    return null;
  },
});
