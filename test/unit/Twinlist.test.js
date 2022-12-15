/* eslint-disable max-lines */
import { mount } from '@vue/test-utils';

import SearchInput from '~/ui/components/forms/SearchInput.vue';
import Twinlist from '~/ui/components/forms/Twinlist.vue';
import MultiselectListBox from '~/ui/components/forms/MultiselectListBox.vue';
import ValueSwitch from '~/ui/components/forms/ValueSwitch.vue';
import Checkboxes from '~/ui/components/forms/Checkboxes.vue';

describe('Twinlist.vue', () => {
    let defaultPossibleValues;

    beforeEach(() => {
        defaultPossibleValues = [{
            id: 'test1',
            text: 'Text 1'
        }, {
            id: 'test2',
            text: 'Text 2'
        }, {
            id: 'test3',
            text: 'Text 3'
        }];
    });

    it('renders', () => {
        let propsData = {
            possibleValues: defaultPossibleValues,
            initialManuallySelected: ['test3'],
            leftLabel: 'Choose',
            rightLabel: 'The value',
            size: 3
        };
        const wrapper = mount(Twinlist, {
            propsData
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.findAll(MultiselectListBox).length).toBe(2);
        expect(wrapper.findAll(MultiselectListBox).at(0).vm.$props.possibleValues.length).toBe(2);
        expect(wrapper.findAll(MultiselectListBox).at(1).vm.$props.possibleValues).toStrictEqual(
            [defaultPossibleValues[2]]
        );
    });

    it('actual list sizes must be 5 or bigger', () => {
        let propsData = {
            possibleValues: [defaultPossibleValues[0]], // one element
            initialManuallySelected: [],
            leftLabel: 'Choose',
            rightLabel: 'The value'
        };
        const wrapper = mount(Twinlist, {
            propsData
        });
        const defaultListSize = 5; // see Twinlist.vue

        // with no size set it is still 5 even if we only have one element
        expect(wrapper.findAll(MultiselectListBox).at(0).vm.$props.size).toBe(defaultListSize);
        expect(wrapper.findAll(MultiselectListBox).at(1).vm.$props.size).toBe(defaultListSize);

        // defaults to 5 (see Twinlist)
        const smallListSize = 3;
        wrapper.setProps({ size: smallListSize });

        expect(wrapper.findAll(MultiselectListBox).at(0).vm.$props.size).toBe(defaultListSize);
        expect(wrapper.findAll(MultiselectListBox).at(1).vm.$props.size).toBe(defaultListSize);

        const bigSize = 12;
        wrapper.setProps({ size: bigSize });

        expect(wrapper.findAll(MultiselectListBox).at(0).vm.$props.size).toBe(bigSize);
        expect(wrapper.findAll(MultiselectListBox).at(1).vm.$props.size).toBe(bigSize);
    });

    it('isValid causes invalid style on left box', () => {
        let propsData = {
            possibleValues: [{
                id: 'test1',
                text: 'test1'
            }],
            initialManuallySelected: [],
            leftLabel: 'Choose',
            rightLabel: 'The value',
            isValid: false
        };
        const wrapper = mount(Twinlist, {
            propsData
        });
        let left = wrapper.find({ ref: 'left' });
        expect(left.vm.isValid).toBe(false);
        wrapper.setProps({ isValid: true });
        expect(left.vm.isValid).toBe(true);
    });

    it('has invalid state if invalid values are selected', () => {
        let propsData = {
            possibleValues: [{
                id: 'test1',
                text: 'Text'
            }, {
                id: 'test2',
                text: 'Some Text'
            }],
            initialManuallySelected: ['invalidId', 'test1'],
            leftLabel: 'Choose',
            rightLabel: 'The value'
        };
        const wrapper = mount(Twinlist, {
            propsData
        });
        expect(wrapper.vm.validate()).toStrictEqual(
            { errorMessage: 'One or more of the selected items is invalid.', isValid: false }
        );
        expect(wrapper.vm.invalidValueIds).toStrictEqual(['invalidId']);

        // make it valid again
        wrapper.setData({ chosenValues: ['test1'] });
        expect(wrapper.vm.validate().isValid).toBe(true);
    });

    it('clears its internal state when there is a change in the possible values', () => {
        let propsData = {
            possibleValues: [{
                id: 'test1',
                text: 'Text'
            }, {
                id: 'test2',
                text: 'Some Text'
            }],
            initialManuallySelected: ['invalidId', 'test1'],
            leftLabel: 'Choose',
            rightLabel: 'The value'
        };
        const wrapper = mount(Twinlist, {
            propsData
        });
        expect(wrapper.vm.chosenValues).toStrictEqual(['invalidId', 'test1']);

        wrapper.setProps({
            possibleValues: [{
                id: 'newValue',
                text: 'newValue'
            }]
        });
        expect(wrapper.vm.chosenValues).toStrictEqual([]);
    });

    it('keeps valid state but removes invalid chosen values when there is a change in the possible values', () => {
        let propsData = {
            possibleValues: [{
                id: 'test1',
                text: 'Text'
            }, {
                id: 'test2',
                text: 'Some Text'
            }],
            initialManuallySelected: ['invalidId', 'test1'],
            leftLabel: 'Choose',
            rightLabel: 'The value'
        };
        const wrapper = mount(Twinlist, {
            propsData
        });
        expect(wrapper.vm.chosenValues).toStrictEqual(['invalidId', 'test1']);

        wrapper.setProps({
            possibleValues: [{
                id: 'test1',
                text: 'validValue'
            }]
        });
        expect(wrapper.vm.chosenValues).toStrictEqual(['test1']);
    });

    it('provides a valid hasSelection method', () => {
        const wrapper = mount(Twinlist, {
            propsData: {
                possibleValues: defaultPossibleValues,
                leftLabel: 'Choose',
                rightLabel: 'The value'
            }
        });
        expect(wrapper.vm.hasSelection()).toBe(false);

        wrapper.setData({ chosenValues: ['test1'] });
        expect(wrapper.vm.hasSelection()).toBe(true);
    });

    describe('double click', () => {
        let propsData;

        beforeEach(() => {
            propsData = {
                possibleValues: defaultPossibleValues,
                initialManuallySelected: ['test3'],
                leftLabel: 'Choose',
                rightLabel: 'The value'
            };
        });

        it('adds to value on double click in left box', async () => {
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            let right = boxes.at(1);
            left.vm.$emit('doubleClickOnItem', 'test2', 1);
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0]).toStrictEqual([['test2', 'test3'], true]);
            expect(right.vm.$props.possibleValues).toStrictEqual([
                propsData.possibleValues[1], propsData.possibleValues[2]
            ]);
        });

        it('adds values on shift double click in left box', async () => {
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            let right = boxes.at(1);
            left.vm.$emit('doubleClickShift', ['test1', 'test2']);
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual(['test1', 'test2', 'test3']);
            expect(right.vm.$props.possibleValues).toStrictEqual([
                propsData.possibleValues[0], propsData.possibleValues[1], propsData.possibleValues[2]
            ]);
        });

        it('removes from value on double click in right box', async () => {
            propsData.initialManuallySelected = ['test2', 'test3'];
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            let right = boxes.at(1);
            right.vm.$emit('doubleClickOnItem', 'test2', 1);
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual(['test3']);
            expect(left.vm.$props.possibleValues).toStrictEqual([
                propsData.possibleValues[0], propsData.possibleValues[1]
            ]);
        });

        it('removes from values on shift double click in right box', async () => {
            propsData.initialManuallySelected = ['test1', 'test2', 'test3'];
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            let right = boxes.at(1);
            right.vm.$emit('doubleClickShift', ['test1', 'test2']);
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual(['test3']);
            expect(left.vm.$props.possibleValues).toStrictEqual([
                propsData.possibleValues[0], propsData.possibleValues[1]
            ]);
        });
    });

    it('moves selected values to right on right arrow key', async () => {
        let propsData = {
            possibleValues: defaultPossibleValues,
            initialManuallySelected: [],
            leftLabel: 'Choose',
            rightLabel: 'The value'
        };
        const wrapper = mount(Twinlist, {
            propsData
        });

        let boxes = wrapper.findAll(MultiselectListBox);
        let left = boxes.at(0);
        let right = boxes.at(1);
        left.vm.setSelected(['test2', 'test3']);
        left.vm.$emit('keyArrowRight');
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted().input[0][0]).toStrictEqual(['test2', 'test3']);
        expect(right.vm.$props.possibleValues).toStrictEqual([
            propsData.possibleValues[1], propsData.possibleValues[2]
        ]);
    });

    it('moves selected values to left on left arrow key', async () => {
        let propsData = {
            possibleValues: defaultPossibleValues,
            initialManuallySelected: ['test2', 'test3'],
            leftLabel: 'Choose',
            rightLabel: 'The value'
        };
        const wrapper = mount(Twinlist, {
            propsData
        });

        let boxes = wrapper.findAll(MultiselectListBox);
        let left = boxes.at(0);
        let right = boxes.at(1);
        right.vm.setSelected(['test2', 'test3']);
        right.vm.$emit('keyArrowLeft');
        await wrapper.vm.$nextTick();
        expect(wrapper.emitted().input[0][0]).toStrictEqual([]);
        expect(left.vm.$props.possibleValues).toStrictEqual(propsData.possibleValues);
    });

    describe('controls', () => {
        it('moves selected values to right on move button click', async () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
                initialManuallySelected: [],
                leftLabel: 'Choose',
                rightLabel: 'The value'
            };
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            let right = boxes.at(1);
            left.vm.setSelected(['test2', 'test3']);
            wrapper.find({ ref: 'moveRight' }).trigger('click');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual(['test2', 'test3']);
            expect(right.vm.$props.possibleValues).toStrictEqual([
                propsData.possibleValues[1], propsData.possibleValues[2]
            ]);
        });

        it('moves selected values to left on move button click', async () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
                initialManuallySelected: ['test2', 'test3'],
                leftLabel: 'Choose',
                rightLabel: 'The value'
            };
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            let right = boxes.at(1);
            right.vm.setSelected(['test2', 'test3']);
            wrapper.find({ ref: 'moveLeft' }).trigger('click');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual([]);
            expect(left.vm.$props.possibleValues).toStrictEqual(propsData.possibleValues);
        });

        it('moves all values to right on all button click', async () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
                initialManuallySelected: [],
                leftLabel: 'Choose',
                rightLabel: 'The value'
            };
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let right = boxes.at(1);
            wrapper.find({ ref: 'moveAllRight' }).trigger('click');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual(['test1', 'test2', 'test3']);
            expect(right.vm.$props.possibleValues).toStrictEqual(propsData.possibleValues);
        });

        it('makes the invalid columns disappear upon moving them to the left', () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
                initialManuallySelected: ['invalidId'],
                leftLabel: 'Choose',
                rightLabel: 'The value'
            };
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            let right = boxes.at(1);

            // move all left to get the invalid left
            wrapper.find({ ref: 'moveAllLeft' }).trigger('click');
            expect(left.vm.$props.possibleValues.map(x => x.id)).not.toContain('invalidId');
            expect(right.vm.$props.possibleValues.map(x => x.id)).not.toContain('invalidId');
        });

        it('moves all values to left on all button click', async () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
                initialManuallySelected: ['test2', 'test3'],
                leftLabel: 'Choose',
                rightLabel: 'The value'
            };
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            wrapper.find({ ref: 'moveAllLeft' }).trigger('click');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual([]);
            expect(left.vm.$props.possibleValues).toStrictEqual(propsData.possibleValues);
        });

        it('moves selected values to right on move button enter', async () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
                initialManuallySelected: [],
                leftLabel: 'Choose',
                rightLabel: 'The value'
            };
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            let right = boxes.at(1);
            left.vm.setSelected(['test2', 'test3']);
            wrapper.find({ ref: 'moveRight' }).trigger('keydown.enter');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual(['test2', 'test3']);
            expect(right.vm.$props.possibleValues).toStrictEqual([
                propsData.possibleValues[1], propsData.possibleValues[2]
            ]);
        });

        it('non applicable buttons are disabled', () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
                initialManuallySelected: [],
                leftLabel: 'Choose',
                rightLabel: 'The value'
            };
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            let right = boxes.at(1);

            const moveRight = wrapper.find({ ref: 'moveRight' });
            const moveLeft = wrapper.find({ ref: 'moveLeft' });
            const moveAllLeft = wrapper.find({ ref: 'moveAllLeft' });
            const moveAllRight = wrapper.find({ ref: 'moveAllRight' });

            // nothing is selected so move selection is disabled
            expect(moveRight.classes()).toContain('disabled');
            expect(moveLeft.classes()).toContain('disabled');

            // move all right is possible
            expect(moveAllRight.classes()).not.toContain('disabled');

            // move all left is not possible as right (the values) is empty
            expect(moveAllLeft.classes()).toContain('disabled');

            left.vm.setSelected(['test2', 'test3']);

            // now we can move right
            expect(moveRight.classes()).not.toContain('disabled');

            // move all right
            wrapper.vm.moveRight(['test1', 'test2', 'test3']);

            // now we can move all to the left (as we have values)
            expect(moveAllLeft.classes()).not.toContain('disabled');

            // but not the other way around
            expect(moveAllRight.classes()).toContain('disabled');

            // select something on the right
            right.vm.setSelected(['test2']);

            // move selected to left is now possible
            expect(moveLeft.classes()).not.toContain('disabled');
        });

        it('moves selected values to left on move button enter', async () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
                initialManuallySelected: ['test2', 'test3'],
                leftLabel: 'Choose',
                rightLabel: 'The value'
            };
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            let right = boxes.at(1);
            right.vm.setSelected(['test2', 'test3']);
            wrapper.find({ ref: 'moveLeft' }).trigger('keydown.enter');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual([]);
            expect(left.vm.$props.possibleValues).toStrictEqual(propsData.possibleValues);
        });

        it('moves all values to right on all button enter', async () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
                initialManuallySelected: [],
                leftLabel: 'Choose',
                rightLabel: 'The value'
            };
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let right = boxes.at(1);
            wrapper.find({ ref: 'moveAllRight' }).trigger('keydown.enter');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual(['test1', 'test2', 'test3']);
            expect(right.vm.$props.possibleValues).toStrictEqual(propsData.possibleValues);
        });

        it('moves all values to left on all button enter', async () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
                initialManuallySelected: ['test2', 'test3'],
                leftLabel: 'Choose',
                rightLabel: 'The value'
            };
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            wrapper.find({ ref: 'moveAllLeft' }).trigger('keydown.enter');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual([]);
            expect(left.vm.$props.possibleValues).toStrictEqual(propsData.possibleValues);
        });
    });

    it('clears selection of the other side on select', () => {
        const mountOptions = {
            propsData: {
                possibleValues: [...defaultPossibleValues, { id: 'test4', text: 'Text 4' }],
                initialManuallySelected: ['test2', 'test3'],
                leftLabel: 'Choose',
                rightLabel: 'The value'
            }
        };

        const wrapper = mount(Twinlist, mountOptions);

        let boxes = wrapper.findAll(MultiselectListBox);
        let left = boxes.at(0);
        let right = boxes.at(1);

        // select something on the left
        wrapper.vm.onLeftInput(['test1']);
        expect(wrapper.vm.$refs.left.value).toStrictEqual(['test1']);

        // select something on the right
        wrapper.vm.onRightInput(['test2']);
        expect(wrapper.vm.$refs.right.value).toStrictEqual(['test2']);
        // the left should now be deselecting all
        expect(left.emitted().input[0][0]).toStrictEqual([]);

        // select something on the left, leads to empty on the right
        wrapper.vm.onLeftInput(['test1', 'test4']);
        expect(right.emitted().input[0][0]).toStrictEqual([]);
    });

    describe('search', () => {
        it('doesn\'t render the search bar by default', () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
                initialManuallySelected: ['test3'],
                leftLabel: 'Choose',
                rightLabel: 'The value',
                size: 3
            };
            const wrapper = mount(Twinlist, {
                propsData
            });
            expect(wrapper.find(ValueSwitch).exists()).toBe(false);
            expect(wrapper.find(SearchInput).exists()).toBe(false);
            expect(wrapper.find('div.search-wrapper label.search').exists()).toBe(false);
            expect(wrapper.find('div.search-wrapper input[type=text].with-icon').exists()).toBe(false);
        });

        it('can render the search bar if wanted', () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
                initialManuallySelected: ['test3'],
                leftLabel: 'Choose',
                rightLabel: 'The value',
                size: 3,
                showSearch: true,
                searchLabel: 'Filter entries',
                searchPlaceholder: 'Enter search term'
            };
            const wrapper = mount(Twinlist, {
                propsData
            });
            expect(wrapper.find(ValueSwitch).exists()).toBe(false);
            expect(wrapper.find(SearchInput).exists()).toBe(true);
            expect(wrapper.find('div.search-wrapper label').exists()).toBe(true);
            expect(wrapper.find('div.search-wrapper label').text()).toBe('Filter entries');
        });

        it('can include initial search term', () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
                initialManuallySelected: ['test2'],
                leftLabel: 'Choose',
                rightLabel: 'The value',
                size: 3,
                showSearch: true,
                initialSearchTerm: '3'
            };
            const wrapper = mount(Twinlist, {
                propsData
            });
            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            let right = boxes.at(1);

            expect(left.props('possibleValues').length).toBe(1);
            expect(left.props('possibleValues')[0].text).toStrictEqual('Text 3');

            expect(right.props('possibleValues').length).toBe(0);

            // Remove search term
            let search = wrapper.find('input');
            search.setValue('');

            expect(left.props('possibleValues').length).toBe(2);
            expect(right.props('possibleValues').length).toBe(1);
            expect(right.props('possibleValues')[0].text).toStrictEqual('Text 2');
        });

        it('can handle basic search requests', () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
                initialManuallySelected: ['test2'],
                leftLabel: 'Choose',
                rightLabel: 'The value',
                size: 3,
                showSearch: true
            };
            const wrapper = mount(Twinlist, {
                propsData
            });
            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            let right = boxes.at(1);

            expect(left.props('possibleValues').length).toBe(2);
            expect(right.props('possibleValues').length).toBe(1);
            expect(right.props('possibleValues')[0].text).toStrictEqual('Text 2');

            let search = wrapper.find('input');

            search.setValue('noresult');
            expect(left.props('possibleValues').length).toBe(0);
            expect(right.props('possibleValues').length).toBe(0);

            search.setValue('');
            expect(left.props('possibleValues').length).toBe(2);
            expect(right.props('possibleValues').length).toBe(1);

            search.setValue('text');
            expect(left.props('possibleValues').length).toBe(2);
            expect(right.props('possibleValues').length).toBe(1);

            search.setValue(' text');
            expect(left.props('possibleValues').length).toBe(0);
            expect(right.props('possibleValues').length).toBe(0);

            search.setValue('1');
            expect(left.props('possibleValues').length).toBe(1);
            expect(right.props('possibleValues').length).toBe(0);

            search.setValue('2');
            expect(left.props('possibleValues').length).toBe(0);
            expect(right.props('possibleValues').length).toBe(1);

            search.setValue(' ');
            expect(left.props('possibleValues').length).toBe(2);
            expect(right.props('possibleValues').length).toBe(1);

            search.setValue('TEXT');
            expect(left.props('possibleValues').length).toBe(2);
            expect(right.props('possibleValues').length).toBe(1);

            expect(wrapper.emitted().input).not.toBeDefined();
        });

        it('moves only all filtered values to right on all button click', async () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
                initialManuallySelected: [],
                leftLabel: 'Choose',
                rightLabel: 'The value',
                showSearch: true,
                initialSearchTerm: '3'
            };
            const wrapper = mount(Twinlist, {
                propsData
            });

            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            let right = boxes.at(1);
            wrapper.find({ ref: 'moveAllRight' }).trigger('click');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input[0][0]).toStrictEqual(['test3']);

            expect(left.props('possibleValues').length).toBe(0);

            let search = wrapper.find('input');

            search.setValue('');
            expect(left.props('possibleValues').length).toBe(2);
            expect(right.props('possibleValues').length).toBe(1);
        });
    });

    describe('mode selection', () => {
        const propsData = {
            possibleValues: defaultPossibleValues,
            initialManuallySelected: ['test3'],
            leftLabel: 'Choose',
            rightLabel: 'The value',
            size: 3
        };

        it('does not render the selection mode by default', () => {
            const wrapper = mount(Twinlist, {
                propsData
            });
            expect(wrapper.find(ValueSwitch).exists()).toBeFalsy();
        });

        it('renders the selection mode if wanted', () => {
            const wrapper = mount(Twinlist, { propsData: {
                ...propsData,
                showMode: true,
                modeLabel: 'Filter options'
            } });
            expect(wrapper.find(ValueSwitch).exists()).toBeTruthy();
            const labels = wrapper.findAll('div.search-wrapper label');
            expect(labels.at(0).text()).toBe('Filter options');
            expect(labels.at(1).text()).toBe('Manual');
            expect(labels.at(2).text()).toBe('Wildcard');
            expect(labels.at(3).text()).toBe('Regex');
            expect(labels.at(4).text()).toBe('Type');
        });

        it('hides type selection mode if wanted', () => {
            const wrapper = mount(Twinlist, { propsData: {
                ...propsData,
                showMode: true,
                withTypes: false
            } });
            expect(wrapper.find(ValueSwitch).exists()).toBeTruthy();
            expect(wrapper.findAll('div.search-wrapper label').wrappers.map(l => l.text())).not.toContain('Type');
        });

        it('emits updated mode', async () => {
            const wrapper = mount(Twinlist, { propsData: {
                ...propsData,
                showMode: true,
                withTypes: false
            } });
            wrapper.find(ValueSwitch).vm.$emit('input', 'regex');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().modeInput[0][0]).toBe('regex');
        });
    });

    describe('search and pattern', () => {
        const propsData = {
            possibleValues: defaultPossibleValues,
            initialManuallySelected: ['test3'],
            leftLabel: 'Choose',
            rightLabel: 'The value',
            size: 3
        };

        it('does not render search by default', () => {
            const wrapper = mount(Twinlist, {
                propsData
            });
            expect(wrapper.find(SearchInput).exists()).toBeFalsy();
        });

        it('renders search if wanted', () => {
            const wrapper = mount(Twinlist, { propsData: {
                ...propsData,
                showSearch: true,
                initialMode: 'manual',
                searchLabel: 'Search term label'
            } });
            expect(wrapper.find(SearchInput).exists()).toBeTruthy();
            const labels = wrapper.findAll('div.search-wrapper label');
            expect(labels.at(0).text()).toBe('Search term label');
        });

        it('can do case-sensitive searches', () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
                initialManuallySelected: ['test2'],
                leftLabel: 'Choose',
                rightLabel: 'The value',
                size: 3,
                showSearch: true,
                showSearchMode: true,
                initialSearchTerm: 'text',
                initialSearchMode: 'manual'
            };
            const wrapper = mount(Twinlist, {
                propsData
            });
            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            let right = boxes.at(1);

            expect(left.props('possibleValues').length).toBe(2);
            expect(left.props('possibleValues')[0].text).toStrictEqual('Text 1');
            expect(left.props('possibleValues')[1].text).toStrictEqual('Text 3');

            expect(right.props('possibleValues').length).toBe(1);
            expect(right.props('possibleValues')[0].text).toStrictEqual('Text 2');

            // Make case-sensitive
            wrapper.vm.caseSensitiveSearch = true;

            expect(left.props('possibleValues').length).toBe(0);
            expect(right.props('possibleValues').length).toBe(0);
        });

        it('can do inverse searches', () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
                initialManuallySelected: ['test2'],
                leftLabel: 'Choose',
                rightLabel: 'The value',
                size: 3,
                showSearch: true,
                initialSearchTerm: '3'
            };
            const wrapper = mount(Twinlist, {
                propsData
            });
            let boxes = wrapper.findAll(MultiselectListBox);
            let left = boxes.at(0);
            let right = boxes.at(1);

            expect(left.props('possibleValues').length).toBe(1);
            expect(left.props('possibleValues')[0].text).toStrictEqual('Text 3');

            expect(right.props('possibleValues').length).toBe(0);

            // Set inverse search
            wrapper.vm.inverseSearch = true;

            expect(left.props('possibleValues').length).toBe(1);
            expect(left.props('possibleValues')[0].text).toStrictEqual('Text 1');
            expect(right.props('possibleValues').length).toBe(1);
            expect(right.props('possibleValues')[0].text).toStrictEqual('Text 2');
        });

        describe('Regex and Wildcard', () => {
            it('changes label if pattern mode (regex or widcard) is selected', () => {
                const wrapper = mount(Twinlist, { propsData: {
                    possibleValues: defaultPossibleValues,
                    leftLabel: 'Choose',
                    rightLabel: 'The value',
                    size: 3,
                    initialMode: 'regex',
                    searchLabel: 'Search term label',
                    patternLabel: 'Pattern label'
                } });
                expect(wrapper.find(SearchInput).exists()).toBeTruthy();
                const labels = wrapper.findAll('div.search-wrapper label');
                expect(labels.at(0).text()).toBe('Pattern label');
            });

            it('selects via regex matching', async () => {
                const propsData = {
                    possibleValues: defaultPossibleValues,
                    initialMode: 'regex',
                    leftLabel: 'Choose',
                    rightLabel: 'The value'
                };
                const wrapper = mount(Twinlist, { propsData });
                
                wrapper.find(SearchInput).vm.$emit('input', '.*1');
                await wrapper.vm.$nextTick();
                expect(wrapper.emitted().patternInput[0][0]).toBe('.*1');
                expect(wrapper.emitted().input[0]).toStrictEqual([['test1'], false]);
                
                let left = wrapper.find({ ref: 'left' });
                let right = wrapper.find({ ref: 'right' });
                
                expect(left.vm.$props.possibleValues.length).toBe(2);
                expect(right.vm.$props.possibleValues.length).toBe(1);
            });

            it('selects via wildcard matching', async () => {
                const propsData = {
                    possibleValues: defaultPossibleValues,
                    initialMode: 'wildcard',
                    leftLabel: 'Choose',
                    rightLabel: 'The value'
                };
                const wrapper = mount(Twinlist, { propsData });
                
                wrapper.find(SearchInput).vm.$emit('input', 't*');
                await wrapper.vm.$nextTick();
                expect(wrapper.emitted().patternInput[0][0]).toBe('t*');
                expect(wrapper.emitted().input[0]).toStrictEqual([['test1', 'test2', 'test3'], false]);
                
                let left = wrapper.find({ ref: 'left' });
                let right = wrapper.find({ ref: 'right' });
                
                expect(left.vm.$props.possibleValues.length).toBe(0);
                expect(right.vm.$props.possibleValues.length).toBe(3);
            });

            it('prohibits manual selection', async () => {
                const propsData = {
                    possibleValues: defaultPossibleValues,
                    initialMode: 'regex',
                    leftLabel: 'Choose',
                    rightLabel: 'The value'
                };
                const wrapper = mount(Twinlist, { propsData });
                
                let left = wrapper.find({ ref: 'left' });
                let right = wrapper.find({ ref: 'right' });
                left.vm.$emit('doubleClickOnItem', 'test2', 1);
                await wrapper.vm.$nextTick();
                expect(wrapper.emitted().input).not.toBeDefined();
                expect(right.vm.$props.possibleValues.length).toBe(0);
            });
        });
    });

    describe('Type selection', () => {
        it('renders type selection and changes label if type selection is selected', () => {
            const wrapper = mount(Twinlist, { propsData: {
                possibleValues: defaultPossibleValues,
                leftLabel: 'Choose',
                rightLabel: 'The value',
                size: 3,
                initialMode: 'type',
                selectedTypesLabel: 'Types label'
            } });
            expect(wrapper.find(Checkboxes).exists()).toBeTruthy();
            expect(wrapper.find(SearchInput).exists()).toBeFalsy();
            const labels = wrapper.findAll('div.search-wrapper label');
            expect(labels.at(0).text()).toBe('Types label');
        });

        it('selects via type matching', async () => {
            const propsData = {
                possibleValues: [
                    {
                        id: 'test1',
                        text: 'test1',
                        type: 'String'
                    },
                    {
                        id: 'test2',
                        text: 'test2',
                        type: 'Double'
                    },
                    {
                        id: 'test3',
                        text: 'test3',
                        type: 'String'
                    }
                ],
                initialMode: 'type',
                leftLabel: 'Choose',
                rightLabel: 'The value'
            };
            const wrapper = mount(Twinlist, { propsData });
            
            wrapper.find(Checkboxes).vm.$emit('input', ['String']);
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().typesInput[0][0]).toStrictEqual(['String']);
            expect(wrapper.emitted().input[0]).toStrictEqual([['test1', 'test3'], false]);

            
            let left = wrapper.find({ ref: 'left' });
            let right = wrapper.find({ ref: 'right' });
            
            expect(left.vm.$props.possibleValues.length).toBe(1);
            expect(right.vm.$props.possibleValues.length).toBe(2);
        });

        it('prohibits manual selection', async () => {
            const propsData = {
                possibleValues: defaultPossibleValues,
                initialMode: 'type',
                leftLabel: 'Choose',
                rightLabel: 'The value'
            };
            const wrapper = mount(Twinlist, { propsData });
            
            let left = wrapper.find({ ref: 'left' });
            let right = wrapper.find({ ref: 'right' });
            left.vm.$emit('doubleClickOnItem', 'test2', 1);
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().input).not.toBeDefined();
            expect(right.vm.$props.possibleValues.length).toBe(0);
        });
    });
});
