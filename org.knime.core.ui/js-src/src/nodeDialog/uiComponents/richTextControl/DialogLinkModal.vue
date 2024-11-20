<script lang="ts">
/**
 * This component wraps the CreateLinkModal component from the @knime/rich-text-editor package
 * in order to enable displaying the modal as a native dialog modal.
 *
 * This is just a temporary workaround until the Modal component in webapps-common is itself based on a native dialog.
 * ( TODO: Remove and resolve properly with UIEXT-2148)
 */
import { type Ref, nextTick, ref, watch } from "vue";

export type Props = {
  linkTool: {
    props: {
      text: Ref<string>;
      url: Ref<string>;
      isActive: Ref<boolean>;
      isEdit: Ref<boolean>;
      urlValidator: (url: string) => boolean;
    };
    events: {
      addLink: (text: string, url: string) => void;
      removeLink: () => void;
      cancelAddLink: () => void;
    };
  };
  useFlowVarTemplates?: boolean;
};
</script>

<script setup lang="ts">
import { CreateLinkModal } from "@knime/rich-text-editor";

const props = defineProps<Props>();

const linkDialog = ref<HTMLDialogElement | null>(null);

const modalPropsOverwrite = {
  isActive: ref(false),
};

/**
 * The transition duration of the modal in milliseconds.
 * This is in sync with the transition duration of the modal in the Modal component in webapps-common.
 */
const MODAL_TRANSITION_DURATION = 100;
const onIsActiveChange = (isActive: boolean) => {
  if (isActive) {
    linkDialog.value!.showModal();
    nextTick(() => {
      modalPropsOverwrite.isActive.value = true;
    });
  } else {
    modalPropsOverwrite.isActive.value = false;
    setTimeout(() => {
      linkDialog.value!.close();
    }, MODAL_TRANSITION_DURATION);
  }
};

watch(() => props.linkTool.props.isActive.value, onIsActiveChange);
</script>

<template>
  <dialog ref="linkDialog">
    <CreateLinkModal
      v-bind="{ ...linkTool.props, ...modalPropsOverwrite }"
      v-on="linkTool.events"
    />
  </dialog>
</template>

<style lang="postcss" scoped>
dialog {
  padding: 0;
  border: none;

  &::backdrop {
    display: none;
  }
}
</style>
