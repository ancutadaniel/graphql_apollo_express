import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import express from 'express';
import { expressjwt } from 'express-jwt';
import jwt from 'jsonwebtoken';
import { User } from './db.js';

// read schema from file
import { readFile } from 'fs/promises';
import { resolvers } from './resolvers.js';

const PORT = 9000;
const JWT_SECRET = Buffer.from('Zn8Q5tyZ/G1MHltc4F/gTkVJMlrbKiZt', 'base64');

const app = express();
app.use(
  cors(),
  express.json(),
  expressjwt({
    algorithms: ['HS256'],
    credentialsRequired: false,
    secret: JWT_SECRET,
  })
);

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne((user) => user.email === email);
  if (user && user.password === password) {
    const token = jwt.sign({ sub: user.id }, JWT_SECRET);
    res.json({ token });
  } else {
    res.sendStatus(401);
  }
});

// ===== GraphQL initiate Apollo Server ===== //
// read schema from file and pass it to Apollo Server
const typeDefs = await readFile('./schema.graphql', 'utf8');

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});
// ===== GraphQL initiate Apollo Server ===== //
await apolloServer.start();
// ===== GraphQL apply Apollo Server to Express ===== //
// we can handle express routes and GraphQL requests on the same port
// some on /graphql, some on /login, etc.
apolloServer.applyMiddleware({ app, path: '/graphql' });

app.listen({ port: PORT }, () => {
  console.log(`Express Server running on port:  http://localhost:${PORT}`);
  console.log(
    `GraphQL running on port: http://localhost:${PORT}${apolloServer.graphqlPath}`
  );
});
