import { shallowMount } from '@vue/test-utils';
import Breadcrumb from '~/ui/components/Breadcrumb';

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

    it('renders links and text', () => {
        let wrapper = shallowMount(Breadcrumb, {
            propsData: {
                items: [{
                    text: 'foo'
                }, {
                    text: 'bar',
                    href: '//h/ref'
                }, {
                    text: 'baz'
                }, {
                    text: 'qux',
                    href: '//another/href'
                }]
            }
        });
        let renderedItems = wrapper.findAll('li *');
        /* eslint-disable no-magic-numbers */
        expect(renderedItems.at(0).element.tagName).toBe('SPAN');
        expect(renderedItems.at(1).element.tagName).toBe('A');
        expect(renderedItems.at(2).element.tagName).toBe('SPAN');
        expect(renderedItems.at(3).element.tagName).toBe('A');

        expect(renderedItems.at(0).text()).toBe('foo');
        expect(renderedItems.at(1).text()).toBe('bar');
        expect(renderedItems.at(2).text()).toBe('baz');
        expect(renderedItems.at(3).text()).toBe('qux');

        expect(renderedItems.at(1).props('to')).toBe('//h/ref');
        expect(renderedItems.at(3).props('to')).toBe('//another/href');

        // check trailing arrows
        expect(wrapper.findAll('li.arrow').length).toBe(4);
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
        // check trailing arrows
        expect(wrapper.findAll('li.arrow').length).toBe(1);
    });
});
