<script>
import CodeExample from './demo/CodeExample';
import code from '!!raw-loader!../../ui/components/LoadMoreButton';
import LoadMoreButton from '../../ui/components/LoadMoreButton';

const codeExample = `<LoadMoreButton
      :loading="loading"
      :show-more="showMore"
      text="Show more"
      @click="onMore"
    />
`;

const pageSize = 4;
const maxLength = 11;

export default {
    components: {
        CodeExample,
        LoadMoreButton
    },
    data() {
        return {
            codeExample,
            code,
            pageSize,
            offset: pageSize,
            loading: false
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
            this.loading = true;
            setTimeout(() => {
                // simulate async loading
                this.offset = this.offset + pageSize;
                this.loading = false;
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
          <h2>Load more button</h2>
          <p>Button to use for "show more" usecases</p>
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
          <LoadMoreButton
            :loading="loading"
            :show-more="showMore"
            @click="onMore"
          />
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show LoadMoreButton.vue source code">{{ code }}</CodeExample>
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
