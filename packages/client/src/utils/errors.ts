type ApiErrorOptions = {
  message?: string;
  response: Response;
  rootCause?: Error;
};

class ApiError extends Error {
  #error: ApiErrorOptions;

  constructor(error: ApiErrorOptions) {
    super(error.message ?? error.rootCause?.message ?? error.response.statusText ?? 'Unknown error');
    this.#error = error;
  }

  public get rootCause() {
    return this.#error.rootCause;
  }

  public get response() {
    return this.#error.response;
  }
}

export { ApiError };
