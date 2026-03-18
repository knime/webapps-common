import type { ComputedRef } from "vue";
import { computed, reactive } from "vue";
import type { JsonSchema } from "@jsonforms/core";

const data = reactive({
  numExecutors: 2,
  containerCores: 2,
  containerMemory: 2,
});

const schema: ComputedRef<JsonSchema> = computed(() => ({
  type: "object",
  properties: {
    numExecutors: {
      title: "Number of executors",
      type: "integer",
      maximum: 100,
      minimum: 1,
    },
    containerCores: {
      title: "Number of vCores per executor",
      description:
        "To semi accurately show how this renderer is used the secondary value is calculated as numExecutors * containerCores to show the total vCore usage in the donut chart",
      type: "integer",
      maximum: 16,
      minimum: 1,
      secondaryValue: data.numExecutors * data.containerCores,
    },
    containerMemory: {
      title: "RAM per executor",
      description:
        "To semi accurately show how this renderer is used the secondary value is calculated as numExecutors * containerMemory to show the total RAM usage in the donut chart",
      type: "integer",
      minimum: 2,
      maximum: 128,
      secondaryValue: data.containerMemory * data.numExecutors,
    },
  },
}));

const uiSchema = {
  type: "VerticalLayout",
  elements: [
    {
      type: "Section",
      label: "Execution context resources",
      elements: [
        {
          type: "Control",
          scope: "#/properties/numExecutors",
          options: {
            format: "quantity",
            step: 1,
          },
        },
        {
          type: "Control",
          scope: "#/properties/containerCores",
          options: {
            format: "executorCoresResources",
            isSharedContext: true,
            donutTitle: "vCore token usage",
            donutMax: 10,
            currentUsage: 2,
          },
        },
        {
          type: "Control",
          scope: "#/properties/containerMemory",
          options: {
            format: "executorMemoryResources",
            showDonut: true,
            donutMax: 10,
            donutTitle: "RAM usage",
            currentUsage: 4,
            unit: "GB",
            step: 1,
          },
        },
      ],
    },
  ],
};

export default {
  schema,
  uiSchema,
  data,
};
