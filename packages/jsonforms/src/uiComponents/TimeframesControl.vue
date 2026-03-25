<script setup lang="ts">
import { Label, TimePartInput } from "@knime/components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";

type Timeframe = {
  start: string;
  end: string;
};

const TIME_PARTS = ["hh", "mm", "ss"] as const;
const TIME_PARTS_COUNT = TIME_PARTS.length;

const props = defineProps<VueControlPropsForLabelContent<Timeframe>>();

type TimeType = keyof Pick<Timeframe, "start" | "end">;

const onUpdate = (rawValue: unknown, type: TimeType, segment: 0 | 1 | 2) => {
  // the bounds event emits an object instead of a value. if this value doesn't exist its assumed the value
  // comes from the input event
  const unwrapped =
    (rawValue as { value?: unknown } | null | undefined)?.value ?? rawValue;
  const asNumber = Number(unwrapped);
  const safeValue = Number.isNaN(asNumber) ? 0 : asNumber;

  // the endpoint expects a value in the form of '13:43:00'. the value received describes a single segment
  // of that time signature. therefore, the received value has to be padded and put in the correct position
  const current = props.control.data?.[type] ?? "00:00:00";
  const parts = current.split(":");
  while (parts.length < TIME_PARTS_COUNT) {
    parts.push("00");
  }
  parts[segment] = String(safeValue).padStart(2, "0");

  // the seconds segment is always set to 59 seconds as per default
  if (type === "end") {
    parts[2] = "59";
  }

  const updatedTimeframe: Timeframe = {
    ...props.control.data,
    [type]: parts.slice(0, TIME_PARTS_COUNT).join(":"),
  };
  props.changeValue(updatedTimeframe);
};
</script>

<template>
  <div class="timeframe">
    <Label #default="{ labelForId: labelForIdStart }" text="Between">
      <div class="input-wrapper">
        <TimePartInput
          :id="labelForIdStart"
          :min="0"
          :max="23"
          :min-digits="2"
          compact
          :model-value="
            parseInt((control.data?.start ?? '00:00:00').split(':')[0], 10)
          "
          @update:model-value="onUpdate($event, 'start', 0)"
          @bounds="onUpdate($event, 'start', 0)"
        /><span>:</span
        ><TimePartInput
          :min="0"
          :max="59"
          :min-digits="2"
          compact
          :model-value="
            parseInt((control.data?.start ?? '00:00:00').split(':')[1], 10)
          "
          @update:model-value="onUpdate($event, 'start', 1)"
          @bounds="onUpdate($event, 'start', 1)"
        />
      </div>
    </Label>

    <Label #default="{ labelForId: labelForIdEnd }" text="and">
      <div class="input-wrapper">
        <TimePartInput
          :id="labelForIdEnd"
          :min="0"
          :max="23"
          :min-digits="2"
          compact
          :model-value="
            parseInt((control.data?.end ?? '00:00:00').split(':')[0], 10)
          "
          @update:model-value="onUpdate($event, 'end', 0)"
          @bounds="onUpdate($event, 'end', 0)"
        /><span>:</span
        ><TimePartInput
          :min="0"
          :max="59"
          :min-digits="2"
          compact
          :model-value="
            parseInt((control.data?.end ?? '00:00:00').split(':')[1], 10)
          "
          @update:model-value="onUpdate($event, 'end', 1)"
          @bounds="onUpdate($event, 'end', 1)"
        />
      </div>
    </Label>
  </div>
</template>

<style lang="postcss" scoped>
.timeframe {
  display: flex;
  flex-direction: row;
  gap: 20px;

  & > .label-wrapper {
    flex: 1 1 auto;

    & :deep(.label-text) {
      font-size: 13px;
      font-weight: 500;
    }

    & > .input-wrapper {
      display: flex;
      flex-direction: row;
      gap: 5px;
      place-items: center center;

      & .wrapper {
        background-color: var(--theme-time-part-input-background-color);
        border-radius: 6px;

        & :deep(input[type="number"]) {
          width: 100%;
          height: 28px;
          padding-right: 53px;
          padding-left: 6px;
          border-radius: 6px;
        }

        & :deep(.increase),
        & :deep(.decrease) {
          width: 20px;
          height: 20px;
          padding: 0 4px;
          border: var(--form-border-width) solid var(--knime-stone-gray);
          border-radius: 4px;
        }

        & :deep(.increase) {
          top: 4px;
          right: 4px;
        }

        & :deep(.decrease) {
          top: 4px;
          right: 28px;
        }
      }
    }
  }
}
</style>
