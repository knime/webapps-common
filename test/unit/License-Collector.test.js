import { shallowMount } from '@vue/test-utils';

import OpenSourceCredits from '../OpenSourceCredits.vue';
import Description from '../Description.vue';

vi.mock('../../buildtools/opensourcecredits/used-packages.json', () => [], { virtual: true });

describe('license-collector.vue', () => {
    it('renders', () => {
        const wrapper = shallowMount(OpenSourceCredits);
        wrapper.setData({ title: 'test Title' });

        expect(wrapper.findComponent(Description).exists()).toBe(true);
        expect(wrapper.findComponent(Description).props('text')).toContain('This project uses open source software components.');
    });
});
