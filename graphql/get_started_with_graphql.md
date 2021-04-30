## Purpose
This guide is to let you know the basic concepts and characteristics of GraphQL, then leading you to build your own 
GraphQL server based on the concepts. \
We are using Nodejs to write the server.

It has 4 parts in this guide.
1. What is GraphQL?
2. Basic concepts of GraphQL
3. Build a GraphQL server
4. Characteristics of GraphQL - ask exactly what you want

## What is GraphQL?
In the official website of GraphQL, it says "GraphQL is a query language for APIs and a runtime for fulfilling 
those queries with your existing data. GraphQL provides a complete and understandable description of the data in 
your API, gives clients the power to ask for exactly what they need and nothing more, makes it easier to evolve APIs 
over time, and enables powerful developer tools."

To understand it more clearly, you can just consider GraphQL as one kind of API design style. Other API design styles that
you are probably familiar with are Rest, RPC and Soap. GraphQL describes the grammar to request data, usually used when 
frontend clients request data from a server.

## Basic concepts of GraphQL
We will explain 3 concepts of GraphQL, they are basic to write a GraphQL server as well.
* operation
* schema
* resolver

### Operation
It is "operation type" actually. Operation type describes what action client wants the server to do. 
GraphQL supports 3 operation types, query, mutation and subscription.

Query is to retrieve data. It is familiar with "R" in "CRUD". \
Mutation is to change the data, such as add, update and delete. It is familiar with "CUD" in "CRUD". \
Subscription is to subscribe. When data changes, it pushes messages.

### Schema
Schema describes the types of the fields in APIs, and the structures of the data. Also, it describes the rules to request data.\
For example, definition in the server can be: 
```
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
```

### Resolver
Now you've already defined the parameters and response of requesting user. However, your server does not know what data 
to return. A resolver tells GraphQL server where and how to get the corresponding data. You can write your process steps 
in the resolver.

For the GetUser API (let's call it API now although it is not exactly), your resolver can be:
```
    export const GetUser = async ({ user_id }, ctx = {}, info = {}) => {
      ... // process steps, get the result
      return ...; // return the result
    }
```

## Build a GraphQL server
Let's try to build a server to implement the GetUser API.\
Choose one folder to run the commands one by one:
```
    mkdir graphql-server-example
    cd graphql-server-example/
    npm init --yes
    npm install apollo-server-express graphql
    touch index.js
```

Let's have a look at the commands.
* "mkdir graphql-server-example" and "cd graphql-server-example/", to create a folder and enter the folder.
* "npm init --yes", to init a project using npm. "--yes" means that npm will use only defaults to init the project
and not prompt you for any options. To install npm, click https://www.npmjs.com/get-npm for details.
* "npm install apollo-server-express graphql", to install the 2 dependencies. We need to use the 2 dependencies to build
our server.
* "touch index.js", to create one file named index.

Open index.js file, copy the scripts to the file.
```
    const express = require('express');
    const { ApolloServer, gql } = require('apollo-server-express');
    
    // Construct a schema, using GraphQL schema language
    const typeDefs = gql`
    `;
    
    const resolvers = {
    };
    
    const server = new ApolloServer({ typeDefs, resolvers });
    
    const app = express();
    server.applyMiddleware({ app });
    
    app.listen({ port: 4000 }, () =>
      console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
```

Let's have a look at the scripts.
```
    const express = require('express');
    const { ApolloServer, gql } = require('apollo-server-express');
```
The 2 lines import required dependencies. We are using "apollo-server-express" to build our server.

```
    // Construct a schema, using GraphQL schema language
    const typeDefs = gql`
    `;
    
    const resolvers = {
    };
```
As talked above, schema and resolver are basic concepts for GraphQL. We need to add our schema in typeDefs and our 
resolver in resolvers later.

```
    const server = new ApolloServer({ typeDefs, resolvers });
    
    const app = express();
    server.applyMiddleware({ app });
    
    app.listen({ port: 4000 }, () =>
      console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
```
These lines of code will init a server using above typeDefs and resolvers.

You have the initial scripts now! Now let's try to complete the codes for typeDefs and resolvers.\
For typeDefs: 
```
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
```

For resolvers:
```
    const resolvers = {
      Query: {
        GetUser: ({user_id}) => user,
      },
    };
```
We let the resolver to return user data directly, so we need to add user data. In your real resolver, it may need several
steps to work out the user data. However, in our example, let's define a const.
```
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
```

All done! Now you can run "node index.js" in your terminal to start the server. After it starts, you will see this:
```
    your_path\graphql-server-example>node index.js
    🚀 Server ready at http://localhost:4000/graphql
```

Let's try to call the API. Open the page http://localhost:4000/graphql, it's a tool to send GraphQL APIs. Write the query:
```
    query {
      GetUser(user_id: "123456") {
        id, name, age, type, created_at,
        department {
          id, name
        }
      }
    }
```
You will get the response:
```
    {
      "data": {
        "GetUser": {
          "id": "8ab517a4-1234-1234-1234-81d618d0b7b7",
          "name": "Test user",
          "age": 25,
          "type": "Employee",
          "created_at": 1619770386,
          "department": {
            "id": "987654",
            "name": "Test department"
          }
        }
      }
    }
```

You can get complete index.js file here https://github.com/echo-qin/learning-tech/graphql/examples/index.js.

## Characteristics of GraphQL - ask exactly what you want
GraphQL has many strengths. Here we only talk about this one - ask exactly what you want.\
Back to your query above, you requested id, name, age, type, created_at and department information for the user. What if
you only want the id and name for the user?

In Restful, the server will always return all the information, and you need to select what you want from the response. 
But in GraphQL, you can request what you want, and the server will only return the fields that you want. Change your query to this:
```
    query {
      GetUser(user_id: "123456") {
        id, name
      }
    }
```
Then you will get the response:
```
    {
      "data": {
        "GetUser": {
          "id": "8ab517a4-1234-1234-1234-81d618d0b7b7",
          "name": "Test user"
        }
      }
    }
```

No waste on the internet transport! Have a try.