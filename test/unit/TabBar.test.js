import { shallowMount } from '@vue/test-utils';

import TabBar from '~/ui/components/TabBar.vue';
import WorkflowIcon from '~/ui/assets/img/icons/workflow.svg';
import NodeIcon from '~/ui/assets/img/icons/node.svg';
import Carousel from '~/ui/components/Carousel.vue';

describe('TabBar.vue', () => {
    let possibleValues = [{
        value: 'all',
        label: 'All',
        icon: null,
        disabled: true
    }, {
        value: 'nodes',
        label: 'Nodes',
        icon: NodeIcon,
        title: 'A title',
        disabled: true
    }, {
        value: 'workflows',
        label: 'Workflows',
        icon: WorkflowIcon,
        disabled: false
    }];

    it('renders defaults', () => {
        let wrapper = shallowMount(TabBar);
        expect(wrapper.find('input').length).toBeFalsy();
    });

    it('renders', () => {
        let wrapper = shallowMount(TabBar, {
            propsData: {
                possibleValues,
                value: 'all'
            }
        });

        expect(wrapper.find(Carousel).exists()).toBe(true);
        expect(wrapper.find(NodeIcon).exists()).toBeTruthy();
        expect(wrapper.find('.tab-bar').exists()).toBeTruthy();
        expect(wrapper.find('.overflow').exists()).toBeTruthy();
        expect(wrapper.find('input:checked').attributes('value')).toEqual('all');
    });

    it('can be disabled', () => {
        let wrapper = shallowMount(TabBar, {
            propsData: {
                possibleValues,
                value: 'all',
                disabled: true
            }
        });
        wrapper.findAll('input[type="radio"]').wrappers.forEach(input => {
            expect(input.attributes('disabled')).toBeTruthy();
        });
    });

    it('can be updated', () => {
        let wrapper = shallowMount(TabBar, {
            propsData: {
                possibleValues,
                value: 'nodes'
            }
        });
        wrapper.setProps({
            value: 'workflows'
        });
        expect(wrapper.find('input:checked').attributes('value')).toEqual('workflows');
    });

    it('reacts to selections', () => {
        let wrapper = shallowMount(TabBar, {
            propsData: {
                possibleValues,
                value: 'nodes'
            }
        });

        expect(wrapper.find('input:checked').attributes('value')).toEqual('nodes');
        wrapper.find('input[type="radio"][value="workflows"]').setChecked();
        expect(wrapper.emitted('update:value')).toBeTruthy();
        expect(wrapper.emitted('update:value')[0]).toEqual(['workflows']);
    });

    it('disables tab if empty', () => {
        let wrapper = shallowMount(TabBar, {
            propsData: {
                possibleValues
            }
        });

        expect(wrapper.findAll('input[disabled="disabled"]')).toHaveLength(2);
    });

    it('renders titles', () => {
        let wrapper = shallowMount(TabBar, {
            propsData: {
                possibleValues
            }
        });
        let titledInputs = wrapper.findAll('label[title]');
        expect(titledInputs).toHaveLength(1);
        expect(titledInputs.at(0).element.title).toBe('A title');
    });
});
