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

    it('calls scroll methods', () => {
        const dragStartSpy = jest.spyOn(Carousel.methods, 'onDragStart');
        const mouseLeaveSpy = jest.spyOn(Carousel.methods, 'onMouseEnd');
        const mouseDownSpy = jest.spyOn(Carousel.methods, 'onMouseDown');
        const mouseMoveSpy = jest.spyOn(Carousel.methods, 'onMouseMove');
        const clickSpy = jest.spyOn(Carousel.methods, 'onMouseEnd');


        const wrapper = shallowMount(Carousel);

        wrapper.find('.carousel').trigger('dragstart');
        expect(dragStartSpy).toHaveBeenCalled();

        wrapper.find('.carousel').trigger('mousedown');
        expect(mouseDownSpy).toHaveBeenCalled();

        wrapper.find('.carousel').trigger('mousemove');
        expect(mouseMoveSpy).toHaveBeenCalled();

        wrapper.find('.carousel').trigger('mouseleave');
        expect(mouseLeaveSpy).toHaveBeenCalled();

        wrapper.find('.carousel').trigger('click');
        expect(clickSpy).toHaveBeenCalledTimes(2);
    });
});
