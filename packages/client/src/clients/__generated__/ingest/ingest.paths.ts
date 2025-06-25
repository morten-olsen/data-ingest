export type paths = {
  '/health': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get: {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: never;
      responses: {
        /** @description Default Response */
        200: {
          headers: Record<string, unknown>;
          content?: never;
        };
      };
    };
    put?: never;
    post?: never;
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/documents': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody: {
        content: {
          'application/json': {
            source: string;
            sourceType: string;
            sourceId?: string | null;
            data?: unknown;
          };
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          headers: Record<string, unknown>;
          content: {
            'application/json': {
              id: string;
              upserted: boolean;
            };
          };
        };
      };
    };
    delete: {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody: {
        content: {
          'application/json': {
            ids: string[];
          };
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          headers: Record<string, unknown>;
          content?: never;
        };
      };
    };
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
  '/query': {
    parameters: {
      query?: never;
      header?: never;
      path?: never;
      cookie?: never;
    };
    get?: never;
    put?: never;
    post: {
      parameters: {
        query?: never;
        header?: never;
        path?: never;
        cookie?: never;
      };
      requestBody?: {
        content: {
          'application/json': {
            sources?: string[];
            sourceTypes?: string[];
            sourceIds?: string[];
            createdAt?: {
              /** Format: date-time */
              gt?: string;
              /** Format: date-time */
              gte?: string;
              /** Format: date-time */
              lt?: string;
              /** Format: date-time */
              lte?: string;
            };
            updatedAt?: {
              /** Format: date-time */
              gt?: string;
              /** Format: date-time */
              gte?: string;
              /** Format: date-time */
              lt?: string;
              /** Format: date-time */
              lte?: string;
            };
            deletedAt?: {
              /** Format: date-time */
              gt?: string;
              /** Format: date-time */
              gte?: string;
              /** Format: date-time */
              lt?: string;
              /** Format: date-time */
              lte?: string;
              null?: boolean;
            };
            /** @default 100 */
            limit?: number;
            /** @default 0 */
            offset?: number;
          };
        };
      };
      responses: {
        /** @description Default Response */
        200: {
          headers: Record<string, unknown>;
          content: {
            'application/json': {
              documents: {
                id: string;
                source: string;
                sourceType: string;
                sourceId?: string | null;
                /** Format: date-time */
                createdAt: string;
                /** Format: date-time */
                updatedAt: string;
                /** Format: date-time */
                deletedAt?: string | null;
                data?: unknown;
              }[];
              hasMore: boolean;
            };
          };
        };
      };
    };
    delete?: never;
    options?: never;
    head?: never;
    patch?: never;
    trace?: never;
  };
};
export type webhooks = Record<string, never>;
export type components = {
  schemas: never;
  responses: never;
  parameters: never;
  requestBodies: never;
  headers: never;
  pathItems: never;
};
export type $defs = Record<string, never>;
export type operations = Record<string, never>;
