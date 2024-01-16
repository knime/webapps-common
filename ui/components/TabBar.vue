<script>
import Carousel from "./Carousel.vue";

/**
 * A radio button group that looks like a tab bar
 */
export default {
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
        return items.every((item) => item.value);
      },
    },
  },
  emits: ["update:modelValue"],
  created() {
    const availableTabs = this.possibleValues.filter((tab) => !tab.disabled);
    let initialTab = availableTabs.find((tab) => tab.value === this.modelValue);

    if (initialTab) {
      consola.trace("TabBar: Initial tab set to", initialTab);
      return;
    }

    initialTab = availableTabs.find((tab) => !tab.disabled);
    consola.trace("TabBar: Setting initial tab to", initialTab);
    this.$emit("update:modelValue", initialTab ? initialTab.value : null);
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
  <Carousel>
    <div class="tab-bar">
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
            :checked="item.value === modelValue"
            @change="onChange(item.value)"
          />
          <span>
            <Component :is="item.icon" v-if="item.icon" />
            {{ item.label }}
          </span>
        </label>
      </div>
    </div>
  </Carousel>
</template>

<style lang="postcss" scoped>
.tab-bar {
  width: 100%;
  position: relative;
  margin-top: -20px;
  padding-top: 20px;
  padding-bottom: 20px;
  display: inline-block;
  z-index: 1; /* create local stacking context */

  & .overflow {
    height: 55px;
  }
}

:deep(.carousel::after) {
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
  content: "";
  position: absolute;
  display: block;
  bottom: 1px;
  left: 0;
  right: 0;
  border-top: 3px solid var(--knime-masala);
  z-index: 1; /* local stacking context because Carousel.vue has isolation: isolate; */
}
</style>
