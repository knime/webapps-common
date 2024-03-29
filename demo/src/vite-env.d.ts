/* eslint-disable spaced-comment */
/// <reference types="vite/client" />
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "*?raw" {
  const string: string;
  export default string;
}
