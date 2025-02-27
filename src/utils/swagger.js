import { createSwaggerSpec } from 'next-swagger-doc';

export const getApiDocs = async () => {
  const spec = createSwaggerSpec({
    apiFolder: 'app/api', // Thư mục chứa API routes của bạn
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Next Swagger API Example',
        version: '1.0.0',
      },
    },
  });
  return spec;
};
