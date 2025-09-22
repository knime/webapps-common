<script>
import { ref } from "vue";

import Carousel from "../Carousel/Carousel.vue";
/**
 * A radio button group that looks like a tab bar
 */
export default {
  name: "TabBar",
  components: {
    Carousel,
  },
  props: {
    /**
     * Make the whole tab bar read-only
     */
    disabled: {
      type: Boolean,
      default: false,
    },
    /**
     * Selected value. Should be one of the value attributes in the `possibleValues` prop.
     */
    modelValue: {
      type: String,
      default: "",
    },
    /**
     * Name of the form elements. This is useful when using the tab bar inside a <form>.
     * Defaults to `value`.
     * If you have multiple tab bars on one page, make sure to include them in separate forms or use unique `name`
     * properties. Otherwise the browser will not allow to select more than one tab in total.
     */
    name: {
      type: String,
      default: "value",
    },
    /**
     *  List of configuration for each tab. The extra component can be used to render additional
     *  information or provide additional functionality like a menu or a badge.
         * @example
           [{
              value: 'all',
              label: 'All',
              icon: null,
              title: 'everything',
              disabled: false,
              extraComponent: {
                props: ["count"],
                render() {
                  return h(
                    "span",
                    {
                      style: {
                        display: "inline-block",
                        background: "red",
                        color: "white",
                        verticalAlign: "middle",
                      },
                    },
                    this.count,
                  );
                },
              },
              extraComponentProps: {
                count: 3,
              },
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
        return items.every((item) => item.value);
      },
    },
  },
  emits: ["update:modelValue"],
  setup(props) {
    // copy needed to be able to use v-model instead of :checked attribute due to SSR hydration issues
    const localModelValue = ref(props.modelValue);
    return {
      localModelValue,
    };
  },
  watch: {
    modelValue(newValue) {
      this.localModelValue = newValue;
    },
  },
  created() {
    const availableTabs = this.possibleValues.filter((tab) => !tab.disabled);
    let initialTab = availableTabs.find((tab) => tab.value === this.modelValue);

    if (initialTab) {
      consola.trace("TabBar: Initial tab set to", initialTab);
      return;
    }

    initialTab = availableTabs[0] ?? { value: null };
    consola.trace("TabBar: Setting initial tab to", initialTab);
    this.$emit("update:modelValue", initialTab.value);
  },
  methods: {
    onChange(value) {
      /**
       * Update event. Fired when the selection is changed.
       *
       * @event update:value
       * @type {String}
       */
      consola.trace("TabBar value changed to", value);
      this.$emit("update:modelValue", value);
    },
  },
};
</script>

<template>
  <Carousel :tabindex="-1">
    <div class="tab-bar">
      <div class="overflow">
        <label
          v-for="item in possibleValues"
          :key="item.value"
          :title="item.title"
        >
          <input
            v-model="localModelValue"
            :name="name"
            :value="item.value"
            :disabled="disabled || item.disabled"
            type="radio"
            @change="onChange(item.value)"
          />
          <span class="tab">
            <Component :is="item.icon" v-if="item.icon" />
            {{ item.label }}
            <Component
              :is="item.extraComponent"
              v-if="item.extraComponent"
              v-bind="item.extraComponentProps"
              class="extra-component"
            />
          </span>
        </label>
      </div>
    </div>
  </Carousel>
</template>

<style lang="postcss" scoped>
.tab-bar {
  position: relative;
  z-index: 1; /* create local stacking context */
  display: inline-block;
  width: 100%;
  padding-top: 20px;
  padding-bottom: 20px;
  margin-top: -20px;

  & .overflow {
    height: 55px;
  }
}

:deep(.carousel::after) {
  position: absolute;
  right: var(--grid-gap-width);
  bottom: 26px;
  left: var(--grid-gap-width);
  display: block;
  content: "";
  border-bottom: 1px solid var(--knime-silver-sand);
}

label {
  position: relative;
}

input[type="radio"] {
  position: absolute;
  top: 0; /* top/left prevent right margin mobile safari */
  left: 0;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;

  /* https://accessibility.18f.gov/hidden-content/ */
  border: 0;
  clip: rect(0 0 0 0);
}

.tab {
  position: relative;
  display: inline-block;
  height: 51px;
  padding: 0 var(--space-8);
  font-size: 16px;
  font-weight: 500;
  line-height: 51px;
  color: var(--knime-dove-gray);
}

label:not(:last-child) {
  margin-right: 10px;
}

svg {
  display: inline-block;
  width: 21px;
  height: 21px;
  margin-right: 2px;
  vertical-align: -5px;
  stroke: var(--knime-dove-gray);
  stroke-width: calc(32px / 21);
}

input:disabled + span {
  color: var(--knime-silver-sand);

  & svg {
    stroke: var(--knime-silver-sand);
  }
}

input:not(:checked, :disabled) + span {
  cursor: pointer;
}

input:not(:disabled):checked + span,
input:not(:disabled) + span:hover {
  color: var(--knime-masala);

  & svg {
    stroke: var(--knime-masala);
  }
}

input:checked:not(:disabled) + span::after {
  position: absolute;
  right: 0;
  bottom: 1px;
  left: 0;
  z-index: 1; /* local stacking context because Carousel.vue has isolation: isolate; */
  display: block;
  content: "";
  border-top: 3px solid var(--knime-masala);
}
</style>
