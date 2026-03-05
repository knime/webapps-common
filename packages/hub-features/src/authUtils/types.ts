export type UserIdentity = { id: string; name: string };

export type AccountInjectorOptions = {
  /**
   * Fetcher function to obtain the basic user identity information
   */
  getIdentity: () => Promise<UserIdentity>;
  /**
   * Callback that runs after each completion of an auth token refresh
   */
  onRefreshComplete?: () => unknown;
};

export type RefresherOptions = Pick<
  AccountInjectorOptions,
  "onRefreshComplete"
>;
