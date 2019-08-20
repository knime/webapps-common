import { mount } from '@vue/test-utils';

import Collapser from '~/ui/components/Collapser';

describe('Collapser.vue', () => {

    it('renders content and title', () => {
        const wrapper = mount(Collapser, {
            propsData: {
                title: 'another title'
            },
            slots: {
                default: '<p>some test content <strong>here</strong></p>'
            }
        });

        expect(wrapper.find('svg').exists()).toBeTruthy();
        expect(wrapper.find('h3').exists()).toBeTruthy();
        expect(wrapper.text()).toContain('another title');
        expect(wrapper.text()).toContain('some test content here');
        expect(wrapper.find('.icon').exists()).toBeFalsy();
        expect(wrapper.classes()).not.toContain('compact');
    });

    it('renders optional icon', () => {
        const wrapper = mount(Collapser, {
            slots: {
                icon: '<svg></svg>'
            }
        });
        expect(wrapper.find('.icon svg').exists()).toBeTruthy();
    });

    it('renders compact version', () => {
        const wrapper = mount(Collapser, {
            propsData: {
                compact: true
            }
        });
        expect(wrapper.classes()).toContain('compact');
    });

    it('calls transition handlers and expands', done => {
        const triggerSpy = jest.spyOn(Collapser.methods, 'onTrigger');
        const enterSpy = jest.spyOn(Collapser.methods, 'onEnter');
        const leaveSpy = jest.spyOn(Collapser.methods, 'onLeave');

        const wrapper = mount(Collapser, {
            propsData: {
                title: 'yet another title'
            },
            slots: {
                default: '<p>some test content <strong>here</strong></p>'
            }
        });

        // open collapser
        wrapper.find('h3').trigger('click');
        expect(triggerSpy).toHaveBeenCalled();

        wrapper.vm.$nextTick(() => {
            expect(enterSpy).toHaveBeenCalled();
            expect(wrapper.vm.isExpanded).toEqual(true);

            // only check if height style property is set as height will be always 0 with vue test utils
            expect(wrapper.find('.panel').attributes('style')).toContain('height');

            // close it again
            wrapper.find('h3').trigger('click');
            wrapper.vm.$nextTick(() => {
                expect(leaveSpy).toHaveBeenCalled();
                expect(wrapper.vm.isExpanded).toBeFalsy();
                expect(wrapper.find('.panel').attributes('style')).toEqual('height: 0px;');
                done();
            });
        });

    });

});
