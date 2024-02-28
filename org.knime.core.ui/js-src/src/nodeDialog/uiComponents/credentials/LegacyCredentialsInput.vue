<script setup lang="ts">
import useDialogControl from "@/nodeDialog/composables/components/useDialogControl";
import { rendererProps } from "@jsonforms/vue";
import CredentialsInputBase from "./CredentialsInputBase.vue";
import type Credentials from "./types/Credentials";

interface LegacyCredentials {
  credentials: Credentials;
  flowVarName: string | null | undefined;
}

const props = defineProps(rendererProps());
const { control, handleDirtyChange, disabled, flowSettings } =
  useDialogControl<LegacyCredentials>({
    props,
    subConfigKeys: ["credentials"],
  });

const onChange = (credentials: Credentials) => {
  handleDirtyChange({ credentials, flowVarName: null });
};
</script>

<template>
  <CredentialsInputBase
    :control="control"
    :data="control.data.credentials"
    :flow-settings="flowSettings"
    :disabled="disabled"
    @change="onChange"
  />
</template>
