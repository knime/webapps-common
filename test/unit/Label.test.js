import { shallowMount } from '@vue/test-utils';

import Label from '~/ui/components/forms/Label';

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

    it('renders compact class if prop set', () => {
        let wrapper = shallowMount(Label, {
            propsData: {
                compact: true
            }
        });
        expect(wrapper.find('label').classes()).toContain('compact');
    });

    it('renders compact class if compactLabels is provided by a parent component', () => {
        let wrapper = shallowMount(Label, {
            provide: {
                compactLabels: true
            }
        });
        expect(wrapper.find('label').classes()).toContain('compact');
    });
});
