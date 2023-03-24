<script>
import { useClipboard } from '@vueuse/core';
import FunctionButton from 'webapps-common/ui/components/FunctionButton.vue';
import LinkIcon from 'webapps-common/ui/assets/img/icons/link.svg';
import Tooltip from 'webapps-common/ui/components/Tooltip.vue';

export default {
    components: {
        LinkIcon,
        FunctionButton,
        Tooltip
    },
    props: {
        /**
         * the headline text to be displayed
         */
        title: {
            type: String,
            default: null
        }
    },
    setup() {
        const { copy, copied } = useClipboard();
        return {
            copy, copied
        };
    },
    computed: {
        tooltipText() {
            return this.copied ? 'Link has been copied' : 'Copy link';
        }
    },
    methods: {
        copyToClipboard() {
            let path = window.location.href.split('?')[0];
            const source = `${path}?q=${this.title}`;
            this.copy(source);
        }
    }
};

</script>

<template>
  <section>
    <div class="grid-container ">
      <div class="grid-item-12 header">
        <h2>
          {{ title }}
          <FunctionButton
            :class="{active:copied}"
            @click="copyToClipboard"
          >
            <Tooltip
              :text="tooltipText"
            >
              <LinkIcon />
            </Tooltip>
          </FunctionButton>
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
  margin-bottom: 23px;
}

 .function-button {
   display: none;
   padding: 0;
   margin: 12px;
   align-items: center;
 }

.header:hover {
  & .function-button{
    display: block;
  }
}

.link-icon {
  padding: 0 20px;
  margin: 0 20 px;
}

.tooltip >>> .text {
  margin-top: -5px;
}
</style>
