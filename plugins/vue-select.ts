import  VueSelect from "vue-select";
// import { VueSelect } from "vue-select";
import "vue-select/dist/vue-select.css";

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.component("v-select", VueSelect);
  // nuxtApp.vueApp.config.compilerOptions.isCustomElement = (tag) => ['v-select'].includes(tag)
  // nuxtApp.vueApp.component("v-select", vSelect);
});
