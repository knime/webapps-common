import { shallowMount } from '@vue/test-utils';

import PortsListItem from '../../ui/components/node/PortsListItem';
import PortIcon from '../../ui/components/node/PortIcon2';
import Description from '../../ui/components/Description';

describe('PortsListItem.vue', () => {
    it('renders', () => {
        const wrapper = shallowMount(PortsListItem);
        expect(wrapper.is('div')).toBeTruthy();
        expect(wrapper.text()).toEqual('Input ports');
    });

    it('renders ports', () => {
        const wrapper = shallowMount(PortsListItem, {
            propsData: {
                ports: [
                    {
                        color: 'cccccc',
                        dataType: 'Data',
                        optional: true,
                        description: 'Hello world!',
                        name: 'Name1'
                    },
                    {
                        color: 'abcdef',
                        dataType: 'Flow Variable',
                        optional: false,
                        description: 'Whatever'
                    },
                    {}
                ],
                title: 'Output Ports'
            }
        });
        expect(wrapper.find('h6').text()).toEqual('Output Ports');
        expect(wrapper.findAll('.type').at(0).text()).toEqual('Type: Data');
        expect(wrapper.findAll('.type').at(1).text()).toEqual('Type: Flow Variable');

        expect(wrapper.findAll(Description).at(0).props('text')).toEqual('Hello world!');
        expect(wrapper.findAll(Description).at(1).props('text')).toEqual('Whatever');

        const PortIcons = wrapper.findAll(PortIcon);
        expect(PortIcons.length).toEqual(3);
        expect(PortIcons.at(0).props()).toStrictEqual({
            color: '#cccccc',
            filled: false,
            dataType: 'table',
        });
        expect(PortIcons.at(1).props()).toStrictEqual({
            color: '#abcdef',
            filled: true,
            dataType: 'flowVariable',
        });
        expect(PortIcons.at(2).props().dataType).toBe('other');

        expect(wrapper.find('svg').exists()).toBeTruthy();
        expect(wrapper.findAll('svg title').at(0).text()).toEqual('Name1');
        expect(wrapper.findAll('svg title').at(1).text()).toEqual('Flow Variable');
    });
});
