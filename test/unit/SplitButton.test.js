import { shallowMount } from '@vue/test-utils';

import SplitButton from '~/ui/components/SplitButton.vue';

describe('SplitButton.vue', () => {
    it('renders slot content', () => {
        const wrapper = shallowMount(SplitButton, {
            slots: {
                default: '<button />'
            }
        });
        expect(wrapper.find('button').exists()).toBeTruthy();
    });
});
