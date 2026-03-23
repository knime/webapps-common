export const TEAM_ACCOUNT_ID_PREFIX = "account:team:";

export const isTeamAccountId = (accountIdentifier: string) =>
  Boolean(accountIdentifier?.startsWith(TEAM_ACCOUNT_ID_PREFIX));
