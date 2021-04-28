<script>
import Carousel from './Carousel';
/**
 * A radio button group that looks like a tab bar
*/
export default {
    components: {
        Carousel
    },
    props: {
        /**
         * Make the whole tab bar read-only
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * Selected value. Should be one of the value attributes in the `possibleValues` prop.
         */
        value: {
            type: String,
            default: ''
        },
        /**
         * Name of the form elements. This is useful when using the tab bar inside a <form>.
         * Defaults to `value`.
         * If you have multiple tab bars on one page, make sure to include them in separate forms or use unique `name`
         * properties. Otherwise the browser will not allow to select more than one tab in total.
         */
        name: {
            type: String,
            default: 'value'
        },
        /**
         * @example
           [{
               value: 'all',
               label: 'All',
               icon: null,
               title: 'everything',
               disabled: false
           }, {
               value: 'nodes',
               label: 'Nodes',
               icon: NodeIcon,
               title: 'Nodes!',
               disabled: true
           }, {
               value: 'workflows',
               label: 'Workflows',
               icon: WorkflowIcon,
               disabled: true
           }]
         */
        possibleValues: {
            type: Array,
            default: () => [],
            validator(items = []) {
                if (!Array.isArray(items)) {
                    return false;
                }
                return items.every(item => item.value);
            }
        }
    },
    methods: {
        onChange(value) {
            /**
             * Update event. Fired when the selection is changed.
             *
             * @event update:value
             * @type {String}
             */
            consola.trace('TabBar value changed to', value);
            this.$emit('update:value', value);
        }
    }
};

/*
* The TabBar can be used as a stand-alone component, or with this mixin, which facilitates usage together with tabbed
* content. Usage example:
*
* <script>
* …
*    computed: {
*        possibleTabValues() { // required
*            return [{
*                value: 'foo',
*                label: 'Foo'
*            }, {
*                value: 'bar',
*                label: 'Bar'
*            }];
*        }
*     }
* …
* <\/script>
*
*
* <template>
*   <div>
*     <TabBar
*       :value.sync="activeTab"              // this exact line is required
*       :possible-values="possibleTabValues" // this exact line is required
*     />
*     <Foo v-if="activeTab === 'bar'"/>     // activeTab can be used here
*     <Baz v-else />
*   </div>
* </template>
*/
export const tabBarMixin = {
    data() {
        return {
            activeTab: null
        };
    },
    computed: {
        // returns the first tab that is not empty
        initialTab() {
            let firstTab = this.possibleTabValues.find(tab => !tab.disabled);
            return firstTab ? firstTab.value : null;
        },
        possibleTabValues() {
            throw new Error('You must implement the possibleTabValues computed property when using this mixin');
        }
    },
    created() {
        let { initialTab } = this;
        consola.trace('TabBar mixin setting initial tab', initialTab);
        this.activeTab = initialTab;
    }
};
</script>

<template>
  <Carousel>
    <div class="wrapper">
      <div class="overflow">
        <label
          v-for="item in possibleValues"
          :key="item.value"
          :title="item.title"
        >
          <input
            :name="name"
            :value="item.value"
            :disabled="disabled || item.disabled"
            type="radio"
            :checked="item.value === value"
            @change="onChange(item.value)"
          >
          <span>
            <Component
              :is="item.icon"
              v-if="item.icon"
            />
            {{ item.label }}
          </span>
        </label>
      </div>
    </div>
  </Carousel>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.wrapper {
  width: 100%;
  position: relative;
  margin-top: -20px;
  padding-top: 20px;
  padding-bottom: 20px;
  display: inline-block;
  z-index: 1; /* create local stacking context */

  @media only screen and (max-width: 900px) {
    margin-top: -10px;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  & .overflow {
    height: 55px;
  }
}

>>> .carousel::after {
  content: "";
  display: block;
  position: absolute;
  border-bottom: 1px solid var(--knime-silver-sand);
  left: var(--grid-gap-width);
  right: var(--grid-gap-width);
  bottom: 26px;
}


label {
  position: relative;
}

input[type="radio"] {
  /* https://accessibility.18f.gov/hidden-content/ */
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  width: 1px;
  top: 0; /* top/left prevent right margin mobile safari */
  left: 0;
}

span {
  position: relative;
  font-size: 16px;
  font-weight: 500;
  padding: 0 10px;
  display: inline-block;
  height: 51px;
  line-height: 51px;
  color: var(--knime-dove-gray);

  @media only screen and (max-width: 900px) {
    padding: 0 7px;
    font-size: 13px;
    height: 41px;
    line-height: 40px;
  }
}

label:not(:last-child) {
  margin-right: 10px;
}

svg {
  display: inline-block;
  vertical-align: -5px;
  width: 21px;
  height: 21px;
  margin-right: 2px;
  stroke: var(--knime-dove-gray);
  stroke-width: calc(32px / 21);

  @media only screen and (max-width: 900px) {
    vertical-align: -4px;
    width: 16px;
    height: 16px;
    stroke-width: calc(32px / 16);
  }
}

input:disabled + span {
  color: var(--knime-silver-sand);

  & svg {
    stroke: var(--knime-silver-sand);
  }
}

input:not(:disabled):checked + span,
input:not(:disabled) + span:hover {
  color: var(--knime-masala);

  & svg {
    stroke: var(--knime-masala);
  }
}

input:checked:not(:disabled) + span::after {
  content: "";
  position: absolute;
  display: block;
  bottom: 1px;
  left: 0;
  right: 0;
  border-top: 3px solid var(--knime-masala);
  z-index: 1; /* local stacking context because Carousel.vue has isolation: isolate; */
}

input:not(:checked):not(:disabled) + span {
  cursor: pointer;
}

@media only screen and (max-width: 900px) {
  >>> .carousel::after {
    left: 0;
    right: 0;
  }

  @supports (-ms-ime-align: auto) { /* fires only on Edge */
    div::after {
      margin-top: 17px;
    }
  }
}


</style>
