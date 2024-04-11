import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client/core";
import { DefaultApolloClient } from "@vue/apollo-composable";


// Apollo client
// HTTP connection to the API
const httpLink = createHttpLink({
    uri: "http://localhost:4000/",
  });
  
  // Cache implementation
  const cache = new InMemoryCache();
  
  // Create the apollo client
  const apolloClient = new ApolloClient({
    link: httpLink,
    cache,
  });

  export default defineNuxtPlugin((nuxtApp) => {
    nuxtApp.vueApp.provide(DefaultApolloClient, apolloClient);
  })