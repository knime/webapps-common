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
            active1: false,
            active2: false,
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
      toggleMenu(mode, id) {
        this['active' + id] = mode === 'open';
      }
    }
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <h2>Menu Toggles</h2>
         <p>
            Menu toggles are mostly decorative. They have an active state, which needs to be set by parent
            components, e.g. a Submenu.
          </p>
        <div class="align-horizontal">

          <button>
            <MenuToggle function><LensIcon /><span>Function</span></MenuToggle>
          </button>

          <SubMenu
            class="demo1"
            :items="subMenuItems"
            @menu-open="toggleMenu('open', 1)"
            @menu-close="toggleMenu('close', 1)"
            orientation="left"
          >
            <MenuToggle :active="active1" >
              <MenuOptionsIcon />
            </MenuToggle>
          </SubMenu>

          <SubMenu
            class="demo2"
            :items="subMenuItems"
            @menu-open="toggleMenu('open', 2)"
            @menu-close="toggleMenu('close', 2)"
            orientation="left"
          >
            <MenuToggle :active="active2">
              <span>Sorter</span>
              <ArrowsOrderIcon />
            </MenuToggle>
          </SubMenu>

        </div>

        <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>

.demo2 >>> ul {
  margin-top: 0;
  width: 100%;
}

/* Native button style reset */
button {
  border: none;
  margin: 0;
  padding: 0;
  width: auto;
  overflow: visible;
  background: transparent;
  -webkit-appearance: none;
}

.align-horizontal {
  display: flex;
  align-items: center;
  margin-bottom: 10px;

  & > * {
    margin-right: 20px;
  }
}

</style>
