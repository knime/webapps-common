import { shallowMount } from '@vue/test-utils';

import OpenSourceCredits from '~/ui/components/OpenSourceCredits.vue';
import Description from '~/ui/components/Description.vue';

jest.mock('../../buildtools/opensourcecredits/used-packages.json', () => [], { virtual: true });

describe('license-collector.vue', () => {
    it('renders', () => {
        const wrapper = shallowMount(OpenSourceCredits);
        wrapper.setData({ title: 'test Title' });

        expect(wrapper.find(Description).exists()).toBe(true);
        expect(wrapper.find(Description).props('text')).toContain('This project uses open source software components.');
    });
});
