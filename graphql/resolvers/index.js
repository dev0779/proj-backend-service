import { userResolvers } from "./user.resolver.js";
import { mergeResolvers } from "@graphql-tools/merge";

export const resolvers = mergeResolvers([userResolvers]);
