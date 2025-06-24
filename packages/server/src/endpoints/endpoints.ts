import { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { z } from 'zod';

import {
  documentIngestResponseSchema,
  documentQueryResponseSchema,
  documentQuerySchema,
  documentUpsertSchema,
} from '../schemas/schemas.js';
import { DocumentsService } from '../services/services.documents.js';

const endpoints: FastifyPluginAsyncZod = async (fastify) => {
  fastify.route({
    method: 'POST',
    url: '/documents',
    schema: {
      body: documentUpsertSchema,
      response: {
        200: documentIngestResponseSchema,
      },
    },
    handler: async (request, reply) => {
      const documentsService = request.container.get(DocumentsService);
      const result = await documentsService.upsert(request.body);
      reply.status(200).send(result);
    },
  });

  fastify.route({
    method: 'DELETE',
    url: '/documents',
    schema: {
      body: z.object({ ids: z.array(z.string()) }),
    },
    handler: async (request, reply) => {
      const documentsService = request.container.get(DocumentsService);
      await documentsService.delete(request.body.ids);
      reply.status(204);
    },
  });

  fastify.route({
    method: 'POST',
    url: '/query',
    schema: {
      body: documentQuerySchema,
      response: {
        200: documentQueryResponseSchema,
      },
    },
    handler: async (request, reply) => {
      const documentsService = request.container.get(DocumentsService);
      const documents = await documentsService.query(request.body);
      reply.status(200).send(documents);
    },
  });
};

export { endpoints };
