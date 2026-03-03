<script setup lang="ts">
import { cloneDeep } from "lodash-es"; // eslint-disable-line depend/ban-dependencies

import { Label, TimePartInput } from "@knime/components";
import { KdsButton } from "@knime/kds-components";

import type { VueControlProps } from "../higherOrderComponents";
import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";

type Timeframe = {
  start: string;
  end: string;
};

const TIME_PARTS = ["hh", "mm", "ss"] as const;
const TIME_PARTS_COUNT = TIME_PARTS.length;
const DEFAULT_TIME_FRAME = {
  start: "00:00:00",
  end: "23:59:59",
};

const { control, handleChange } = defineProps<
  {
    handleChange: VueControlProps<Timeframe[]>["handleChange"];
    control: VueControlProps<Timeframe[]>["control"];
  } & VueControlPropsForLabelContent<Timeframe[]>
>();

const onAdd = () => {
  // creating a shallow copy of the default timeframe, otherwise
  // all frames created in one step would share a reference
  handleChange(control.path, [...control.data, { ...DEFAULT_TIME_FRAME }]);
};

const onDelete = (index: number) => {
  // one timeframe is mandatory
  if (control.data.length > 1) {
    handleChange(
      control.path,
      control.data.filter((_: unknown, i: number) => i !== index),
    );
  }
};

type TimeType = keyof Pick<Timeframe, "start" | "end">;

const onUpdate = (
  rawValue: unknown,
  timeframeIndex: number,
  type: TimeType,
  segment: 0 | 1 | 2,
) => {
  // the bounds event emits an object instead of a value. if this value doesn't exist its assumed the value
  // comes from the input event
  const unwrapped =
    (rawValue as { value?: unknown } | null | undefined)?.value ?? rawValue;
  const asNumber = Number(unwrapped);
  const safeValue = Number.isNaN(asNumber) ? 0 : asNumber;

  // the endpoint expects a value in the form of '13:43:00'. the value received describes a single segment
  // of that time signature. therefore, the received value has to be padded and put in the correct position
  // before placing it back in the timeframes array
  const timeframes = cloneDeep(control.data) as Timeframe[];
  const current = timeframes[timeframeIndex]?.[type] ?? "00:00:00";
  const parts = current.split(":");
  while (parts.length < TIME_PARTS_COUNT) {
    parts.push("00");
  }
  parts[segment] = String(safeValue).padStart(2, "0");

  // the seconds segment is always set to 59 seconds as per default
  if (type === "end") {
    parts[2] = "59";
  }

  timeframes[timeframeIndex] = {
    ...timeframes[timeframeIndex],
    [type]: parts.slice(0, TIME_PARTS_COUNT).join(":"),
  };
  handleChange(control.path, timeframes);
};
</script>

<template>
  <div class="timeframe-wrapper">
    <div v-for="(item, index) in control.data" :key="index" class="timeframe">
      <Label #default="{ labelForId: labelForIdStart }" text="Between">
        <div class="input-wrapper">
          <TimePartInput
            :id="labelForIdStart"
            :min="0"
            :max="23"
            :min-digits="2"
            compact
            :model-value="parseInt(item.start.split(':')[0], 10)"
            @update:model-value="onUpdate($event, index, 'start', 0)"
            @bounds="onUpdate($event, index, 'start', 0)"
          /><span>:</span
          ><TimePartInput
            :min="0"
            :max="59"
            :min-digits="2"
            compact
            :model-value="parseInt(item.start.split(':')[1], 10)"
            @update:model-value="onUpdate($event, index, 'start', 1)"
            @bounds="onUpdate($event, index, 'start', 1)"
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
            :model-value="parseInt(item.end.split(':')[0], 10)"
            @update:model-value="onUpdate($event, index, 'end', 0)"
            @bounds="onUpdate($event, index, 'end', 0)"
          /><span>:</span
          ><TimePartInput
            :min="0"
            :max="59"
            :min-digits="2"
            compact
            :model-value="parseInt(item.end.split(':')[1], 10)"
            @update:model-value="onUpdate($event, index, 'end', 1)"
            @bounds="onUpdate($event, index, 'end', 1)"
          />
        </div>
      </Label>

      <KdsButton
        aria-label="Delete timeframe"
        leading-icon="trash"
        title="Delete timeframe"
        size="small"
        variant="transparent"
        @click.prevent="onDelete(index)"
      />
    </div>
  </div>

  <KdsButton
    aria-label="Add timeframe"
    leading-icon="plus"
    label="Add timeframe"
    size="xsmall"
    variant="outlined"
    @click.prevent="onAdd"
  />
</template>

<style lang="postcss" scoped>
.timeframe {
  display: flex;
  flex-direction: row;
  gap: 20px;
  margin-bottom: 10px;

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

  & .button {
    flex: 0 0 30px;
    height: 30px;
    margin-top: 25px;
    margin-left: -10px;
    pointer-events: none;
    border-radius: 50%;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover:not(:only-child) {
    & .button {
      pointer-events: all;
      opacity: 1;
    }
  }
}

.button[aria-label="Add timeframe"] {
  border-radius: 6px;
}
</style>
