<script>
import CodeExample from './demo/CodeExample';
import SubMenu from '../../ui/components/SubMenu';
import MenuButton from '../../ui/components/MenuButton';
import menuButtonCode from '!!raw-loader!../../ui/components/MenuButton';
import MenuOptionsIcon from '../../ui/assets/img/icons/menu-options.svg?inline';
import LensIcon from '../../ui/assets/img/icons/lens.svg?inline';
import ArrowsOrderIcon from '../../ui/assets/img/icons/arrows-order.svg?inline';

const codeExample =
`<MenuButton function without-text><MenuOptionsIcon /></MenuButton>
<MenuButton function><LensIcon /><span>Function</span></MenuButton>
<MenuButton function><span>Function Menu</span><ArrowsOrderIcon /></MenuButton>
`;

export default {
    components: {
        MenuButton,
        MenuOptionsIcon,
        LensIcon,
        ArrowsOrderIcon,
        CodeExample,
        SubMenu
    },
    data() {
        return {
            menuButtonCode,
            codeExample,
            active: false,
            subMenuItems: [{
              href: 'http://apple.com',
              text: 'Apples',
            }, {
              href: 'https://en.wikipedia.org/wiki/Orange_(colour)',
              text: 'Oranges',
            },  {
              to: '/testing-nuxt-link',
              text: 'Ananas'
           }]
        };
    },
    methods: {
      onClick() {
        this.active = true;
      }
    }
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <h2>Function MenuButtons</h2>

        <!-- function menuButtons -->
        <div class="align-horizontal">
          <SubMenu :items="subMenuItems" orientation="left">
            <MenuButton :active="active">
              <MenuOptionsIcon />
            </MenuButton>
          </SubMenu>
        </div>

        <div class="align-horizontal">

          <MenuButton>
            <span>Sorter</span>
            <ArrowsOrderIcon />
          </MenuButton>

          <MenuButton active>
            <span>Sorter</span>
            <ArrowsOrderIcon />
          </MenuButton>

        </div>


        <div class="align-horizontal">
          <MenuButton function><LensIcon /><span>Function</span></MenuButton>
        </div>

        <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>

.align-horizontal {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  & > * {
    margin-right: 20px;
  }
}

</style>
