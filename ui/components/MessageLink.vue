<script>

/**
 * Link component for use in the Message component. Minimally styled to allow reuse in the body
 * of the message, in the details or provided via slot.
 */
export default {
    props: {
        /**
         * Link configuration object. Can either be a nuxt-link (with the `to` property) or an
         * `<a... />` tag (with href).
         *
         * @example
         *    {
         *       text
         *       href (external links, will become <a></a>)
         *       to (internal links, will become <nuxt-link></nuxt-link>)
         *       newTab (will set the 'target' attribute to '_blank' to open link in new tab)
         *    }
         *
         */
        link: {
            type: Object,
            default: () => ({})
        }
    }
};
</script>

<template>
  <nuxt-link
    v-if="link.to"
    :to="link.to"
    class="message-link"
  >
    {{ ' ' + link.text }}
  </nuxt-link>
  <a
    v-else-if="link.href"
    :href="link.href"
    :target="link.newTab ? '_blank' : null"
    class="message-link"
  >
    {{ ' ' + link.text }}
  </a>
</template>

<style lang="postcss" scoped>

.message-link {
  text-decoration: underline;
  cursor: pointer;
}

</style>
