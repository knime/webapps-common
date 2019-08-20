import { mount } from '@vue/test-utils';

import Description from '~/ui/components/Description';

describe('Description.vue', () => {
    it('renders plain text', () => {
        const text = '<p>testtext</p>';
        const wrapper = mount(Description, {
            propsData: {
                text
            }
        });
        expect(wrapper.is('div')).toBeTruthy();
        expect(wrapper.classes()).toContain('plain');
        expect(wrapper.text()).toEqual(text);
    });

    it('renders html', () => {
        const html = '<p>testtext</p>';
        const wrapper = mount(Description, {
            propsData: {
                text: html,
                renderAsHtml: true
            }
        });
        expect(wrapper.is('div')).toBeTruthy();
        expect(wrapper.classes()).not.toContain('plain');
        expect(wrapper.html()).toContain(html);
    });

    it('renders html via slot', () => {
        const html = '<p>testtext</p>';
        const wrapper = mount(Description, {
            slots: {
                default: [html]
            }
        });
        expect(wrapper.is('div')).toBeTruthy();
        expect(wrapper.classes()).not.toContain('plain');
        expect(wrapper.html()).toContain(html);
    });
});
