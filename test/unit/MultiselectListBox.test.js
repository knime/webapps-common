/* eslint-disable no-magic-numbers */
import { mount } from '@vue/test-utils';

import MultiselectListBox from '~/ui/components/forms/MultiselectListBox';

describe('MultiselectListBox.vue', () => {

    let possibleValues;

    beforeEach(() => {
        possibleValues = [{
            id: 'test1',
            text: 'Test 1'
        }, {
            id: 'test2',
            text: 'Test 2'
        }, {
            id: 'test3',
            text: 'Test 3'
        }, {
            id: 'test4',
            text: 'Test 4'
        }];
    });

    it('renders', () => {
        let propsData = {
            possibleValues,
            value: [],
            ariaLabel: 'A Label'
        };
        const wrapper = mount(MultiselectListBox, {
            propsData
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.findAll('[role=option]').length).toBe(propsData.possibleValues.length);
    });

    it('sets the currentKeyNavIndex to the last selected value', () => {
        const wrapper = mount(MultiselectListBox, {
            propsData: {
                possibleValues,
                value: ['test1', 'test3'],
                ariaLabel: 'A Label'
            }
        });

        expect(wrapper.vm.$data.currentKeyNavIndex).toBe(2);
    });

    it('selects item by click', async () => {
        const wrapper = mount(MultiselectListBox, {
            propsData: {
                possibleValues,
                value: ['test1', 'test3'],
                ariaLabel: 'A Label'
            }
        });

        wrapper.findAll('[role=option]').at(3).trigger('click');
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted().input[0][0]).toStrictEqual(['test4']);
    });

    it('selects item by shift click', async () => {
        const wrapper = mount(MultiselectListBox, {
            propsData: {
                possibleValues,
                value: ['test3'],
                ariaLabel: 'A Label'
            }
        });
        wrapper.findAll('[role=option]').at(3).trigger('click', { shiftKey: true });
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted().input[0][0]).toStrictEqual(['test3', 'test4']);
    });


    it('adds item by ctrl click', async () => {
        const wrapper = mount(MultiselectListBox, {
            propsData: {
                possibleValues,
                value: ['test1'],
                ariaLabel: 'A Label'
            }
        });
        wrapper.findAll('[role=option]').at(3).trigger('click', { ctrlKey: true });
        wrapper.findAll('[role=option]').at(1).trigger('click', { ctrlKey: true });
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted().input[0][0]).toStrictEqual(['test1', 'test4', 'test2']);
    });

    it('adds item by meta (command) click', async () => {
        const wrapper = mount(MultiselectListBox, {
            propsData: {
                possibleValues,
                value: ['test1'],
                ariaLabel: 'A Label'
            }
        });
        wrapper.findAll('[role=option]').at(3).trigger('click', { metaKey: true });
        wrapper.findAll('[role=option]').at(1).trigger('click', { metaKey: true });
        await wrapper.vm.$nextTick();
        // test2 got debounced
        expect(wrapper.emitted().input[0][0]).toStrictEqual(['test1', 'test4']);
    });


    it('selects item by key up', async () => {
        const wrapper = mount(MultiselectListBox, {
            propsData: {
                possibleValues,
                value: ['test3'],
                ariaLabel: 'A Label'
            }
        });
        wrapper.find('[role=listbox]').trigger('keydown.up');
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted().input[0][0]).toStrictEqual(['test2']);
    });

    it('selects item by key up with shift', async () => {
        const wrapper = mount(MultiselectListBox, {
            propsData: {
                possibleValues,
                value: ['test3'],
                ariaLabel: 'A Label'
            }
        });
        wrapper.find('[role=listbox]').trigger('keydown.up', { shiftKey: true });
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted().input[0][0]).toStrictEqual(['test2', 'test3']);
    });

    it('selects item by key down', async () => {
        const wrapper = mount(MultiselectListBox, {
            propsData: {
                possibleValues,
                value: ['test3'],
                ariaLabel: 'A Label'
            }
        });
        wrapper.find('[role=listbox]').trigger('keydown.down');
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted().input[0][0]).toStrictEqual(['test4']);
    });

    it('selects item by key down with shift', async () => {
        const wrapper = mount(MultiselectListBox, {
            propsData: {
                possibleValues,
                value: ['test3'],
                ariaLabel: 'A Label'
            }
        });
        wrapper.find('[role=listbox]').trigger('keydown.down', { shiftKey: true });
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted().input[0][0]).toStrictEqual(['test3', 'test4']);
    });

    it('selects first item by HOME key', async () => {
        const wrapper = mount(MultiselectListBox, {
            propsData: {
                possibleValues,
                value: ['test2'],
                ariaLabel: 'A Label'
            }
        });
        wrapper.find('[role=listbox]').trigger('keydown.home');
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted().input[0][0]).toStrictEqual(['test1']);
    });

    it('selects last item by END key', async () => {
        const wrapper = mount(MultiselectListBox, {
            propsData: {
                possibleValues,
                value: [],
                ariaLabel: 'A Label'
            }
        });
        wrapper.find('[role=listbox]').trigger('keydown.end');
        await wrapper.vm.$nextTick();
        // NOTE:
        // this seems to generate more then one input event even if it shouldn't
        // they keydown.end seems to trigger keydown.home and then keydown.end - nobody really knows why.
        // this sems to only happen with home and end keys
        let emitted = wrapper.emitted().input;
        expect(emitted[emitted.length - 1][0]).toStrictEqual(['test4']);
    });

    it('selects multiple elements on mouse move while mouse down (drag)', async () => {
        const wrapper = mount(MultiselectListBox, {
            propsData: {
                possibleValues,
                value: [],
                ariaLabel: 'A Label'
            }
        });
        wrapper.findAll('[role=option]').at(1).trigger('mousedown');
        wrapper.findAll('[role=option]').at(3).trigger('mousemove');
        await wrapper.vm.$nextTick();

        expect(wrapper.emitted().input[0][0]).toStrictEqual(['test2', 'test3', 'test4']);
    });

});
