/* eslint-disable no-magic-numbers */
import { mount } from '@vue/test-utils';

import MultiselectListBox from '~/ui/components/forms/MultiselectListBox';

describe('MultiselectListBox.vue', () => {

    let possibleValues;

    beforeEach(() => {
        possibleValues = [{
            id: 'test1',
            text: 'Option 1'
        }, {
            id: 'test2',
            text: 'Option 2'
        }, {
            id: 'test3',
            text: 'Option 3'
        }, {
            id: 'test4',
            text: 'Option 4'
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

        let options = wrapper.findAll('[role=option]');
        expect(options.length).toBe(propsData.possibleValues.length);
        propsData.possibleValues.forEach((value, i) => {
            expect(options.at(i).text()).toContain(value.text);
        });
    });

    it('renders with default possibleValues', () => {
        let propsData = {
            ariaLabel: 'A Label'
        };
        const wrapper = mount(MultiselectListBox, {
            propsData
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.findAll('[role=option]').length).toBe(0);
    });

    it('updates the currentKeyNavIndex to the last selected value', () => {
        const wrapper = mount(MultiselectListBox, {
            propsData: {
                possibleValues,
                value: ['test1', 'test3'],
                ariaLabel: 'A Label'
            }
        });

        expect(wrapper.vm.$data.currentKeyNavIndex).toBe(2);
    });

    describe('mouse click', () => {

        it('selects item on click', async () => {
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

        it('adds item to selected while holding shift key', async () => {
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


        it('adds item to selected while holding ctrl key', async () => {
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

        it('removes item from selected while holding ctrl key', async () => {
            const wrapper = mount(MultiselectListBox, {
                propsData: {
                    possibleValues,
                    value: ['test1', 'test2', 'test4'],
                    ariaLabel: 'A Label'
                }
            });
            wrapper.findAll('[role=option]').at(3).trigger('click', { ctrlKey: true });
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual(['test1', 'test2']);
        });


        it('adds items to selected while holding meta (mac: command) key', async () => {
            const wrapper = mount(MultiselectListBox, {
                propsData: {
                    possibleValues,
                    value: ['test1'],
                    ariaLabel: 'A Label'
                }
            });

            // wait 300ms to get debounce code executed (and tested)
            let promise = new Promise((resolve, reject) => {
                setTimeout(() => resolve(), 300);
            });

            wrapper.findAll('[role=option]').at(3).trigger('click', { metaKey: true });
            wrapper.findAll('[role=option]').at(1).trigger('click', { metaKey: true });

            // do the wait
            await promise;

            expect(wrapper.emitted().input[0][0]).toStrictEqual(['test1', 'test4', 'test2']);
        });
    });

    describe('keyboard navigation', () => {

        it('selects all by CTRL+a', async () => {
            const wrapper = mount(MultiselectListBox, {
                propsData: {
                    possibleValues,
                    value: ['test3'],
                    ariaLabel: 'A Label'
                }
            });
            wrapper.find('[role=listbox]').trigger('keydown.a', { ctrlKey: true });
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual(['test1', 'test2', 'test3', 'test4']);
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
            // this seems to generate more than one input event even if it shouldn't
            // they keydown.end seems to trigger keydown.home and then keydown.end - nobody really knows why.
            // this sems to only happen with home and end keys
            let emitted = wrapper.emitted().input;
            expect(emitted[emitted.length - 1][0]).toStrictEqual(['test4']);
        });
    });

    describe('methods and events', () => {

        it('validation of possibleValues', () => {
            const wrapper = mount(MultiselectListBox, {
                propsData: {
                    ariaLabel: 'A Label'
                }
            });

            const propPossibleValues = wrapper.vm.$options.props.possibleValues;
            expect(propPossibleValues.required).toBeFalsy();
            expect(propPossibleValues.type).toBe(Array);
            expect(propPossibleValues.validator && propPossibleValues.validator('str')).toBeFalsy();
            expect(propPossibleValues.validator && propPossibleValues.validator([])).toBeTruthy();
        });

        it('clearSelection', () => {
            const wrapper = mount(MultiselectListBox, {
                propsData: {
                    possibleValues,
                    value: ['test2', 'test3', 'test4'],
                    ariaLabel: 'A Label'
                }
            });
            expect(wrapper.vm.hasSelection()).toStrictEqual(true);
            wrapper.vm.clearSelection();
            expect(wrapper.emitted().input[0][0]).toStrictEqual([]);
        });

        it('keyArrowLeft event', async () => {
            const wrapper = mount(MultiselectListBox, {
                propsData: {
                    possibleValues,
                    value: ['test3'],
                    ariaLabel: 'A Label'
                }
            });
            wrapper.find('[role=listbox]').trigger('keydown.left');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().keyArrowLeft[0][0]).toStrictEqual(['test3']);
        });

        it('keyArrowRight event', async () => {
            const wrapper = mount(MultiselectListBox, {
                propsData: {
                    possibleValues,
                    value: ['test3'],
                    ariaLabel: 'A Label'
                }
            });
            wrapper.find('[role=listbox]').trigger('keydown.right');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().keyArrowRight[0][0]).toStrictEqual(['test3']);
        });

        it('activated doubleClickOnItem', async () => {
            const wrapper = mount(MultiselectListBox, {
                propsData: {
                    possibleValues,
                    value: [],
                    ariaLabel: 'A Label'
                }
            });
            wrapper.findAll('[role=option]').at(2).trigger('dblclick');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().doubleClickOnItem[0][0]).toStrictEqual('test3');
        });

        it('activated doubleClickShift', async () => {
            const wrapper = mount(MultiselectListBox, {
                propsData: {
                    possibleValues,
                    value: ['test1', 'test2'],
                    ariaLabel: 'A Label'
                }
            });
            wrapper.findAll('[role=option]').at(1).trigger('dblclick', { shiftKey: true });
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().doubleClickShift[0][0]).toStrictEqual(['test1', 'test2']);
        });

    });

    describe('drag', () => {

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

        it('deselects multiple elements on mouse move while mouse down (drag) with ctrl down', async () => {
            const wrapper = mount(MultiselectListBox, {
                propsData: {
                    possibleValues,
                    value: ['test1', 'test2', 'test3'],
                    ariaLabel: 'A Label'
                }
            });
            // select
            wrapper.findAll('[role=option]').at(1).trigger('mousedown', { ctrlKey: true });
            wrapper.findAll('[role=option]').at(3).trigger('mousemove', { ctrlKey: true });
            wrapper.vm.stopDrag();
            await wrapper.vm.$nextTick();

            expect(wrapper.emitted().input[0][0]).toStrictEqual(['test1']);
        });

        it('does not select multiple items if shift is pressed', async () => {
            const wrapper = mount(MultiselectListBox, {
                propsData: {
                    possibleValues,
                    value: ['test1', 'test2', 'test3'],
                    ariaLabel: 'A Label'
                }
            });
            // select
            wrapper.findAll('[role=option]').at(1).trigger('mousedown', { shiftKey: true });
            wrapper.findAll('[role=option]').at(3).trigger('mousemove', { shiftKey: true });
            await wrapper.vm.$nextTick();

            expect(wrapper.emitted().input).toBeUndefined();
        });
    });
});
