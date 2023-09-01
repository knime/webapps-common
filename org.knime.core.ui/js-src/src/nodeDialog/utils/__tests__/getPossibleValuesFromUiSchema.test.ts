import type Result from "@/nodeDialog/api/types/Result";
import type { PossibleValue } from "@/nodeDialog/types/ChoicesUiSchema";
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

  it("uses optionsMapper per default", async () => {
    expect(
      await getPossibleValuesFromUiSchema(control, dummyAsyncChoicesProvider),
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
      ),
    ).toEqual(
      expect.arrayContaining([
        {
          id: "<row-keys>",
          text: "RowIDs",
        },
      ]),
    );
  });

  it("fetches async choices if no possible values are provided", async () => {
    const successResultChoices = [{ id: "foo", text: "bar" }];
    const successfulAsyncChoicesProvider: () => Promise<
      Result<PossibleValue[]>
    > = vi.fn(() =>
      Promise.resolve({ state: "SUCCESS", result: successResultChoices }),
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
      ),
    ).toEqual([
      {
        id: "<row-keys>",
        text: "RowIDs",
      },
      ...successResultChoices,
    ]);

    expect(successfulAsyncChoicesProvider).toHaveBeenCalledWith(
      choicesProviderClass,
    );
  });
});
