import { mount } from '@vue/test-utils';
import ExpandTransition from '~/ui/components/transitions/ExpandTransition.vue';

describe('ExpandTransition.vue', () => {
    it('calls transition handlers and expands', async () => {
        const enterSpy = jest.spyOn(ExpandTransition.methods, 'onEnter');
        const leaveSpy = jest.spyOn(ExpandTransition.methods, 'onLeave');

        const wrapper = mount(ExpandTransition, {
            propsData: {
                isExpanded: false
            },
            slots: {
                default: '<p>some test content <strong>here</strong></p>'
            }
        });

        // open
        await wrapper.setProps({ isExpanded: true });


        expect(enterSpy).toHaveBeenCalled();

        // only check if height style property is set as height will be always 0 with vue test utils
        expect(wrapper.find('.panel').attributes('style')).toContain('height');

        // close
        await wrapper.setProps({ isExpanded: false });

        expect(leaveSpy).toHaveBeenCalled();
        expect(wrapper.find('.panel').attributes('style')).toEqual('height: 0px;');
    });
});
