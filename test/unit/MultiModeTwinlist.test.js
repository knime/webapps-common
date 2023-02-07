/* eslint-disable max-lines */
import { mount } from '@vue/test-utils';

import SearchInput from '~/ui/components/forms/SearchInput.vue';
import MultiModeTwinlist from '~/ui/components/forms/MultiModeTwinlist.vue';
import MultiselectListBox from '~/ui/components/forms/MultiselectListBox.vue';
import Twinlist from '~/ui/components/forms/Twinlist.vue';
import ValueSwitch from '~/ui/components/forms/ValueSwitch.vue';
import Checkboxes from '~/ui/components/forms/Checkboxes.vue';

describe('MultiModeMultiModeTwinlist.vue', () => {
    let defaultPossibleValues;
    
    const expectBoxValues = (expectedValues, actualValues) => {
        expect(actualValues.length).toBe(expectedValues.length);
        expectedValues.forEach((e, i) => {
            expect(actualValues[i].text).toStrictEqual(e);
        });
    };

    const expectTwinlistIncludes = (wrapper, expectedLeft, expectedRight) => {
        let boxes = wrapper.find(Twinlist).findAll(MultiselectListBox);
        let actualLeft = boxes.at(0).props('possibleValues');
        let actualRight = boxes.at(1).props('possibleValues');
        expectBoxValues(expectedLeft, actualLeft);
        expectBoxValues(expectedRight, actualRight);
    };

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
        const wrapper = mount(MultiModeTwinlist, {
            propsData
        });
        expect(wrapper.html()).toBeTruthy();
        expect(wrapper.isVisible()).toBeTruthy();
        expect(wrapper.find(Twinlist).findAll(MultiselectListBox).length).toBe(2);
        expect(wrapper.find(Twinlist).findAll(MultiselectListBox).at(0).vm.$props.possibleValues.length).toBe(2);
        expect(wrapper.find(Twinlist).findAll(MultiselectListBox).at(1).vm.$props.possibleValues).toStrictEqual(
            [defaultPossibleValues[2]]
        );
    });
    
    it('emits selection on mounted', () => {
        let initialSelection = ['A', 'B', 'C'];
        let propsData = {
            possibleValues: [{
                id: 'test1',
                text: 'test1'
            }],
            initialManuallySelected: initialSelection,
            leftLabel: 'Choose',
            rightLabel: 'The value',
            isValid: false
        };
        const wrapper = mount(MultiModeTwinlist, {
            propsData
        });
        expect(wrapper.emitted().input[0][0]).toStrictEqual(
            { selected: initialSelection, isManual: true, deselected: ['test1'] }
        );
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
        const wrapper = mount(MultiModeTwinlist, {
            propsData
        });
        expect(wrapper.vm.validate()).toStrictEqual(
            { errorMessage: 'One or more of the selected items is invalid.', isValid: false }
        );
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
        const wrapper = mount(MultiModeTwinlist, {
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
        const wrapper = mount(MultiModeTwinlist, {
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
    
    it('does not update manually chosen values if mode is not manual', async () => {
        const initialManuallySelected = ['test1'];
        const wrapper = mount(MultiModeTwinlist, {
            propsData: {
                possibleValues: defaultPossibleValues,
                leftLabel: 'Choose',
                rightLabel: 'The value',
                showMode: true,
                initialManuallySelected
            }
        });
        expectTwinlistIncludes(wrapper, ['Text 2', 'Text 3'], ['Text 1']);

        // change to regex, where no columns are selected (empty pattern)
        wrapper.find(ValueSwitch).vm.$emit('input', 'regex');
        await wrapper.vm.$nextTick();
        expectTwinlistIncludes(wrapper, ['Text 1', 'Text 2', 'Text 3'], []);

        // change back to manual
        wrapper.find(ValueSwitch).vm.$emit('input', 'manual');
        await wrapper.vm.$nextTick();
        expectTwinlistIncludes(wrapper, ['Text 2', 'Text 3'], ['Text 1']);
    });

    describe('search', () => {
        let propsData;
        
        beforeEach(() => {
            propsData = {
                possibleValues: defaultPossibleValues,
                leftLabel: 'Choose',
                rightLabel: 'The value',
                size: 3
            };
        });

        it('shows search by default if mode is manual', () => {
            const wrapper = mount(MultiModeTwinlist, { propsData });
            expect(wrapper.find(Twinlist).find(SearchInput).exists()).toBeTruthy();
            wrapper.setData({ mode: 'regex' });
            expect(wrapper.find(Twinlist).find(SearchInput).exists()).toBeFalsy();
        });

        it('does not show search if wanted', () => {
            propsData.showSearch = false;
            const wrapper = mount(MultiModeTwinlist, { propsData });
            expect(wrapper.find(Twinlist).find(SearchInput).exists()).toBeFalsy();
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
            const wrapper = mount(MultiModeTwinlist, {
                propsData
            });
            expect(wrapper.find(ValueSwitch).exists()).toBeFalsy();
        });

        it('renders the selection mode if wanted', () => {
            const wrapper = mount(MultiModeTwinlist, { propsData: {
                ...propsData,
                showMode: true,
                modeLabel: 'Filter options'
            } });
            expect(wrapper.find(ValueSwitch).exists()).toBeTruthy();
            const labels = wrapper.findAll('div.label label');
            expect(labels.at(0).text()).toBe('Filter options');
            expect(labels.at(1).text()).toBe('Manual');
            expect(labels.at(2).text()).toBe('Wildcard');
            expect(labels.at(3).text()).toBe('Regex');
            expect(labels.at(4).text()).toBe('Type');
        });

        it('hides type selection mode if wanted', () => {
            const wrapper = mount(MultiModeTwinlist, { propsData: {
                ...propsData,
                showMode: true,
                withTypes: false
            } });
            expect(wrapper.find(ValueSwitch).exists()).toBeTruthy();
            expect(wrapper.findAll('div.label label').wrappers.map(l => l.text())).not.toContain('Type');
        });

        it('emits updated mode', async () => {
            const wrapper = mount(MultiModeTwinlist, { propsData: {
                ...propsData,
                showMode: true,
                withTypes: false
            } });
            wrapper.find(ValueSwitch).vm.$emit('input', 'regex');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().modeInput[0][0]).toBe('regex');
        });
    });

    describe('pattern filter', () => {
        it('changes label if pattern mode (regex or widcard) is selected', () => {
            const wrapper = mount(MultiModeTwinlist, { propsData: {
                possibleValues: defaultPossibleValues,
                leftLabel: 'Choose',
                rightLabel: 'The value',
                size: 3,
                initialMode: 'regex',
                patternLabel: 'Pattern label'
            } });
            expect(wrapper.find(SearchInput).exists()).toBeTruthy();
            const labels = wrapper.findAll('div.label label');
            expect(labels.at(0).text()).toBe('Pattern label');
        });

        it('selects via regex matching', async () => {
            const propsData = {
                possibleValues: defaultPossibleValues,
                initialMode: 'regex',
                leftLabel: 'Choose',
                rightLabel: 'The value'
            };
            const wrapper = mount(MultiModeTwinlist, { propsData });
            
            wrapper.find(SearchInput).vm.$emit('input', '.*1');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().patternInput[0][0]).toBe('.*1');
            expect(wrapper.emitted().input[1][0]).toStrictEqual({ selected: ['test1'], isManual: false });
           
            expectTwinlistIncludes(wrapper, ['Text 2', 'Text 3'], ['Text 1']);
        });

        it('selects via wildcard matching', async () => {
            const propsData = {
                possibleValues: defaultPossibleValues,
                initialMode: 'wildcard',
                leftLabel: 'Choose',
                rightLabel: 'The value'
            };
            const wrapper = mount(MultiModeTwinlist, { propsData });
            
            wrapper.find(SearchInput).vm.$emit('input', 't*');
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().patternInput[0][0]).toBe('t*');
            expect(wrapper.emitted().input[1][0]).toStrictEqual(
                { selected: ['test1', 'test2', 'test3'], isManual: false }
            );
            expectTwinlistIncludes(wrapper, [], ['Text 1', 'Text 2', 'Text 3']);
        });

        it('can do case-sensitive searches', () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
                initialManuallySelected: ['test2'],
                leftLabel: 'Choose',
                rightLabel: 'The value',
                size: 3,
                initialMode: 'regex',
                initialPattern: 't.*2'
            };
            const wrapper = mount(MultiModeTwinlist, {
                propsData
            });
           
            expectTwinlistIncludes(wrapper, ['Text 1', 'Text 3'], ['Text 2']);

            // Make case-sensitive
            wrapper.vm.caseSensitivePattern = true;
           
            expectTwinlistIncludes(wrapper, ['Text 1', 'Text 2', 'Text 3'], []);
        });

        it('can do inverse searches', () => {
            let propsData = {
                possibleValues: defaultPossibleValues,
                initialManuallySelected: ['test2'],
                leftLabel: 'Choose',
                rightLabel: 'The value',
                size: 3,
                initialMode: 'wildcard',
                initialPattern: '*3'
            };
            const wrapper = mount(MultiModeTwinlist, {
                propsData
            });
            expectTwinlistIncludes(wrapper, ['Text 1', 'Text 2'], ['Text 3']);

            // Set inverse search
            wrapper.vm.inversePattern = true;

            expectTwinlistIncludes(wrapper, ['Text 3'], ['Text 1', 'Text 2']);
        });
        

        it('prohibits manual selection', () => {
            const propsData = {
                possibleValues: defaultPossibleValues,
                initialMode: 'regex',
                leftLabel: 'Choose',
                rightLabel: 'The value'
            };
            const wrapper = mount(MultiModeTwinlist, { propsData });
            
            expect(wrapper.find(Twinlist).vm.disabled).toBe(true);
        });
    });

    describe('Type selection', () => {
        const possibleValuesWithTypes = [
            {
                id: 'test1',
                text: 'Text 1',
                type: { id: 'StringValue', text: 'String' }
            },
            {
                id: 'test2',
                text: 'Text 2',
                type: { id: 'DoubleValue', text: 'Double' }
            },
            {
                id: 'test3',
                text: 'Text 3',
                type: { id: 'StringValue', text: 'String' }
            }
        ];

        it('does not render type selection without possible types', () => {
            const wrapper = mount(MultiModeTwinlist, { propsData: {
                possibleValues: defaultPossibleValues,
                leftLabel: 'Choose',
                rightLabel: 'The value',
                size: 3,
                initialMode: 'type'
            } });
            expect(wrapper.find(Checkboxes).exists()).toBeFalsy();
        });

        it('renders type selection and changes label if type selection is selected', () => {
            const wrapper = mount(MultiModeTwinlist, { propsData: {
                possibleValues: possibleValuesWithTypes,
                leftLabel: 'Choose',
                rightLabel: 'The value',
                size: 3,
                initialMode: 'type',
                selectedTypesLabel: 'Types label'
            } });
            expect(wrapper.find(Checkboxes).exists()).toBeTruthy();
            expect(wrapper.find(SearchInput).exists()).toBeFalsy();
            const labels = wrapper.findAll('div.label label');
            expect(labels.at(0).text()).toBe('Types label');
        });

        it('selects via type matching', async () => {
            const propsData = {
                possibleValues: possibleValuesWithTypes,
                initialMode: 'type',
                leftLabel: 'Choose',
                rightLabel: 'The value'
            };
            const wrapper = mount(MultiModeTwinlist, { propsData });
            expect(wrapper.vm.possibleTypes).toStrictEqual([
                { id: 'StringValue', text: 'String' },
                { id: 'DoubleValue', text: 'Double' }
            ]);
            wrapper.find(Checkboxes).vm.$emit('input', ['StringValue']);
            await wrapper.vm.$nextTick();
            expect(wrapper.emitted().typesInput[0][0]).toStrictEqual(['StringValue']);
            expect(wrapper.emitted().input[1][0]).toStrictEqual({ selected: ['test1', 'test3'], isManual: false });
            expectTwinlistIncludes(wrapper, ['Text 2'], ['Text 1', 'Text 3']);
        });

        it('takes additionalPossibleTypes into account', () => {
            const additionalPossibleTypes = [
                { id: 'StringValue', text: 'String' },
                { id: 'IntValue', text: 'Int' }
            ];
            const propsData = {
                possibleValues: possibleValuesWithTypes,
                additionalPossibleTypes,
                initialMode: 'type',
                leftLabel: 'Choose',
                rightLabel: 'The value'
            };
            const wrapper = mount(MultiModeTwinlist, { propsData });
            expect(wrapper.vm.possibleTypes).toStrictEqual([
                { id: 'StringValue', text: 'String' },
                { id: 'IntValue', text: 'Int' },
                { id: 'DoubleValue', text: 'Double' }
            ]);
        });

        it('prohibits manual selection', () => {
            const propsData = {
                possibleValues: possibleValuesWithTypes,
                values: [],
                initialMode: 'type',
                leftLabel: 'Choose',
                rightLabel: 'The value'
            };
            const wrapper = mount(MultiModeTwinlist, { propsData });
            
            expect(wrapper.find(Twinlist).vm.disabled).toBe(true);
        });
    });

    describe('unknown columns', () => {
        let propsData;

        beforeEach(() => {
            propsData = {
                possibleValues: defaultPossibleValues,
                leftLabel: 'Choose',
                rightLabel: 'The value'
            };
        });

        it('does not render unknown columns by default', () => {
            const wrapper = mount(MultiModeTwinlist, { propsData });
            expect(wrapper.find(Twinlist).vm.showUnknownValues).toBeFalsy();
        });

        it('renders and excludes unkown columns by default', () => {
            propsData.showUnknownValues = true;
            const wrapper = mount(MultiModeTwinlist, { propsData });
            expect(wrapper.find(Twinlist).vm.initialIncludeUnknownValues).toBeFalsy();
        });

        it('does not render unknown columns if wanted', () => {
            propsData.showUnknownValues = false;
            const wrapper = mount(MultiModeTwinlist, { propsData });
            expect(wrapper.find(Twinlist).vm.showUnknownValues).toBeFalsy();
        });

        it('does not render unknown columns on non-manual mode', () => {
            propsData.initialMode = 'regex';
            const wrapper = mount(MultiModeTwinlist, { propsData });
            expect(wrapper.find(Twinlist).vm.showUnknownValues).toBeFalsy();
        });
        
        it('emits includeUnknownValuesInput event', () => {
            const wrapper = mount(MultiModeTwinlist, { propsData });
            wrapper.find(Twinlist).vm.$emit('includeUnknownValuesInput', true);
            expect(wrapper.emitted().includeUnknownValuesInput[0][0]).toBe(true);
        });
    });
});
