export const buildUrlRegex = (requireHttpPrefix: boolean = false) => {
  const httpPrefixCheck = "(http://www\\.|https://www\\.|http://|https://)";

  const urlCheck =
    "[a-z0-9]+([-.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?";

  return new RegExp(
    `^${httpPrefixCheck}${requireHttpPrefix ? "" : "?"}${urlCheck}$`
  );
};
