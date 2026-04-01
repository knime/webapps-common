import type {
  KdsTwinListPossibleValue,
  KdsTypeIconName,
} from "@knime/kds-components";

import type { IdAndText } from "../../types/ChoicesUiSchema";

type PossibleValueWithOptionalType = {
  id: string;
  text: string;
  type?: IdAndText;
};

export const toKdsPossibleValues = (
  values: PossibleValueWithOptionalType[],
): KdsTwinListPossibleValue[] =>
  values.map((v) => ({
    id: v.id,
    text: v.text,
    ...(v.type
      ? {
          type: v.type.id,
          accessory: {
            type: "dataType" as const,
            name: v.type.id as KdsTypeIconName,
          },
        }
      : {}),
  }));
