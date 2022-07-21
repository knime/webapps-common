import { shallowMount } from '@vue/test-utils';

import Carousel from '~/ui/components/Carousel.vue';

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

    it('calls scroll methods', () => {
        const dragStartSpy = jest.spyOn(Carousel.methods, 'onDragStart');
        const mouseLeaveSpy = jest.spyOn(Carousel.methods, 'onMouseEnd');
        const mouseDownSpy = jest.spyOn(Carousel.methods, 'onMouseDown');
        const mouseMoveSpy = jest.spyOn(Carousel.methods, 'onMouseMove');
        const clickSpy = jest.spyOn(Carousel.methods, 'onMouseEnd');


        const wrapper = shallowMount(Carousel);

        wrapper.find('.carousel').trigger('dragstart');
        expect(dragStartSpy).toHaveBeenCalled();

        wrapper.find('.carousel').trigger('mousedown', {
            pageX: 0
        });
        expect(mouseDownSpy).toHaveBeenCalled();

        const scrollValue = 30;

        wrapper.find({ ref: 'carousel' }).trigger('mousemove', {
            pageX: -scrollValue
        });
        expect(wrapper.vm.$refs.carousel.scrollLeft).toBe(scrollValue);
        expect(mouseMoveSpy).toHaveBeenCalled();

        wrapper.find('.carousel').trigger('mouseleave');
        expect(mouseLeaveSpy).toHaveBeenCalled();

        wrapper.find('.carousel').trigger('click');
        expect(clickSpy).toHaveBeenCalledTimes(2);
    });
});
