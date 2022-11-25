import { describe, it, expect } from 'vitest'; // TODO enable globals?

import { mount, shallowMount } from '@vue/test-utils';
import FileLink from '../FileLink.vue';

describe('FileLink', () => {
    it('renders link', () => {
        const wrapper = shallowMount(FileLink, {
            props: {
                text: 'Dl Some Stuff',
                href: 'https://example.com/file.pdf'
            }
        });
        expect(wrapper.find('a').exists()).toBeTruthy();
        expect(wrapper.classes()).toEqual(['file-link']);
        const a = wrapper.find('a');
        expect(a.text()).toContain('Dl Some Stuff');
        // no file ext - no icon
        expect(wrapper.find('svg').exists()).toBeFalsy();
        expect(a.attributes('href')).toBe('https://example.com/file.pdf');
        expect(a.attributes('download')).toBe('');
    });

    it('renders with icon', () => {
        const wrapper = mount(FileLink, {
            propsData: {
                text: 'Dl Some Stuff',
                href: 'https://example.com/file.pdf',
                fileExt: 'pdf',
                mimeType: 'application/pdf'
            }
        });
        expect(wrapper.find('a').find('svg').exists()).toBeTruthy();
        expect(wrapper.find('a').attributes('type')).toBe('application/pdf');
    });

    it('renders with size', () => {
        const wrapper = mount(FileLink, {
            propsData: {
                text: 'Dl Some Stuff',
                href: 'https://example.com/file.pdf',
                fileExt: 'pdf',
                mimeType: 'application/pdf',
                size: 847
            }
        });

        expect(wrapper.find('figcaption').text()).toContain('847');
    });

    it('renders with size in Bytes', () => {
        const wrapper = shallowMount(FileLink, {
            propsData: {
                text: 'A Word File',
                href: 'https://example.com/file.doc',
                fileExt: 'doc',
                size: 20
            }
        });
        expect(wrapper.find('abbr').text()).toBe('B');
        expect(wrapper.find('abbr').attributes('title')).toBe('bytes');
        expect(wrapper.find('figcaption').text()).toContain('20');
    });

    it('renders with size in Kilobytes', () => {
        const wrapper = shallowMount(FileLink, {
            propsData: {
                text: 'A Word File',
                href: 'https://example.com/file.doc',
                fileExt: 'doc',
                size: 2000
            }
        });
        expect(wrapper.find('abbr').text()).toBe('KB');
        expect(wrapper.find('abbr').attributes('title')).toBe('kilobytes');
        expect(wrapper.find('figcaption').text()).toContain('1.95');
    });

    it('renders with size in Megabytes', () => {
        const wrapper = shallowMount(FileLink, {
            propsData: {
                text: 'A Word File',
                href: 'https://example.com/file.doc',
                fileExt: 'doc',
                size: 2000000
            }
        });
        expect(wrapper.find('abbr').text()).toBe('MB');
        expect(wrapper.find('abbr').attributes('title')).toBe('megabytes');
        expect(wrapper.find('figcaption').text()).toContain('1.91');
    });

    it('renders with size in Gigabytes', () => {
        const wrapper = shallowMount(FileLink, {
            propsData: {
                text: 'A Word File',
                href: 'https://example.com/file.doc',
                fileExt: 'doc',
                size: 2000000000
            }
        });
        expect(wrapper.find('abbr').text()).toBe('GB');
        expect(wrapper.find('abbr').attributes('title')).toBe('gigabytes');
        expect(wrapper.find('figcaption').text()).toContain('1.86');
    });
});
