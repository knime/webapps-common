import { describe, it, expect } from 'vitest';
import { mount, shallowMount } from '@vue/test-utils';

import LinkList from '../LinkList.vue';

describe('LinkList.vue', () => {
    it('renders links', () => {
        const links = [{
            text: 'The Pivoting Node: Basic Examples',
            url: 'https://www.youtube.com/watch?v=zo9YdH9kgKQ&t=2s'
        }, {
            text: 'Advanced layouts of the pivot table using multiple aggregation columns',
            url: 'https://www.youtube.com/watch?v=1Dilumi6X2I&t=1s'
        }];
        const wrapper = mount(LinkList, {
            props: {
                links
            }
        });
        links.forEach(link => {
            const el = wrapper.find(`a[href="${link.url}"]`);
            expect(el.exists()).toBeTruthy();
            expect(el.text()).toEqual(link.text);
            expect(el.attributes('rel')).toBe('ugc noopener');
        });
    });

    it('renders links without text', () => {
        const links = [{
            text: '',
            url: ''
        }, {
            text: '',
            url: 'https://www.knime.com/blog/beauty-and-the-monster.com'
        }];
        const wrapper = shallowMount(LinkList, {
            props: {
                links
            }
        });
        links.forEach(link => {
            const el = wrapper.find(`a[href="${link.url}"]`);
            if (link.url) {
                expect(el.text()).toEqual(link.url);
            } else {
                expect(el.exists()).toBeFalsy();
            }
        });
        expect(wrapper.findAll('a').length).toBe(1);
    });

    it('renders nothing if no links provided', () => {
        const wrapper = mount(LinkList);
        expect(wrapper.find('*').exists()).toBeFalsy();
    });
});
