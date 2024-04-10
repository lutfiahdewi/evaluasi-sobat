// apollo.config.js
module.exports = {
  client: {
    service: {
      // name: "my-app",
      // URL to the GraphQL API
      // url: 'https://swapi-graphql.netlify.app/.netlify/functions/index',
      // url: "http://localhost:8080/",
      url: "http://localhost:4000/",
      localSchemaFile: "./graphql-apollo/schema.graphql",
    },
    // Files processed by the extension
    includes: ["src/**/*.vue", "pages/**/*.vue", "src/**/*.js", "store/**/*.ts"],
  },
};
