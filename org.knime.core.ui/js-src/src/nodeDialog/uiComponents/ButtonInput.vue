<script>
import { defineComponent } from 'vue';
import { rendererProps } from '@jsonforms/vue';
import DialogComponentWrapper from './DialogComponentWrapper.vue';
import FunctionButton from 'webapps-common/ui/components/FunctionButton.vue';
import LabeledInput from './LabeledInput.vue';
import LoadingIcon from 'webapps-common/ui/components/LoadingIcon.vue';
import { useJsonFormsControlWithUpdate } from './composables/jsonFormsControlWithUpdate';

const ButtonInput = defineComponent({
    name: 'ButtonInput',
    components: {
        FunctionButton,
        DialogComponentWrapper,
        LabeledInput,
        LoadingIcon
    },
    inject: ['registerWatcher', 'getData'],
    inheritAttrs: false,
    props: {
        ...rendererProps()
    },
    setup(props) {
        return useJsonFormsControlWithUpdate(props);
    },
    data() {
        return {
            numPendingRequests: 0,
            errorMessage: null,
            currentSettings: {},
            currentState: {}
        };
    },
    computed: {
        states() {
            return this.control.uischema.options?.states ?? [];
        },
        displayErrorMessage() {
            return this.control.uischema.options?.displayErrorMessage ?? true;
        },
        showTitleAndDescription() {
            return this.control.uischema.options?.showTitleAndDescription ?? true;
        }
    },
    mounted() {
        const dependencies = this.control.uischema.options?.dependencies || [];
        this.registerWatcher({
            transformSettings: this.onSettingsChange.bind(this),
            init: this.initialize.bind(this),
            dependencies
        });
    },
    methods: {
        async initialize(newSettings) {
            this.saveCurrentSettings(newSettings);
            await this.performRequest({
                method: 'initializeButton',
                options: [this.control.data]
            });
        },
        onSettingsChange(newSettings) {
            this.saveCurrentSettings(newSettings);
            this.performRequest({
                method: 'update',
                options: [this.currentSettings]
            });
        },
        saveCurrentSettings(newSettings) {
            this.currentSettings = { ...newSettings.view, ...newSettings.model };
        },
        async onClick() {
            const { id, nextState } = this.currentState;
            const lastSuccessfulState = this.currentState;
            const resetCallback = () => {
                if (nextState === this.currentState.id) {
                    this.currentState = lastSuccessfulState;
                }
            };
            if (typeof nextState !== 'undefined') {
                this.setButtonState(nextState);
            }
            await this.performRequest({
                method: 'invokeButtonAction',
                options: [id, this.currentSettings]
            }, resetCallback);
        },
        async performRequest({ method, options }) {
            this.numPendingRequests += 1;
            const receivedData = await this.getData({
                method,
                options: [this.control.uischema.options.actionHandler, ...options]
            });
            this.numPendingRequests -= 1;
            this.handleDataServiceResult(receivedData, resetCallback);
        },
        handleDataServiceResult(receivedData, resetCallback = () => {}) {
            const { state, message, result } = receivedData;
            if (state === 'SUCCESS') {
                this.setNextState(result);
                return;
            }
            if (state === 'FAIL') {
                this.errorMessage = message;
            }
            resetCallback();
        },
        setNextState(dataServiceResult) {
            if (dataServiceResult === null) {
                return;
            }
            const { settingResult, saveResult, buttonState } = dataServiceResult;
            if (saveResult) {
                this.saveResult(settingResult);
            }
            this.setButtonState(buttonState);
        },
        saveResult(result) {
            // without setTimeout, the value is not updated when triggered via onSettigsChange --> TODO UIEXT-1137: use new UIEXT-1015 logic
            setTimeout(() => this.handleChange(this.control.path, result));
        },
        setButtonState(newButtonStateId) {
            this.clearError();
            this.currentState = this.states.find(({ id }) => id === newButtonStateId);
        },
        clearError() {
            this.errorMessage = null;
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
          :disabled="currentState.disabled"
          class="button-input"
          :primary="currentState.primary"
          @click="onClick"
        >
          <div class="button-input-text">{{ currentState.text }} </div>
        </FunctionButton>
        <LoadingIcon v-if="numPendingRequests > 0" />
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
