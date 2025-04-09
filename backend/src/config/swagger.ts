import swaggerJsdoc from "swagger-jsdoc";

export const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Minha API",
      version: "1.0.0",
      description: "Documentação da API com Swagger",
    },
  },
  apis: ["./src/routes/*.ts"], // Caminho dos arquivos com comentários Swagger
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
