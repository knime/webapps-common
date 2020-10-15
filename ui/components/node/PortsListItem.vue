<script>
import PortIcon from './PortIcon2';
import Description from '../Description';

export default {
    components: {
        Description,
        PortIcon
    },
    props: {
        /** Hub-Format expected */
        ports: {
            type: Array,
            default: () => []
        },
        title: {
            type: String,
            default: 'Input ports'
        }
    },
    methods: {
        /** 
         * PortIcon uses types 'table', 'flowVariable', any other
         * Deprecated types from Hub 'Data', 'Flow Variable', any other
        */
        translatePortType(dataType) {
            switch (dataType) {
                case 'Data':
                    return 'table';
                case 'Flow Variable':
                    return 'flowVariable';
                default:
                    return 'other';
            }
        }
    }
};
</script>

<template>
  <div class="wrapper">
    <h6>{{ title }}</h6>
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
          <title>{{ port.name || port.dataType }}</title>
          <PortIcon
            :color="`#${port.color}`"
            :filled="!port.optional"
            :data-type="translatePortType(port.dataType)"
          />
        </svg>
        <span class="type">Type: {{ port.dataType }}</span>
        <Description
          v-if="port.description"
          :text="port.description"
          :render-as-html="true"
        />
      </li>
    </ol>
  </div>
</template>

<style type="postcss" scoped>
@import "webapps-common/ui/css/variables";

.wrapper {
  background: var(--knime-white);
  display: flex;
  margin-bottom: 10px;
}

h6 {
  display: block;
  width: 180px;
  margin: 20px 30px;
  flex-shrink: 0;
}

ol {
  flex: 1;
  list-style: none;
  display: block;
  padding: 0;
  margin-top: 22px;
  margin-right: 20px;
  min-width: 0; /* https://css-tricks.com/flexbox-truncated-text/#article-header-id-3 */

  & li {
    display: block;
    padding: 0;
    position: relative;
    margin-bottom: 14px;
    font-size: 16px;
    line-height: 20px;
  }
}

svg {
  position: absolute;
  left: -25px;
  top: 5px;
}

.type {
  display: block;
}

@media only screen and (max-width: 900px) {
  h6 {
    width: 33%;
  }

  >>> div.description {
    font-size: 13px;
    line-height: 24px;
  }
}
</style>
