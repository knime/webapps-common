<script setup lang="ts">
import { computed, ref } from "vue";

import { KdsDropdown } from "@knime/kds-components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents";

import { type UiSchemaWithProvidedOptions } from "./composables/useProvidedState";

type TeamAndSpacesControlOptions = {
  possibleTeams: { id: string; text: string }[];
  possibleSpaces: {
    id: string;
    spaces: {
      id: string;
      text: string;
      ownerAccountId?: string;
    }[];
  }[];
};

type TeamAndSpacesDropdownControlUiSchema =
  UiSchemaWithProvidedOptions<TeamAndSpacesControlOptions>;

const props = defineProps<VueControlPropsForLabelContent<string>>();

const accountId = ref<string>("");
const scopeOrSpaceId = ref<string>("");

const uischema = computed(
  () => props.control.uischema as TeamAndSpacesDropdownControlUiSchema,
);
const options = computed(() => uischema.value.options);
const possibleTeams = computed(() => options.value?.possibleTeams ?? []);
const possibleSpaces = computed(() => options.value?.possibleSpaces ?? []);
const possibleSpacesPerTeam = computed(
  () =>
    possibleSpaces.value.find(({ id }) => id === accountId.value)?.spaces ?? [],
);

const teamsDisabled = computed(() => {
  return !props.control.enabled || possibleTeams.value.length === 0;
});
const spacesDisabled = computed(() => {
  return !props.control.enabled || possibleSpacesPerTeam.value.length === 0;
});

const setInitialValues = () => {
  if (props.control.data) {
    scopeOrSpaceId.value = props.control.data;
    const matchAccountIdToSpaceId = possibleSpaces.value.find(({ spaces }) =>
      spaces.some(({ id }) => id === scopeOrSpaceId.value),
    );

    if (matchAccountIdToSpaceId) {
      accountId.value = matchAccountIdToSpaceId.id;
    }
  }
};

const onChangeTeam = () => {
  scopeOrSpaceId.value = possibleSpacesPerTeam.value[0]?.id ?? null;
  props.changeValue(scopeOrSpaceId.value);
};

setInitialValues();
</script>

<template>
  <div class="team-and-space">
    <div class="team">
      <KdsDropdown
        v-model="accountId"
        label="Team"
        aria-label="account-id"
        :disabled="teamsDisabled"
        :possible-values="possibleTeams"
        placeholder="No team selected"
        @update:model-value="onChangeTeam"
      />
    </div>

    <div class="space">
      <KdsDropdown
        v-model="scopeOrSpaceId"
        label="Space"
        aria-label="space-id"
        :disabled="spacesDisabled"
        :possible-values="possibleSpacesPerTeam"
        placeholder="No space selected"
        @update:model-value="() => changeValue(scopeOrSpaceId)"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.team-and-space {
  transition: 0.3s opacity ease-in-out;

  & .team,
  & .space {
    float: left;
    width: calc(50% - 5px);
    margin-right: 5px;
  }
}
</style>
