import createClient from 'openapi-fetch';

import { paths } from '../clients/__generated__/ingest/ingest.paths.js';

import { ClientDocuments } from './client.documents.js';

type ClientOptions = {
  baseUrl?: string;
  headers?: Record<string, string>;
};

class Client {
  #documents: ClientDocuments;

  constructor(options: ClientOptions) {
    const baseUrl = options.baseUrl ?? process.env.INGEST_BASE_URL;
    if (!baseUrl) {
      throw new Error('INGEST_BASE_URL is not set');
    }

    const client = createClient<paths>({ baseUrl, headers: options.headers });
    this.#documents = new ClientDocuments(client);
  }

  public get documents() {
    return this.#documents;
  }
}

export { Client };
export {
  type DocumentUpsertInput,
  type DocumentQueryInput,
  type DocumentUpsertResponse,
  type DocumentQueryResponse,
} from './client.documents.js';
