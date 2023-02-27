<script>
import { resolveNuxtLinkComponent } from '../util/nuxtComponentResolver';

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
        },
        /**
         * toggle to set disabled state on button
         */
        disabled: {
            type: Boolean,
            default: false
        }
    },
    emits: ['click'],
    computed: {
        // TODO: Can be made into a composition function
        linkComponent() {
            return resolveNuxtLinkComponent();
        },
        component() {
            if (this.to) {
                return this.linkComponent;
            } else if (this.href) {
                return 'a';
            }
            return 'button';
        },
        props() {
            if (this.to) {
                return {
                    to: this.to,
                    event: this.preventDefault ? [] : 'click'
                };
            } else if (this.href) {
                return {
                    href: this.href
                };
            }
            return {};
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
  <!-- Note: @click events also fire on keyboard activation via Enter -->
  <Component
    :is="component"
    v-bind="{...$attrs, ...props}"
    ref="button"
    @click="onClick"
  >
    <slot />
  </Component>
</template>
