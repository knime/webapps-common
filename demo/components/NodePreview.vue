<script>
/* eslint-disable max-len */
import CodeExample from './demo/CodeExample';
import NodePreview from '../../ui/components/node/NodePreview';
import code from '!!raw-loader!../../ui/components/node/NodePreview';

export default {
    components: {
        NodePreview,
        CodeExample
    },
    data() {
        return {
            codeExample: `<NodePreview v-bind="{
    hasDynPorts: false,
    isComponent: true,
    type: 'Sink',
    inPorts: [
        { dataType: 'table' }
    ],
    outPorts: [
        { dataType: 'other', color: '#1eb9dc' },
        { dataType: 'table' },
        { dataType: 'table', optional: true }
    ],
    icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAsklEQVR4nGNgoBUwMDBwMDIyakDGIDFiNAqAFJuYmGAoBoonAPEEoBoFilwHNLyeaEMMIEABTUzA2Nh4PooA0Gn12JwN8jc2cZAYWBxoUgBQcwGQnoBiKgEDYGEFF4CGsgIooIgxAKYHOweLTegGE20AkkEGQC+uRzNgApwDDxQiAchFGOpRTMTvGlA0YqqFBmIBIc2wAMelQAFo+n5s6R4kBrKZqFQITR8omYmUMCIaAAD0RELelYkiBgAAAABJRU5ErkJggg=='
}" />`,
            nodePreview: {
                hasDynPorts: true,
                isComponent: false,
                type: 'Sink',
                inPorts: [
                    { dataType: 'table' }
                ],
                outPorts: [
                    { dataType: 'other', color: '#1eb9dc'  },
                    { dataType: 'table' },
                    { dataType: 'table', optional: true }
                ],
                icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAsklEQVR4nGNgoBUwMDBwMDIyakDGIDFiNAqAFJuYmGAoBoonAPEEoBoFilwHNLyeaEMMIEABTUzA2Nh4PooA0Gn12JwN8jc2cZAYWBxoUgBQcwGQnoBiKgEDYGEFF4CGsgIooIgxAKYHOweLTegGE20AkkEGQC+uRzNgApwDDxQiAchFGOpRTMTvGlA0YqqFBmIBIc2wAMelQAFo+n5s6R4kBrKZqFQITR8omYmUMCIaAAD0RELelYkiBgAAAABJRU5ErkJggg=='
            },
            componentPreview: {
                hasDynPorts: false,
                isComponent: true,
                type: 'Sink',
                inPorts: [
                    { dataType: 'table' }
                ],
                outPorts: [
                    { dataType: 'other', color: '#1eb9dc' },
                    { dataType: 'table' },
                    { dataType: 'table', optional: true }
                ],
                icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAsklEQVR4nGNgoBUwMDBwMDIyakDGIDFiNAqAFJuYmGAoBoonAPEEoBoFilwHNLyeaEMMIEABTUzA2Nh4PooA0Gn12JwN8jc2cZAYWBxoUgBQcwGQnoBiKgEDYGEFF4CGsgIooIgxAKYHOweLTegGE20AkkEGQC+uRzNgApwDDxQiAchFGOpRTMTvGlA0YqqFBmIBIc2wAMelQAFo+n5s6R4kBrKZqFQITR8omYmUMCIaAAD0RELelYkiBgAAAABJRU5ErkJggg=='
            }
        };
    },
    computed: {
        code() {
            return code;
        }
    }
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h2>NodePreview</h2>
          <p>
            A component that draws a Node (left, with dynamic ports) or a Component (right).
          </p>
        </div>
      </div>
      <div class="grid-container page-content">
        <div>
          <NodePreview v-bind="nodePreview" />
        </div>
        <div>
          <NodePreview v-bind="componentPreview" />
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show NodePreview.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.page-content {
  justify-content: flex-start;

  & > div {
    outline: 2px dotted purple;
    margin-right: 20px;

    & svg {
      width: 130px;
    }
  }
}

</style>
