import { shallowMount } from '@vue/test-utils';

import Label from '~/ui/components/forms/Label';

describe('Label.vue', () => {
    let context, propsData;

    beforeEach(() => {
        propsData = {
            label: 'Testing Label'
        };
    });

    it('renders', () => {
        let wrapper = shallowMount(Label, {
            ...context,
            propsData
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
    });

    it('has default props', () => {
        let wrapper = shallowMount(Label, {
            ...context
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
    });
});
