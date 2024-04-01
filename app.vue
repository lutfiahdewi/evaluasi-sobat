<script setup lang="ts">
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client/core";
import { DefaultApolloClient } from "@vue/apollo-composable";
useHead({
  titleTemplate: (titleChild) => {
    return titleChild ? `${titleChild} - Evaluasi SOBAT Mitra` : "Evaluasi SOBAT Mitra";
  },
  meta: [{ name: "description", content: "An unnofficial part of SOBAT BPS for performance assessment." }],
  bodyAttrs: {
    class: "test",
  },
  link: [{ rel: "icon", type: "image/png", href: "/logo.png" }],
  script: [{ innerHTML: "console.log('Main app rendered!')" }],
});

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

provide(DefaultApolloClient, apolloClient);
</script>

<template>
  <div>
    <!-- <NuxtWelcome /> -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>
