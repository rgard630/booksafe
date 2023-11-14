// Load required modules and dependencies
const express = require('express');
const path = require('path');
const db = require('./config/connection');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require('@apollo/server/express4');
const { authMiddleware } = require('./utils/auth');
const { typeDefs, resolvers } = require('./schemas');

// Establish an instance of the Express application
const app = express();

// Define the server's port using an environment variable or defaulting to 3001
const PORT = process.env.PORT || 3001;

// Instantiate an Apollo Server configured with defined typeDefs and resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Async function to commence the Apollo Server
const initiateApolloServer = async () => {
  // Begin the Apollo Server
  await server.start();

  // Implement middleware to manage URL-encoded and JSON data
  app.use(express.urlencoded({ extended: false }));
  app.use(express.json());

  // Introduce middleware for processing GraphQL requests with authentication
  app.use('/graphql', expressMiddleware(server, {
    context: authMiddleware
  }));

  // Serve static resources if in production (for React client)
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/dist')));

    // Route for other paths to serve the React client's index.html
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, '../client/dist/index.html'));
    });
  }

  // Once the database connection is established, initiate the Express server
  db.once('open', () => {
    app.listen(PORT, () => {
      // Display server details in the console upon successful launch
      console.log(`API server running on port ${PORT}!`);
      console.log(`Use GraphQL at http://localhost:${PORT}/graphql`);
    });
  });
};

// Invoke the function to commence the Apollo Server
initiateApolloServer();
