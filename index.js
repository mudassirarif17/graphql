import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import axios from "axios";

async function startServer() {
    const PORT = 4000;
    const app = express();

    const typeDefs = `

        type User {
            id: ID!,
            name: String!,
            username: String!,
            email: String!,
            phone: String!,
            website: String!,
        }

        type Todo {
            id: ID!
            title: String
            completed: Boolean
            user: User
        }

        

        type Query {
            getTodos: [Todo]
            getUsers : [User]
            getUser(id : ID!) : User
        }
    `;

    const resolvers = {
        Todo : {
            user: async (todo) => (
                await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.id}`)
            ).data
        },
        Query: {
            //getTodos: () => [{ id: 1, title: "SomeThing SomeThing", completed: false } , { id: 2, title: "Tehami", completed: false }],
            getTodos: async () => (await axios.get('https://jsonplaceholder.typicode.com/todos')).data ,
            getUsers: async () => (await axios.get('https://jsonplaceholder.typicode.com/users')).data,
            getUser: async (parent , {id}) => (await axios.get(`https://jsonplaceholder.typicode.com/users/${todo.id}`)).data,
        },
    };

    const server = new ApolloServer({ typeDefs, resolvers });
    await server.start(); // Start Apollo server

    app.use(cors());
    app.use(bodyParser.json());
    app.use('/graphql', expressMiddleware(server)); // Correct the typo here

    app.listen(PORT, () =>
        console.log(`Server is running on http://localhost:${PORT}/graphql`)
    );
}

startServer();
