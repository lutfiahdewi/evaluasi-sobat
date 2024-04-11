import { logErrorMessages } from "@vue/apollo-util";
import { defineStore } from "pinia";
import { useLogin } from "~/composables/useQueries";
import { DefaultApolloClient, provideApolloClient } from "@vue/apollo-composable";
import { ApolloClient, InMemoryCache, createHttpLink, type NormalizedCacheObject } from "@apollo/client/core";
import { inject } from "vue";

// const nuxtApp = useNuxtApp()
// const currentClient: ApolloClient<NormalizedCacheObject> = nuxtApp.vueApp.runWithContext(()=>inject(DefaultApolloClient))
interface UserPayloadInterface {
  email: string;
  password: string;
}
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


export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: false,
    loading: false,
  }),
  actions: {
    async authenticateUser({ email, password }: UserPayloadInterface) {
      // useFetch from nuxt 3
      /*const { data, pending }: any = await useFetch('https://dummyjson.com/auth/login', {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        body: {
          username,
          password,
        },plugin, Nuxt hook, Nuxt middleware, or Vue setup function.
      });*/
      const { mutate: sendLogin, onDone, onError, loading } = provideApolloClient(apolloClient)(() => useMutation(useLogin()));
      sendLogin({ email, password });
      this.loading = loading.value;
      onError((error) => {
        logErrorMessages(error);
        return;
      });
      onDone((result) => {
        if (result.data) {
          console.log("token from grqpql: ", result.data?.login?.token);
          const token = useCookie("token", { maxAge: 30 * 24 * 3600 }); // useCookie new hook in nuxt 3
          token.value = result.data?.login?.token; // set token to cookie
          this.authenticated = true; // set authenticated  state value to true
        }
      });
    },
    logUserOut() {
      const token = useCookie("token"); // useCookie new hook in nuxt 3
      this.authenticated = false; // set authenticated  state value to false
      token.value = null; // clear the token cookie
    },
  },
});
