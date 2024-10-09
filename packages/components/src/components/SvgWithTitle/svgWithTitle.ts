import { type ComponentInstance, h as createElement } from "vue";

/**
 * Higher order component that decorates a SVG component (loaded with vue-svg-loader) with a `<title>` element
 * Note that `title` attributes have no effect on `<svg>` elements, so we need to inject a DOM element.
 *
 * @example
 *
 * import MyIcon from '~/icons/foo.svg';
 * import svgWithTitle from '…';
 * export default {
 *   components: {
 *       MyIcon: svgWithTitle(MyIcon, 'My Title')
 *   }
 * };
 *
 * @param SvgComponent The component to decorate
 * @param title The title to insert
 * @returns The component with a title inserted as the first child of `<svg>`
 */
export default (SvgComponent: ComponentInstance<any>, title: string) => ({
  render() {
    const renderedComponent = SvgComponent.render.apply(this, createElement);

    const titleEl = createElement("title", title);
    // @ts-ignore
    titleEl.ns = "svg";

    renderedComponent.children.unshift(titleEl);
    return renderedComponent;
  },
});
