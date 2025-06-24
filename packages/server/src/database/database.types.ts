import { Knex } from 'knex';

type Migration = Knex.Migration & {
  name: string;
};

export type { Migration };
