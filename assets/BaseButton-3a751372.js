const n=`<script lang="ts">
import { defineComponent } from "vue";
import { resolveNuxtLinkComponent } from "../util/nuxtComponentResolver";

export default defineComponent({
  props: {
    /**
     * If set, the button renders an <a> element instead of a <button> element
     * Has no effect when used together with \`to\`.
     */
    href: {
      type: String,
      default: "",
    },
    /**
     * If set, the button renders a <nuxt-link> instead of a <button> element.
     * Supersedes the \`href\` property.
     */
    to: {
      type: String,
      default: "",
    },
    /**
     * toggle to prevent default click handler
     */
    preventDefault: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["click"],
  computed: {
    // TODO: Can be made into a composition function
    component() {
      if (this.to) {
        return resolveNuxtLinkComponent();
      }

      if (this.href) {
        return "a";
      }

      return "button";
    },
    dynamicProps() {
      if (this.to) {
        return {
          to: this.to,
          event: this.preventDefault ? [] : "click",
        };
      }

      if (this.href) {
        return {
          href: this.href,
        };
      }

      return {};
    },
  },
  methods: {
    onClick(e: MouseEvent) {
      this.$emit("click", e);

      if (this.preventDefault) {
        e.preventDefault();
      }
    },
    // This can be called from outside via focus on a $ref
    focus() {
      // eslint-disable-next-line no-extra-parens
      (this.$refs.button as HTMLButtonElement)?.focus();
    },
  },
});
<\/script>

<template>
  <!-- Note: @click events also fire on keyboard activation via Enter -->
  <Component
    :is="component"
    v-bind="{ ...$attrs, ...dynamicProps }"
    ref="button"
    @click="onClick"
  >
    <slot />
  </Component>
</template>
`;export{n as b};
