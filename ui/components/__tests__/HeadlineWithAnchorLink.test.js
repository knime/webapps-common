import { describe, it, expect, vi } from 'vitest';

import { shallowMount } from '@vue/test-utils';
import HeadlineWithAnchorLink from '../HeadlineWithAnchorLink.vue';
import FunctionButton from '../FunctionButton.vue';
import LinkIcon from '../../assets/img/icons/link.svg';
import Tooltip from '../Tooltip.vue';

const useClipboardMock = {
    copy: vi.fn()
};

vi.mock('@vueuse/core', () => ({
    useClipboard: vi.fn(() => useClipboardMock)
}));


describe('HeadlineWithAnchorLink.vue', () => {
    it('renders', () => {
        const wrapper = shallowMount(HeadlineWithAnchorLink, {
            props: {
                title: 'Button'
            }
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.find('h2').exists()).toBeTruthy();
        expect(wrapper.findComponent(FunctionButton).exists()).toBeTruthy();
        expect(wrapper.findComponent(Tooltip).exists()).toBeTruthy();
        expect(wrapper.findComponent(LinkIcon).exists()).toBeTruthy();
    });

    it('handles copy link', () => {
        const url = 'http://knime.com/';
        const title = 'Button';
        Object.defineProperty(window, 'location', {
            value: new URL(url)
        });

        window.location.href = url;
        const wrapper = shallowMount(HeadlineWithAnchorLink, {
            props: {
                title
            }
        });
        wrapper.findComponent(FunctionButton).vm.$emit('click');
        expect(useClipboardMock.copy).toHaveBeenCalledWith(`${url}?q=${title}`);
    });
});

