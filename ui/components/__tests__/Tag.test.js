import { describe, it, expect, test } from 'vitest';
import { mount } from '@vue/test-utils';

import Tag from '../Tag.vue';

describe('Tag.vue', () => {
    it('renders not clickable tag', () => {
        const wrapper = mount(Tag, {
            slots: {
                default: '<span>something</span>'
            } 
        });
        expect(wrapper.text()).toEqual('something');
        expect(wrapper.classes()).not.toContain('clickable');
        expect(wrapper.classes()).not.toContain('active');
    });

    it('renders clickable tag', () => {
        const wrapper = mount(Tag, {
            props: {
                clickable: true
            },
            slots: {
                default: '<span>something</span>'
            } 
        });
        expect(wrapper.text()).toEqual('something');
        expect(wrapper.classes()).toContain('clickable');
        expect(wrapper.classes()).not.toContain('active');

    });

    it('renders active tag', () => {
        const wrapper = mount(Tag, {
            props: {
                active: true
            },
            slots: {
                default: '<span>something</span>'
            } 
        });
        expect(wrapper.text()).toEqual('something');
        expect(wrapper.classes()).not.toContain('clickable');
        expect(wrapper.classes()).toContain('active');

    });
    

});
