import { mount } from '@vue/test-utils';

import Collapser from '~/ui/components/Collapser.vue';

describe('Collapser.vue', () => {
    it('renders content and title', () => {
        const wrapper = mount(Collapser, {
            slots: {
                title: 'another title',
                default: '<p>some test content <strong>here</strong></p>'
            }
        });

        expect(wrapper.find('svg').exists()).toBeTruthy();
        expect(wrapper.find('.button').exists()).toBeTruthy();
        expect(wrapper.text()).toContain('another title');
        expect(wrapper.text()).toContain('some test content here');
        expect(wrapper.find('.icon').exists()).toBeFalsy();
        expect(wrapper.classes()).not.toContain('compact');
    });

    it('renders optional icon', () => {
        const wrapper = mount(Collapser, {
            slots: {
                title: '<svg class="icon"></svg>'
            }
        });
        expect(wrapper.find('.icon').exists()).toBeTruthy();
    });

    it('handles button click', () => {
        const triggerSpy = jest.spyOn(Collapser.methods, 'onTrigger');

        const wrapper = mount(Collapser, {
            slots: {
                title: 'yet another title',
                default: '<p>some test content <strong>here</strong></p>'
            }
        });

        wrapper.find('.button').trigger('click');
        expect(triggerSpy).toHaveBeenCalled();
    });
});
