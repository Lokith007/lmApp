import { ApolloClient, InMemoryCache, HttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: new HttpLink({
    uri: "https://lm-backend-production-d237.up.railway.app/", // 👈 your backend GraphQL endpoint
  }),
  cache: new InMemoryCache(),
});

export default client;
