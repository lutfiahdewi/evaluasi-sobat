import { storeToRefs } from 'pinia';
import { useAuthStore } from '~/store/auth';

export default defineNuxtRouteMiddleware((to) => {
  const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive
  const token = useCookie("token"); // get token from cookies
  console.log("Hello form middleware");

  if (token.value) {
    // check if value exists
    authenticated.value = true; // update the state to authenticated
  }

  // if token exists and url is /login redirect to homepage
  if (token.value && to?.name === 'login') {
    // return navigateTo('/beranda');
    return reloadNuxtApp({path: '/beranda'});
  }

  // if token doesn't exist redirect to log in
  if (!token.value && to?.name !== 'login') {
    if (to?.name !== ''){
      return;
    }
    abortNavigation();
    return navigateTo('/login');
  }
});
