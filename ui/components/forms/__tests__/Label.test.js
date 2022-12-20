import { describe, it, expect, beforeEach } from 'vitest';
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
        const wrapper = shallowMount(Label, {
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
        const wrapper = shallowMount(Label, {
            props: {
                compact: true
            }
        });
        expect(wrapper.find('label').classes()).toContain('compact');
    });

    it('renders compact class if compactLabels is provided by a parent component', () => {
        const wrapper = shallowMount(Label, {
            global: {
                provide: {
                    compactLabels: true
                }
            }
        });
        expect(wrapper.find('label').classes()).toContain('compact');
    });
});
