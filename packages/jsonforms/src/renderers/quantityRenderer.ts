import { rankWith } from "@jsonforms/core";

import { priorityRanks } from "../constants";
import { hasFormat, inputFormats } from "../constants/inputFormats";
import { withLabel } from "../higherOrderComponents";
import QuantityControl from "../uiComponents/QuantityControl.vue";

export const quantityRenderer = withLabel()({
  name: "QuantityControl",
  control: QuantityControl,
  tester: rankWith(priorityRanks.default, hasFormat(inputFormats.quantity)),
});
