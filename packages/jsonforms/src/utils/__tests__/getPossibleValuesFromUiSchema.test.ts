import { describe, expect, it, vi } from "vitest";
import { ref } from "vue";
import flushPromises from "flush-promises";

import type {
  ChoicesUiSchema,
  PossibleValue,
} from "../../types/ChoicesUiSchema";
import getPossibleValuesFromUiSchema, {
  withSpecialChoices,
} from "../getPossibleValuesFromUiSchema";

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

  it("adds additional options", async () => {
    expect(
      await getPossibleValuesFromUiSchema(
        {
          uischema: {
            options: {
              possibleValues,
              showNoneColumn: true,
            },
          },
        },
        dummyAsyncChoicesProvider,
        dummySendAlert,
      ),
    ).toEqual(
      expect.arrayContaining([
        {
          id: "<none>",
          text: "None",
        },
      ]),
    );
    expect(
      await getPossibleValuesFromUiSchema(
        {
          uischema: {
            options: {
              possibleValues,
              showRowKeys: true,
            },
          },
        },
        dummyAsyncChoicesProvider,
        dummySendAlert,
      ),
    ).toEqual(
      expect.arrayContaining([
        {
          id: "<row-keys>",
          text: "RowID",
          compatibleTypes: ["org.knime.core.data.StringValue"],
        },
      ]),
    );
    expect(
      await getPossibleValuesFromUiSchema(
        {
          uischema: {
            options: {
              possibleValues,
              showRowNumbers: true,
            },
          },
        },
        dummyAsyncChoicesProvider,
        dummySendAlert,
      ),
    ).toEqual(
      expect.arrayContaining([
        {
          id: "<row-numbers>",
          text: "Row number",
          compatibleTypes: [
            "org.knime.core.data.LongValue",
            "org.knime.core.data.DoubleValue",
          ],
        },
      ]),
    );
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
                showRowKeys: true,
                choicesProviderClass,
              },
            },
          },
          successfulAsyncChoicesProvider,
          dummySendAlert,
        ),
      ).toEqual([
        {
          id: "<row-keys>",
          text: "RowID",
          compatibleTypes: ["org.knime.core.data.StringValue"],
        },
        ...successResultChoices,
      ]);

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

  describe("withSpecialChoices", () => {
    it("adds special choices to the existing ones given as ref", async () => {
      const existing = ref<PossibleValue[] | null>(null);

      const uischema: ChoicesUiSchema = {
        options: {
          showRowKeys: true,
        },
      };

      const withSpecial = withSpecialChoices(existing, { uischema });
      expect(withSpecial.value).toBeNull();

      existing.value = [];
      await flushPromises();

      expect(withSpecial.value).toStrictEqual([
        expect.objectContaining({ id: "<row-keys>" }),
      ]);

      existing.value = [{ id: "foo", text: "bar" }];
      await flushPromises();

      expect(withSpecial.value).toStrictEqual([
        expect.objectContaining({ id: "<row-keys>" }),
        { id: "foo", text: "bar" },
      ]);
    });
  });
});
