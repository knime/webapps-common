import { describe, it, expect, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import ExpandTransition from '../ExpandTransition.vue';

describe('ExpandTransition.vue', () => {
    it('calls transition handlers and expands', async () => {
        const enterSpy = vi.spyOn(ExpandTransition.methods, 'onEnter');
        const leaveSpy = vi.spyOn(ExpandTransition.methods, 'onLeave');

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
        expect(wrapper.find('.panel').attributes('style')).toBe('height: 0px;');
    });
});
