<script setup lang="ts">
definePageMeta({
  layout: false,
});
import { storeToRefs } from "pinia"; // import storeToRefs helper hook from pinia
import { useAuthStore } from "~/store/auth"; // import the auth store we just created

// const router = useRouter();
const {onLogout} = useApollo()

const { logUserOut } = useAuthStore(); // use authenticateUser action from  auth store
const { authenticated } = storeToRefs(useAuthStore()); // make authenticated state reactive with storeToRefs
logUserOut();
const authorizedRole = useCookie("authorizedRole");
const operator = useCookie("operator");
authorizedRole.value = undefined;
operator.value = undefined;
onLogout(); // remove auth token in apollo client
/*if(authenticated){
  return
}else{
}*/

reloadNuxtApp({ path: "/" });
</script>

<template>
  <ModalLoading> Logging you out... </ModalLoading>
</template>
