import { shallowMount } from '@vue/test-utils';

import Carousel from '~/ui/components/Carousel';

describe('Carousel.vue', () => {
    it('renders default', () => {
        const wrapper = shallowMount(Carousel);

        expect(wrapper.find('.shadow-wrapper').exists()).toBe(true);
        expect(wrapper.find('.shadow-right').exists()).toBe(true);
        expect(wrapper.find('.shadow-left').exists()).toBe(true);
        expect(wrapper.find('.carousel').exists()).toBe(true);
        expect(wrapper.vm.shadowColor).toBe('porcelain');
    });

    it('renders slot', () => {
        const wrapper = shallowMount(Carousel, {
            slots: {
                default: '<div class="slot"></div>'
            }
        });
        expect(wrapper.find('.slot').exists()).toBe(true);
    });

    it('renders shadowColor', () => {
        const wrapper = shallowMount(Carousel, {
            propsData: {
                'shadow-color': 'white'
            }
        });
        expect(wrapper.vm.shadowColor).toBe('white');
    });
});
