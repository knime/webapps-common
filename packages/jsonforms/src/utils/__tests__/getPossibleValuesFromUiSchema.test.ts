import { describe, expect, it, vi } from "vitest";

import getPossibleValuesFromUiSchema from "../getPossibleValuesFromUiSchema";

describe("generatePossibleValues", () => {
  const possibleValues = [
    { id: "column_1", text: "Column Name 1" },
    { id: "column_2", text: "Column Name 2" },
  ];
  const control = { uischema: { options: { possibleValues } } };
  const dummyAsyncChoicesProvider = () =>
    Promise.reject(new Error("Should not be called"));
  const dummySendAlert = vi.fn();

  it("uses optionsMapper per default", async () => {
    expect(
      await getPossibleValuesFromUiSchema(
        control,
        dummyAsyncChoicesProvider,
        dummySendAlert,
      ),
    ).toStrictEqual(possibleValues);
  });

  describe("async choices", () => {
    it("fetches async choices if no possible values are provided", async () => {
      const successResultChoices = [{ id: "foo", text: "bar" }];
      const successfulAsyncChoicesProvider: () => Promise<any> = vi.fn(() =>
        Promise.resolve({
          state: "SUCCESS" as const,
          result: successResultChoices,
          message: [],
        }),
      );
      const choicesProviderClass = "myChoicesProviderClass";

      expect(
        await getPossibleValuesFromUiSchema(
          {
            uischema: {
              options: {
                choicesProviderClass,
              },
            },
          },
          successfulAsyncChoicesProvider,
          dummySendAlert,
        ),
      ).toEqual(successResultChoices);

      expect(successfulAsyncChoicesProvider).toHaveBeenCalledWith(
        choicesProviderClass,
      );
    });

    /**
     * Due to the autohandling of errors which are not handled in the backend, the result of an async choices request can be undefined.
     */
    it("returns empty possible values if asnychronous result is undefined", async () => {
      const undefinedAsyncChoicesProvider: () => Promise<any> = vi.fn(() =>
        Promise.resolve(undefined),
      );
      const choicesProviderClass = "myChoicesProviderClass";

      expect(
        await getPossibleValuesFromUiSchema(
          {
            uischema: {
              options: {
                choicesProviderClass,
              },
            },
          },
          undefinedAsyncChoicesProvider,
          dummySendAlert,
        ),
      ).toEqual([]);

      expect(undefinedAsyncChoicesProvider).toHaveBeenCalledWith(
        choicesProviderClass,
      );
    });
  });
});
