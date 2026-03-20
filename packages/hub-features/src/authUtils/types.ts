export type UserIdentity = { id: string; name: string };

export type AuthRefresher = {
  /**
   * Fetcher function to obtain the basic user identity information
   */
  getIdentity: () => Promise<UserIdentity>;
  /**
   * Callback that runs after each completion of an auth token refresh
   */
  onRefreshComplete?: () => unknown;
};
