import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/auth';

export default defineNuxtRouteMiddleware((to) => {
  //Used to apply the given auth token to the specified Apollo client.
  const { onLogin } = useApollo();
  const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive
  const token = useCookie("token"); // get token from cookies
  console.log("Hello form middleware");
  console.log(to?.name);
  console.log(token.value);

  // check if value exists
  if (token.value) {
    onLogin(token.value)// set token for apollo client
    authenticated.value = true; // update the state to authenticated
  }

  // if token exists and url is /login redirect to homepage
  /*if (!(token.value===null || token.value===undefined) && (to?.name === 'login')) {
    // return navigateTo('/beranda');
    return reloadNuxtApp({path: '/beranda'});
  }*/

  // if token doesn't exist redirect to log in
  if (!token.value && to?.name !== 'login') {
    if (to?.name !== 'index'){
      return;
    }
    abortNavigation();
    return navigateTo('/');
  }
});
