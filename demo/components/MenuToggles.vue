<script>
import CodeExample from './demo/CodeExample';
import SubMenu from '../../ui/components/SubMenu';
import MenuToggle from '../../ui/components/MenuToggle';
import menuToggleCode from '!!raw-loader!../../ui/components/MenuToggle';
import MenuOptionsIcon from '../../ui/assets/img/icons/menu-options.svg?inline';
import LensIcon from '../../ui/assets/img/icons/lens.svg?inline';
import ArrowsOrderIcon from '../../ui/assets/img/icons/arrows-order.svg?inline';

const codeExample =
`
<button>
  <MenuToggle :active="active">
    <LensIcon />
    <span>Function</span>
  </MenuToggle>
</button>

<SubMenu>
  <MenuToggle :active="active">
    <MenuOptionsIcon />
  </MenuToggle>
</SubMenu>

<SubMenu>
  <MenuToggle :active="active2">
    <span>Sorter</span>
    <ArrowsOrderIcon />
  </MenuToggle>
</SubMenu>
`;

export default {
    components: {
        MenuToggle,
        MenuOptionsIcon,
        LensIcon,
        ArrowsOrderIcon,
        CodeExample,
        SubMenu
    },
    data() {
        return {
            menuToggleCode,
            codeExample,
            focused0: false,
            active1: false,
            active2: false,
            subMenuItems: [{
                href: 'http://apple.com',
                text: 'Apples'
            }, {
                href: 'https://en.wikipedia.org/wiki/Orange_(colour)',
                text: 'Oranges'
            },  {
                to: '/testing-nuxt-link',
                text: 'Ananas'
            }]
        };
    }
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <h2>Menu Toggles</h2>
        <p>
          Works with an icon &amp; text combination or a single icon.
        </p>
        <div class="align-horizontal">
          <MenuToggle :active="focused0"><LensIcon /><span>Function</span></MenuToggle>
        </div>

        <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
        <CodeExample summary="Show MenuToggle.vue source code">{{ menuToggleCode }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.align-horizontal {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  & > * {
    margin-right: 20px;
  }
}

</style>
