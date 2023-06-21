<script>
import { defineComponent } from 'vue';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';
import DialogComponentWrapper from './DialogComponentWrapper.vue';
import FunctionButton from 'webapps-common/ui/components/FunctionButton.vue';
import LabeledInput from './LabeledInput.vue';
import LoadingIcon from 'webapps-common/ui/components/LoadingIcon.vue';
import { JsonDataService } from '@knime/ui-extension-service';

const ButtonInput = defineComponent({
    name: 'ButtonInput',
    components: {
        FunctionButton,
        DialogComponentWrapper,
        LabeledInput,
        LoadingIcon
    },
    inject: ['getKnimeService'],
    inheritAttrs: false,
    props: {
        ...rendererProps()
    },
    setup(props) {
        return useJsonFormsControl(props);
    },
    data() {
        return {
            jsonDataService: null,
            isLoading: false,
            errorMessage: null
        };
    },
    computed: {
        hasData() {
            return this.control.data !== null && typeof this.control.data !== 'undefined';
        },
        buttonText() {
            if (this.hasData) {
                return this.succeededButtonText;
            }
            return this.isLoading ? this.cancelButtonText : this.invokeButtonText;
        },
        isButtonDisabled() {
            return (this.hasData && !this.isMultipleUse) ||
                (this.isLoading && !this.isCancelable);
        },
        invokeButtonText() {
            return this.control.uischema.options?.buttonTexts?.invoke ?? 'Invoke action';
        },
        cancelButtonText() {
            return this.control.uischema.options?.buttonTexts?.cancel ?? 'Cancel';
        },
        succeededButtonText() {
            return this.control.uischema.options?.buttonTexts?.succeeded ?? 'Success';
        },
        displayErrorMessage() {
            return this.control.uischema.options?.displayErrorMessage ?? true;
        },
        isMultipleUse() {
            return this.control.uischema.options?.isMultipleUse ?? false;
        },
        isCancelable() {
            return this.control.uischema.options?.isCancelable ?? true;
        },
        showTitleAndDescription() {
            return this.control.uischema.options?.showTitleAndDescription ?? true;
        }
    },
    mounted() {
        this.jsonDataService = new JsonDataService(this.getKnimeService());
    },
    methods: {
        async onClick() {
            this.errorMessage = null;
            if (this.isLoading) {
                this.jsonDataService.data({
                    method: 'invokeActionHandler',
                    options: [this.control.uischema.options.actionHandler, 'cancel']
                });
                this.isLoading = false;
            } else {
                this.isLoading = true;
                const receivedData = await this.jsonDataService.data({
                    method: 'invokeActionHandler',
                    options: [this.control.uischema.options.actionHandler]
                });
                this.isLoading = false;
                if (receivedData?.state === 'FAIL') {
                    this.errorMessage = receivedData.message;
                } else if (receivedData?.state === 'SUCCESS') {
                    this.handleChange(this.control.path, receivedData.result);
                }
            }
        }
    }
});
export default ButtonInput;
</script>

<template>
  <DialogComponentWrapper :control="control">
    <LabeledInput
      :text="control.label"
      :description="control.description"
      :errors="[control.errors]"
      :show-reexecution-icon="isModelSettingAndHasNodeView"
      :scope="control.uischema.scope"
      :flow-settings="flowSettings"
      :show="showTitleAndDescription"
    >
      <div class="button-wrapper">
        <FunctionButton
          :disabled="isButtonDisabled"
          class="button-input"
          :primary="!isLoading"
          @click="onClick"
        >
          <div class="button-input-text">{{ buttonText }} </div>
        </FunctionButton>
        <LoadingIcon v-if="isLoading" />
        <span
          v-if="errorMessage && displayErrorMessage"
          class="error-message"
        >
          Error: {{ errorMessage }}
        </span>
      </div>
    </LabeledInput>
  </DialogComponentWrapper>
</template>

<style>
.button-input {
    min-width: 100px;
    text-align: center;
}

.button-wrapper {
    display: flex;
    align-items: center;
    justify-content: left;
    gap: 10px;
}

.button-input-text {
    display: flex;
    justify-content: center;
    width: 100%;
}

.error-message {
    font-size: 13px;
    color: var(--knime-coral-dark)
}

svg {
    height: 18px;
}
</style>
