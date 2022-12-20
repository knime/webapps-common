import { describe, it, expect, beforeEach } from 'vitest';
import { shallowMount } from '@vue/test-utils';

import LegacyBrowserWarning from '../LegacyBrowserWarning.vue';

describe('LegacyBrowserWarning.vue', () => {
    let props;

    beforeEach(() => {
        props = {
            text: 'Testing text'
        };
    });

    it('renders', () => {
        let wrapper = shallowMount(LegacyBrowserWarning, {
            props
        });
        expect(wrapper.html()).toContain('<template>');
        expect(wrapper.html()).toContain(props.text);
        expect(wrapper.html())
            .toContain('<a href="https://browser-update.org/update-browser.html" rel="noopener">Please update your browser</a>');
    });
});
