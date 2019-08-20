<script>
export default {
    props: {
        disabled: {
            type: Boolean,
            default: false
        },
        value: {
            type: String,
            default: ''
        },
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
               disabled: false
           }, {
               value: 'nodes',
               label: 'Nodes',
               icon: NodeIcon,
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
            default: () => []
        }
    },
    data() {
        return {
            selected: this.value
        };
    },
    watch: {
        value(newSelected) {
            this.selected = newSelected;
        }
    },
    methods: {
        onChange() {
            this.$emit('update:value', this.selected);
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
        this.activeTab = this.initialTab;
    }
};
</script>

<template>
  <div>
    <label
      v-for="item in possibleValues"
      :key="item.value"
    >
      <input
        v-model="selected"
        type="radio"
        :name="name"
        :value="item.value"
        :disabled="disabled || item.disabled"
        @change="onChange"
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
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

div {
  border-bottom: 1px solid var(--theme-color-6);
  margin-bottom: 20px;
  height: 50px;
}

input[type="radio"] {
  /* https://a11yproject.com/posts/how-to-hide-content/ */
  position: absolute;
  height: 1px;
  width: 1px;
  overflow: hidden;
  clip: rect(1px, 1px, 1px, 1px);
}

span {
  font-size: 16px;
  font-weight: 500;
  margin-right: 20px;
  padding: 0 10px;
  display: inline-block;
  height: 51px;
  line-height: 51px;
  color: var(--theme-color-7);
}

svg {
  display: inline-block;
  vertical-align: -5px;
  width: 21px;
  height: 21px;
  margin-right: 2px;
  stroke: var(--theme-color-7);
  stroke-width: calc(32px / 21);
}

input:disabled + span {
  color: var(--theme-color-6);

  & svg {
    stroke: var(--theme-color-6);
  }
}

input:checked + span,
input:not(:disabled) + span:hover {
  color: var(--theme-color-4);

  & svg {
    stroke: var(--theme-color-4);
  }
}

input:checked:not(:disabled) + span {
  border-bottom: 3px solid var(--theme-color-4);
}

input:not(:checked):not(:disabled) + span {
  cursor: pointer;
}

</style>
