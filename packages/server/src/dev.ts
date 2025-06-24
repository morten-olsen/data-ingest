import { createApi } from './api.js';
import { Container } from './utils/container.js';

const container = new Container();
const server = await createApi(container);

console.log('Starting server on port 3400');
await server.listen({
  port: 3400,
});
