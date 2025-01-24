import type { PropType } from "vue";
import { type Strategy } from "@floating-ui/vue";
import type { MenuItem, Props as MenuItemsProps } from "../base/MenuItem/MenuItems.vue";
declare const orientations: readonly ["right", "top", "left"];
type Orientation = (typeof orientations)[number];
/**
 * SubMenu offers shows a Button with a submenu based on MenuItems.
 * It offers an orientation where the menu appears (top, left, right)
 */
declare const _default: import("vue").DefineComponent<{
    /**
     * Items to be listed in the menu.
     * See MenuItems for more details.
     */
    items: {
        type: PropType<MenuItem<any, any>[]>;
        required: true;
    };
    /**
     * Identifier for click handler
     */
    id: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Button title
     */
    buttonTitle: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Alignment of the submenu with the menu button left or right. Defaults to 'right'.
     */
    orientation: {
        type: PropType<"left" | "right" | "top">;
        default: string;
        validator(orientation?: Orientation): boolean;
    };
    /**
     * Disable SubMenu
     */
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Set max-width for the menu and truncate larger text
     */
    maxMenuWidth: {
        type: NumberConstructor;
        default: null;
    };
    /**
     * Allow overflow of the popover on the main axis regarding the SubMenu Button
     */
    allowOverflowMainAxis: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Allows the popover to be displayed outside a containing block with hidden or scroll overflow
     * (see also https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block, e.g. when a parent container
     * has a translate css styling).
     * Whenever the menu is expanded, a callback which closes it again is emitted as the event 'toggle'.
     */
    teleportToBody: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * The positioning strategy for the dropdown menu (also called popover)
     */
    positioningStrategy: {
        type: PropType<Strategy>;
        default: string;
        validator: (value: string) => boolean;
    };
    menuItemsProps: {
        type: PropType<Partial<MenuItemsProps>>;
        default: () => Partial<MenuItemsProps>;
    };
}, {
    clippingBoundary: import("vue").ComputedRef<HTMLElement>;
    menuItems: import("vue").Ref<null>;
    submenu: import("vue").Ref<null>;
    menuWrapper: import("vue").Ref<HTMLElement | null>;
    expanded: import("vue").Ref<boolean>;
    closeMenu: () => void;
    updateFloatingMenu: () => void;
    menuWrapperFloatingStyles: Readonly<import("vue").Ref<{
        position: Strategy;
        top: string;
        left: string;
        transform?: string | undefined;
        willChange?: string | undefined;
    }>>;
    shadowRoot: ShadowRoot | null;
}, {
    activeDescendant: string | undefined;
}, {}, {
    toggleMenu(event: Event): void;
    onItemClick(event: Event, item: any): void;
    onKeydown(event: KeyboardEvent): void;
    getMenuItems(): any;
    setActiveDescendant(id: string | null): void;
}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, ("close" | "toggle" | "open" | "item-click")[], "close" | "toggle" | "open" | "item-click", import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<{
    /**
     * Items to be listed in the menu.
     * See MenuItems for more details.
     */
    items: {
        type: PropType<MenuItem<any, any>[]>;
        required: true;
    };
    /**
     * Identifier for click handler
     */
    id: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Button title
     */
    buttonTitle: {
        type: StringConstructor;
        default: string;
    };
    /**
     * Alignment of the submenu with the menu button left or right. Defaults to 'right'.
     */
    orientation: {
        type: PropType<"left" | "right" | "top">;
        default: string;
        validator(orientation?: Orientation): boolean;
    };
    /**
     * Disable SubMenu
     */
    disabled: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Set max-width for the menu and truncate larger text
     */
    maxMenuWidth: {
        type: NumberConstructor;
        default: null;
    };
    /**
     * Allow overflow of the popover on the main axis regarding the SubMenu Button
     */
    allowOverflowMainAxis: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * Allows the popover to be displayed outside a containing block with hidden or scroll overflow
     * (see also https://developer.mozilla.org/en-US/docs/Web/CSS/Containing_block, e.g. when a parent container
     * has a translate css styling).
     * Whenever the menu is expanded, a callback which closes it again is emitted as the event 'toggle'.
     */
    teleportToBody: {
        type: BooleanConstructor;
        default: boolean;
    };
    /**
     * The positioning strategy for the dropdown menu (also called popover)
     */
    positioningStrategy: {
        type: PropType<Strategy>;
        default: string;
        validator: (value: string) => boolean;
    };
    menuItemsProps: {
        type: PropType<Partial<MenuItemsProps>>;
        default: () => Partial<MenuItemsProps>;
    };
}>> & {
    onClose?: ((...args: any[]) => any) | undefined;
    onToggle?: ((...args: any[]) => any) | undefined;
    "onItem-click"?: ((...args: any[]) => any) | undefined;
    onOpen?: ((...args: any[]) => any) | undefined;
}, {
    disabled: boolean;
    id: string;
    maxMenuWidth: number;
    buttonTitle: string;
    orientation: "left" | "right" | "top";
    allowOverflowMainAxis: boolean;
    teleportToBody: boolean;
    positioningStrategy: Strategy;
    menuItemsProps: Partial<MenuItemsProps>;
}, {}>;
export default _default;
