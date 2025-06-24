import knex, { Knex } from 'knex';

import { migrationSource } from './migrations/migrations.js';

class Database {
  #knex?: Promise<Knex>;

  #setup = async () => {
    const knexInstance = knex({
      client: 'pg',
      searchPath: ['dataflow', 'public'],
      connection: {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT) : 5432,
        user: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB || 'postgres',
      },
      migrations: {
        migrationSource,
      },
    });

    await knexInstance.raw('CREATE SCHEMA IF NOT EXISTS dataflow');
    await knexInstance.raw('SET search_path TO dataflow, public');
    await knexInstance.migrate.latest();

    return knexInstance;
  };

  public getDb = async () => {
    if (!this.#knex) {
      this.#knex = this.#setup();
    }

    return this.#knex;
  };
}

export { Database };
export { applyDateFilter } from './database.utils.js';
export {
  tableNames,
  type DocumentRow,
  type DocumentAttributeRow,
  type DocumentRelationRow,
} from './migrations/migrations.001-init.js';
