<script>
import PortIcon from './PortIcon2';
import Description from '../Description';

export default {
    components: {
        Description,
        PortIcon
    },
    props: {
        /** 
         * Array of Ports
         * Port {
         *   color: String, // css-format
         *   optional: Boolean,
         *   dataType: String, // on of ['flowVariable', 'table', 'other']
         *   typeName: String, // human readable data type,
         *   name: String, // name of this port
         *   description: String
         * }
         */
        ports: {
            type: Array,
            default: () => []
        },
        /** Header title of this Port-Group */
        title: {
            type: String,
            default: 'Input ports'
        },
        /** If set, rendering is adjusted for dynamic ports */
        dynamicPorts: {
            type: Boolean,
            default: false
        }
    },
};
</script>

<template>
  <div class="wrapper">
    <h6>{{ title }}</h6>
    <div class="content">
      <Description 
          v-if="dynamicPorts && ports[0] && ports[0].description"
          class="dyn-ports-description"
          :text="ports[0].description"
          :render-as-html="true"
      />
      <ol>
        <li
          v-for="(port,index) in ports"
          :key="index"
        >
          <svg
            viewBox="-4.5 -4.5 9 9"
            width="12"
            height="12"
          >
            <PortIcon
              :color="port.color"
              :filled="!port.optional"
              :data-type="port.dataType"
            />
          </svg>
          <div :class="['port-type', { fat: !dynamicPorts }]">Type: {{ port.typeName }}</div>
          <div class="port-name" v-if="!dynamicPorts && port.name">{{ port.name }}</div>
          <Description
            class="port-description"
            v-if="!dynamicPorts && port.description"
            :text="port.description"
            :render-as-html="true"
          />
        </li>
      </ol>
    </div>
  </div>
</template>

<style type="postcss" scoped>
@import "webapps-common/ui/css/variables";

.wrapper {
  background: var(--knime-white);
  display: flex;
  flex-wrap: wrap;
  
  margin-bottom: 10px;
  padding: 20px 30px;

  & h6 {
    flex-basis: 33%;
    margin: 0 0 16px 0;
    min-width: 140px;
    padding-right: 10px;
    flex-grow: 1;
  }
  
  & .content {
    flex-basis: 66%;
    flex-grow: 1;

    & .dyn-ports-description {
      margin-bottom: 22px;
    }
  }
}

ol {
  list-style: none;
  margin-left: 28px;
  display: block;
  padding: 0;
  margin-top: 0;
  
  & li {
    display: block;
    padding: 0;
    position: relative;
    margin-bottom: 14px;
    font-size: 16px;
    line-height: 20px;

    & svg {
      position: absolute;
      left: -25px;
      top: 5px;
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
