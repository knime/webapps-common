import { merge } from "lodash-es";
import { type FetchOptions, ofetch } from "ofetch";

export const defaultConfig: FetchOptions = {
  headers: {
    "Content-Type": "application/json",

    // see: https://knime-com.atlassian.net/wiki/spaces/SPECS/pages/4126769212/API+Errors#Client-Request-Headers
    Accept: "application/json; application/problem+json",
  },
} as const;

export const getFetchClient = (customOptions?: FetchOptions) =>
  ofetch.create(merge(customOptions, defaultConfig));
