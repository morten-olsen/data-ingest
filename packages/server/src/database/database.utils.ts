import { Knex } from 'knex';
import { z } from 'zod';

import { filterDateSchema, filterNullableDateSchema } from '../schemas/schemas.js';

const applyDateFilter = <T extends Record<string, unknown>>(
  queryBuilder: Knex.QueryBuilder<T>,
  column: string,
  filter?: z.infer<typeof filterDateSchema> | z.infer<typeof filterNullableDateSchema>,
) => {
  if (!filter) {
    return queryBuilder;
  }

  if (filter.gt) {
    queryBuilder = queryBuilder.where(column, '>', filter.gt);
  } else if (filter.gte) {
    queryBuilder = queryBuilder.where(column, '>=', filter.gte);
  } else if (filter.lt) {
    queryBuilder = queryBuilder.where(column, '<', filter.lt);
  } else if (filter.lte) {
    queryBuilder = queryBuilder.where(column, '<=', filter.lte);
  }
  if ('null' in filter) {
    if (filter.null) {
      queryBuilder = queryBuilder.whereNull(column);
    } else {
      queryBuilder = queryBuilder.whereNotNull(column);
    }
  }

  return queryBuilder;
};

export { applyDateFilter };
