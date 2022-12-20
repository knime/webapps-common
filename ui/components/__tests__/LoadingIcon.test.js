import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';

import LoadingIcon from '../LoadingIcon.vue';
import ReloadIcon from '../../../ui/assets/img/icons/reload.svg';

describe('LoadingIcon.vue', () => {
    it('renders', () => {
        const wrapper = shallowMount(LoadingIcon, {
            global: {
                stubs: {
                    ReloadIcon
                }
            }
        });

        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.findComponent(ReloadIcon).exists()).toBeTruthy();
    });
});
