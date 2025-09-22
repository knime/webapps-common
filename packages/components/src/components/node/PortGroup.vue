<script>
import Description from "../Description/Description.vue";

import PortIcon from "./PortIcon.vue";

/** PortGroups are part of the NodeFeaureList
 *  A PortGroup is one section that contains several ports and their metadata.
 *  Examples are "Input ports", "Output ports"
 */
export default {
  name: "PortGroup",
  components: {
    Description,
    PortIcon,
  },
  props: {
    /**
     * Array of Ports
     * Port {
     *   color: String, // css-format
     *   optional: Boolean,
     *   type: String, // on of ['flowVariable', 'table', 'other']
     *   typeName: String, // human readable data type,
     *   name: String, // name of this port
     *   description: String
     * }
     */
    ports: {
      type: Array,
      default: () => [],
    },
    /** Header title of this PortGroup */
    title: {
      type: String,
      default: "Input ports",
    },
    groupDescription: {
      type: String,
      default: null,
    },
  },
  computed: {
    /**
     * Decides whether we are rendering static or dynamic ports.
     * @returns {Boolean} dynamicPorts
     */
    dynamicPorts() {
      return Boolean(this.groupDescription);
    },
  },
};
</script>

<template>
  <div class="wrapper">
    <h6>{{ title }}</h6>
    <div class="content">
      <Description
        v-if="dynamicPorts"
        :text="groupDescription"
        render-as-html
        class="dyn-ports-description"
      />
      <ol>
        <li v-for="(port, index) in ports" :key="index">
          <svg viewBox="-4.5 -4.5 9 9" width="12" height="12">
            <PortIcon
              :color="port.color"
              :filled="!port.optional"
              :type="port.type"
            />
          </svg>
          <div :class="['port-type', { fat: !dynamicPorts }]">
            Type: {{ port.typeName }}
          </div>
          <div v-if="!dynamicPorts && port.name" class="port-name">
            {{ port.name }}
          </div>
          <Description
            v-if="!dynamicPorts && port.description"
            :text="port.description"
            render-as-html
            class="port-description"
          />
        </li>
      </ol>
    </div>
  </div>
</template>

<style type="postcss" scoped>
.wrapper {
  display: flex;
  flex-wrap: wrap;
  padding: 20px 30px;
  margin-bottom: 10px;
  background: var(--knime-white);

  & h6 {
    flex-grow: 1;
    flex-basis: 33%;
    min-width: 140px;
    padding-right: 10px;
    margin: 0 0 16px;
  }

  & .content {
    flex-grow: 1;
    flex-basis: 66%;

    & .dyn-ports-description {
      margin-bottom: 22px;
    }
  }
}

ol {
  display: block;
  padding: 0;
  margin-top: 0;
  margin-left: 28px;
  list-style: none;

  & li {
    position: relative;
    display: block;
    padding: 0;
    margin-bottom: 14px;
    font-size: 16px;
    line-height: 20px;

    & svg {
      position: absolute;
      top: 4px;
      left: -25px;
    }

    & .port-name {
      margin: 10px 0;
    }

    & .port-type {
      &.fat {
        font-weight: 600;
      }
    }
  }
}
</style>
