import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';

export async function initServer() {
    const app = express();

    app.use(cors());

    const graphqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
            }
        `,
        resolvers: {
            Query: {
                hello: () => "Hello, world!"
            }
        },
    });

    await graphqlServer.start();

    app.use("/graphql", expressMiddleware(graphqlServer));

    return app;
}
