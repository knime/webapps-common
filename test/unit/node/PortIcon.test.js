import { shallowMount } from '@vue/test-utils';

import PortIcon from '../../../ui/components/node/PortIcon.vue';
import * as portColors from '../../../ui/colors/portColors.mjs';

describe('PortIcon', () => {
    let wrapper;

    it('renders holey port', () => {
        wrapper = shallowMount(PortIcon, {
            propsData: {
                type: 'other',
                color: 'yellow',
                filled: false
            }
        });
        expect(wrapper.attributes().stroke).toBe('yellow');
        expect(wrapper.attributes().fill).toBe('transparent');
    });

    it.each([
        ['table', 'polygon', portColors.table],
        ['flowVariable', 'circle', portColors.flowVariable],
        ['other', 'rect', '']
    ])('Renders filled port: DataType %s', (type, tag, color) => {
        wrapper = shallowMount(PortIcon, {
            propsData: {
                type,
                filled: true
            }
        });
        expect(wrapper.find(tag).exists()).toBeTruthy();
        expect(wrapper.attributes().stroke).toBe(color);
        expect(wrapper.attributes().fill).toBe(color);
    });
});
