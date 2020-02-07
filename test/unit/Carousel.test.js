import { shallowMount } from '@vue/test-utils';

import Carousel from '~/ui/components/Carousel';

describe('Carousel.vue', () => {
    it('renders default', () => {
        const wrapper = shallowMount(Carousel);

        expect(wrapper.find('.shadow-wrapper').exists()).toBe(true);
        expect(wrapper.find('.carousel').exists()).toBe(true);
    });

    it('renders slot', () => {
        const wrapper = shallowMount(Carousel, {
            slots: {
                default: '<div class="slot"></div>'
            }
        });
        expect(wrapper.find('.slot').exists()).toBe(true);
    });
});
