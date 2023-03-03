import{C as k}from"./CodeExample-334ef8e4.js";import{M as h,H as b,L as g}from"./heart-6bb234eb.js";import{H as p,S as f}from"./star-367d052e.js";import{_ as w,m as l,o as y,c as _,b as e,d as s,t as d,w as v,e as I,r as x,p as E,f as C}from"./index-16ba5cb9.js";const A=`<script>
/**
 * MenuItems component with keyboard navigation and (optional) hotkey text and icons
 * Can be used to create a float-able menu or a sub menu or similar.
 * Position and visibility needs to be handled by the wrapper.
 *
 * A click or activation by keyboard (enter and space) emits \`@item-click\`.
 * If the data has a to attribute the used tag will be \`nuxt-link\` if it has a \`href\` attribute it will be a \`a\` tag
 * otherwise we use the generic \`button\` and leave the handling of the action to the wrapping component that reacts
 * to \`item-click\` and calls any action.
 *
 * Hovering or focusing an item emits \`@item-active\`.
 *
 * By default keyboard navigation wraps around top and bottom.
 * This can be disabled by calling preventDefault on the the events \`@top-reached\` and \`@bottom-reached\`
 */
export default {
    props: {
        /**
         * Items to be listed in the menu.
         * Each item has a \`text\`, optional \`title\`, optional \`icon\` and optional \`to\` / \`href\` properties,
         * where \`to\` is for router-links and \`href\` for standard (e.g. external) links.
         * Items can be disabled with the 'disabled' property.
         * The optional title will be shown on menu items on hover
         * The optional hotkeyText is shown aligned right besides the text if the prop 'showHotkeys' is true.
         * The optional separator will add a separator below the item if it's not the last in the list.
         * The optional sectionHeadline adds another styling to the item-font by reducing size and brightening color
         * The optional selected visually emphasizes an item by inverting the color of the item
         * @example
          [{
            text: Example
            sectionHeadline: true
          }, {
            href: 'http://apple.com',
            text: 'Apples',
            icon: HelpIcon
            hotkeyText: 'CTRL + H',
            title: 'Tastier Apples'
          }, {
            href: 'https://en.wikipedia.org/wiki/Orange_(colour)',
            text: 'Oranges',
            icon: StarIcon,
            disabled: true,
            separator: true
          }, {
            to: '/testing-nuxt-link',
            text: 'Ananas',
            selected: true
           }]
         */
        items: {
            required: true,
            type: Array
        },
        /**
         * Aria Label
         */
        ariaLabel: {
            type: String,
            required: true
        },
        /**
         * Identifier for click handler
         */
        id: {
            default: '',
            type: String
        },
        /**
         * Maximum width in px of the menu
         */
        maxMenuWidth: {
            type: Number,
            default: null
        }
    },
    emits: ['top-reached', 'bottom-reached', 'item-click', 'item-active'],
    computed: {
        useMaxMenuWidth() {
            return Boolean(this.maxMenuWidth);
        }
    },
    methods: {
        /**
         * @returns {Array<Element>} - HTML Elements to use for focus and events.
         */
        getEnabledListItems() {
            return this.$refs.listItem.map(el => el.$el || el).filter(x => !x.classList.contains('disabled'));
        },
        /**
         * Returns the next HTML Element from the list of items. If the current focused Element is at the top or bottom
         * of the list, this method will return the opposite end.
         *
         * @param {Number} changeInd - the positive or negative index shift for the next Element (usually 1 || -1).
         * @returns {Element} - the next option Element in the list of items.
         */
        getNextElement(changeInd) {
            // filter out disabled items
            let listItems = this.getEnabledListItems();
            
            // lookup next item (if none is currently active, start at top or bottom)
            let nextItem = listItems[listItems.indexOf(document.activeElement) + changeInd];
            
            let cancelWrapAround = false;
            if (!nextItem) {
                if (changeInd < 0) {
                    // if before first element, wrap around the list
                    this.$emit('top-reached', { preventDefault: () => {
                        cancelWrapAround = true;
                    } });
                    if (!cancelWrapAround) {
                        nextItem = listItems[listItems.length - 1];
                    }
                } else {
                    // if after last element, wrap around the list
                    this.$emit('bottom-reached', { preventDefault: () => {
                        cancelWrapAround = true;
                    } });
                    if (!cancelWrapAround) {
                        nextItem = listItems[0];
                    }
                }
            }

            return nextItem;
        },
        // publicly accessed
        onArrowUpKey() {
            let nextElement = this.getNextElement(-1);
            if (nextElement) {
                nextElement.focus();
            }
        },
        // publicly accessed
        onArrowDownKey() {
            let nextElement = this.getNextElement(1);
            if (nextElement) {
                nextElement.focus();
            }
        },
        // publicly accessed
        focusFirst() {
            let listItems = this.getEnabledListItems();
            let firstItem = listItems[0];
            if (firstItem) {
                firstItem.focus();
            }
        },
        // publicly accessed
        focusLast() {
            let listItems = this.getEnabledListItems();
            let lastItem = listItems[listItems.length - 1];
            if (lastItem) {
                lastItem.focus();
            }
        },
        linkTagByType(item) {
            if (item.to) {
                return 'nuxt-link';
            } else if (item.href) {
                return 'a';
            } else {
                return 'button';
            }
        },
        /**
         * Items can behave as links (either nuxt or native <a>) or buttons.
         * The MenuItems just emit the item-click event.
         *
         * @param {Object} event - browser event.
         * @param {Object} item - submenu item which was clicked.
         * @returns {undefined}
         * @emits {item-click}
         */
        onItemClick(event, item) {
            if (item.disabled || item.sectionHeadline) {
                return;
            }

            let isButton = !(item.href || item.to);
            if (isButton) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            } else if (event.type !== 'click' && event.code === 'Space') {
                // ignore a "click" through pressing space on links
                return;
            } else if (event.type !== 'click') {
                // Handle "Enter" on links. Nuxt-link with \`to: { name: 'namedRoute' }\` do not have an href property
                // and will not automatically react to keyboard events. We must trigger the click to activate the nuxt
                // event listener.
                let newEvent = new Event('click');
                event.target.dispatchEvent(newEvent);
            }
            this.$emit('item-click', event, item, this.id);
        }
    }
};
<\/script>

<template>
  <ul
    :aria-label="ariaLabel"
    role="menu"
    tabindex="0"
    @keydown.up.stop.prevent="onArrowUpKey"
    @keydown.down.stop.prevent="onArrowDownKey"
    @pointerleave="$emit('item-active', null, id)"
    @focusout="$emit('item-active', null, id)"
  >
    <li
      v-for="(item, index) in items"
      :key="index"
      :class="[{ separator: item.separator }]"
      :style="{ 'max-width': useMaxMenuWidth ? \`\${maxMenuWidth}px\` : null }"
      :title="item.title"
      @click="onItemClick($event, item)"
      @keydown.enter="onItemClick($event, item)"
      @keydown.space="onItemClick($event, item)"
      @focusin="$emit('item-active', item.disabled || item.sectionHeadline ? null : item, id)"
      @pointerenter="$emit('item-active', item.disabled || item.sectionHeadline ? null : item, id)"
    >
      <Component
        :is="linkTagByType(item)"
        ref="listItem"
        :tabindex="item.disabled ? null: '0'"
        :class="['list-item', item.sectionHeadline ? 'section-headline' : 'clickable-item', {
          disabled: item.disabled, selected: item.selected }]"
        :to="item.to || null"
        :href="item.href || null"
      >
        <Component
          :is="item.icon"
          v-if="item.icon"
          class="item-icon"
        />
        <div class="label">
          <span :class="['text', { truncate: useMaxMenuWidth }]">
            {{ item.text }}
          </span>
          <span
            v-if="item.hotkeyText"
            class="hotkey"
          >{{ item.hotkeyText }}</span>
        </div>
      </Component>
    </li>
  </ul>
</template>

<style lang="postcss" scoped>
ul {
  margin: 5px 0;
  padding: 0;
  background-color: var(--knime-white);
  color: var(--theme-dropdown-foreground-color);
  font-size: 13px;
  line-height: 18px;
  font-weight: 500;
  font-family: var(--theme-text-medium-font-family);
  text-align: left;
  list-style-type: none;
  z-index: var(--z-index-common-menu-items-expanded, 1);

  &.expanded {
    display: block;
  }

  &:focus {
    outline: none;
  }

  & li:not(:last-child).separator {
    border-bottom: 1px solid var(--knime-porcelain);
  }

  & .list-item {
    border: none;
    background: none;
    width: 100%;
    padding: 6px 13px;

    /* <button> does not inherit font-weight from ul in chrome */
    font-weight: 500;
    display: flex;
    text-decoration: none;
    white-space: nowrap;
    color: var(--theme-text-normal-color);

    &.clickable-item {
      cursor: pointer;

      &.disabled {
        opacity: 0.5;
        cursor: default;
        pointer-events: none;
      }

      & .item-icon {
        stroke: var(--theme-dropdown-foreground-color);
        stroke-width: calc(32px / 18);
        width: 18px;
        height: 18px;
        margin-right: 7px;
      }

      &.selected {
        background-color: var(--theme-dropdown-foreground-color);
        color: var(--theme-dropdown-background-color); /* background and foreground are switched on selection */

        & .item-icon {
          stroke: var(--theme-dropdown-background-color);
        }
      }

      & .label {
        display: flex;
        text-align: left;
        width: 100%;

        & .text {
          flex-shrink: 1;
          flex-basis: 100%;

          &.truncate {
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        & .hotkey {
          margin-left: 40px;
        }
      }

      &:hover {
        outline: none;
        background-color: var(--theme-dropdown-background-color-hover);
        color: var(--theme-dropdown-foreground-color-hover);

        & .item-icon {
          stroke: var(--theme-dropdown-foreground-color-hover);

          & .text {
            stroke: var(--theme-dropdown-foreground-color-hover);
          }
        }
      }

      &:active,
      &:focus {
        outline: none;
        background-color: var(--theme-dropdown-background-color-focus);
        color: var(--theme-dropdown-foreground-color-focus);

        & .item-icon {
          stroke: var(--theme-dropdown-foreground-color-focus);

          & .text {
            stroke: var(--theme-dropdown-foreground-color-focus);
          }
        }
      }
    }

    &.section-headline {
      color: var(--knime-stone);
      padding-top: 13px;
      pointer-events: none;
      height: 30px;
      font-size: 10px;
      line-height: 15px;
      display: flex;
      align-items: center;

      &:hover,
      &:focus,
      &:active {
        outline: none;
      }
    }
  }
}
</style>
`;const T=`<script>
import MenuItems from '~/webapps-common/ui/components/MenuItems.vue';
import MenuIcon from '~/webapps-common/ui/assets/img/icons/menu-options.svg';

const items = [{
    href: 'http://apple.com',
    text: 'Apples',
    icon: HelpIcon,
    hotkeyText: 'Ctrl + 1'
}, {
    href: 'https://en.wikipedia.org/wiki/Orange_(colour)',
    text: 'Oranges',
    icon: StarIcon,
    hotkeyText: 'Ctrl + 2',
    separator: true
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
        MenuItems,
        MenuIcon
    },
    data() {
        return {
            items
        };
    },
    methods: {
        onItemClick(event, item, id) {
            console.log(event) // this is the native dom event
            console.log(item) // this is the item object that was clicked on
            console.log(id) // this is the id of the menu whose item was clicked on
        }
    }
};
<\/script>

<template>
    <MenuItems
      :items="items"
      id="the-id-of-my-menu"
      aria-label="This is a menu displaying items"
      @item-click="onItemClick"
    >
</template>
`,o=[{href:"http://apple.com",text:"Apples",icon:l(p),hotkeyText:"Ctrl + 1"},{href:"https://en.wikipedia.org/wiki/Orange_(colour)",text:"Oranges",icon:l(f),hotkeyText:"Ctrl + 2"},{href:"about:blank",text:"Disabled Item",disabled:!0,icon:l(f),hotkeyText:"Ctrl + 3"},{to:"/testing-nuxt-link",text:"Ananas",icon:l(b)},{href:"https://www.urbandictionary.com/define.php?term=go%20bananas",text:"Bananas",icon:l(g)},{text:"Item without href/to",icon:l(p)}],M={components:{MenuItems:h,CodeExample:k},data(){return{MenuItems:h,menuItemsData:o,codeExampleStandalone:T,code:A,hoveredItem:null}},computed:{menuItemsWithoutIcons(){return o.map(({icon:t,hotkeyText:i,...r})=>r)},menuItemsWithSeparator(){return o.map((t,i)=>i===2||i===4?{...t,separator:!0}:t)},menuItemsWithSelectedEntries(){return o.map((t,i)=>i===1||i===3?{...t,selected:!0}:t)},menuItemsWithSections(){return[{text:"Round-shaped",sectionHeadline:!0,separator:!0},o[0],o[1],{text:"Different-shaped",sectionHeadline:!0,separator:!0},o[3],o[4]]}},methods:{onItemClick(t,i,r){window.alert(`You clicked on menu ${r} on an item with a value of: ${JSON.stringify(i)}`)},onItemActive(t){this.hoveredItem=t}}},a=t=>(E("data-v-1014dfb2"),t=t(),C(),t),S={class:"grid-container"},H={class:"grid-item-12"},W=a(()=>e("h2",null,"MenuItems",-1)),L=a(()=>e("p",null,"A component that displays a group of items. Supports keyboard navigation.",-1)),N={class:"menu-items"},O={class:"menu-item-wrapper"},D=a(()=>e("div",{class:"menu-name"},"Normal",-1)),B={class:"card"},R={class:"menu-item-wrapper"},z=a(()=>e("div",{class:"menu-name"},"With icons and hotkeys",-1)),K={class:"card"},j={class:"menu-item-wrapper"},P=a(()=>e("div",{class:"menu-name"},"With separators",-1)),V={class:"card"},q={class:"menu-item-wrapper"},U=a(()=>e("div",{class:"menu-name"},"With selected entries",-1)),Y={class:"card"},F={class:"menu-item-wrapper"},J=a(()=>e("div",{class:"menu-name"},"With sections",-1)),$={class:"card"},G={class:"hover-preview"},Q={class:"hover-title"},X={class:"hover-content"};function Z(t,i,r,ee,c,n){const m=x("MenuItems",!0),u=x("CodeExample");return y(),_("section",null,[e("div",S,[e("div",H,[W,L,e("div",N,[e("div",O,[D,e("div",B,[s(m,{id:"NORMAL",items:n.menuItemsWithoutIcons,"aria-label":"Menu items without icons",onItemClick:n.onItemClick,onItemActive:n.onItemActive},null,8,["items","onItemClick","onItemActive"])])]),e("div",R,[z,e("div",K,[s(m,{id:"WITH_ICONS_AND_HOTKEYS",items:c.menuItemsData,"aria-label":"Menu items with icons and hotkeys",onItemClick:n.onItemClick,onItemActive:n.onItemActive},null,8,["items","onItemClick","onItemActive"])])]),e("div",j,[P,e("div",V,[s(m,{id:"WITH_SEPARATORS",items:n.menuItemsWithSeparator,"aria-label":"Menu items with separators",onItemClick:n.onItemClick,onItemActive:n.onItemActive},null,8,["items","onItemClick","onItemActive"])])]),e("div",q,[U,e("div",Y,[s(m,{id:"WITH_SELECTED_ENTRIES",items:n.menuItemsWithSelectedEntries,"aria-label":"Menu items with selected entries",onItemClick:n.onItemClick,onItemActive:n.onItemActive},null,8,["items","onItemClick","onItemActive"])])]),e("div",F,[J,e("div",$,[s(m,{id:"WITH_SECTIONS",items:n.menuItemsWithSections,"aria-label":"Menu items with sections",onItemClick:n.onItemClick,onItemActive:n.onItemActive},null,8,["items","onItemClick","onItemActive"])])]),e("div",G,[e("div",Q,d(c.hoveredItem?"Hovered value is:":"Hover over an item"),1),e("pre",X,d(c.hoveredItem),1)])]),s(u,{summary:"Show usage example"},{default:v(()=>[I(d(c.codeExampleStandalone),1)]),_:1}),s(u,{summary:"Show MenuItems.vue source code"},{default:v(()=>[I(d(c.code),1)]),_:1})])])])}const se=w(M,[["render",Z],["__scopeId","data-v-1014dfb2"]]);export{se as default};
