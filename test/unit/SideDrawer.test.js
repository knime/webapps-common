import { shallowMount } from '@vue/test-utils';
import SideDrawer from '~/ui/components/SideDrawer.vue';

const assertExpandStatus = (wrapper, isExpanded) => {
    expect(wrapper.find('.sideDrawer').exists()).toBe(isExpanded);
    expect(wrapper.find('.content').exists()).toBe(isExpanded);
};

describe('SideDrawer.vue', () => {
    let wrapper;
    beforeEach(() => {
        wrapper = shallowMount(SideDrawer);
    });

    it('renders collapsed state by default', () => {
        assertExpandStatus(wrapper, false);
    });

    it('can toggle', () => {
        wrapper.setProps({ isExpanded: true });

        assertExpandStatus(wrapper, true);

        wrapper.setProps({ isExpanded: false });

        assertExpandStatus(wrapper, false);
    });
});
