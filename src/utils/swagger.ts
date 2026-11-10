import swaggerJsDoc from "swagger-jsdoc"

const options = {
  failOnErrors: true,
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'web-technologies project/7',
      version: '1.0.0',
    },
  },
  apis: ['./src/routers/*.ts'],
};

export const openapiSpecification = swaggerJsDoc(options);