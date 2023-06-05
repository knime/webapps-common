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

    it('renders big class if prop set', () => {
        let wrapper = shallowMount(Label, {
            propsData: {
                big: true
            }
        });
        expect(wrapper.find('label').classes()).toContain('big');
    });

    it('renders big class if bigLabels is provided by a parent component', () => {
        let wrapper = shallowMount(Label, {
            provide: {
                bigLabels: true
            }
        });
        expect(wrapper.find('label').classes()).toContain('big');
    });
});
