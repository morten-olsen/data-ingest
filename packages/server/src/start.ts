import { createApi } from './api.js';
import { subscribe } from './subscribe.js';
import { Container } from './utils/container.js';

const container = new Container();
const server = await createApi(container);

await server.listen({
  host: '0.0.0.0',
  port: 3400,
});

await subscribe(container);
