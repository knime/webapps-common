/**
 * Adds a "where do you want to go" `wdywtg` query param to the url. This
 * will take the user to the URL contained within that param after the auth flow completes
 */
const addWdywtg = (url: string, wdywtg?: string) => {
  if (wdywtg) {
    const decodedWdywtg = decodeURIComponent(wdywtg);

    // we decode an already-encoded wdywtg so that we can properly encode spaces
    if (decodedWdywtg !== wdywtg) {
      wdywtg = decodedWdywtg;
    }

    url += `?wdywtg=${encodeURIComponent(wdywtg)}`;
  }
  return url;
};

export const AUTH_SERVICE_PATH = "/_/auth";

export const buildLoginPath = ({ wdywtg }: { wdywtg?: string } = {}) =>
  addWdywtg(`${AUTH_SERVICE_PATH}/login`, wdywtg);

export const buildLogoutPath = ({ wdywtg }: { wdywtg?: string } = {}) =>
  addWdywtg(`${AUTH_SERVICE_PATH}/logout`, wdywtg);
