<script>
import { useClipboard } from "@vueuse/core";
import { FunctionButton, Tooltip } from "@knime/components";
import LinkIcon from "@knime/styles/img/icons/link.svg";
import CheckIcon from "@knime/styles/img/icons/check.svg";

export default {
  components: {
    LinkIcon,
    CheckIcon,
    FunctionButton,
    Tooltip,
  },
  props: {
    /**
     * the headline text to be displayed
     */
    title: {
      type: String,
      default: null,
    },
  },
  setup() {
    const { copy, copied } = useClipboard({
      copiedDuring: 3000, // 3s
    });
    return {
      copy,
      copied,
    };
  },
  computed: {
    tooltipText() {
      return this.copied ? "Link copied" : "Copy link";
    },
  },
  methods: {
    copyToClipboard() {
      let path = window.location.href.split("?")[0];
      const source = `${path}?q=${this.title}`;
      this.copy(source);
    },
  },
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12 header">
        <h2>
          {{ title }}
          <Tooltip :text="tooltipText">
            <FunctionButton :active="copied" @click="copyToClipboard">
              <CheckIcon v-if="copied" />
              <LinkIcon v-else />
            </FunctionButton>
          </Tooltip>
        </h2>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
h2 {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}

.function-button {
  display: none;
  padding: 0;
  margin: 5px 12px;
  align-items: center;

  &.active {
    background-color: var(--theme-color-success);
    display: block;
    opacity: 0;
    transition: opacity 2s linear;
    transition-delay: 1s;
  }
}

.header:hover {
  & .function-button {
    display: block;
  }
}

.link-icon {
  padding: 0 20px;
  margin: 0 20 px;
}

:deep(.tooltip) {
  line-height: 1.44;

  & > .text {
    top: -8px;
    z-index: 2;
  }
}
</style>
