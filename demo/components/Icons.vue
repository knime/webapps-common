<script>
import ImagePreviews from './demo/ImagePreviews';
import CodeExample from './demo/CodeExample';

export default {
    components: {
        ImagePreviews,
        CodeExample
    },
    data() {
        return {
            codeExample: `<script>
import FolderIcon from '~/webapps-common/ui/assets/img/icons/folder.svg?inline';

export default {
  components: {
    FolderIcon
  }
};
<\/script>

<template>
  <FolderIcon />
</template>

<style lang="postcss" scoped>
svg {
  width: 25px;
  height: 25px;
  stroke: var(--theme-color-4);
  stroke-width: calc(32px / 25); /* replace 25 with the desired display size to get 1px stroke width */

  &:hover {
    stroke: var(--theme-color-5);
  }
}

/*
  In the future the above syntax could be simplified using CSS variables, but IE11 does not support this, and
  neither does the fallback plugin:
  svg {
    width: calc(var(--icon-size) * 1px);
    height: calc(var(--icon-size) * 1px);
    stroke-width: calc(32px / var(--icon-size));
  }
*/
</style>`
        };
    },
    computed: {
        icons() {
            const components = require.context('webapps-common/ui/assets/img/icons', false, /.svg$/);
            return components.keys().sort().map(x => ({
                name: x.replace('./', ''),
                src: components(x)
            }));
        }
    }
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h2>Icons</h2>
          <ImagePreviews
            :images="icons"
            width="60px"
            height="60px"
          />
          <p>
            The SVG icons have an original size of 32x32px. It's recommended to inline the icons as Vue components which
            also supports to change e.g. the stroke color and width via CSS:
          </p>
          <CodeExample summary="Show icon as Vue component code example">{{ codeExample }}</CodeExample>
          <p>Use <code>webapps-common/ui/util/svgWithTitle.js</code> to add a tooltip to the SVG.</p>
        </div>
      </div>
    </section>
  </div>
</template>
