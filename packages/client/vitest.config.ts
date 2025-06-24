import { defineConfig } from 'vitest/config';
import { getAliases } from '@morten-olsen/data-ingest-tests/vitest';

// eslint-disable-next-line import/no-default-export
export default defineConfig(async () => {
  const aliases = await getAliases();
  return {
    resolve: {
      alias: aliases,
    },
  };
});
