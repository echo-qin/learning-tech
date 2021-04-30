const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');

const user = {
  id: "8ab517a4-1234-1234-1234-81d618d0b7b7",
  name: "Test user",
  age: 25,
  type: "Employee",
  created_at: 1619770386,
  department: {
    id: "987654",
    name: "Test department"
  }
}

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
    type Query {
      GetUser(user_id: String!): User!
    }

    type User {
      id: String!
      name: String!
      age: Int
      type: String!
      created_at: Int!
      department: Department
    }

    type Department {
      id: String!
      name: String!
    }
`;

const resolvers = {
  Query: {
    GetUser: (user_id) => user,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

const app = express();
server.applyMiddleware({ app });

app.listen({ port: 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
