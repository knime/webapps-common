import { shallowMount } from '@vue/test-utils';

import NodePreview from '../../../ui/components/node/NodePreview';
import NodeTorsoNormal from '../../../ui/components/node/NodeTorsoNormal';
import PortIcon from '../../../ui/components/node/PortIcon';

describe('NodeIconGenerated.vue', () => {
    it('renders node torso', () => {
        const wrapper = shallowMount(NodePreview, {
            propsData: {
                type: 'A',
                isComponent: true,
                icon: 'data:image/icon'
            }
        });
        expect(wrapper.find(NodeTorsoNormal).props()).toStrictEqual({
            type: 'A',
            isComponent: true,
            icon: 'data:image/icon'
        });
    });

    it('creates port icons', () => {
        const wrapper = shallowMount(NodePreview, {
            propsData: {
                inPorts: [{
                    color: '#000',
                    optional: true,
                    dataType: 'flowVariable'
                }],
                outPorts: [{
                    color: '#fff',
                    optional: false,
                    dataType: 'table'
                }, {
                    color: '#888',
                    optional: true,
                    dataType: 'other'
                }]
            }
        });
        let portIcons = wrapper.findAll(PortIcon);
        expect(portIcons.at(0).props()).toStrictEqual({
            color: '#000',
            filled: false,
            dataType: 'flowVariable'
        });
        expect(portIcons.at(0).attributes().transform).toBe('translate(-4.5, 16)');

        expect(portIcons.at(1).props()).toStrictEqual({
            color: '#fff',
            filled: true,
            dataType: 'table'
        });
        expect(portIcons.at(1).attributes().transform).toBe('translate(36.5, 5.5)');

        expect(portIcons.at(2).props()).toStrictEqual({
            color: '#888',
            filled: false,
            dataType: 'other'
        });
        expect(portIcons.at(2).attributes().transform).toBe('translate(36.5, 26.5)');

    });

    it('renders dynamic Ports indicator', () => {
        const wrapper = shallowMount(NodePreview, {
            propsData: {
                hasDynPorts: true
            }
        });

        // eslint-disable-next-line no-magic-numbers
        expect(wrapper.findAll('circle').length).toBe(3);
    });
});
