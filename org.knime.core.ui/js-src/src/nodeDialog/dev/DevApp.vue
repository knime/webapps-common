<script>
/* eslint-disable no-console */
import { KnimeService } from '@knime/ui-extension-service';
import NodeDialog from '@/nodeDialog/NodeDialog.vue';
import { computed } from 'vue';

export default {
    components: {
        NodeDialog
    },
    provide() {
        // load default page mock
        if (localStorage && localStorage.dialogIdx) {
            this.currentDialogIndex = Number(localStorage.getItem('dialogIdx'));
        }
        this.currentKS = computed(() => this.getMockKnimeService());
        return {
            getKnimeService: () => this.currentKS
        };
    },
    data() {
        return {
            currentDialogIndex: 0,
            currentKS: null
        };
    },
    computed: {
        dialogMocks() {
            // eslint-disable-next-line no-undef
            const mocks = import.meta.glob('@@/mocks/*.json', { eager: true });
            return Object.keys(mocks).sort().map(file => ({
                name: file.replace('/mocks/', ''),
                config: mocks[file]
            }));
        },
        currentDialog() {
            return this.dialogMocks[this.currentDialogIndex]?.config;
        }
    },
    watch: {
        currentDialogIndex(newIdx, oldIdx) {
            if (newIdx === oldIdx) {
                return;
            }
            localStorage.setItem('dialogIdx', newIdx);
            this.currentKS = computed(() => this.getMockKnimeService());
        }
    },
    created() {
        // load default page mock
        if (localStorage && localStorage.dialogIdx) {
            this.currentDialogIndex = Number(localStorage.getItem('dialogIdx'));
        }
        // Mock global AP/RPC functionality.
        window.closeCEFWindow = () => console.log('Close CEF called by dev app (functional only in KAP).');
    },
    methods: {
        getMockKnimeService() {
            let initialData = JSON.stringify(this.currentDialog);
            let extensionConfig = {
                initialData,
                nodeId: '0',
                workflowId: '0',
                projectId: '7',
                resourceInfo: {
                    type: 'VUE_COMPONENT_LIB',
                    id: 'NodeDialog',
                    path: 'any',
                    url: null
                },
                extensionType: 'dialog'
            };
            return new KnimeService(extensionConfig, this.callService, this.pushEvent);
        },
        onDialogSelect(e) {
            let dialogIdx = e.target.selectedOptions[0].index - 1;
            this.currentDialogIndex = dialogIdx;
        },
        // Mock service calls
        callService(request) {
            console.log('KnimeService called service with request:', request);
            const delay = 3000;
            return new Promise(resolve => setTimeout(resolve, delay));
        },
        pushEvent(event) {
            console.log('Push event was called:', event);
        },
        applySettings() {
            let message = 'Current dialog does not have an apply data method.';
            if (typeof this.currentKS?.dataGetter === 'function') {
                message = `Dialog returned value: \n${JSON.stringify(
                    this.currentKS.dataGetter()
                )}`;
            }
            // eslint-disable-next-line no-console
            console.log(message);
        }
    }
};
</script>

<template>
  <div class="container">
    <h1>UI Extension based KNIME Node Dialog Dev App</h1>
    <p>
      Dialog mock:
      <select
        @change="onDialogSelect"
      >
        <option :value="null">-</option>
        <option
          v-for="(dialog, index) in dialogMocks"
          :key="dialog.name"
          :value="dialog.name"
          :selected="index === currentDialogIndex"
        >
          {{ dialog.name }}
        </option>
      </select>
    </p>
    <div class="frame">
      <NodeDialog
        v-if="currentDialog && currentKS"
        :key="currentDialog.result.name"
      />
      <button @click="applySettings">Simulate Apply (prints to console)</button>
    </div>
  </div>
</template>

<style lang="postcss">
@import url("webapps-common/ui/css");

body {
  margin: 10px;
  font-size: 18px;
  line-height: 26px;
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.frame {
  position: relative;
  border: 5px solid orange;
  max-width: 400px;
  min-width: 340px;
}
</style>
