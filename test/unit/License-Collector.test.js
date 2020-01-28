import { shallowMount } from '@vue/test-utils';

import LicenseCollector from '~/ui/pages/license-collector.vue';
import Description from '~/ui/components/Description.vue';

describe('license-collector.vue', () => {

    it('renders', () => {
        const wrapper = shallowMount(LicenseCollector);
        wrapper.setData({ title: 'test Title' });

        expect(wrapper.find(Description).exists()).toBe(true);
        expect(wrapper.find(Description).props('text')).toContain('This project uses open source software components.');
    });

});
