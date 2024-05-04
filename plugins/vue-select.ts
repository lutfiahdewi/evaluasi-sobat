import  VueSelect from "vue-select";
// import vSelect from 'vue-select'
import "vue-select/dist/vue-select.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("v-select", VueSelect);
  // nuxtApp.vueApp.component("v-select", vSelect);
});
