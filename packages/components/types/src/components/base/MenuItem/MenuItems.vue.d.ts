/**
 * MenuItems component with (optional) hotkey text and icons
 * Can be used to create a float-able menu or a sub menu or similar.
 * Position and visibility needs to be handled by the wrapper.
 *
 * The elements of the menu are not focusable.
 * Instead, the component exposes a onKeydown method, which can be taken as a listener for keydown events on a focused
 * element in a parent component. When doing so, the elements in the menu are marked via keyboard navigation.
 * For accessibility, the focused outside element which listens to keydown events needs to have an aria-activedescendant
 * label set to the id of the visually focused element and additionally an aria-owns label with the same id if the menu items are
 * not DOM-descendants of this element (see https://www.w3.org/WAI/ARIA/apg/practices/keyboard-interface/#kbd_focus_activedescendant)
 * This id is emitted via the `@item-focused` event whenever the visually focused item changes. This emit also yields null whenever no element
 * is visually focused.
 *
 * For some keydown events, a `@close` event is emitted.
 *
 * There is a prop called `registerKeydown` if its true the component is registering the onKeydown method to
 * the @keydown event on its own. This is handy if you don't need to have any control over it
 * (like keeping the focus anywhere).
 *
 * A click or activation by keyboard (enter and space) emits `@item-click`.
 * If the data has a `to` attribute the used tag will be `nuxt-link` if it has a `href` attribute it will be a `a` tag
 * otherwise we use the generic `button` and leave the handling of the action to the wrapping component that reacts
 * to `item-click` and calls any action.
 *
 * Hovering an item emits `@item-hovered`.
 *
 * There is support for sub menus with the `children` key in items. The sublevel menus are recursive and create
 * another MenuItems instance. The keyboard navigation is delegated to the submenu and open/close is handled.
 * Use the selector `:deep(.menu-items-sub-level)` to style the sub menus
 */
import { type FunctionalComponent, type SVGAttributes } from "vue";
import type { Boundary } from "@floating-ui/vue";
export interface MenuItem<TMetadata = any, TChildrenMetadata = TMetadata> {
    text: string;
    icon?: FunctionalComponent<SVGAttributes>;
    disabled?: boolean;
    /** longer description text that will be displayed below the menu entry but still is part of it */
    description?: string;
    /** shown on menu items on hover */
    title?: string;
    /** for router-links */
    to?: string;
    /** for standard (e.g. external) links */
    href?: string;
    /** adds another styling to the item-font by reducing size and brightening color */
    sectionHeadline?: boolean;
    /** visually emphasizes an item by inverting the color of the item */
    selected?: boolean;
    /** adds a download indicator property for file links */
    download?: boolean | string;
    /** show a separator below the item if it's not the last in the list */
    separator?: boolean;
    /** shown aligned right besides the text */
    hotkeyText?: string;
    /** sub menu */
    children?: Array<MenuItem<TChildrenMetadata>>;
    /** any typed field that can be used to put any data in the item by users of this component */
    metadata?: TMetadata;
    /** If this field is set, the item will be displayed as a checkbox with initial state checkbox.checked, triggering
    checkbox.setBoolean on toggle */
    checkbox?: {
        checked: boolean;
        setBoolean: (checked: boolean) => void;
    };
}
export type Props = {
    items: MenuItem[];
    menuAriaLabel: string;
    disableSpaceToClick?: boolean;
    registerKeydown?: boolean;
    /**
     * Element used to detect when the MenuItem is near the edges of a clipping parent.
     * This will then be used to automatically position opened floating submenus accordingly.
     *
     * Defaults to the document's body
     */
    clippingBoundary?: Boundary;
};
declare const _default: import("vue").DefineComponent<__VLS_WithDefaults<__VLS_TypePropsToOption<Props>, {
    disableSpaceToClick: boolean;
    registerKeydown: boolean;
    clippingBoundary: () => HTMLElement;
}>, {
    onKeydown: (event: KeyboardEvent) => void;
    resetNavigation: () => void;
    focusIndex: (index?: number) => void;
}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    close: () => void;
    "item-click": (event: MouseEvent, item: MenuItem<any, any>, menuId: string) => void;
    "item-focused": (itemId: string | null, item: MenuItem<any, any> | null) => void;
    "item-hovered": (item: MenuItem<any, any> | null, menuId: string, index: number) => void;
    "close-submenu": () => void;
}, string, import("vue").PublicProps, Readonly<import("vue").ExtractPropTypes<__VLS_WithDefaults<__VLS_TypePropsToOption<Props>, {
    disableSpaceToClick: boolean;
    registerKeydown: boolean;
    clippingBoundary: () => HTMLElement;
}>>> & {
    onClose?: (() => any) | undefined;
    "onItem-click"?: ((event: MouseEvent, item: MenuItem<any, any>, menuId: string) => any) | undefined;
    "onItem-focused"?: ((itemId: string | null, item: MenuItem<any, any> | null) => any) | undefined;
    "onItem-hovered"?: ((item: MenuItem<any, any> | null, menuId: string, index: number) => any) | undefined;
    "onClose-submenu"?: (() => any) | undefined;
}, {
    disableSpaceToClick: boolean;
    clippingBoundary: Boundary;
    registerKeydown: boolean;
}, {}>;
export default _default;
type __VLS_WithDefaults<P, D> = {
    [K in keyof Pick<P, keyof P>]: K extends keyof D ? __VLS_Prettify<P[K] & {
        default: D[K];
    }> : P[K];
};
type __VLS_Prettify<T> = {
    [K in keyof T]: T[K];
} & {};
type __VLS_NonUndefinedable<T> = T extends undefined ? never : T;
type __VLS_TypePropsToOption<T> = {
    [K in keyof T]-?: {} extends Pick<T, K> ? {
        type: import('vue').PropType<__VLS_NonUndefinedable<T[K]>>;
    } : {
        type: import('vue').PropType<T[K]>;
        required: true;
    };
};
