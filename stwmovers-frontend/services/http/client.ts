import { createFetch } from 'ofetch'

export type ApiClientOptions = {
  baseURL: string
}

export const createApiClient = (opts: ApiClientOptions) => {
  return createFetch({
    defaults: {
      baseURL: opts.baseURL,
      headers: {
        Accept: 'application/json',
      },
    },
  })
}

