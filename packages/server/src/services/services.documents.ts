import deepEqual from 'deep-equal';
import { z } from 'zod';
import { EventEmitter } from 'eventemitter3';

import { Container } from '../utils/container.js';
import {
  documentIngestResponseSchema,
  documentQueryResponseSchema,
  documentQuerySchema,
  documentUpsertSchema,
} from '../schemas/schemas.js';
import { applyDateFilter, Database, type DocumentRow, tableNames } from '../database/database.js';

type DocumentServiceEvents = {
  'document.upsert': (document: z.infer<typeof documentUpsertSchema>) => void;
};

class DocumentsService extends EventEmitter<DocumentServiceEvents> {
  #container: Container;

  constructor(container: Container) {
    super();
    this.#container = container;
  }

  public query = async (
    query: z.infer<typeof documentQuerySchema>,
  ): Promise<z.infer<typeof documentQueryResponseSchema>> => {
    const db = await this.#container.get(Database).getDb();
    let queryBuilder = db<DocumentRow>(tableNames.documents).select('*');

    if (query.sources) {
      queryBuilder = queryBuilder.whereIn('source', query.sources);
    }

    if (query.sourceTypes) {
      queryBuilder = queryBuilder.whereIn('sourceType', query.sourceTypes);
    }

    if (query.sourceIds) {
      queryBuilder = queryBuilder.whereIn('sourceId', query.sourceIds);
    }

    queryBuilder = applyDateFilter(queryBuilder, 'createdAt', query.createdAt);
    queryBuilder = applyDateFilter(queryBuilder, 'updatedAt', query.updatedAt);
    queryBuilder = applyDateFilter(queryBuilder, 'deletedAt', query.deletedAt);

    queryBuilder.limit(query.limit + 1);
    queryBuilder.offset(query.offset);

    const documents = await queryBuilder;
    const hasMore = documents.length > query.limit;

    return {
      documents: documents.map((document) => ({
        ...document,
        data: document.data.value,
        createdAt: document.createdAt.toISOString(),
        updatedAt: document.updatedAt.toISOString(),
        deletedAt: document.deletedAt?.toISOString() ?? null,
      })),
      hasMore,
    };
  };

  public delete = async (ids: string[]) => {
    const db = await this.#container.get(Database).getDb();
    await db<DocumentRow>(tableNames.documents).whereIn('id', ids).update({
      deletedAt: new Date(),
    });
  };

  public upsert = async (
    document: z.infer<typeof documentUpsertSchema>,
  ): Promise<z.infer<typeof documentIngestResponseSchema>> => {
    const parsedDocument = documentUpsertSchema.parse(document);
    const db = await this.#container.get(Database).getDb();
    const existingDocument: DocumentRow | undefined = parsedDocument.sourceId
      ? await db<DocumentRow>(tableNames.documents)
          .from(tableNames.documents)
          .where({
            source: parsedDocument.source,
            sourceType: parsedDocument.sourceType,
            sourceId: parsedDocument.sourceId,
          })
          .first()
      : undefined;

    if (existingDocument && deepEqual(existingDocument.data.value, parsedDocument.data)) {
      return {
        id: existingDocument.id,
        upserted: false,
      };
    }

    const insertData: DocumentRow = {
      ...parsedDocument,
      id: existingDocument?.id ?? crypto.randomUUID(),
      sourceId: parsedDocument.sourceId ?? null,
      createdAt: existingDocument?.createdAt ? new Date(existingDocument.createdAt) : new Date(),
      updatedAt: new Date(),
      deletedAt: null,
      data: {
        value: parsedDocument.data,
      },
    };

    if (existingDocument) {
      await db<DocumentRow>(tableNames.documents).where({ id: existingDocument.id }).update(insertData);
    } else {
      await db<DocumentRow>(tableNames.documents).insert(insertData);
    }

    this.emit('document.upsert', insertData);

    return {
      id: insertData.id,
      upserted: true,
    };
  };
}

export { DocumentsService };
