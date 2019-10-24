import { shallowMount, mount } from '@vue/test-utils';
import Breadcrumb from '~/ui/components/Breadcrumb';
import ArrowNext from '~/ui/assets/img/icons/arrow-next.svg?inline';

describe('Breadcrumb.vue', () => {
    it('renders', () => {
        let wrapper = shallowMount(Breadcrumb, {
            propsData: {
                items: [{ text: 'foo' }]
            }
        });
        expect(wrapper.html()).toBeTruthy();
    });

    it('renders nothing by default', () => {
        let wrapper = shallowMount(Breadcrumb);
        expect(wrapper.isEmpty()).toBeTruthy();
    });

    it('renders links, text, icons and arrows', () => {
        let wrapper = mount(Breadcrumb, {
            propsData: {
                items: [{
                    text: 'foo'
                }, {
                    text: 'bar',
                    href: '//h/ref'
                }, {
                    text: 'baz',
                    icon: ArrowNext
                }, {
                    text: 'qux',
                    href: '//another/href'
                }]
            }
        });
        let renderedItems = wrapper.findAll('li > *');
        
        /* eslint-disable no-magic-numbers */
        expect(renderedItems.at(0).element.tagName).toBe('SPAN');
        expect(renderedItems.at(2).element.tagName).toBe('A');
        expect(renderedItems.at(4).element.tagName).toBe('SPAN');
        expect(renderedItems.at(6).element.tagName).toBe('A');

        expect(renderedItems.at(0).text()).toBe('foo');
        expect(renderedItems.at(2).text()).toBe('bar');
        expect(renderedItems.at(4).text()).toBe('baz');
        expect(renderedItems.at(6).text()).toBe('qux');

        expect(renderedItems.at(2).props('to')).toBe('//h/ref');
        expect(renderedItems.at(6).props('to')).toBe('//another/href');

        expect(wrapper.findAll('li > *').at(4).find('svg').exists()).toBe(true);

        // check trailing arrows
        let arrows = 0;
        for (let i = 0; i < renderedItems.length; i++) {
            if (renderedItems.at(i).element.tagName === 'svg') {
                arrows += 1;
            }
        }
        expect(arrows).toBe(4);
    });

    it('should sometimes render no trailing arrow', () => {
        let wrapper = shallowMount(Breadcrumb, {
            propsData: {
                items: [{
                    text: 'foo'
                }, {
                    text: 'bar',
                    href: '//h/ref',
                    noTrailingArrow: true
                }]
            }
        });
        let renderedItems = wrapper.findAll('li > *');

        // check trailing arrows
        let arrows = 0;
        for (let i = 0; i < renderedItems.length; i++) {
            if (renderedItems.at(i).is(ArrowNext)) {
                arrows += 1;
            }
        }
        expect(arrows).toBe(1);
    });
});
