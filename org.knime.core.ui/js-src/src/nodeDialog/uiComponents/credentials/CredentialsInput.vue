<script setup lang="ts">
import useDialogControl from "@/nodeDialog/composables/components/useDialogControl";
import { rendererProps } from "@jsonforms/vue";
import CredentialsInputBase from "./CredentialsInputBase.vue";
import type Credentials from "./types/Credentials";

const props = defineProps(rendererProps());
const { control, onChange, disabled, flowSettings } =
  useDialogControl<Credentials>({ props });
</script>

<template>
  <CredentialsInputBase
    :control="control"
    :data="control.data"
    :flow-settings="flowSettings"
    :disabled="disabled"
    @change="onChange"
  />
</template>
