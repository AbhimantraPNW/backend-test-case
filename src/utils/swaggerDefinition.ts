import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'backend tes api documentation',
    },
    servers: [
      {
        url: 'http://localhost:8000',
      },
    ],
  },
  apis: ['./src/controllers/**/*.ts', './src/routes/**/*.ts'], 
};

export const swaggerSpec = swaggerJSDoc(options);