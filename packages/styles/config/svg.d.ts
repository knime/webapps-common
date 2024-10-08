declare module "*.svg" {
  import { FunctionalComponent, SVGAttributes } from "vue";

  const src: FunctionalComponent<SVGAttributes>;
  export default src;
}
