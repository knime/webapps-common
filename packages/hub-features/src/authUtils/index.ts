import { createAccountInjector } from "./accountInjector";
import * as client from "./client";
import { stopRefresher } from "./refresher";
import { buildLoginPath, buildLogoutPath } from "./shared";
import { useAuthState } from "./useAuthState";

export const authUtils = {
  createAccountInjector,
  stopTokenRefresh: stopRefresher,
  useAuthState,
  client,
  paths: { login: buildLoginPath, logout: buildLogoutPath },
};
