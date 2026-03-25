import createClient from "openapi-fetch";

import type { paths } from "./schema/schema";

export const $httpClient = createClient<paths>({
  baseUrl: "/_/api",
  headers: {
    Accept: "application/json, application/problem+json",
  },
});
