import 'fastify';
import { Container } from './utils/container.js';

declare module 'fastify' {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface FastifyRequest {
    container: Container;
  }
}
