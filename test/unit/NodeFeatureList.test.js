import { shallowMount } from '@vue/test-utils';

import NodeFeatureList from '../../ui/components/node/NodeFeatureList';
import TabBar from '../../ui/components/TabBar';
import PortsList from '../../ui/components/node/PortsList';
import DialogOptions from '../../ui/components/node/DialogOptions';
import ViewsList from '../../ui/components/node/ViewsList';

describe('NodeFeatureList.vue', () => {
    it('renders ports and options', () => {
        const wrapper = shallowMount(NodeFeatureList, {
            propsData: {
                inPorts: [{
                    dummy: 'inPort'
                }],
                outPorts: [{
                    dummy: 'outPort'
                }],
                dynInPorts: [{
                    dummy: 'dynInPort'
                }],
                dynOutPorts: [{
                    dummy: 'dynOutPort'
                }],
                dialogs: [{
                    dummy: 'dialog'
                }],
                views: [{
                    dummy: 'view'
                }]
            }
        });

        expect(wrapper.find(TabBar).props('value')).toEqual('ports');
        expect(wrapper.find(PortsList).props('inPorts')).toEqual([{ dummy: 'inPort' }]);
        expect(wrapper.find(PortsList).props('outPorts')).toEqual([{ dummy: 'outPort' }]);
        expect(wrapper.find(PortsList).props('dynInPorts')).toEqual([{ dummy: 'dynInPort' }]);
        expect(wrapper.find(PortsList).props('dynOutPorts')).toEqual([{ dummy: 'dynOutPort' }]);
        wrapper.find(TabBar).vm.$emit('update:value', 'node-dialog-options');
        expect(wrapper.find(DialogOptions).props('options')).toEqual([{ dummy: 'dialog' }]);
        wrapper.find(TabBar).vm.$emit('update:value', 'views');
        expect(wrapper.find(ViewsList).props('views')).toEqual([{ dummy: 'view' }]);
    });

    it('displays default placeholder if all tabs are empty', () => {
        const wrapper = shallowMount(NodeFeatureList);
        expect(wrapper.find(TabBar).props('value')).toEqual(null);
        expect(wrapper.find('.placeholder').text()).toEqual('This node does not provide any ports, options or views.');
    });

    it('displays custom placeholder text if all tabs are empty', () => {
        const wrapper = shallowMount(NodeFeatureList, {
            propsData: {
                emptyText: 'This is a placeholder text!'
            }
        });
        expect(wrapper.find(TabBar).props('value')).toEqual(null);
        expect(wrapper.find('.placeholder').text()).toEqual('This is a placeholder text!');
    });

    it('selects second tab if first is empty', () => {
        const wrapper = shallowMount(NodeFeatureList, {
            propsData: {
                dialogs: [{
                    dummy: 'dialog'
                }]
            }
        });

        expect(wrapper.find(TabBar).props('value')).toEqual('node-dialog-options');
    });

    it('disables ports tab if there are no ports', () => {
        const wrapper = shallowMount(NodeFeatureList, {
            propsData: {
                dialogs: [{
                    dummy: 'dialog'
                }]
            }
        });
        expect(wrapper.vm.possibleTabValues.find(cfg => cfg.value === 'ports').disabled).toBe(true);
    });

    it('enables ports tab if there are ports', () => {
        const wrapper = shallowMount(NodeFeatureList, {
            propsData: {
                inPorts: [{
                    dummy: 'port'
                }]
            }
        });
        expect(wrapper.vm.possibleTabValues.find(cfg => cfg.value === 'ports').disabled).toBe(false);
    });

    it('disables views tab if there are no views', () => {
        const wrapper = shallowMount(NodeFeatureList, {
            propsData: {
                dialogs: [{
                    dummy: 'dialog'
                }]
            }
        });
        expect(wrapper.vm.possibleTabValues.find(cfg => cfg.value === 'views').disabled).toBe(true);
    });

    it('enables views tab if there are views', () => {
        const wrapper = shallowMount(NodeFeatureList, {
            propsData: {
                views: [{
                    dummy: 'view'
                }]
            }
        });
        expect(wrapper.vm.possibleTabValues.find(cfg => cfg.value === 'views').disabled).toBe(false);
    });

    it('disables options tab if there are no options', () => {
        const wrapper = shallowMount(NodeFeatureList, {
            propsData: {
                views: [{
                    dummy: 'dialog'
                }]
            }
        });
        expect(wrapper.vm.possibleTabValues.find(cfg => cfg.value === 'node-dialog-options').disabled).toBe(true);
    });

    it('enables views tab if there are views', () => {
        const wrapper = shallowMount(NodeFeatureList, {
            propsData: {
                dialogs: [{
                    dummy: 'view'
                }]
            }
        });
        expect(wrapper.vm.possibleTabValues.find(cfg => cfg.value === 'node-dialog-options').disabled).toBe(false);
    });
});
