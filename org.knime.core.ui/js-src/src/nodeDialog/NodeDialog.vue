<script>
import { JsonDataService, DialogService } from '@knime/ui-extension-service';
import { vanillaRenderers } from '@jsonforms/vue-vanilla';
import { JsonForms } from '@jsonforms/vue';
import { fallbackRenderers, defaultRenderers } from './renderers';
import { hasAdvancedOptions } from '../nodeDialog/utils';
import Button from 'webapps-common/ui/components/Button.vue';
import { cloneDeep } from 'lodash';

const renderers = [...vanillaRenderers, ...fallbackRenderers, ...defaultRenderers];

export default {
    components: {
        JsonForms,
        Button
    },
    inject: ['getKnimeService'],
    provide() {
        return {
            registerWatcher: this.registerWatcher
        };
    },
    data() {
        return {
            jsonDataService: null,
            settings: null,
            originalSettingsData: null,
            allSettingsWatcherCallbacks: [],
            renderers: Object.freeze(renderers)
        };
    },
    // TODO: UIEXT-236 Move to dialog service
    computed: {
        dirtyModelSettings() {
            return this.$store.state['pagebuilder/dialog'].dirtyModelSettings;
        }
    },
    async mounted() {
        this.jsonDataService = new JsonDataService(this.getKnimeService());
        this.dialogService = new DialogService(this.getKnimeService());
        const settings = await this.jsonDataService.initialData();
        settings.schema.flowVariablesMap = await this.dialogService.getFlowVariableSettings();
        settings.schema.hasNodeView = this.dialogService.hasNodeView();
        settings.schema.showAdvancedSettings = false;
        this.settings = settings;

        this.originalSettingsData = JSON.stringify(this.settings?.data || {});
        this.jsonDataService.registerDataGetter(this.getData);
        this.$store.dispatch('pagebuilder/dialog/setApplySettings', { applySettings: this.applySettings });
    },
    methods: {
        getData() {
            return this.settings.data;
        },
        registerWatcher(callback) {
            this.allSettingsWatcherCallbacks.push(callback);
        },
        onSettingsChanged(data) {
            if (this.allSettingsWatcherCallbacks.length) {
                const copyOfOldData = JSON.parse(JSON.stringify(this.settings.data));
                const copyOfNewData = JSON.parse(JSON.stringify(data.data));
                this.allSettingsWatcherCallbacks.forEach(callback => {
                    callback(copyOfOldData, copyOfNewData);
                });
            }
            if (data.data) {
                this.settings.data = data.data;
                // TODO: UIEXT-236 Move to dialog service
                if (this.originalSettingsData === JSON.stringify(this.settings.data)) {
                    this.$store.dispatch('pagebuilder/dialog/cleanSettings');
                } else {
                    this.$store.dispatch('pagebuilder/dialog/dirtySettings');
                }
                // TODO: UIEXT-236 Move to dialog service
                if (!this.dirtyModelSettings) {
                    const rawSettings = cloneDeep(this.settings);
                    this.jsonDataService.publishData(rawSettings);
                }
            }
        },
        applySettings() {
            this.originalSettingsData = JSON.stringify(this.settings.data);
            return this.jsonDataService.applyData();
        },
        async applySettingsCloseDialog() {
            const response = await this.applySettings();
            if (response.result) {
                alert(response.result);
            } else {
                this.closeDialog();
            }
        },
        closeDialog() {
            window.closeCEFWindow();
        },
        changeAdvancedSettings() {
            this.settings.schema.showAdvancedSettings = !this.settings.schema.showAdvancedSettings;
        },
        hasAdvancedOptions() {
            if (!this.settings) {
                return false;
            }
            return hasAdvancedOptions(this.settings.ui_schema);
        }
    }
};
</script>

<template>
  <div class="dialog">
    <div class="form">
      <JsonForms
        v-if="settings"
        :data="settings.data"
        :schema="settings.schema"
        :uischema="settings.ui_schema"
        :renderers="renderers"
        @change="onSettingsChanged"
      />
      <a
        v-if="hasAdvancedOptions()"
        class="advanced-options"
        @click="changeAdvancedSettings"
      >
        {{ settings.schema.showAdvancedSettings ? 'Hide' : 'Show' }} advanced settings
      </a>
    </div>
    <div class="controls">
      <Button
        with-border
        compact
        @click="closeDialog"
      >
        Cancel
      </Button>
      <Button
        primary
        compact
        @click.prevent="applySettingsCloseDialog"
      >
        Ok
      </Button>
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.dialog {
  --controls-height: 49px;
  --description-button-size: 15px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100vh;
  background-color: var(--knime-gray-ultra-light);
  border-left: 1px solid var(--knime-silver-sand);
  padding: 11px 0; /* Padding set at 11px to align with the commons "Messages" component */

  & .form {
    display: flex;
    flex-direction: column;
    height: calc(100vh - var(--controls-height));
    padding: 0 20px;
    overflow: hidden;
    overflow-y: auto;
  }

  & .controls {
    display: flex;
    justify-content: space-between;
    height: var(--controls-height);
    padding: 13px 20px 5px;
    background-color: var(--knime-gray-light-semi);
    border-top: 1px solid var(--knime-silver-sand);
  }

  & .advanced-options {
    display: flex;
    justify-content: space-between;
    text-decoration: underline;
    margin-bottom: 20px;
    font-size: 14px;
    cursor: pointer;
    color: var(--knime-dove-gray);

    &:hover {
      color: var(--knime-masala);
      text-decoration: underline dotted;
    }
  }
}
</style>
