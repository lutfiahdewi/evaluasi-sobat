import { logErrorMessages } from "@vue/apollo-util";
import { defineStore } from "pinia";
import { useLogin } from "~/composables/useQueries";
import { provideApolloClient } from "@vue/apollo-composable";
import { ApolloClient, InMemoryCache, createHttpLink, type NormalizedCacheObject } from "@apollo/client/core";

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

// determine role
type Role = "default" | "admin" | "mitra" | "operator";
function validateRole(roleId: number) {
  let role: Role = "default";
  if (roleId === 1 || roleId === 2) {
    role = "admin";
  } else if (roleId === 0 || roleId === 3) {
    role = "mitra";
  }
  return role;
}

export const useAuthStore = defineStore("auth", {
  state: () => ({
    authenticated: false,
    loading: false,
    username: "",
    roleId: -1,
    role: "default",
  }),
  getters: {
    getUsername: (state) => {
      return state.username;
    },
    getRole: (state) => state.role,
  },
  actions: {
    async authenticateUser({ email, password }: UserPayloadInterface): Promise<boolean> {
      const { mutate: sendLogin, onDone, onError, loading } = provideApolloClient(apolloClient)(() => useMutation(useLogin()));
      try {
        const result = await sendLogin({ email, password });
        this.loading = loading.value;
        const token = useCookie("token", { maxAge: 30 * 24 * 3600 }); // useCookie new hook in nuxt 3
        const authorizedRole = useCookie("authorizedRole");
        const operator = useCookie("operator");
        token.value = result?.data.login.token; // set token to cookie
        if (result?.data) {
          this.username = result?.data.login.user.username;
          this.roleId = result?.data.login.user.UserRole[0].role_id;
          this.role = validateRole(this.roleId);
          authorizedRole.value =this.role;
          operator.value = this.roleId == 2 ? 'true' : undefined;
          this.authenticated = true;
        }
        return true;
      } catch (e) {
        onError((error) => {
          logErrorMessages(error);
          this.authenticated = false;
        });
        return false;
      }
    },
    logUserOut() {
      const token = useCookie("token"); // useCookie new hook in nuxt 3
      token.value = undefined; // clear the token cookie
      this.authenticated = false; // set authenticated  state value to false
    },
  },
});
