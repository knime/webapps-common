import { describe, expect, it } from "vitest";
import type { FetchError } from "ofetch";

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

      const fetchError: FetchError = {
        data: {
          title: "The title",
          details: ["detail 1"],
        },
        statusCode: 400,
        response,
        name: "",
        message: "",
      };

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

    it("should NOT parse into RFCError", () => {
      const fetchError: FetchError = {
        data: {
          title: "The title",
          details: ["detail 1"],
        },
        statusCode: 400,
        name: "",
        message: "",
      };

      const parsedError = rfcErrors.tryParse(fetchError);

      expect(parsedError instanceof rfcErrors.RFCError).toBe(false);
      expect(parsedError).toBe(fetchError);
    });
  });
});
