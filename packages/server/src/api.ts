import fastifyCors from '@fastify/cors';
import fastifySwagger from '@fastify/swagger';
import fastify from 'fastify';
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
  ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { endpoints } from './endpoints/endpoints.js';
import { Container } from './utils/container.js';

class BaseError extends Error {
  public statusCode: number;
  constructor(message: string, statusCode = 500) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
  }
}

const createApi = async (container: Container) => {
  const app = fastify().withTypeProvider<ZodTypeProvider>();
  app.decorate('container', container);
  app.setValidatorCompiler(validatorCompiler);
  app.setSerializerCompiler(serializerCompiler);

  app.register(fastifyCors);
  app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Ingestion API',
        version: '1.0.0',
      },
    },
    transform: jsonSchemaTransform,
  });

  await app.register(import('@scalar/fastify-api-reference'), {
    routePrefix: '/docs',
  });

  app.addHook('onRequest', async (req) => {
    req.container = container;
  });

  app.setErrorHandler((err, req, reply) => {
    console.error(err);
    if (hasZodFastifySchemaValidationErrors(err)) {
      return reply.code(400).send({
        error: 'Response Validation Error',
        message: "Request doesn't match the schema",
        statusCode: 400,
        details: {
          issues: err.validation,
          method: req.method,
          url: req.url,
        },
      });
    }

    if (isResponseSerializationError(err)) {
      return reply.code(500).send({
        error: 'Internal Server Error',
        message: "Response doesn't match the schema",
        statusCode: 500,
        details: {
          issues: err.cause.issues,
          method: err.method,
          url: err.url,
        },
      });
    }

    if (err instanceof BaseError) {
      return reply.code(err.statusCode ?? 500).send({
        error: err.name,
        message: err.message,
        statusCode: err.statusCode,
      });
    }

    return reply.code(500).send({
      error: 'Internal Server Error',
      message: err instanceof Error ? err.message : 'An unknown error occurred',
      statusCode: 500,
    });
  });

  app.get('/health', async () => {
    return { status: 'ok' };
  });

  await app.register(endpoints);
  await app.ready();
  app.swagger();

  return app;
};

export { createApi };
