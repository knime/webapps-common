<script>
import ImagePreviews from './demo/ImagePreviews.vue';
import CodeExample from './demo/CodeExample.vue';
import ListNumbersIcon from 'webapps-common/ui/assets/img/icons/list-numbers.svg';
import FolderIcon from 'webapps-common/ui/assets/img/icons/folder.svg';
import svgWithTitle from 'webapps-common/ui/util/svgWithTitle';
import InputField from 'webapps-common/ui/components/forms/InputField.vue';

const codeExample1 = `<script>
import FolderIcon from '~/webapps-common/ui/assets/img/icons/folder.svg';

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
  stroke: var(--knime-masala);
  stroke-width: calc(32px / 25); /* replace 25 with the desired display size to get 1px stroke width */

  &:hover {
    stroke: var(--knime-porcelain);
  }
}

/*
  This should work as well now as IE11 was dropped:

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
import ListNumbersIcon from '~/webapps-common/ui/assets/img/icons/list-numbers.svg';

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
  stroke: var(--knime-masala);
  stroke-width: calc(32px / 25); /* replace 25 with the desired display size to get 1px stroke width */

  & .text {
    stroke: none;
    fill: var(--knime-masala);
  }

  &:hover {
    stroke: var(--knime-porcelain);

    & .text {
      fill: var(--knime-porcelain);
    }
  }
}

/*
  TODO HUB-1985: This should work as well now as IE11 was dropped:

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
import ListNumbersIcon from '~/webapps-common/ui/assets/img/icons/list-numbers.svg';
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
        InputField
    },
    data() {
        return {
            codeExample1,
            codeExample2,
            codeExampleTooltip,
            iconFilterTerm: ''
        };
    },
    computed: {
        icons() {
            const files = import.meta.glob('@@/../ui/assets/img/icons/*.svg', { as: 'url', eager: true });

            return Object.keys(files).map(file => ({
                name: file.replace('../ui/assets/img/icons/', ''),
                src: files[file]
            }));
        },
        filteredIcons() {
            return this.icons.filter(icon => icon.name.includes(this.iconFilterTerm));
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
          <InputField
            v-model="iconFilterTerm"
            class="filter-icons-input"
            type="text"
            placeholder="Filter Icons"
          />
          <ImagePreviews
            :images="filteredIcons"
            width="60px"
            height="60px"
          />
          <p>
            The SVG icons have an original size of 32x32px. It's recommended to inline the icons as Vue components which
            also supports to change e.g. the stroke color and width via CSS:
          </p>
          <FolderIcon class="hover" /> Normal case
          <CodeExample summary="Show icon as Vue component code example">{{ codeExample1 }}</CodeExample>

          <ListNumbersIcon class="hover" /> With numbers or text (be sure to set the <code>.text</code>
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
:deep(.wrapper) {
  margin: 0 -20px;
}

.filter-icons-input {
  width: 400px;
  margin-bottom: 30px;
}

svg {
  vertical-align: middle;
  width: 50px;
  height: 50px;
  stroke-width: calc(32px / 50);
  stroke: var(--knime-masala);

  & :deep(.text) {
    fill: var(--knime-masala);
    stroke: none;
  }

  &.hover {
    stroke: var(--knime-silver-sand);

    & .text {
      fill: var(--knime-silver-sand);
    }

    &:hover {
      stroke: var(--knime-masala);

      & .text {
        fill: var(--knime-masala);
      }
    }
  }
}
</style>
