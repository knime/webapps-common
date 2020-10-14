<script>

import PortsListItem from './PortsListItem';

export default {
    components: {
        PortsListItem
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
  <div v-if="hasPorts" class="ports-list">
    <PortsListItem
      v-if="inPorts.length"
      :ports="inPorts"
      class="inports"
      title="Input ports"
    />
    <PortsListItem
      v-if="outPorts.length"
      :ports="outPorts"
      class="outports"
      title="Output ports"
    />
    <PortsListItem
      v-if="normalizedDynInPorts.length"
      :ports="normalizedDynInPorts"
      class="dyninports"
      title="Dynamic input ports"
    />
    <PortsListItem
      v-if="normalizedDynOutPorts.length"
      :ports="normalizedDynOutPorts"
      class="dynoutports"
      title="Dynamic output ports"
    />
  </div>
</template>
