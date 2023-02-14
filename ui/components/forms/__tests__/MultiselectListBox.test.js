/* eslint-disable max-lines */
/* eslint-disable no-magic-numbers */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';

import MultiselectListBox from '../MultiselectListBox.vue';

vi.useFakeTimers();

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
        let props = {
            possibleValues,
            modelValue: [],
            ariaLabel: 'A Label'
        };
        const wrapper = mount(MultiselectListBox, {
            props
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();

        let options = wrapper.findAll('[role=option]');
        expect(options.length).toBe(props.possibleValues.length);
        props.possibleValues.forEach((value, i) => {
            expect(options[i].text()).toContain(value.text);
        });
    });

    it('renders invalid style', async () => {
        let props = {
            possibleValues,
            modelValue: [],
            ariaLabel: 'A Label',
            isValid: false
        };
        const wrapper = mount(MultiselectListBox, {
            props
        });
        let root = wrapper.find('.multiselect-list-box');
        expect(root.classes()).toContain('invalid');
        await wrapper.setProps({ isValid: true });
        expect(root.classes()).not.toContain('invalid');
    });

    it('renders with default possibleValues', () => {
        let props = {
            ariaLabel: 'A Label'
        };
        const wrapper = mount(MultiselectListBox, {
            props
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.findAll('[role=option]').length).toBe(0);
    });

    it('updates the currentKeyNavIndex to the last selected value', () => {
        const wrapper = mount(MultiselectListBox, {
            props: {
                possibleValues,
                modelValue: ['test1', 'test3'],
                ariaLabel: 'A Label'
            }
        });

        expect(wrapper.vm.$data.currentKeyNavIndex).toBe(2);
    });

    describe('mouse click', () => {
        it('selects item on click', async () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: ['test1', 'test3'],
                    ariaLabel: 'A Label'
                }
            });

            await wrapper.findAll('[role=option]')[3].trigger('click');
            expect(wrapper.emitted('update:modelValue')[0][0]).toStrictEqual(['test4']);
        });

        it('adds item to selected while holding shift key', async () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: ['test3'],
                    ariaLabel: 'A Label'
                }
            });
            await wrapper.findAll('[role=option]')[3].trigger('click', { shiftKey: true });
            expect(wrapper.emitted('update:modelValue')[0][0]).toStrictEqual(['test3', 'test4']);
        });

        it('adds item to selected while holding ctrl key', async () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: ['test1'],
                    ariaLabel: 'A Label'
                }
            });
            await wrapper.findAll('[role=option]')[3].trigger('click', { ctrlKey: true });
            await wrapper.findAll('[role=option]')[1].trigger('click', { ctrlKey: true });
            expect(wrapper.emitted('update:modelValue')[0][0]).toStrictEqual(['test1', 'test4', 'test2']);
        });

        it('removes item from selected while holding ctrl key', async () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: ['test1', 'test2', 'test4'],
                    ariaLabel: 'A Label'
                }
            });
            await wrapper.findAll('[role=option]')[3].trigger('click', { ctrlKey: true });
            expect(wrapper.emitted('update:modelValue')[0][0]).toStrictEqual(['test1', 'test2']);
        });

        it('adds items to selected while holding meta (mac: command) key', () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: ['test1'],
                    ariaLabel: 'A Label'
                }
            });

            wrapper.findAll('[role=option]')[3].trigger('click', { metaKey: true });
            wrapper.findAll('[role=option]')[1].trigger('click', { metaKey: true });

            vi.runAllTimers();

            expect(wrapper.emitted('update:modelValue')[0][0]).toStrictEqual(['test1', 'test4', 'test2']);
        });

        it('disables item selection on click', async () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: ['test1', 'test3'],
                    ariaLabel: 'A Label',
                    disabled: true
                }
            });

            await wrapper.findAll('[role=option]')[3].trigger('click');
            expect(wrapper.props('modelValue')).toStrictEqual(['test1', 'test3']);
            await wrapper.findAll('[role=option]')[1].trigger('click', { shiftKey: true });
            expect(wrapper.props('modelValue')).toStrictEqual(['test1', 'test3']);
            await wrapper.findAll('[role=option]')[3].trigger('click', { metaKey: true });
            expect(wrapper.props('modelValue')).toStrictEqual(['test1', 'test3']);
            await wrapper.findAll('[role=option]')[3].trigger('click', { ctrlKey: true });
            expect(wrapper.props('modelValue')).toStrictEqual(['test1', 'test3']);
            await wrapper.findAll('[role=option]')[1].trigger('dblclick');
            expect(wrapper.props('modelValue')).toStrictEqual(['test1', 'test3']);
            await wrapper.findAll('[role=option]')[1].trigger('dblclick', { shiftKey: true });
            expect(wrapper.props('modelValue')).toStrictEqual(['test1', 'test3']);
        });
    });

    describe('keyboard navigation', () => {
        it('selects all by CTRL+a', async () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: ['test3'],
                    ariaLabel: 'A Label'
                }
            });
            await wrapper.find('[role=listbox]').trigger('keydown.a', { ctrlKey: true });
            expect(wrapper.emitted('update:modelValue')[0][0]).toStrictEqual(['test1', 'test2', 'test3', 'test4']);
        });

        it('selects item by key up', async () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: ['test3'],
                    ariaLabel: 'A Label'
                }
            });
            await wrapper.find('[role=listbox]').trigger('keydown.up');
            expect(wrapper.emitted('update:modelValue')[0][0]).toStrictEqual(['test2']);
        });

        it('selects item by key up with shift', async () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: ['test3'],
                    ariaLabel: 'A Label'
                }
            });
            await wrapper.find('[role=listbox]').trigger('keydown.up', { shiftKey: true });
            expect(wrapper.emitted('update:modelValue')[0][0]).toStrictEqual(['test2', 'test3']);
        });

        it('selects item by key down', async () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: ['test3'],
                    ariaLabel: 'A Label'
                }
            });
            await wrapper.find('[role=listbox]').trigger('keydown.down');
            expect(wrapper.emitted('update:modelValue')[0][0]).toStrictEqual(['test4']);
        });

        it('selects item by key down with shift', async () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: ['test3'],
                    ariaLabel: 'A Label'
                }
            });
            await wrapper.find('[role=listbox]').trigger('keydown.down', { shiftKey: true });
            expect(wrapper.emitted('update:modelValue')[0][0]).toStrictEqual(['test3', 'test4']);
        });

        it('selects first item by HOME key', async () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: ['test2'],
                    ariaLabel: 'A Label'
                }
            });
            await wrapper.find('[role=listbox]').trigger('keydown.home');
            expect(wrapper.emitted('update:modelValue')[0][0]).toStrictEqual(['test1']);
        });

        it('selects last item by END key', async () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: [],
                    ariaLabel: 'A Label'
                }
            });
            await wrapper.find('[role=listbox]').trigger('keydown.end');
            // NOTE:
            // this seems to generate more than one input event even if it shouldn't
            // the keydown.end seems to trigger keydown.home and then keydown.end - nobody really knows why.
            // this seems to only happen with home and end keys
            let emitted = wrapper.emitted('update:modelValue');
            expect(emitted[emitted.length - 1][0]).toStrictEqual(['test4']);
        });

        it('disables all keyboard controls', async () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: [],
                    ariaLabel: 'A Label',
                    disabled: true
                }
            });

            wrapper.find('[role=listbox]').trigger('keydown.up');
            wrapper.find('[role=listbox]').trigger('keydown.down');
            wrapper.find('[role=listbox]').trigger('keydown.left');
            wrapper.find('[role=listbox]').trigger('keydown.right');
            wrapper.find('[role=listbox]').trigger('keydown.up', { shiftKey: true });
            wrapper.find('[role=listbox]').trigger('keydown.down', { shiftKey: true });
            wrapper.find('[role=listbox]').trigger('keydown.a', { ctrlKey: true });

            await wrapper.vm.$nextTick();
            expect(wrapper.props('modelValue')).toStrictEqual([]);
        });
    });

    describe('methods and events', () => {
        it('validates possibleValues', () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    ariaLabel: 'A Label'
                }
            });

            const propPossibleValues = wrapper.vm.$options.props.possibleValues;
            expect(propPossibleValues.required).toBeFalsy();
            expect(propPossibleValues.type).toBe(Array);
            expect(propPossibleValues.validator && propPossibleValues.validator('str')).toBeFalsy();
            expect(propPossibleValues.validator && propPossibleValues.validator([])).toBeTruthy();
        });

        it('provides clearSelection method', () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: ['test2', 'test3', 'test4'],
                    ariaLabel: 'A Label'
                }
            });
            wrapper.vm.clearSelection();
            expect(wrapper.emitted('update:modelValue')[0][0]).toStrictEqual([]);
        });

        it('disables clearSelection method', () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: ['test2', 'test3', 'test4'],
                    ariaLabel: 'A Label',
                    disabled: true
                }
            });
            wrapper.vm.clearSelection();
            expect(wrapper.props('modelValue')).toStrictEqual(['test2', 'test3', 'test4']);
        });

        it('provides hasSelection method', async () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: [],
                    ariaLabel: 'A Label'
                }
            });
            expect(wrapper.vm.hasSelection()).toBe(false);
            await wrapper.setProps({ modelValue: ['test2', 'test3', 'test4'] });
            expect(wrapper.vm.hasSelection()).toBe(true);
        });


        it('emits keyArrowLeft event', async () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: ['test3'],
                    ariaLabel: 'A Label'
                }
            });
            await wrapper.find('[role=listbox]').trigger('keydown.left');
            expect(wrapper.emitted().keyArrowLeft[0][0]).toStrictEqual(['test3']);
        });

        it('emits keyArrowRight event', async () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: ['test3'],
                    ariaLabel: 'A Label'
                }
            });
            await wrapper.find('[role=listbox]').trigger('keydown.right');
            expect(wrapper.emitted().keyArrowRight[0][0]).toStrictEqual(['test3']);
        });

        it('emits doubleClickOnItem event', async () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: [],
                    ariaLabel: 'A Label'
                }
            });
            await wrapper.findAll('[role=option]')[2].trigger('dblclick');
            expect(wrapper.emitted().doubleClickOnItem[0][0]).toBe('test3');
        });

        it('emits doubleClickShift event', async () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: ['test1', 'test2'],
                    ariaLabel: 'A Label'
                }
            });
            await wrapper.findAll('[role=option]')[1].trigger('dblclick', { shiftKey: true });
            expect(wrapper.emitted().doubleClickShift[0][0]).toStrictEqual(['test1', 'test2']);
        });
    });

    describe('drag', () => {
        it('selects multiple elements on mouse move while mouse down (drag)', async () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: [],
                    ariaLabel: 'A Label'
                }
            });
            wrapper.findAll('[role=option]')[1].trigger('mousedown');
            wrapper.findAll('[role=option]')[3].trigger('mousemove');
            await wrapper.vm.$nextTick();

            expect(wrapper.emitted('update:modelValue')[0][0]).toStrictEqual(['test2', 'test3', 'test4']);
        });

        it('deselects multiple elements on mouse move while mouse down (drag) with ctrl down', async () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: ['test1', 'test2', 'test3'],
                    ariaLabel: 'A Label'
                }
            });
            // select
            wrapper.findAll('[role=option]')[1].trigger('mousedown', { ctrlKey: true });
            wrapper.findAll('[role=option]')[3].trigger('mousemove', { ctrlKey: true });
            wrapper.vm.onStopDrag();
            await wrapper.vm.$nextTick();

            expect(wrapper.emitted('update:modelValue')[0][0]).toStrictEqual(['test1']);
        });

        it('deselects multiple elements on mouse move while mouse down (drag) with meta/cmd down', async () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: ['test1', 'test2', 'test3'],
                    ariaLabel: 'A Label'
                }
            });
            // select
            wrapper.findAll('[role=option]')[1].trigger('mousedown', { metaKey: true });
            wrapper.findAll('[role=option]')[3].trigger('mousemove', { metaKey: true });
            wrapper.vm.onStopDrag();
            await wrapper.vm.$nextTick();

            expect(wrapper.emitted('update:modelValue')[0][0]).toStrictEqual(['test1']);
        });

        it('does not select multiple items if shift is pressed', async () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: ['test1', 'test2', 'test3'],
                    ariaLabel: 'A Label'
                }
            });
            // select
            wrapper.findAll('[role=option]')[1].trigger('mousedown', { shiftKey: true });
            wrapper.findAll('[role=option]')[3].trigger('mousemove', { shiftKey: true });
            await wrapper.vm.$nextTick();

            expect(wrapper.emitted('update:modelValue')).toBeUndefined();
        });

        it('disables selection on drag', async () => {
            const wrapper = mount(MultiselectListBox, {
                props: {
                    possibleValues,
                    modelValue: [],
                    ariaLabel: 'A Label',
                    disabled: true
                }
            });
            wrapper.findAll('[role=option]')[1].trigger('mousedown');
            wrapper.findAll('[role=option]')[3].trigger('mousemove');
            await wrapper.vm.$nextTick();

            expect(wrapper.props('modelValue')).toStrictEqual([]);
        });
    });

    describe('empty state', () => {
        let propsData;

        beforeEach(() => {
            propsData = {
                possibleValues: [],
                value: [],
                ariaLabel: 'A Label'
            };
        });

        it('does not display an empty state per default', () => {
            const wrapper = mount(MultiselectListBox, { propsData });
            expect(wrapper.find('.empty-state').exists()).toBeFalsy();
        });

        it('displays an empty state if wanted', () => {
            propsData.withIsEmptyState = true;
            const wrapper = mount(MultiselectListBox, { propsData });
            expect(wrapper.find('.empty-state').text()).toBe('No entries in this list');
            const emptyStateLabel = 'Custom label';
            wrapper.setProps({ emptyStateLabel });
            expect(wrapper.find('.empty-state').text()).toBe(emptyStateLabel);
        });

        it('does not displays an empty state if the box is not empty', () => {
            propsData.withIsEmptyState = true;
            propsData.possibleValues = possibleValues;
            const wrapper = mount(MultiselectListBox, { propsData });
            expect(wrapper.find('.empty-state').exists()).toBeFalsy();
        });

        it('does not take the bottom value into account', () => {
            propsData.withIsEmptyState = true;
            propsData.withBottomValue = true;
            const wrapper = mount(MultiselectListBox, { propsData });
            expect(wrapper.find('.empty-state').exists()).toBeTruthy();
        });
    });

    describe('bottom value', () => {
        let propsData;
        const bottomValue = {
            id: Symbol('Bottom value'),
            text: 'Bottom value'
        };

        const getBottomValueOption = (wrapper) => wrapper.find('[role="bottom-box"]').find('[role="option"]');

        const getSelectedBottomValueOption = (wrapper) => wrapper.find('[role="bottom-box"]')
            .find('[role="option"].selected');

        beforeEach(() => {
            propsData = {
                bottomValue,
                withBottomValue: true,
                possibleValues,
                value: [],
                ariaLabel: 'A Label'
            };
        });

        it('does not render bottom value by default', () => {
            const wrapper = mount(MultiselectListBox, {
                possibleValues,
                value: [],
                ariaLabel: 'A Label'
            });
            expect(wrapper.find('[role="bottom-box"]').exists()).toBeFalsy();
        });

        it('renders default bottom value if wanted', () => {
            const wrapper = mount(MultiselectListBox, { propsData });
            expect(wrapper.find('[role="bottom-box"]').exists()).toBeTruthy();
            expect(wrapper.find('[role="bottom-box"]').find('[role="option"]').text()).toBe(bottomValue.text);
        });

        it('selects bottom element on click', () => {
            const wrapper = mount(MultiselectListBox, { propsData });
            getBottomValueOption(wrapper).trigger('click', { preventDefault: () => {} });
            expect(getSelectedBottomValueOption(wrapper).exists()).toBeTruthy();
            expect(wrapper.emitted().input[0][0]).toStrictEqual([bottomValue.id]);
        });

        it('emits dblclick event on double click', () => {
            const wrapper = mount(MultiselectListBox, { propsData });
            getBottomValueOption(wrapper).trigger('dblclick', { preventDefault: () => {} });
            expect(getSelectedBottomValueOption(wrapper).exists()).toBeFalsy();
            expect(wrapper.emitted().doubleClickOnItem[0][0]).toBe(bottomValue.id);
        });

        it('adds selection from the current selected index to the bottom on shift click', async () => {
            const wrapper = mount(MultiselectListBox, { propsData });

            wrapper.findAll('[role=option]').at(2).trigger('click');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual(['test3']);
            getBottomValueOption(wrapper).trigger('click', { preventDefault: () => {}, shiftKey: true });
            expect(wrapper.emitted().input[1][0]).toStrictEqual(['test3', 'test4', bottomValue.id]);
            getBottomValueOption(wrapper).trigger('click', { preventDefault: () => {} });
            wrapper.findAll('[role=option]').at(3).trigger('click', { shiftKey: true });
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[3][0]).toStrictEqual(['test4', bottomValue.id]);
            expect(getSelectedBottomValueOption(wrapper).exists()).toBeTruthy();
        });

        it('adds selectionon ctrl click', async () => {
            const wrapper = mount(MultiselectListBox, { propsData });

            wrapper.findAll('[role=option]').at(2).trigger('click');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual(['test3']);
            getBottomValueOption(wrapper).trigger('click', { preventDefault: () => {}, ctrlKey: true });
            expect(wrapper.emitted().input[1][0]).toStrictEqual(['test3', bottomValue.id]);
            expect(getSelectedBottomValueOption(wrapper).exists()).toBeTruthy();
            getBottomValueOption(wrapper).trigger('click', { preventDefault: () => {}, ctrlKey: true });
            expect(wrapper.emitted().input[1][0]).toStrictEqual(['test3']);
            expect(getSelectedBottomValueOption(wrapper).exists()).toBeFalsy();
        });

        it('bottom value gets selected on ctrl a', async () => {
            const wrapper = mount(MultiselectListBox, { propsData });
            wrapper.find('[role=listbox]').trigger('keydown.a', { ctrlKey: true });
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual(['test1', 'test2', 'test3', 'test4', bottomValue.id]);
            expect(getSelectedBottomValueOption(wrapper).exists()).toBeTruthy();
        });

        describe('keyboard interaction', () => {
            it('bottom is reachable with keydown.down', async () => {
                const wrapper = mount(MultiselectListBox, { propsData });
                wrapper.findAll('[role=option]').at(3).trigger('click');
                await wrapper.vm.$nextTick();
                expect(wrapper.emitted().input[0][0]).toStrictEqual(['test4']);
                wrapper.find('[role=listbox]').trigger('keydown.down');
                await wrapper.vm.$nextTick();
                expect(wrapper.emitted().input[1][0]).toStrictEqual([bottomValue.id]);
            });

            it('keydown.up from the bottom leads to the last element in the list', async () => {
                const wrapper = mount(MultiselectListBox, { propsData });
                getBottomValueOption(wrapper).trigger('click', { preventDefault: () => {} });
                await wrapper.vm.$nextTick();
                expect(wrapper.emitted().input[0][0]).toStrictEqual([bottomValue.id]);
                wrapper.find('[role=listbox]').trigger('keydown.up');
                await wrapper.vm.$nextTick();
                expect(wrapper.emitted().input[1][0]).toStrictEqual(['test4']);
            });

            it('bottom is reachable with shift + keydown.down', async () => {
                const wrapper = mount(MultiselectListBox, { propsData });
                wrapper.findAll('[role=option]').at(3).trigger('click');
                await wrapper.vm.$nextTick();
                expect(wrapper.emitted().input[0][0]).toStrictEqual(['test4']);
                wrapper.find('[role=listbox]').trigger('keydown.down', { shiftKey: true });
                await wrapper.vm.$nextTick();
                expect(wrapper.emitted().input[1][0]).toStrictEqual(['test4', bottomValue.id]);
            });

            it('shift + keydown.up from the bottom leads to combined selection with list elements', async () => {
                const wrapper = mount(MultiselectListBox, { propsData });
                getBottomValueOption(wrapper).trigger('click', { preventDefault: () => {} });
                await wrapper.vm.$nextTick();
                expect(wrapper.emitted().input[0][0]).toStrictEqual([bottomValue.id]);
                wrapper.find('[role=listbox]').trigger('keydown.up', { shiftKey: true });
                await wrapper.vm.$nextTick();
                expect(wrapper.emitted().input[1][0]).toStrictEqual(['test4', bottomValue.id]);
            });
        });

        describe('drag', () => {
            it('starts drag on handleStartDrag', async () => {
                const wrapper = mount(MultiselectListBox, { propsData });
                getBottomValueOption(wrapper).trigger('mousedown', { shiftKey: false, ctrlKey: false });
                wrapper.findAll('[role=option]').at(1).trigger('mousemove');
                await wrapper.vm.$nextTick();
    
                expect(wrapper.emitted().input[0][0]).toStrictEqual(['test2', 'test3', 'test4', bottomValue.id]);
            });

            it('continues drag on handleDrag', async () => {
                const wrapper = mount(MultiselectListBox, { propsData });
                wrapper.findAll('[role=option]').at(1).trigger('mousedown');
                getBottomValueOption(wrapper).trigger('mousemove');
                await wrapper.vm.$nextTick();

                expect(wrapper.emitted().input[0][0]).toStrictEqual(['test2', 'test3', 'test4', bottomValue.id]);
            });
        });
    });
});
