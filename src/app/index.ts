import express, { Request, Response } from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import bodyParser from 'body-parser';

export async function initServer() {
    const app = express();

    app.use(cors());
    app.use(bodyParser.json());

    const graphqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
            }

            type Mutation {
                setCookie(name: String!, value: String!): String
            }
        `,
        resolvers: {
            Query: {
                hello: () => "Hello, world!"
            },
            Mutation: {
                setCookie: async (_: any, { name, value }: { name: string; value: string }, { res }: { res: Response }) => {
                    setCookie(res, name, value, { httpOnly: true, maxAge: 1000 * 60 * 60 }); // 1 hour
                    return "Cookie has been set!";
                }
            }
        },
    });

    await graphqlServer.start();

    app.use("/graphql", expressMiddleware(graphqlServer, {
        context: async ({ req, res }: { req: Request; res: Response }) => ({
            req,
            res
        }),
    }));

    return app;
}

// Function to set a cookie
function setCookie(res: Response, name: string, value: string, options: object = {}) {
    res.cookie(name, value, options);
}
