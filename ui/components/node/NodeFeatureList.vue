<script>
import PortIcon from '../../assets/img/icons/plugin.svg?inline';
import ViewsIcon from '../../assets/img/icons/eye.svg?inline';
import OptionsIcon from '../../assets/img/icons/settings.svg?inline';
import TabBar, { tabBarMixin } from '../TabBar';
import PortsList from './PortsList';
import ViewsList from './ViewsList';
import DialogOptions from './DialogOptions';

export default {
    components: {
        TabBar,
        DialogOptions,
        PortsList,
        ViewsList
    },
    mixins: [tabBarMixin],
    props: {
        /** Passed through to PortsList.vue */
        inPorts: {
            type: Array,
            default: () => []
        },
        /** Passed through to PortsList.vue */
        outPorts: {
            type: Array,
            default: () => []
        },
        /** Passed through to PortsList.vue */
        dynInPorts: {
            type: Array,
            default: () => []
        },
        /** Passed through to PortsList.vue */
        dynOutPorts: {
            type: Array,
            default: () => []
        },
        /** Passed through to DialogOptions.vue */
        dialogs: {
            type: Array,
            default: () => []
        },
        /** Passed through to ViewsList.vue */
        views: {
            type: Array,
            default: () => []
        },
        /** Text that is show if node has neither views, dialogs nor ports */
        emptyText: {
            type: String,
            default: 'This node does not provide any ports, options or views.'
        }
    },
    computed: {
        hasPorts() {
            return this.inPorts.length > 0 || this.outPorts.length > 0 || this.dynInPorts.length > 0 ||
            this.dynOutPorts.length > 0;
        },
        possibleTabValues() {
            return [{
                value: 'ports',
                label: 'Ports',
                icon: PortIcon,
                disabled: !this.hasPorts
            }, {
                value: 'node-dialog-options',
                label: 'Options',
                icon: OptionsIcon,
                disabled: this.dialogs.length === 0
            }, {
                value: 'views',
                label: 'Views',
                icon: ViewsIcon,
                disabled: this.views.length === 0
            }];
        }
    }
};
</script>

<template>
  <div class="feature-list">
    <TabBar
      :value.sync="activeTab"
      :possible-values="possibleTabValues"
      name="feature"
    />
    <KeepAlive>
      <PortsList
        v-if="activeTab === 'ports'"
        :in-ports="inPorts"
        :out-ports="outPorts"
        :dyn-in-ports="dynInPorts"
        :dyn-out-ports="dynOutPorts"
      />
      <DialogOptions
        v-else-if="activeTab === 'node-dialog-options'"
        :options="dialogs"
      />
      <ViewsList
        v-else-if="activeTab === 'views'"
        :views="views"
      />
      <p
        v-else
        class="placeholder"
      >
        {{ emptyText }}
      </p>
    </KeepAlive>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.placeholder {
  font-size: 13px;
  font-weight: 300;
  color: var(--knime-dove-gray);
}
</style>
