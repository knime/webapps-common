import { shallowMount } from '@vue/test-utils';

import PortsList from '../../../ui/components/node/PortsList';
import PortGroup from '../../../ui/components/node/PortGroup';

describe('PortsList.vue', () => {
    it('renders', () => {
        const wrapper = shallowMount(PortsList);
        expect(wrapper.find(PortsList)).toBeTruthy();
    });

    it('accepts inPorts', () => {
        const wrapper = shallowMount(PortsList, {
            propsData: {
                inPorts: [{
                    foo: 'bar'
                }]
            }
        });
        expect(wrapper.is('div')).toBeTruthy();
        expect(wrapper.findAll(PortGroup).length).toEqual(1);
        expect(wrapper.find(PortGroup).props('ports')).toEqual([{ foo: 'bar' }]);
    });

    it('accepts outPorts', () => {
        const wrapper = shallowMount(PortsList, {
            propsData: {
                outPorts: [{
                    baz: 'qux'
                }]
            }
        });
        expect(wrapper.findAll(PortGroup).length).toEqual(1);
        expect(wrapper.find(PortGroup).props('ports')).toEqual([{ baz: 'qux' }]);
    });

    it('accepts inPorts and outPorts', () => {
        const wrapper = shallowMount(PortsList, {
            propsData: {
                inPorts: [{
                    foo: 'bar'
                }],
                outPorts: [{
                    baz: 'qux'
                }]
            }
        });
        let allPortsListItems = wrapper.findAll(PortGroup);
        expect(allPortsListItems.length).toEqual(2);
        expect(allPortsListItems.at(0).props('ports')).toEqual([{ foo: 'bar' }]);
        expect(allPortsListItems.at(1).props('ports')).toEqual([{ baz: 'qux' }]);
    });

    it('accepts dynInPorts and dynOutPorts', () => {
        const wrapper = shallowMount(PortsList, {
            propsData: {
                dynInPorts: [{
                    types: [{ foo: 'bar' }]

                }],
                dynOutPorts: [{
                    types: [{ baz: 'qux' }]

                }],
                inPorts: [{
                    foo: 'foo'
                }],
                outPorts: [{
                    baz: 'baz'
                }]
            }
        });
        let allPortsListItems = wrapper.findAll(PortGroup);
        // eslint-disable-next-line no-magic-numbers
        expect(allPortsListItems.length).toEqual(4);
        expect(allPortsListItems.at(2).props('ports')).toEqual([{ foo: 'bar' }]);
        // eslint-disable-next-line no-magic-numbers
        expect(allPortsListItems.at(3).props('ports')).toEqual([{ baz: 'qux' }]);
    });
});
