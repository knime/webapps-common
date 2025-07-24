import { type Component, h } from "vue";

/**
 * Higher order component that decorates a SVG component (loaded with vue-svg-loader) with a `<title>` element
 * Note that `title` attributes have no effect on `<svg>` elements, so we need to inject a DOM element.
 *
 * @example
 *
 * import MyIcon from "~/icons/foo.svg";
 * import svgWithTitle from "…";
 * export default {
 *   components: {
 *       MyIcon: svgWithTitle(MyIcon, "My Title")
 *   }
 * };
 *
 * or for sfc setup
 *
 * import MyIcon from "~/icons/foo.svg";
 * import svgWithTitle from "…";
 * const MyIconWithTitle = svgWithTitle(MyIcon, "My Title")
 *
 *
 * @param SvgComponent The component to decorate
 * @param title The title to insert
 * @returns The component with a title inserted as the first child of `<svg>`
 */
export default (SvgComponent: Component, title: string) => ({
  render() {
    // Type incompatibilities mainly come from the fact that
    // vite-svg-loader is a rather old lib and they haven't updated their type
    // definitions. See https://github.com/jpkleemans/vite-svg-loader/blob/main/index.d.ts#L25
    // @ts-expect-error Property render does not exist on type
    const renderedComponent = SvgComponent.render({}, []);

    const titleEl = h("title", title);
    // @ts-expect-error Property 'ns' does not exist on type 'VNode<RendererNode, RendererElement, { [key: string]: any; }>'.
    titleEl.ns = "svg";

    renderedComponent.children.unshift(titleEl);
    return renderedComponent;
  },
});
