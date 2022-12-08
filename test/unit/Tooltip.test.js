import { mount } from '@vue/test-utils';
import Tooltip from '~/ui/components/Tooltip.vue';

import { createPopper } from '@popperjs/core';
jest.mock('@popperjs/core', () => ({
    createPopper: jest.fn()
}));

describe('Tooltip', () => {
    let wrapper;

    const placement = 'top-end';
    const slotText = 'Can you feel the thunder inside?';
    const slotComponent = `<span class="ramrod">${slotText}</span>`;
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
        expect(wrapper.find('.ramrod').exists()).toBe(true);
        expect(wrapper.find('.ramrod').text()).toBe(slotText);
        expect(wrapper.text()).toContain(text);
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
