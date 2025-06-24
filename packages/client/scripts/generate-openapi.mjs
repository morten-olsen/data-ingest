import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import openapiTS, { astToString } from 'openapi-typescript';
import { fetch } from 'undici';

const clients = {
  ingest: 'https://ingest.data.olsen.cloud/docs/openapi.json',
};

for (const [name, specUrl] of Object.entries(clients)) {
  const specResponse = await fetch(specUrl);
  if (!specResponse.ok) {
    throw new Error(`Failed to fetch OpenAPI spec for ${name}: ${specResponse.statusText}`);
  }
  const spec = await specResponse.text();
  const ast = await openapiTS(spec, {});
  const content = astToString(ast);
  const dir = resolve(import.meta.dirname, '..', 'src', 'clients', '__generated__', name);
  const pathsTarget = resolve(dir, `${name}.paths.ts`);

  await mkdir(dir, { recursive: true });
  await writeFile(pathsTarget, content, 'utf8');
}
