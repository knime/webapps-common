<script>
import CodeExample from '../demo/CodeExample.vue';
import ExpandTransition from 'webapps-common/ui/components/transitions/ExpandTransition.vue';
import Button from 'webapps-common/ui/components/Button.vue';
import code from 'webapps-common/ui/components/transitions/ExpandTransition.vue?raw';

export default {
    components: {
        ExpandTransition,
        Button,
        CodeExample
    },
    data() {
        return {
            isExpanded: false,
            codeExample: `<ExpandTransition :is-expanded="isExpanded" >
    <p>Lorem ipsum…</p>
</ExpandTransition>`
        };
    },
    computed: {
        code() {
            return code;
        }
    },
    methods: {
        onClick() {
            this.isExpanded = !this.isExpanded;
        }
    }
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <div class="grid-container demo">
          <Button
            compact
            primary
            @click="onClick"
            @keydown.space.stop.prevent="onClick"
          >
            Trigger Expand
          </Button>
          <div class="grid-item-3 content">
            <h5>Expand Transition</h5>
            <ExpandTransition
              :is-expanded="isExpanded"
            >
              <div>
                <p>Lorem ipsum…</p>
              </div>
            </ExpandTransition>
          </div>
        </div>
        <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
        <CodeExample summary="Show ExpandTransition.vue source code">{{ code }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
.demo {
  margin-bottom: 10px;
  flex-direction: column;
  align-items: flex-start;
  justify-content: flex-start;

  & button {
    margin: 10px 0;
  }
}

.content {
  background-color: var(--knime-porcelain);

  & :deep(h5) {
    padding: 15px 30px;
    margin: 0;
    position: relative;
  }

  & :deep(.panel) {
    padding: 0 30px;
  }
}
</style>
