import { mount } from '@vue/test-utils';
import Tooltip from '~/ui/components/Tooltip.vue';

import { createPopper } from '@popperjs/core';
jest.mock('@popperjs/core', () => ({
    createPopper: jest.fn()
}));

describe('Tooltip', () => {
    let wrapper;

    const placement = 'top-end';
    const slotComponent = '<span class="special">Can you feel the thunder inside?</span>';
    const text = 'Make a lightning crack as you ride!';

    const popperPadding = 8;
    const popperOffset = 12;

    beforeEach(() => {
        wrapper = mount(Tooltip, {
            propsData: {
                text,
                placement
            },
            slots: {
                default: slotComponent
            }
        });
    });

    it('renders', () => {
        expect(wrapper.find('.special').exists()).toBe(true);
        expect(wrapper.find('.special').text()).toBe('sometext');
        expect(wrapper.text()).toContain('My text');
    });

    it('initializes popper on mouse enter', () => {
        wrapper.find('.tooltip').trigger('mouseenter');
        expect(createPopper).toHaveBeenCalledWith(
            expect.anything(),
            expect.anything(),
            {
                placement,
                modifiers: [{
                    name: 'preventOverflow',
                    options: {
                        padding: popperPadding
                    }
                }, {
                    name: 'offset',
                    options: {
                        offset: [0, popperOffset]
                    }
                }]
            }
        );
    });
});
