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
}: {
  headline: string;
  rfcError: RFCError;
}): Toast => {
  const { data } = rfcError;

  const rfcErrorToastContent = h(RFCErrorToastTemplate, { headline, ...data });

  return {
    type: "error",
    headline,
    component: rfcErrorToastContent,
    autoRemove: false,
  };
};

/**
 * Try to parse an ofetch's `FetchError` to an `RFCError`. When parsing is not possible
 * it returns the same `FetchError` given unchanged.
 */
const tryParse = (error: FetchError): RFCError | FetchError => {
  if (!error.response) {
    return error;
  }

  const responseDate = error.response.headers.get("date")
    ? new Date(error.response.headers.get("date")!)
    : new Date();

  const rfcErrorData: RFCErrorData = {
    title: error.data.title as string,
    details: error.data.details as string[] | undefined,
    status: error.statusCode as number,
    date: responseDate,
    requestId: error.response.headers.get("x-request-id") ?? "",
    // eslint-disable-next-line no-undefined
    errorId: error.response.headers.get("x-error-id") ?? undefined,
  };

  return new RFCError(rfcErrorData);
};

export const rfcErrors = {
  toToast,
  tryParse,
  RFCError,
};
