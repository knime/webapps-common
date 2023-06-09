import { shallowMount } from '@vue/test-utils';

import Label from '~/ui/components/forms/Label.vue';

describe('Label.vue', () => {
    let propsData;

    beforeEach(() => {
        propsData = {
            text: 'Testing Label'
        };
    });

    it('renders', () => {
        let wrapper = shallowMount(Label, {
            propsData,
            slots: {
                default: 'slot content'
            }
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.text()).toContain(propsData.text);
        expect(wrapper.text()).toContain('slot content');
    });

    it('renders large class if prop set', () => {
        let wrapper = shallowMount(Label, {
            propsData: {
                large: true
            }
        });
        expect(wrapper.find('label').classes()).toContain('large');
    });

    it('renders large class if largeLabels is provided by a parent component', () => {
        let wrapper = shallowMount(Label, {
            provide: {
                largeLabels: true
            }
        });
        expect(wrapper.find('label').classes()).toContain('large');
    });
});
