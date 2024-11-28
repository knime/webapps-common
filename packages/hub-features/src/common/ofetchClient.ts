import { ofetch } from "ofetch";

const defaultConfig = {
  headers: {
    "Content-Type": "application/json",

    // see: https://knime-com.atlassian.net/wiki/spaces/SPECS/pages/4126769212/API+Errors#Client-Request-Headers
    Accept: "application/json; application/problem+json",
  },
} as const;

export const $ofetch = ofetch.create(defaultConfig);
