import { rankWith, uiTypeIs } from "@jsonforms/core";

import { priorityRanks } from "../constants";
import { SimpleArrayLayout } from "../layoutComponents";

const simpleArrayLayoutTester = uiTypeIs("SimpleArrayLayout");

export const simpleArrayLayoutRenderer = {
  name: "SimpleArrayLayout",
  tester: rankWith(priorityRanks.default, simpleArrayLayoutTester),
  renderer: SimpleArrayLayout,
};
