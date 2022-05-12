<script>
import PortGroup from './PortGroup';

/**
 * Part of NodeFeatureList
 * This components displays information about a node's/component's ports
 *
 * It renders two fixed PortGroups for regular Inports and Outports
 * and one PortGroup per dynamic in/out-port, listing all possible types for said port
 */
export default {
    components: {
        PortGroup
    },
    props: {
        inPorts: {
            type: Array,
            default: () => []
        },
        outPorts: {
            type: Array,
            default: () => []
        },
        dynInPorts: {
            type: Array,
            default: () => []
        },
        dynOutPorts: {
            type: Array,
            default: () => []
        }
    },
    computed: {
        hasPorts() {
            return this.inPorts.length > 0 || this.outPorts.length > 0 || this.dynInPorts.length > 0 ||
            this.dynOutPorts.length > 0;
        }
    }
};
</script>

<template>
  <div
    v-if="hasPorts"
    class="ports-list"
  >
    <PortGroup
      v-if="inPorts.length"
      class="inports"
      title="Input ports"
      :ports="inPorts"
    />
    <PortGroup
      v-if="outPorts.length"
      class="outports"
      title="Output ports"
      :ports="outPorts"
    />
    <template v-for="dynPortsGroup in dynInPorts">
      <PortGroup
        :key="dynPortsGroup.groupName"
        :title="dynPortsGroup.groupName + ' (Dynamic Inport)'"
        :group-description="dynPortsGroup.groupDescription"
        :ports="dynPortsGroup.types"
      />
    </template>

    <template v-for="dynPortsGroup in dynOutPorts">
      <PortGroup
        :key="dynPortsGroup.groupName"
        :title="dynPortsGroup.groupName + ' (Dynamic Outport)'"
        :group-description="dynPortsGroup.groupDescription"
        :ports="dynPortsGroup.types"
      />
    </template>
  </div>
</template>
