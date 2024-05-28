// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  hooks: {},
  devtools: { enabled: true },
  typescript: {
    // typeCheck: true,
    strict: true,
  },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  image: {
    dir: "assets/img",
    domains: ["evaluasi-sobat.vercel.com"],
  },
  plugins: [
    "~/plugins/preline.client.ts",
    "~/plugins/my-apollo-client.ts",
    "~/plugins/vue-select.ts",
    { src: "~/plugins/vue-good-table-next.js", ssr: false },
    { src: "~/plugins/vue-quill.ts", mode: "client" },
    // { src: "~/plugins/vue-select.ts", mode: "client" },
  ],
  // vue: {
  //   compilerOptions: {
  //     isCustomElement: (tag) => ["v-select", 'QuillEditor'].includes(tag),
  //   },
  // },
  modules: ["@nuxtjs/apollo", "@vueuse/nuxt", "@nuxt/image", "@vee-validate/nuxt", "nuxt-lodash", "@pinia/nuxt"],
  apollo: {
    clients: {
      default: {
        httpEndpoint: "https://evaluasisobat.my.id/graphql",
      },
    },
  },
  veeValidate: {
    // disable or enable auto imports
    autoImports: true,
    // Use different names for components
    componentNames: {
      Form: "VeeForm",
      Field: "VeeField",
      FieldArray: "VeeFieldArray",
      ErrorMessage: "VeeErrorMessage",
    },
  },
});
