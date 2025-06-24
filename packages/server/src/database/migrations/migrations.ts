import { Knex } from 'knex';

import { Migration } from '../database.types.js';

import { init } from './migrations.001-init.js';

const migrations = [init];

const migrationSource: Knex.MigrationSource<Migration> = {
  getMigrations: async () => migrations,
  getMigrationName: (migration) => migration.name,
  getMigration: async (migration) => migration,
};

export { migrationSource };
