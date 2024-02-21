// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  hooks: {},
  devtools: { enabled: true },
  typescript: {
    strict: true,
  },
  css: ["~/assets/css/main.css"],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  plugins: ["~/plugins/preline.client.ts", { src: "~/plugins/vue-good-table-next.js", ssr: false }],
  modules: ['@nuxtjs/apollo', '@vueuse/nuxt'],
  apollo: {
    clients: {
      default: {
        httpEndpoint: 'https://swapi-graphql.netlify.app/.netlify/functions/index'
      }
    },
  },
});
