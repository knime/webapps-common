import svgLoader from '~/node_modules/vue-svg-loader/package.json';

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
 * @param { Vue.component } SvgComponent The component to decorate
 * @param { String } title The title to insert
 * @returns { Vue.component } The component with a title inserted as the first child of `<svg>`
 */
export default (SvgComponent, title) => ({
    render(createElement) {
        // Due to an incompatibility of vue-svg-loader between versions 0.16.0 and 0.17.x
        // a different implementation has to be provided, so that projects which use v0.17.x (e.g Vue-CLI 5 projects)
        // can make use of this svgWithTitle reusable helper function
        const renderedComponent = svgLoader.version === '0.16.0'
            ? createElement(SvgComponent)
            : SvgComponent.render.apply(this, createElement);

        const titleEl = createElement('title', title);
        titleEl.ns = 'svg';
        
        renderedComponent.children.unshift(titleEl);
        return renderedComponent;
    }
});
