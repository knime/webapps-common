<script>
export default {
    props: {
        /**
         * If set, the button renders an <a> element instead of a <button> element
         * Has no effect when used together with `to`.
         */
        href: {
            type: String,
            default: ''
        },
        /**
         * If set, the button renders a <nuxt-link> instead of a <button> element.
         * Supersedes the `href` property.
         */
        to: {
            type: String,
            default: ''
        },
        /**
         * toggle to prevent default click handler
         */
        preventDefault: {
            type: Boolean,
            default: false
        }
    },
    emits: ['click'],
    methods: {
        onClick(e) {
            /**
             * Click event. Fired when the button is clicked.
             *
             * @event click
             */
            this.$emit('click', e);
            if (this.preventDefault) {
                e.preventDefault();
            }
        },
        // This can be called from outside via focus on a $ref
        focus() {
            this.$refs.button?.focus?.();
        }
    }
};
</script>

<template>
  <nuxt-link
    v-if="to"
    ref="button"
    v-bind="$attrs"
    :to="to"
    :event="preventDefault ? [] : 'click'"
    @click="onClick"
  >
    <slot />
  </nuxt-link>
  <!-- Note: @click events also fire on keyboard activation via Enter -->
  <a
    v-else-if="href"
    ref="button"
    v-bind="$attrs"
    :href="href"
    @click="onClick"
  >
    <slot />
  </a>
  <!-- Note: @click events also fire on keyboard activation via Space -->
  <button
    v-else
    ref="button"
    v-bind="$attrs"
    @click="onClick"
  >
    <slot />
  </button>
</template>
