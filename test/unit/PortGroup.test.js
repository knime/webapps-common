/* eslint-disable no-magic-numbers */

import { shallowMount } from '@vue/test-utils';

import PortGroup from '../../ui/components/node/PortGroup';
import PortIcon from '../../ui/components/node/PortIcon';
import Description from '../../ui/components/Description';

describe('PortsListItem.vue', () => {

    let propsData, wrapper;

    beforeEach(() => {
        propsData = {
            ports: [
                {
                    color: '#cccccc',
                    type: 'table',
                    typeName: 'Table',
                    optional: true,
                    description: 'Hello world!',
                    name: 'Name1'
                },
                {
                    color: '#abcdef',
                    type: 'flowVariable',
                    typeName: 'Flow Variable',
                    optional: false,
                    description: 'Whatever',
                    name: 'Porty'
                },
                {}
            ],
            title: 'Output Ports'
        };
    });

    describe('renders independent ports', () => {
        beforeEach(() => {
            wrapper = shallowMount(PortGroup, { propsData });
        });

        it('renders title', () => {
            expect(wrapper.find('h6').text()).toEqual('Output Ports');
        });

        it('renders PortIcons', () => {
            const PortIcons = wrapper.findAll(PortIcon);

            expect(PortIcons.at(0).props()).toStrictEqual({
                color: '#cccccc',
                filled: false,
                type: 'table'
            });
            expect(PortIcons.at(1).props()).toStrictEqual({
                color: '#abcdef',
                filled: true,
                type: 'flowVariable'
            });
            expect(PortIcons.at(2).props().type).toBe('table'); // default prop value
        });

        it('renders Port Names', () => {
            const PortNames = wrapper.findAll('.port-name');

            expect(PortNames.length).toEqual(2);
            expect(PortNames.at(0).text()).toEqual('Name1');
            expect(PortNames.at(1).text()).toEqual('Porty');
        });

        it('renders thick Type Names', () => {
            const PortTypes = wrapper.findAll('.port-type.fat');

            expect(PortTypes.length).toEqual(3);
            expect(PortTypes.at(0).text()).toEqual('Type: Table');
            expect(PortTypes.at(1).text()).toEqual('Type: Flow Variable');
            expect(PortTypes.at(2).text()).toEqual('Type:');
        });

        it('renders Port Descriptions', () => {
            const PortDescriptions = wrapper.findAll(Description);

            expect(PortDescriptions.length).toEqual(2);
            expect(PortDescriptions.at(0).props('text')).toEqual('Hello world!');
            expect(PortDescriptions.at(1).props('text')).toEqual('Whatever');
        });
    });

    describe('renders port group', () => {
        beforeEach(() => {
            propsData.groupDescription = 'group';
            wrapper = shallowMount(PortGroup, { propsData });
        });


        it("doesn't render Port Names", () => {
            const PortNames = wrapper.findAll('.port-name');
            expect(PortNames.length).toEqual(0);
        });

        it('renders Type Names', () => {
            const PortTypes = wrapper.findAll('.port-type');

            expect(PortTypes.length).toEqual(3);
            expect(PortTypes.at(0).text()).toEqual('Type: Table');
            expect(PortTypes.at(1).text()).toEqual('Type: Flow Variable');
            expect(PortTypes.at(2).text()).toEqual('Type:');
        });

        it('renders thin typeNames', () => {
            expect(wrapper.find('.port-type.fat').exists()).toBe(false);
        });

        it("renders group description, doesn't render port descriptions", () => {
            const PortDescriptions = wrapper.findAll(Description);
            expect(PortDescriptions.length).toEqual(1);

            expect(PortDescriptions.at(0).props('text')).toEqual('group');

        });
    });
});
