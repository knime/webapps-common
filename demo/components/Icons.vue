<script>
import ImagePreviews from './demo/ImagePreviews';
import CodeExample from './demo/CodeExample';
import ListNumbersIcon from '../../ui/assets/img/icons/list-numbers.svg?inline';
import FolderIcon from '../../ui/assets/img/icons/folder.svg?inline';
import svgWithTitle from '../../ui/util/svgWithTitle';

const codeExample1 = `<script>
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
  :root svg {
    width: calc(var(--icon-size) * 1px);
    height: calc(var(--icon-size) * 1px);
    stroke-width: calc(32px / var(--icon-size));
  }

  #my-svg {
    --icon-size: 25;
  }
*/
</style>`;

const codeExample2 = `<script>
import ListNumbersIcon from '~/webapps-common/ui/assets/img/icons/list-numbers.svg?inline';

export default {
  components: {
    ListNumbersIcon
  }
};
<\/script>

<template>
  <ListNumbersIcon />
</template>

<style lang="postcss" scoped>
svg {
  width: 25px;
  height: 25px;
  stroke: var(--theme-color-4);
  stroke-width: calc(32px / 25); /* replace 25 with the desired display size to get 1px stroke width */

  & .text {
    stroke: none;
    fill: var(--theme-color-4);
  }

  &:hover {
    stroke: var(--theme-color-5);

    & .text {
      fill: var(--theme-color-5);
    }
  }
}

/*
  In the future the above syntax could be simplified using CSS variables, but IE11 does not support this, and
  neither does the fallback plugin:
  :root svg {
    width: calc(var(--icon-size) * 1px);
    height: calc(var(--icon-size) * 1px);
    stroke-width: calc(32px / var(--icon-size));
  }

  #my-svg {
    --icon-size: 25;
  }
*/
</style>`;

const codeExampleTooltip = `<script>
import ListNumbersIcon from '~/webapps-common/ui/assets/img/icons/list-numbers.svg?inline';
import svgWithTitle from '~/webapps-common/ui/util/svgWithTitle';

export default {
  components: {
    ListNumbersIcon: svgWithTitle(ListNumbersIcon, 'This is a list with numbers')
  }
};
<\/script>

<template>
  <ListNumbersIcon />
</template>`;

export default {
    components: {
        ListNumbersIcon,
        FolderIcon,
        ListNumbersIconWithTip: svgWithTitle(ListNumbersIcon, 'This is a list with numbers'),
        ImagePreviews,
        CodeExample,
    },
    data() {
        return {
            codeExample1,
            codeExample2,
            codeExampleTooltip
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
          <FolderIcon class="hoverStyle" /> Normal case
          <CodeExample summary="Show icon as Vue component code example">{{ codeExample1 }}</CodeExample>

          <ListNumbersIcon class="hoverStyle" /> With numbers or text (be sure to set the <code>.text</code>
            class with a fill and stroke to none)
          <CodeExample summary="Show icon with text as Vue component code example">{{ codeExample2 }}</CodeExample>

          <ListNumbersIconWithTip />
          With title via <code>webapps-common/ui/util/svgWithTitle.js</code> (hover to show the title)
          <CodeExample summary="Show icon with tooltip code example">{{ codeExampleTooltip }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

>>> .wrapper {
  margin: 0 -20px;
}

svg {
  vertical-align: middle;
  width: 50px;
  height: 50px;
  stroke-width: calc(32px / 50);
  stroke: var(--theme-color-4);

  & >>> .text {
    fill: var(--theme-color-4);
    stroke: none;
  }

  &.hoverStyle {
    stroke: var(--theme-color-6);

    & .text {
      fill: var(--theme-color-6);
    }

    &:hover {
      stroke: var(--theme-color-4);

      & .text {
        fill: var(--theme-color-4);
      }
    }
  }
}
</style>
