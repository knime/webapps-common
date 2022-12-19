import { shallowMount } from '@vue/test-utils';

import Label from '../Label.vue';

describe('Label.vue', () => {
    let props;

    beforeEach(() => {
        props = {
            text: 'Testing Label'
        };
    });

    it('renders', () => {
        let wrapper = shallowMount(Label, {
            props,
            slots: {
                default: 'slot content'
            }
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.text()).toContain(props.text);
        expect(wrapper.text()).toContain('slot content');
    });

    it('renders compact class if prop set', () => {
        let wrapper = shallowMount(Label, {
            props: {
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
