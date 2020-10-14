import { shallowMount } from '@vue/test-utils';

import NodeIconGenerated from '../../ui/components/node/NodeIconGenerated';
import PortIcon from '../../ui/components/node/PortIcon';

describe('NodeIconGenerated.vue', () => {
    it('renders', () => {
        const wrapper = shallowMount(NodeIconGenerated);
        expect(wrapper.is('svg')).toBeTruthy();
    });

    it('uses the correct background and path', () => {
        let wrapper = shallowMount(NodeIconGenerated, {
            propsData: {
                nodeType: 'Predictor'
            }
        });

        expect(wrapper.findAll('svg > path').length).toBe(1);

        expect(wrapper.find('svg > path').attributes('fill')).toBe('#4EAF75');
        expect(wrapper.find('svg > path').attributes('d')).toBe('M0,29.2L0,2.8C0,1.3,1.3,0,2.8,0l26.3,0C30.7,0,32,1.3' +
            ',32,2.8v26.3c0,1.6-1.3,2.8-2.8,2.8H2.8C1.3,32,0,30.7,0,29.2z');

        wrapper = shallowMount(NodeIconGenerated, {
            propsData: {
                nodeType: 'ScopeEnd'
            }
        });
        expect(wrapper.find('svg > path').attributes('fill')).toBe('#92548D');
        expect(wrapper.find('svg > path').attributes('d')).toBe(
            'M32,2.8v26.3c0,1.6-1.3,2.8-2.8,2.8H4L0,16.1L4,0l25.2,0C30.7,0,32,1.3,32,2.8z'
        );
    });

    it('renders a pictogram', () => {
        const pictogram = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAAATlBMVEXw20+ypESpnEPE' +
            'tEeekkHMu0lSTzWGfT0yMzDq1U54cDvUwkpmYTiom0Pjz0yTiT+1pkXq1k6YjUCbj0GShz+3qEV6cjvcyUummUJ1bjpMp0snAAAATUlE' +
            'QVQYGcXAyQ2AIBRF0auC76M4z/03aoKRjQV4+FdZcszyZBKxWerAS8JOApmEs8uTSVBFq3j0SHhoROLqwbbWdmcFSehUTLSrRr5unv0C' +
            'GpFau18AAAAASUVORK5CYII=';
        let wrapper = shallowMount(NodeIconGenerated, {
            propsData: {
                pictogram
            }
        });

        expect(wrapper.find('image').attributes('href')).toBe(pictogram);
    });


    it('creates port icons', () => {
        const wrapper = shallowMount(NodeIconGenerated, {
            propsData: {
                inPorts: [{
                    color: 'red',
                    optional: true,
                    dataType: 'foo'
                }],
                outPorts: [{
                    color: 'blue',
                    optional: false,
                    dataType: 'bar'
                }, {
                    color: 'green',
                    optional: true,
                    dataType: 'baz'
                }]
            }
        });
        let portIcons = wrapper.findAll(PortIcon);
        expect(portIcons.at(0).props()).toMatchObject({
            color: 'red',
            optional: true,
            dataType: 'foo',
            index: 0,
            total: 1
        });
        expect(portIcons.at(1).props()).toMatchObject({
            color: 'blue',
            optional: false,
            dataType: 'bar',
            index: 0,
            total: 2
        });
        expect(portIcons.at(2).props()).toMatchObject({
            color: 'green',
            optional: true,
            dataType: 'baz',
            index: 1,
            total: 2
        });
    });

    it('renders component icons', () => {
        const wrapper = shallowMount(NodeIconGenerated, {
            propsData: {
                isComponent: true,
                nodeType: 'Visualizer',
                inPorts: [{
                    color: 'red',
                    optional: true,
                    dataType: 'foo'
                }],
                outPorts: [{
                    color: 'blue',
                    optional: false,
                    dataType: 'bar'
                }, {
                    color: 'green',
                    optional: true,
                    dataType: 'baz'
                }]
            }
        });

        expect(wrapper.findAll('svg > path').length).toBe(2);

        expect(wrapper.findAll('svg > path').at(0).attributes('fill')).toBe('#BDBEBE');
        expect(wrapper.findAll('svg > path').at(1).attributes('fill')).toBe('#4BA1BF');

    });

    it('renders dynamic Ports indicator', () => {
        const wrapper = shallowMount(NodeIconGenerated, {
            propsData: {
                inPorts: [{
                    color: 'red',
                    optional: true,
                    dataType: 'foo'
                }],
                outPorts: [{
                    color: 'blue',
                    optional: false,
                    dataType: 'bar'
                }, {
                    color: 'green',
                    optional: true,
                    dataType: 'baz'
                }],
                hasDynPorts: true
            }
        });

        // eslint-disable-next-line no-magic-numbers
        expect(wrapper.findAll('circle').length).toBe(3);
    });

});
