import{C as _}from"./CodeExample-d75a8ba9.js";import{S as f}from"./SubMenu-c41093b0.js";import{H as b,S as g}from"./star-14468fba.js";import{H as I,L as x}from"./heart-cc788f23.js";import{M}from"./menu-options-e36d0ba7.js";import{_ as y,m as a,r as l,o as k,c as S,b as e,d as n,w as o,e as v,t as w,p as O,f as T}from"./index-4ac92318.js";const E=`<script>
import { createPopper } from '@popperjs/core/dist/esm';
import FunctionButton from './FunctionButton.vue';
import MenuItems from './MenuItems.vue';

const BLUR_TIMEOUT = 1;

/**
 * SubMenu offers shows a Button with a submenu based on MenuItems.
 * It offers an orientation where the menu appears (top, left, right)
 */
export default {
    components: {
        FunctionButton,
        MenuItems
    },
    props: {
        /**
         * Items to be listed in the menu.
         * See MenuItems for more details.
         */
        items: {
            type: Array,
            required: true
        },
        /**
         * Identifier for click handler
         */
        id: {
            type: String,
            default: ''
        },
        /**
         * Button title
         */
        buttonTitle: {
            type: String,
            default: ''
        },
        /**
         * Alignment of the submenu with the menu button left or right. Defaults to 'right'.
         */
        orientation: {
            type: String,
            default: 'right',
            validator(orientation = 'right') {
                return ['right', 'left', 'top'].includes(orientation);
            }
        },
        /**
         * Disable SubMenu
         */
        disabled: {
            type: Boolean,
            default: false
        },
        /**
         * Set max-width for the menu and truncate larger text
         */
        maxMenuWidth: {
            type: Number,
            default: null
        },
        /**
         * Allow overflow of the popper on the main axis regarding the SubMenu Button
         */
        allowOverflowMainAxis: {
            type: Boolean,
            default: false
        }
    },
    emits: ['item-click'],
    data() {
        return {
            expanded: false
        };
    },
    computed: {
        popperPlacement() {
            const placementMap = {
                right: 'bottom-end',
                top: 'top-end',
                left: 'bottom-start'
            };
            return placementMap[this.orientation];
        }
    },
    watch: {
        orientation() {
            this.setPopperOrientation();
        }
    },
    mounted() {
        this.activatePopper();
    },
    beforeUnmount() {
        this.destroyPopper();
    },
    methods: {
        activatePopper() {
            const referenceEl = this.$refs.submenu;
            const targetEl = this.$refs['menu-wrapper'];

            this.popperInstance = createPopper(referenceEl, targetEl, {
                placement: this.popperPlacement,
                modifiers: [{
                    name: 'preventOverflow',
                    options: { mainAxis: !this.allowOverflowMainAxis }
                }]
            });
        },
        setPopperOrientation() {
            if (!this.popperInstance) {
                return;
            }

            this.popperInstance.setOptions({
                placement: this.popperPlacement
            });
        },
        destroyPopper() {
            if (this.popperInstance) {
                this.popperInstance.destroy();
            }
        },
        /**
         * Close the menu if item was clicked (or activated by keyboard)
         *
         * @param {Object} event - browser event.
         * @param {Object} item - submenu item which was clicked.
         * @returns {undefined}
         * @emits {item-click}
         */
        onItemClick(event, item) {
            this.$emit('item-click', event, item, this.id);
            this.closeMenu();
        },
        toggleMenu() {
            this.expanded = !this.expanded;
            this.popperInstance.update();

            setTimeout(() => {
                if (this.$refs['submenu-toggle']) {
                    this.$refs['submenu-toggle'].focus();
                }
            }, BLUR_TIMEOUT);
        },
        /**
         * Handle arrow key "up" events.
         *
         * @param {Event} e
         * @returns {undefined}
         */
        onUp(e) {
            if (this.orientation !== 'top' && document.activeElement === this.$refs['submenu-toggle'].$el) {
                return;
            }
            this.$refs.menuItems.onArrowUpKey(e);
        },
        /**
         * Handle arrow key "down" events.
         *
         * @param {Event} e
         * @returns {undefined}
         */
        onDown(e) {
            if (this.orientation === 'top' && document.activeElement === this.$refs['submenu-toggle'].$el) {
                return;
            }
            this.$refs.menuItems.onArrowDownKey(e);
        },
        /**
         * Handle focus leaving events.
         * NOTE: focusout bubbles, so we can use this event to close menu.
         * @return {undefined}
         */
        onFocusOut() {
            setTimeout(() => {
                const menuItems = this.$refs.menuItems;
                if (menuItems && menuItems.$el && !menuItems.$el.contains(document.activeElement)) {
                    this.closeMenu(false);
                }
            }, BLUR_TIMEOUT);
        },
        /**
         * Handle closing the menu.
         *
         * @param {Boolean} [refocusToggle = true] - if the toggle button should be re-focused after closing.
         * @return {undefined}
         */
        closeMenu(refocusToggle = true) {
            setTimeout(() => {
                this.expanded = false;
                if (refocusToggle && this.$refs['submenu-toggle']) {
                    this.$refs['submenu-toggle'].focus();
                }
            }, BLUR_TIMEOUT);
        },
        /**
         * Manually prevents default event bubbling and propagation for methods which fire blur/focusout events that
         * interfere with the refocusing behavior. This allows the timeout to be set extremely low.
         * @param {Event} event
         * @return {undefined}
         */
        onPreventEvent(event) {
            event.preventDefault();
            event.stopPropagation();
            event.stopImmediatePropagation();
        }
    }
};
<\/script>

<template>
  <div
    ref="submenu"
    :class="['submenu', { disabled }]"
    @keydown.esc.stop.prevent="closeMenu"
    @keydown.up.stop.prevent="onUp"
    @keydown.down.stop.prevent="onDown"
    @focusout.stop="onFocusOut"
    @mousedown="onPreventEvent"
  >
    <FunctionButton
      ref="submenu-toggle"
      aria-haspopup="true"
      type="button"
      :title="buttonTitle"
      :class="['submenu-toggle', { expanded }]"
      :aria-expanded="String(expanded)"
      :disabled="disabled"
      :active="expanded"
      @click.stop.prevent="toggleMenu"
      @keydown.enter="onPreventEvent"
    >
      <slot />
    </FunctionButton>
    <div
      ref="menu-wrapper"
      :class="['menu-wrapper', { expanded }, { disabled } ]"
    >
      <MenuItems
        :id="id"
        ref="menuItems"
        :class="['menu-items', \`orient-\${orientation}\`]"
        :items="items"
        :max-menu-width="maxMenuWidth"
        aria-label="sub menu"
        @item-click="onItemClick"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.menu-items {
  box-shadow: 0 1px 4px 0 var(--knime-gray-dark-semi);
}

.menu-wrapper {
  position: absolute;
  display: none;
  z-index: var(--z-index-common-menu-items-expanded, 57);

  &.expanded {
    display: block;
  }

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}
</style>
`;const B=`<script>
import SubMenu from '~/webapps-common/ui/components/SubMenu.vue';
import MenuIcon from '~/webapps-common/ui/assets/img/icons/menu-options.svg';

const subMenuItems = [{
    href: 'http://apple.com',
    text: 'Apples',
    icon: HelpIcon,
    hotkeyText: 'Ctrl + 1'
}, {
    href: 'https://en.wikipedia.org/wiki/Orange_(colour)',
    text: 'Oranges',
    icon: StarIcon,
    hotkeyText: 'Ctrl + 2'
}, {
    href: 'about:blank',
    text: 'Disabled Item',
    disabled: true,
    icon: StarIcon,
    hotkeyText: 'Ctrl + 3'
}, {
    to: '/testing-nuxt-link',
    text: 'Ananas',
    icon: HeartIcon
}, {
    href: 'https://www.urbandictionary.com/define.php?term=go%20bananas',
    text: 'Bananas',
    icon: LeaveIcon
}, {
    text: 'Item without href/to',
    icon: HelpIcon
}];

export default {
    components: {
        SubMenu,
        MenuIcon
    },
    data() {
        return {
            subMenuItems
        };
    }
};
<\/script>

<template>
  <nav>
    <SubMenu
      :items="subMenuItems"
      orientation="left"
      button-title="Open my submenu with icons"
    >
  </nav>
</template>

<style lang="postcss" scoped>
nav {
  display: flex;

  & :deep(.submenu-toggle:hover),
  & :deep(.submenu-toggle:focus),
  &:focus-within :deep(.submenu-toggle) {
    color: var(--knime-white);
    background-color: var(--knime-masala);

    & svg {
      stroke: var(--knime-white);
    }
  }
}
</style>
`,d=[{href:"http://apple.com",text:"Apples",icon:a(b),hotkeyText:"Ctrl + 1"},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:a(g),hotkeyText:"Ctrl + 2"},{href:"about:blank",text:"Disabled Item",disabled:!0,icon:a(g),hotkeyText:"Ctrl + 3"},{to:"/testing-nuxt-link",text:"Ananas",icon:a(I)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:a(x)},{text:"Item without href/to",icon:a(b)}],P={components:{SubMenu:f,CodeExample:_,MenuIcon:M},data(){return{SubMenu:f,subMenuItems:d,codeExampleStandalone:B,code:E}},computed:{subMenuItemsWithSeparator(){return d.map((t,u)=>u===2||u===4?{...t,separator:!0}:t)},subMenuItemsWithoutIcons(){return d.map(({icon:t,hotkeyText:u,...m})=>m)}}},s=t=>(O("data-v-d6a15b16"),t=t(),T(),t),C={class:"grid-container"},$={class:"grid-item-12"},A=s(()=>e("h2",null,"SubMenu",-1)),U=s(()=>e("p",null," A button that opens a dropdown menu containing clickable items. The menu will be positioned based on the orientation prop but will readjust automatically depending on available space. Resize window and/or scroll to try it out ",-1)),H={class:"submenus"},D={class:"card"},W=s(()=>e("span",{class:"menu-name"},"Normal",-1)),F={class:"card"},L=s(()=>e("span",{class:"menu-name"},"Orientation left",-1)),N={class:"card"},R=s(()=>e("span",{class:"menu-name"},"Orientation top",-1)),j={class:"card"},z=s(()=>e("span",{class:"menu-name"},"Disabled submenu",-1)),V={class:"card"},K=s(()=>e("span",{class:"menu-name"},"Normal (reduced width)",-1));function q(t,u,m,G,c,p){const i=l("MenuIcon"),r=l("SubMenu",!0),h=l("CodeExample");return k(),S("section",null,[e("div",C,[e("div",$,[A,U,e("div",H,[e("div",D,[W,n(r,{items:p.subMenuItemsWithSeparator,"button-title":"Open my submenu"},{default:o(()=>[n(i,{class:"open-icon"})]),_:1},8,["items"])]),e("div",F,[L,n(r,{items:p.subMenuItemsWithSeparator,orientation:"left","button-title":"Open my submenu with icons"},{default:o(()=>[n(i,{class:"open-icon"})]),_:1},8,["items"])]),e("div",N,[R,n(r,{items:p.subMenuItemsWithSeparator,orientation:"top","button-title":"Open my submenu with icons"},{default:o(()=>[n(i,{class:"open-icon"})]),_:1},8,["items"])]),e("div",j,[z,n(r,{items:c.subMenuItems,disabled:"","button-title":"Open my submenu with icons"},{default:o(()=>[n(i,{class:"open-icon"})]),_:1},8,["items"])]),e("div",V,[K,n(r,{items:p.subMenuItemsWithoutIcons,"max-menu-width":100,"button-title":"Open my submenu"},{default:o(()=>[n(i,{class:"open-icon"})]),_:1},8,["items"])])]),n(h,{summary:"Show usage example"},{default:o(()=>[v(w(c.codeExampleStandalone),1)]),_:1}),n(h,{summary:"Show SubMenu.vue source code"},{default:o(()=>[v(w(c.code),1)]),_:1})])])])}const ne=y(P,[["render",q],["__scopeId","data-v-d6a15b16"]]);export{ne as default};
