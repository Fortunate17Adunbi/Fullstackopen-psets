import React from "react";
import ReactDOM from "react-dom/client";
import { ApolloClient, HttpLink, InMemoryCache, split } from "@apollo/client";
import { SetContextLink } from "@apollo/client/link/context";
import { ApolloProvider } from "@apollo/client/react";
import { BrowserRouter as Router } from "react-router-dom";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import App from "./App.jsx";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";

const authLink = new SetContextLink((_, { headers }) => {
  const token = localStorage.getItem("logged-user-to-library");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : null,
    },
  };
});

const httpLink = new HttpLink({ uri: "http://localhost:4000/" });

const wsLink = new GraphQLWsLink(createClient({ url: "ws://localhost:4000" }));

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);

    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  authLink.concat(httpLink)
);

const client = new ApolloClient({
  link: splitLink,
  cache: new InMemoryCache(),
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Router>
        <App />
      </Router>
    </ApolloProvider>
  </React.StrictMode>
);
