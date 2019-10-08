import { mount } from '@vue/test-utils';

import Collapser from '~/ui/components/Collapser';

describe('Collapser.vue', () => {

    it('renders content and title', () => {
        const wrapper = mount(Collapser, {
            slots: {
                title: 'another title',
                default: '<p>some test content <strong>here</strong></p>'
            }
        });

        expect(wrapper.find('svg').exists()).toBeTruthy();
        expect(wrapper.find('button').exists()).toBeTruthy();
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

    it('calls transition handlers and expands', done => {
        const triggerSpy = jest.spyOn(Collapser.methods, 'onTrigger');
        const enterSpy = jest.spyOn(Collapser.methods, 'onEnter');
        const leaveSpy = jest.spyOn(Collapser.methods, 'onLeave');

        const wrapper = mount(Collapser, {
            slots: {
                title: 'yet another title',
                default: '<p>some test content <strong>here</strong></p>'
            }
        });

        // open collapser
        wrapper.find('button').trigger('click');
        expect(triggerSpy).toHaveBeenCalled();

        wrapper.vm.$nextTick(() => {
            expect(enterSpy).toHaveBeenCalled();
            expect(wrapper.vm.isExpanded).toEqual(true);

            // only check if height style property is set as height will be always 0 with vue test utils
            expect(wrapper.find('.panel').attributes('style')).toContain('height');

            // close it again
            wrapper.find('button').trigger('click');
            wrapper.vm.$nextTick(() => {
                expect(leaveSpy).toHaveBeenCalled();
                expect(wrapper.vm.isExpanded).toBeFalsy();
                expect(wrapper.find('.panel').attributes('style')).toEqual('height: 0px;');
                done();
            });
        });

    });

});
