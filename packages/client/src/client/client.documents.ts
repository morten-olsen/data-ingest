import createClient from 'openapi-fetch';

import { paths } from '../clients/__generated__/ingest/ingest.paths.js';
import { ApiError } from '../utils/errors.js';

type DocumentUpsertInput = paths['/documents']['post']['requestBody']['content']['application/json'];
type DocumentQueryInput = Exclude<paths['/query']['post']['requestBody'], undefined>['content']['application/json'];

type Client = ReturnType<typeof createClient<paths>>;

class ClientDocuments {
  #client: Client;

  constructor(client: Client) {
    this.#client = client;
  }

  public upsert = async (document: DocumentUpsertInput): Promise<DocumentUpsertResponse> => {
    const { response, error, data } = await this.#client.POST('/documents', {
      body: document,
    });

    if (error || !data) {
      throw new ApiError({
        message: 'Failed to upsert document',
        response,
        rootCause: error,
      });
    }

    return data;
  };

  public query = async (query: DocumentQueryInput): Promise<DocumentQueryResponse> => {
    const { response, error, data } = await this.#client.POST('/query', {
      body: query,
    });

    if (error || !data) {
      throw new ApiError({
        message: 'Failed to query documents',
        response,
        rootCause: error,
      });
    }

    return data;
  };
}

type DocumentUpsertResponse = paths['/documents']['post']['responses']['200']['content']['application/json'];
type DocumentQueryResponse = paths['/query']['post']['responses']['200']['content']['application/json'];

export {
  ClientDocuments,
  type DocumentUpsertInput,
  type DocumentQueryInput,
  type DocumentUpsertResponse,
  type DocumentQueryResponse,
};
