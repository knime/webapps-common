import { describe, it, expect } from 'vitest';
import { shallowMount, mount } from '@vue/test-utils';
import { markRaw } from 'vue';

import Breadcrumb from '../Breadcrumb.vue';
import ArrowNext from '../../assets/img/icons/arrow-next.svg';

describe('Breadcrumb.vue', () => {
    it('renders nothing by default', () => {
        let wrapper = shallowMount(Breadcrumb);
        expect(wrapper.find('nav').exists()).toBeFalsy();
        expect(wrapper.find('.grey-style').exists()).toBe(false);
    });

    it('renders links, text, icons and arrows', () => {
        let wrapper = mount(Breadcrumb, {
            props: {
                items: [{
                    text: 'foo'
                }, {
                    text: 'bar',
                    href: '//h/ref'
                }, {
                    text: 'baz',
                    icon: markRaw(ArrowNext)
                }, {
                    text: 'qux',
                    href: '//another/href'
                }]
            }
        });
        let renderedItems = wrapper.findAll('li > *');

        /* eslint-disable no-magic-numbers */
        expect(renderedItems[0].element.tagName).toBe('SPAN');
        expect(renderedItems[2].element.tagName).toBe('A');
        expect(renderedItems[4].element.tagName).toBe('SPAN');
        expect(renderedItems[6].element.tagName).toBe('A');

        expect(renderedItems[0].text()).toBe('foo');
        expect(renderedItems[2].text()).toBe('bar');
        expect(renderedItems[4].text()).toBe('baz');
        expect(renderedItems[6].text()).toBe('qux');

        expect(renderedItems[2].attributes('href')).toBe('//h/ref');
        expect(renderedItems[6].attributes('href')).toBe('//another/href');

        expect(wrapper.findAll('li > *')[4].find('svg').exists()).toBe(true);

        // check trailing arrows
        let arrows = 0;
        for (let i = 0; i < renderedItems.length; i++) {
            if (renderedItems[i].element.tagName === 'svg') {
                arrows += 1;
            }
        }
        expect(arrows).toBe(3);
        /* eslint-enable no-magic-numbers */
    });

    it('renders grey focus and hover style', () => {
        let wrapper = mount(Breadcrumb, {
            props: {
                items: [{ text: 'foo' }],
                greyStyle: true
            }
        });

        expect(wrapper.find('.grey-style').exists()).toBe(true);
    });
});
