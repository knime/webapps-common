import { h } from "vue";
import { FetchError } from "ofetch";

import type { Toast } from "@knime/components";

import RFCErrorToastTemplate from "./RFCErrorToastTemplate.vue";
import { RFCError, type RFCErrorData } from "./types";

/**
 * Map to a toast template component compatible with an RFCError format
 */
const toToast = ({
  headline,
  rfcError,
  canCopyToClipboard = true,
}: {
  headline: string;
  rfcError: RFCError;
  canCopyToClipboard?: boolean;
}): Toast => {
  const { data } = rfcError;

  const rfcErrorToastContent = h(RFCErrorToastTemplate, {
    headline,
    ...data,
    canCopyToClipboard,
  });

  return {
    type: "error",
    headline,
    component: rfcErrorToastContent,
    autoRemove: false,
  };
};

/**
 * Parse an ofetch's `FetchError` to an `RFCError`.
 * When parsing is not possible it returns undefined.
 */
const tryParse = (error: unknown): RFCError | undefined => {
  if (!(error instanceof FetchError)) {
    return undefined;
  }

  if (!error.response) {
    return undefined;
  }

  const responseDate = error.response.headers.get("date")
    ? new Date(error.response.headers.get("date")!)
    : undefined;

  const title =
    typeof error.data === "string" ? error.data : error.data?.title ?? "";

  const rfcErrorData: RFCErrorData = {
    title: title as string,
    details: error.data?.details as string[] | undefined,
    status: error.statusCode as number,
    date: responseDate,
    requestId: error.response.headers.get("x-request-id") ?? undefined,
    errorId: error.response.headers.get("x-error-id") ?? undefined,
  };

  return new RFCError(rfcErrorData);
};

export const rfcErrors = {
  toToast,
  tryParse,
  RFCError,
};
