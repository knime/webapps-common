import type { RFCErrorData } from "./types";

export const serializeErrorForClipboard = (
  error: RFCErrorData,
  headline: string,
  formatDate: (date: Date) => string,
): string => {
  let details = "";
  if (error.details?.length) {
    if (error.details.length > 1) {
      const detailLines = error.details
        .map((item) => `\u2022 ${item}`)
        .join("\n");
      details = `\n${detailLines}`;
    } else {
      details = error.details[0];
    }
  }

  let errorText = `${headline}\n\n`;
  errorText += `${error.title}\n\n`;
  errorText += details ? `Details: ${details}\n\n` : "";

  if (error.status !== undefined) {
    errorText += `Status: ${error.status}\n`;
  }

  if (error.date) {
    errorText += `Date: ${formatDate(error.date)}\n`;
  }

  if (error.requestId) {
    errorText += `Request Id: ${error.requestId}\n`;
  }

  if (error.errorId) {
    errorText += `Error Id: ${error.errorId}\n`;
  }

  if (error.stacktrace) {
    errorText += "------\n"; // separator
    errorText += `Stacktrace:\n\n${error.stacktrace}\n`;
  }

  return errorText;
};
