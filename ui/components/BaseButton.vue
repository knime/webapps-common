<script>
export default {
    props: {
        /**
         * If set, the button renders an <a> element instead of a <button> element
         * When used together with `to`, the `href` attribute is passed to <nuxt-link>.
         */
        href: {
            type: String,
            default: ''
        },
        /**
         * If set, the button renders a <nuxt-link> instead of a <button> element.
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
    computed: {
        component() {
            if (this.to) {
                return 'nuxt-link';
            } else if (this.href) {
                return 'a';
            } else {
                return 'button';
            }
        }
    },
    methods: {
        onClick(e) {
            /* anchor tags can act as buttons without href and space key should work */
            if (e.code === 'Space' && this.href) {
                return false;
            }
            /**
             * Click event. Fired when the button is clicked.
             *
             * @event click
             */
            this.$emit('click', e);
            if (this.preventDefault) {
                e.preventDefault();
                return false;
            }
        },
        focus() {
            /** This can be called from outside via focus on a $ref */
            this.$el.focus();
        }
    }
};
</script>
<template>
  <!-- see https://stackoverflow.com/a/41476882/5134084 for the `.native` in `@click.native`  -->
  <nuxt-link
    v-if="component === 'nuxt-link'"
    :to="to"
    :event="preventDefault ? [] : 'click'"
    @click.native="onClick"
  >
    <slot />
  </nuxt-link>
  <!--"@keydown.enter.self.prevent" needed to silence 'enter' key events which incorrectly fire w/ @click.
      On native <button> elem, click event cannot be differentiated as enter or click (Vue issue). -->
  <button
    v-else-if="component === 'button'"
    @click="onClick"
    @keydown.space="onClick"
    @keydown.enter.self.prevent
  >
    <slot />
  </button>
  <a
    v-else
    :href="href"
    @click="onClick"
    @keydown.enter="onClick"
    @keydown.space="onClick"
  >
    <slot />
  </a>
</template>

