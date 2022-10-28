<script>
import { resolveNuxtLinkComponent } from '../util/nuxtComponentResolver';

export default {
    compatConfig: {
        INSTANCE_LISTENERS: false,
        COMPILER_V_BIND_OBJECT_ORDER: false
    },
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
    computed: {
        // TODO: Can be made into a composition function
        linkComponent() {
            return resolveNuxtLinkComponent();
        }
    },
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
            this.$refs.button?.focus();
        }
    }
};
</script>

<template>
  <Component
    :is="linkComponent"
    v-if="to"
    v-bind="$attrs"
    ref="button"
    :to="to"
    :event="preventDefault ? [] : 'click'"
    @click="onClick"
  >
    <slot />
  </Component>
  <!-- Note: @click events also fire on keyboard activation via Enter -->
  <a
    v-else-if="href"
    v-bind="$attrs"
    ref="button"
    :href="href"
    @click="onClick"
  >
    <slot />
  </a>
  <!-- Note: @click events also fire on keyboard activation via Space -->
  <button
    v-else
    v-bind="$attrs"
    ref="button"
    @click="onClick"
  >
    <slot />
  </button>
</template>
