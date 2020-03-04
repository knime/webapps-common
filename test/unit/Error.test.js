import { shallowMount } from '@vue/test-utils';

import Error from '~/ui/components/Error';

describe('Error.vue', () => {
    it('renders default', () => {
        const wrapper = shallowMount(Error);
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.find('.error-status').text()).toBe('?');
        expect(wrapper.find('.error-message').text()).toBe('An error occurred. Please try again.');
    });

    it('renders props', () => {
        const wrapper = shallowMount(Error, {
            propsData: {
                statusCode: '500',
                message: 'An error occurred.'
            }
        });
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.find('.error-status').text()).toBe('500');
        expect(wrapper.find('.error-message').text()).toBe('An error occurred.');
    });
});
