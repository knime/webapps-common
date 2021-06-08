import { mount } from '@vue/test-utils';
import Tooltip from '~/ui/components/Tooltip';

describe('Tooltip', () => {
    it('renders', () => {
        const wrapper = mount(Tooltip, {
            propsData: {
                text: 'My text'
            },
            slots: {
                default: '<span class="special">sometext</span>'
            }
        });
        expect(wrapper.find('.special').exists()).toBe(true);
        expect(wrapper.find('.special').text()).toBe('sometext');
        expect(wrapper.text()).toContain('My text');
    });
});
