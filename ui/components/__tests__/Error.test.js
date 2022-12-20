import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';

import Error from '../Error.vue';

describe('Error.vue', () => {
    it('renders default', () => {
        const wrapper = shallowMount(Error);
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.find('h2').text()).toBe('Something went wrong!');
        expect(wrapper.find('.error-status').exists()).toBe(false); // use icon instead of text
        expect(wrapper.find('.error-message').text()).toBe('An error occurred. Please try again.');
    });

    it('renders props', () => {
        const wrapper = shallowMount(Error, {
            props: {
                statusCode: '500',
                headline: 'Hot dang!',
                message: 'An error occurred.'
            }
        });
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.find('h2').text()).toBe('Hot dang!');
        expect(wrapper.find('.error-status').text()).toBe('500');
        expect(wrapper.find('.error-message').text()).toBe('An error occurred.');
    });
});
