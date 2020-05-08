<script>
import CodeExample from './demo/CodeExample';
import code from '!!raw-loader!../../ui/components/IdleReadyButton';
import IdleReadyButton from '../../ui/components/IdleReadyButton';

const codeExample = `<IdleReadyButton
  :idle="ready"
  :show="showMore"
  text="Show more"
  @click="onMore"
/>`;

const pageSize = 4;
const maxLength = 11;

export default {
    components: {
        CodeExample,
        IdleReadyButton
    },
    data() {
        return {
            codeExample,
            code,
            pageSize,
            offset: pageSize,
            idle: false
        };
    },
    computed: {
        demoItems() {
            const demoItems = [];
            for (let index = 0; index < this.offset; index++) {
                demoItems.push({
                    name: `Item-${index + 1}`
                });
            }
            return demoItems;
        },
        showMore() {
            return this.offset < maxLength;
        }
    },
    methods: {
        onMore() {
            this.idle = true;
            setTimeout(() => {
                // simulate async idle
                this.offset = this.offset + pageSize;
                this.idle = false;
            }, 1000);
        }
    }
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h2>Idle-ready button</h2>
          <p>Button with two states:</p>
          <ul>
            <li>idle (e.g. while loading)</li>
            <li>and ready</li>
          </ul>
          <p>Ready and idle states are set with props, as well as the idle text and ready text.</p>
        </div>
      </div>
    </section>
    <section class="demo">
      <div class="grid-container">
        <div class="grid-item-12">
          <ul>
            <li
              v-for="(item, index) in demoItems"
              :key="index"
            >
              {{ item.name }}
            </li>
          </ul>
          <IdleReadyButton
            :ready="showMore"
            :idle="idle"
            @click="onMore"
          />
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show IdleReadyButton.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="postcss">
@import "../../ui/css/variables";

.demo {
  background: var(--theme-color-porcelain);

  & .grid-item-12 {
    padding-bottom: 2em;
  }

  & ul {
    list-style-type: none;
    padding: 15px 0 0 0;
    margin: 0;
  }

  & li {
    height: 30px;
    background-color: var(--theme-color-white);
    padding: 5px 10px;
    margin-bottom: 5px;
  }
}

</style>
