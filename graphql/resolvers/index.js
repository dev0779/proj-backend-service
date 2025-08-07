import { userResolvers } from "./user.resolver.js";
import { mergeResolvers } from "@graphql-tools/merge";
import { DateTimeResolver } from 'graphql-scalars';

const customScalars = {
    DateTime: DateTimeResolver
}

export const resolvers = mergeResolvers([userResolvers, customScalars]);
