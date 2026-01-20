import type { Component, ConcreteComponent } from "vue";

export type LinkLike = ConcreteComponent | Component;

export type NavMenuItemProps<T = unknown> = {
  /**
   * Text to show in the navigation item. If the text is too large
   * it will be truncated and this value will also be used as the `title`
   * attribute
   */
  text: string;
  /**
   * When set, the navigation item will act as a router-controlled navigation item,
   * based on what your application's router is (Vue router / Nuxt router).
   * For external links, use the `href` prop only
   */
  to?: T;
  /**
   * When set, the navigation item will act as an external link, meaning outside
   * the control of your application's router (Vue router / Nuxt router). For router
   * links, refer to the `to` prop
   */
  href?: string;
  /**
   * When used in conjunction with the `to` prop, this will halt the navigation.
   * Instead, you will receive a `click` event and it's the responsibility of the
   * caller to continue with the navigation manually. Has no effect when used the
   * `href` prop
   */
  manualNavigation?: boolean;
  /**
   * Whether the active should be in the active state. This will have a different
   * styling depending whether the NavMenuItem is at a root-level (active top-level item)
   * vs if it's nested inside another menu (active child item of a parent)
   */
  active?: boolean;
};
