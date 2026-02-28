import { describe, expect, it } from "vitest";
import { FetchError } from "ofetch";

import { rfcErrors } from "..";
import { RFCError } from "../types";

describe("rfcErrors", () => {
  describe("toToast", () => {
    it("should create toast using template component", () => {
      const rfcError = new RFCError({
        title: "The title",
        details: ["detail 1"],
        date: new Date(),
        requestId: "request-id",
        status: 400,
        errorId: "error-id",
      });

      const result = rfcErrors.toToast({
        headline: "Toast headline",
        rfcError,
      });

      expect(result).toEqual(
        expect.objectContaining({
          type: "error",
          headline: "Toast headline",
          autoRemove: false,
        }),
      );

      expect(result.component?.props).toStrictEqual({
        headline: "Toast headline",
        ...rfcError.data,
        canCopyToClipboard: true,
        serializeErrorForClipboard: undefined,
      });
    });
  });

  describe("tryParse", () => {
    it("should parse into RFCError", () => {
      const response = new Response();

      const date = new Date();
      response.headers.set("date", date.toISOString());
      response.headers.set("x-request-id", "request-id");
      response.headers.set("x-error-id", "error-id");

      const fetchError = new FetchError("");
      fetchError.data = {
        title: "The title",
        details: ["detail 1"],
      };
      fetchError.statusCode = 400;
      fetchError.response = response;
      fetchError.name = "";
      fetchError.message = "";

      const expectedError = new RFCError({
        title: "The title",
        details: ["detail 1"],
        date,
        requestId: "request-id",
        errorId: "error-id",
        status: 400,
      });

      const parsedError = rfcErrors.tryParse(fetchError);

      expect(parsedError).toEqual(expectedError);
    });

    it("should NOT parse into RFCError if response is missing", () => {
      const fetchError = new FetchError("");
      fetchError.data = {
        title: "The title",
        details: ["detail 1"],
      };
      fetchError.statusCode = 400;
      fetchError.name = "";
      fetchError.message = "";

      const parsedError = rfcErrors.tryParse(fetchError);

      expect(parsedError).toBeUndefined();
    });

    it("should NOT parse into RFCError if no FetchError is given", () => {
      const error = new Error("");

      const parsedError = rfcErrors.tryParse(error);

      expect(parsedError).toBeUndefined();
    });
  });
});
