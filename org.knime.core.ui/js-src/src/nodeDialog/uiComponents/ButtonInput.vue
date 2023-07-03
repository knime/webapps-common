<script>
import { defineComponent } from 'vue';
import { rendererProps } from '@jsonforms/vue';
import DialogComponentWrapper from './DialogComponentWrapper.vue';
import FunctionButton from 'webapps-common/ui/components/FunctionButton.vue';
import LabeledInput from './LabeledInput.vue';
import LoadingIcon from 'webapps-common/ui/components/LoadingIcon.vue';

import { JsonDataService } from '@knime/ui-extension-service';
import { useJsonFormsControlWithUpdate } from './composables/jsonFormsControlWithUpdate';

const ButtonInput = defineComponent({
    name: 'ButtonInput',
    components: {
        FunctionButton,
        DialogComponentWrapper,
        LabeledInput,
        LoadingIcon
    },
    inject: ['getKnimeService', 'registerWatcher'],
    inheritAttrs: false,
    props: {
        ...rendererProps()
    },
    setup(props) {
        return useJsonFormsControlWithUpdate(props);
    },
    data() {
        return {
            jsonDataService: null,
            isLoading: false,
            errorMessage: null,
            currentSettings: {}
        };
    },
    computed: {
        hasData() {
            return this.control.data !== null && typeof this.control.data !== 'undefined';
        },
        buttonText() {
            if (this.isLoading) {
                return this.cancelButtonText;
            }
            return this.hasData ? this.succeededButtonText : this.invokeButtonText;
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
        const dependencies = this.control.uischema.options?.dependencies || [];
        this.registerWatcher({
            transformSettings: this.onSettingsChange.bind(this),
            dependencies
        });
        this.jsonDataService = new JsonDataService(this.getKnimeService());
    },
    methods: {
        saveResult(result) {
            // without setTimeout, the value is not updated when triggered via onSettigsChange
            setTimeout(() => this.handleChange(this.control.path, result));
        },
        async onClick() {
            this.clearError();
            if (this.isLoading) {
                this.cancel();
            } else {
                this.isLoading = true;
                const receivedData = await this.jsonDataService.data({
                    method: 'invokeActionHandler',
                    options: [this.control.uischema.options.actionHandler, 'click', this.currentSettings]
                });
                this.isLoading = false;
                if (receivedData?.state === 'FAIL') {
                    this.errorMessage = receivedData.message;
                } else if (receivedData?.state === 'SUCCESS') {
                    this.saveResult(receivedData?.result);
                }
            }
        },
        cancel() {
            this.jsonDataService.data({
                method: 'invokeActionHandler',
                options: [this.control.uischema.options.actionHandler, 'cancel']
            });
            this.isLoading = false;
        },
        clearError() {
            this.errorMessage = null;
        },
        onSettingsChange(newSettings) {
            this.currentSettings = { ...newSettings.view, ...newSettings.model };
            if (this.hasData) {
                if (this.isLoading && this.isCancelable) {
                    this.cancel();
                }
                this.saveResult(null);
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

<style scoped>
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
