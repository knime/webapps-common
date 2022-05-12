/**
 * Higher order component that decorates a SVG component (loaded with vue-svg-loader) with a `<title>` element
 * Note that `title` attributes have no effect on `<svg>` elements, so we need to inject a DOM element.
 *
 * @example
 *
 * import MyIcon from '~/icons/foo.svg?inline';
 * import svgWithTitle from '…';
 * export default {
 *   components: {
 *       MyIcon: svgWithTitle(MyIcon, 'My Title')
 *   }
 * };
 *
 * @param { Vue.component } SvgComponent The component to decorate
 * @param { String } title The title to insert
 * @returns { Vue.component } The component with a title inserted as the first child of `<svg>`
 */
export default (SvgComponent, title) => ({
    render(createElement) {
        let result = createElement(SvgComponent);
        let titleEl = createElement('title', title);
        titleEl.ns = 'svg';
        result.children.unshift(titleEl);
        return result;
    }
});
