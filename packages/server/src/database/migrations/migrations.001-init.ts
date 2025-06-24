import { Migration } from '../database.types.js';

const tableNames = {
  documents: 'documents',
  documentAttributes: 'document_attributes',
  documentRelations: 'document_relations',
};

const init: Migration = {
  name: 'init',
  up: async (knex) => {
    await knex.schema.createTable(tableNames.documents, (table) => {
      table.string('id').primary();
      table.string('source').notNullable();
      table.string('sourceType').notNullable();
      table.string('sourceId').nullable();
      table.datetime('createdAt').notNullable();
      table.datetime('updatedAt').notNullable();
      table.datetime('deletedAt').nullable();
      table.jsonb('data').notNullable();
      table.string('fromDocumentId').nullable().references('documents.id').onDelete('SET NULL');
      table.index(['source', 'sourceType', 'sourceId']);
    });

    await knex.schema.createTable(tableNames.documentAttributes, (table) => {
      table.string('field').notNullable();
      table.string('documentId').notNullable().references('documents.id');
      table.string('type').notNullable();
      table.string('stringValue').nullable();
      table.integer('intValue').nullable();
      table.float('floatValue').nullable();
      table.boolean('booleanValue').nullable();
      table.datetime('dateValue').nullable();
      table.jsonb('jsonValue').nullable();
      table.primary(['documentId', 'field']);
    });

    await knex.schema.createTable(tableNames.documentRelations, (table) => {
      table.string('documentId').notNullable().references('documents.id');
      table.string('relatedDocumentId').notNullable().references('documents.id');
      table.string('type').notNullable();
      table.jsonb('data').nullable();
      table.primary(['documentId', 'relatedDocumentId']);
    });
  },
  down: async (knex) => {
    await knex.schema.dropTable(tableNames.documentRelations);
    await knex.schema.dropTable(tableNames.documentAttributes);
    await knex.schema.dropTable(tableNames.documents);
  },
};

type DocumentRow = {
  id: string;
  source: string;
  sourceType: string;
  sourceId: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  data: {
    value: unknown;
  };
};

type DocumentAttributeRow = {
  field: string;
  documentId: string;
  type: string;
  stringValue: string | null;
  intValue: number | null;
  floatValue: number | null;
  booleanValue: boolean | null;
  dateValue: Date | null;
  jsonValue: Record<string, unknown> | null;
};

type DocumentRelationRow = {
  documentId: string;
  relatedDocumentId: string;
  type: string;
};

export { init, type DocumentRow, type DocumentAttributeRow, type DocumentRelationRow, tableNames };
