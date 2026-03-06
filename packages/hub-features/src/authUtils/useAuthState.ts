import { computed, readonly, shallowRef } from "vue";

import type { UserIdentity } from "./types";

// Value is cached in the module scope
const loggedInUser = shallowRef<UserIdentity | null>(null);

export const setLoggedInUser = (user: UserIdentity) => {
  loggedInUser.value = user;
};

export const useAuthState = () => {
  const isLoggedIn = computed(() => Boolean(loggedInUser.value));

  return {
    loggedInUser: readonly(loggedInUser),
    isLoggedIn,
  };
};
