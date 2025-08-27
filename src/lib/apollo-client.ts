import { ApolloClient, InMemoryCache } from "@apollo/client";
import createUploadLink from "apollo-upload-client/createUploadLink.mjs";

const uploadLink = createUploadLink({
    uri: "/graphql",
    headers: {
        "GraphQL-Preflight": "1", // Required for Hot Chocolate multipart requests
    },
});

export const apolloClient = new ApolloClient({
    link: uploadLink,
    cache: new InMemoryCache(),
    defaultOptions: {
        watchQuery: {
            errorPolicy: "all",
        },
        query: {
            errorPolicy: "all",
        },
    },
});
