import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "school app",
        version: "1.0.0",
        description: "This is the description of the school app",
    },
    servers: [
        {
            url: "http://localhost:3000",
        },
    ],
};

const options = {
    definition: swaggerDefinition,
    apis: ['./src/routes/*.ts','./app.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);