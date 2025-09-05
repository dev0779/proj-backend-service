import express from "express";
import { PrismaClient } from "@prisma/client";
import { typeDefs } from "./graphql/schemas/index.js";
import { resolvers } from "./graphql/resolvers/index.js";
import { ApolloServer } from "apollo-server-express";
import { verifyToken } from "./auth/auth.js";
import cookieParser from "cookie-parser";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

app.use(cookieParser());

app.use((req, res, next) => {
  const token = req.cookies["token"];
  if (token) {
    const decoded = verifyToken(token);
    if (decoded) {
      req.user = decoded;
    }
  }
  next();
});

// GraphQL
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({
    currentUser: req.user,
    prisma,
    res,
  }),
});

async function startServer() {
  await server.start();
  server.applyMiddleware({
    app,
    cors: {
      origin: "http://localhost:5173", // frontend URL
      credentials: true,
    },
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(
      `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
    )
  );
}

startServer();

/* const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); */
