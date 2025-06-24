import { z } from 'zod';

const filterDateSchema = z.object({
  gt: z.string().datetime().optional(),
  gte: z.string().datetime().optional(),
  lt: z.string().datetime().optional(),
  lte: z.string().datetime().optional(),
});

const filterNullableDateSchema = filterDateSchema.extend({
  null: z.boolean().optional(),
});

const documentSchema = z.object({
  id: z.string(),
  source: z.string(),
  sourceType: z.string(),
  sourceId: z.string().nullable().optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  deletedAt: z.string().datetime().nullable().optional(),
  data: z.unknown(),
});

const documentUpsertSchema = documentSchema.omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  deletedAt: true,
});

const documentQuerySchema = z.object({
  sources: z.array(z.string()).optional(),
  sourceTypes: z.array(z.string()).optional(),
  sourceIds: z.array(z.string()).optional(),
  createdAt: filterDateSchema.optional(),
  updatedAt: filterDateSchema.optional(),
  deletedAt: filterNullableDateSchema.optional(),
  limit: z.number().min(1).max(100).default(100),
  offset: z.number().min(0).default(0),
});

const documentIngestResponseSchema = z.object({
  id: z.string(),
  upserted: z.boolean(),
});

const documentQueryResponseSchema = z.object({
  documents: z.array(documentSchema),
  hasMore: z.boolean(),
});

export {
  documentSchema,
  documentUpsertSchema,
  documentQuerySchema,
  filterDateSchema,
  filterNullableDateSchema,
  documentIngestResponseSchema,
  documentQueryResponseSchema,
};
