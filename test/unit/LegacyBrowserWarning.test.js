import { shallowMount } from '@vue/test-utils';

import LegacyBrowserWarning from '~/ui/components/LegacyBrowserWarning';

describe('Label.vue', () => {
    let propsData;

    beforeEach(() => {
        propsData = {
            text: 'Testing text'
        };
    });

    it('renders', () => {
        let wrapper = shallowMount(LegacyBrowserWarning, {
            propsData
        });
        expect(wrapper.html()).toContain('<template>');
        expect(wrapper.html()).toContain(propsData.text);
        expect(wrapper.html())
            .toContain('<a href="https://browser-update.org/update-browser.html">Please update your browser</a>');
    });

});
