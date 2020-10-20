<script>

import PortGroup from './PortGroup';

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
        },
        normalizedDynInPorts() {
            return this.normalizeDynPorts({ dynPorts: this.dynInPorts });
        },
        normalizedDynOutPorts() {
            return this.normalizeDynPorts({ dynPorts: this.dynOutPorts });
        }
    },
    methods: {
        normalizeDynPorts({ dynPorts }) {
            /*
            In this component dynamic port groups can be displayed the same way as regular port groups.
            Therefore we normalize the dynamic ports' data format to regular ports' format.
            */

            return dynPorts.reduce((acc, dynPort) => {
                const normalizedPorts = dynPort.types.map(type => ({
                    ...type,
                    name: dynPort.groupName,
                    description: dynPort.groupDescription
                }));
                return acc.concat(normalizedPorts);
            }, []);

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
        class="dyninports"
      />
    </template>

    <template v-for="dynPortsGroup in dynOutPorts">
      <PortGroup
        :key="dynPortsGroup.groupName"
        :title="dynPortsGroup.groupName + ' (Dynamic Outport)'"
        :group-description="dynPortsGroup.groupDescription"
        :ports="dynPortsGroup.types"
        class="dynoutports"
      />
    </template>
  </div>
</template>
