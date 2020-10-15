import { shallowMount } from '@vue/test-utils';

import PortIcon from '../../../ui/components/node/PortIcon2';

describe('PortIcon', () => {
    let wrapper;

    it('renders holey port', () => {
        wrapper = shallowMount(PortIcon, {
            propsData: {
                color: 'yellow',
                filled: false
            }
        });
        expect(wrapper.attributes().stroke).toBe('yellow');
        expect(wrapper.attributes().fill).toBe('white');
    });

    it('renders filled port', () => {
        wrapper = shallowMount(PortIcon, {
            propsData: {
                color: 'yellow',
                filled: true
            }
        });
        expect(wrapper.attributes().stroke).toBe('yellow');
        expect(wrapper.attributes().fill).toBe('yellow');
    });

    it.each([
        ['table', 'polygon'],
        ['flowVariable', 'circle'],
        ['other', 'rect']
    ])('DataType %s', (dataType, tag) => {
        wrapper = shallowMount(PortIcon, { propsData: { dataType } });
        expect(wrapper.find(tag).exists()).toBeTruthy()
    });
});