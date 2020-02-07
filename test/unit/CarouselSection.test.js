import CarouselSection from '~/ui/components/CarouselSection';
import { shallowMount } from '@vue/test-utils';

describe('CarouselSection.vue', () => {

    it('renders default', () => {
        let wrapper = shallowMount(CarouselSection);
        expect(wrapper.find('section').exists()).toBe(true);
        expect(wrapper.vm.backgroundColor).toBe('porcelain');
    });

    it('renders backgroundColor', () => {
        let wrapper = shallowMount(CarouselSection, {
            propsData: {
                backgroundColor: 'white'
            }
        });

        expect(wrapper.find('.white').exists()).toBe(true);
    });
});

