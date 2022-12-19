import MessageLink from '../MessageLink.vue';
import { shallowMount } from '@vue/test-utils';

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
        expect(wrapper.find('a').attributes('target')).not.toBeDefined();
    });

    it('renders with to', () => {
        wrapper = shallowMount(MessageLink, {
            props: {
                link: {
                    text: 'I\'m a link',
                    to: {
                        href: 'localhost:3000'
                    }
                }
            }
        });

        expect(wrapper.find('a').exists()).toBe(true);
        expect(wrapper.find('a').text()).toBe('I\'m a link');
        expect(wrapper.find('a').attributes('href')).not.toBeDefined();
        expect(wrapper.find('a').attributes('target')).not.toBeDefined();
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
