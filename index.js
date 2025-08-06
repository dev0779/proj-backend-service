import express from "express";
import { PrismaClient } from "@prisma/client";
import { typeDefs } from "./graphql/schemas/index.js";
import { resolvers } from "./graphql/resolvers/index.js";
import { ApolloServer } from "apollo-server-express";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

/* app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.post("/users", async (req, res) => {
  const { first_name, last_name, email, username, password, status } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: { first_name, last_name, email, username, password, status },
    });
    res.json(newUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to create user" });
  }
}); */

// GraphQL
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: () => ({ prisma }),
});

async function startServer() {
  await server.start();
  server.applyMiddleware({ app });

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
