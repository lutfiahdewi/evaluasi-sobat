import { QuillEditor, Quill } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css';

export default defineNuxtPlugin(nuxtApp => {
    nuxtApp.vueApp.component('QuillEditor', QuillEditor);
    //nuxtApp.vueApp.use(Delta);
    //const docus = new Quill(document.createElement("div"));
    //nuxtApp.vueApp.provide(docus, docus);
  })