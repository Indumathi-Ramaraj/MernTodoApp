const swaggerJSDoc = require("swagger-jsdoc");

/**
 * Swagger definition (OpenAPI 3.0)
 */
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "TODO App API",
      version: "1.0.0",
      description:
        "Swagger documentation for the TODO backend (authentication & todo management).",
      contact: {
        name: "Indumathi MR",
        email: "induammu218@gmail.com",
      },
    },

    servers: [
      {
        url: "https://mern-todo-backend-88mz.onrender.com/api",
        description: "Local dev server",
      },
    ],
    tags: [
      { name: "Auth", description: "Signup / Login routes" },
      { name: "Todo", description: "Todo CRUD routes" },
    ],
    components: {
      securitySchemes: {
        OAuth2PasswordBearer: {
          type: "oauth2",
          flows: {
            password: {
              tokenUrl: "https://mern-todo-backend-88mz.onrender.com/api/login",
              description: "Use your email as username",
              scopes: {},
            },
          },
        },
      },
    },
    security: [
      {
        OAuth2PasswordBearer: [],
      },
    ],
  },

  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
