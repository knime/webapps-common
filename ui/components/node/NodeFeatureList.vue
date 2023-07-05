<script>
import PortIcon from "../../assets/img/icons/plugin.svg";
import ViewsIcon from "../../assets/img/icons/eye.svg";
import OptionsIcon from "../../assets/img/icons/settings.svg";
import TabBar from "../TabBar.vue";
import PortsList from "./PortsList.vue";
import ViewsList from "./ViewsList.vue";
import DialogOptions from "./DialogOptions.vue";

export default {
  components: {
    TabBar,
    DialogOptions,
    PortsList,
    ViewsList,
  },
  props: {
    /** Passed through to PortsList.vue */
    inPorts: {
      type: Array,
      default: () => [],
    },
    /** Passed through to PortsList.vue */
    outPorts: {
      type: Array,
      default: () => [],
    },
    /** Passed through to PortsList.vue */
    dynInPorts: {
      type: Array,
      default: () => [],
    },
    /** Passed through to PortsList.vue */
    dynOutPorts: {
      type: Array,
      default: () => [],
    },
    /** Passed through to DialogOptions.vue */
    options: {
      type: Array,
      default: () => [],
    },
    /** Passed through to ViewsList.vue */
    views: {
      type: Array,
      default: () => [],
    },
    /** Text that is show if node has neither views, options nor ports */
    emptyText: {
      type: String,
      default: "This node does not provide any ports, options or views.",
    },
    /** Passed through to DialogOptions.vue */
    sanitizeContent: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      activeTab: null,
    };
  },
  computed: {
    hasPorts() {
      return (
        this.inPorts.length > 0 ||
        this.outPorts.length > 0 ||
        this.dynInPorts.length > 0 ||
        this.dynOutPorts.length > 0
      );
    },
    possibleTabValues() {
      return [
        {
          value: "ports",
          label: "Ports",
          icon: PortIcon,
          disabled: !this.hasPorts,
        },
        {
          value: "node-dialog-options",
          label: "Options",
          icon: OptionsIcon,
          disabled: this.options.length === 0,
        },
        {
          value: "views",
          label: "Views",
          icon: ViewsIcon,
          disabled: this.views.length === 0,
        },
      ];
    },
  },
};
</script>

<template>
  <div class="feature-list">
    <TabBar
      v-model="activeTab"
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
        :sanitize-content="sanitizeContent"
        :options="options"
      />
      <ViewsList v-else-if="activeTab === 'views'" :views="views" />
      <p v-else class="placeholder">
        {{ emptyText }}
      </p>
    </KeepAlive>
  </div>
</template>

<style lang="postcss" scoped>
.placeholder {
  font-size: 13px;
  font-weight: 300;
  color: var(--knime-dove-gray);
}
</style>
