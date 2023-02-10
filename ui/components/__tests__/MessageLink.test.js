import { describe, it, expect } from 'vitest';
import { shallowMount, RouterLinkStub } from '@vue/test-utils';

import MessageLink from '../MessageLink.vue';

describe('MessageLink.vue', () => {
    let wrapper;

    it('renders with href', () => {
        wrapper = shallowMount(MessageLink, {
            props: {
                link: {
                    text: 'I\'m a link',
                    href: 'localhost:3000'
                }
            }
        });

        expect(wrapper.find('a').exists()).toBe(true);
        expect(wrapper.find('a').text()).toBe('I\'m a link');
        expect(wrapper.find('a').attributes('href')).toBe('localhost:3000');
        expect(wrapper.find('a').attributes('target')).toBeUndefined();
    });

    it('renders with to', () => {
        wrapper = shallowMount(MessageLink, {
            props: {
                link: {
                    text: 'I\'m a link',
                    to: 'localhost:3000'
                }
            },
            global: {
                stubs: {
                    RouterLink: RouterLinkStub
                }
            }
        });

        expect(wrapper.findComponent(RouterLinkStub).exists()).toBe(true);
        expect(wrapper.findComponent(RouterLinkStub).text()).toBe('I\'m a link');
        expect(wrapper.findComponent(RouterLinkStub).props('to')).toBe('localhost:3000');
        expect(wrapper.findComponent(RouterLinkStub).props('href')).toBeUndefined();
        expect(wrapper.findComponent(RouterLinkStub).attributes('target')).toBeUndefined();
    });

    it('sets target', () => {
        wrapper = shallowMount(MessageLink, {
            props: {
                link: {
                    text: 'I\'m a link',
                    href: 'localhost:3000',
                    newTab: true
                }
            }
        });

        expect(wrapper.find('a').exists()).toBe(true);
        expect(wrapper.find('a').text()).toBe('I\'m a link');
        expect(wrapper.find('a').attributes('href')).toBe('localhost:3000');
        expect(wrapper.find('a').attributes('target')).toBe('_blank');
    });
});
