<script>

import { useClipboard } from '@vueuse/core';
import FunctionButton from 'webapps-common/ui/components/FunctionButton.vue';
import LinkIcon from 'webapps-common/ui/assets/img/icons/link.svg';


const { copy } = useClipboard();

export default {

    components: {
        LinkIcon,
        FunctionButton
    },
    props: {
        /**
         * the text to be shown -- to be changed
         */
        title: {
            type: String,
            default: null
        }
    },

    methods: {
        copyToClipboard() {
            let path = window.location.href.split('?')[0];
            const source = `${path}?q=${this.title}`;
            copy(source);
        }
    }
};

</script>

<template>
  <section>
    <div class="grid-container header">
      <h2>
        {{ title }}


        <FunctionButton
          @click="copyToClipboard"
        >
          <LinkIcon />
        </FunctionButton>
      </h2>
    </div>
  </section>
</template>

<style lang="postcss" scoped>

    h2{
        display: flex;
    }

    .function-button {
        padding: 0 20px;
        margin: 15px;
        align-items: center;
    }

    .link-icon{
        padding: 0 20px;
        margin: 0 20 px;
    }

</style>
