import { optionsMapper,
    isModelSettingAndHasNodeView,
    hasAdvancedOptions,
    optionsMapperWithType,
    mergeDeep } from '@/utils/nodeDialogUtils';

describe('Utils', () => {
    it('optionsMapper maps Knime row data presentation to echarts index value', () => {
        expect(
            [
                { const: 'rowName', title: 'Row Name' },
                { const: 'columName', title: 'Colum Name' }
            ].map(optionsMapper)
        ).toEqual([
            { id: 'rowName', text: 'Row Name' },
            { id: 'columName', text: 'Colum Name' }
        ]);
    });

    it('optionsMapperWithType resolves additional type information', () => {
        expect(
            [
                { const: 'rowName', title: 'Row Name', columnType: 'typeA', columnTypeDisplayed: 'Type A' },
                { const: 'columName', title: 'Colum Name', columnType: 'typeB', columnTypeDisplayed: 'Type B' }
            ].map(optionsMapperWithType)
        ).toEqual([
            { id: 'rowName', text: 'Row Name', type: { id: 'typeA', text: 'Type A' } },
            { id: 'columName', text: 'Colum Name', type: { id: 'typeB', text: 'Type B' } }
        ]);
    });

    it('mergeDeep', () => {
        // resolves without conflicts if possible
        expect(mergeDeep({ a: 1 }, { b: 1 })).toStrictEqual({ a: 1, b: 1 });
        expect(mergeDeep({ a: { b: 1 } }, { a: { c: 1 } })).toStrictEqual({ a: { b: 1, c: 1 } });
        // prefers the second object over the first one on conflicts
        expect(mergeDeep({ a: 1 }, { a: 2 })).toStrictEqual({ a: 2 });
        expect(mergeDeep({ a: { b: 1 } }, { a: 1 })).toStrictEqual({ a: 1 });
        expect(mergeDeep({ a: 1 }, { a: { c: 1 } })).toStrictEqual({ a: { c: 1 } });
        // arrays
        expect(mergeDeep({ a: [1] }, { a: [2] })).toStrictEqual({ a: [2] });
        // not an object
        expect(mergeDeep({ a: 1 }, 1)).toStrictEqual({ a: 1 });
        expect(mergeDeep(1, { a: 1 })).toStrictEqual({ a: 1 });
    });

    test('isModelSettingsAndhasNodeView', () => {
        const control = {
            rootSchema: {
                hasNodeView: true
            },
            uischema: {
                scope: '#/properties/model/blub'
            }


        };
        expect(isModelSettingAndHasNodeView(control)).toBeTruthy();

        control.rootSchema.hasNodeView = false;
        expect(isModelSettingAndHasNodeView(control)).toBeFalsy();

        control.rootSchema.hasNodeView = true;
        control.uischema.scope = '#/properties/view/blub';
        expect(isModelSettingAndHasNodeView(control)).toBeFalsy();
    });

    it('checks that ui_schema with advanced settings returns true', () => {
        const uiSchema = {
            elements: [
                {
                    type: 'Section',
                    label: 'Some Section',
                    description: 'test',
                    elements: [
                        {
                            type: 'Control',
                            scope: '#/properties/model/properties/categoryColumn',
                            options: {
                                format: 'columnSelection',
                                showRowKeys: false,
                                showNoneColumn: false,
                                isAdvanced: true
                            }
                        }
                    ]
                }
            ]
        };
        expect(hasAdvancedOptions(uiSchema)).toBeTruthy();
    });

    it('checks that ui_schema without advanced settings returns false', () => {
        const uiSchema = {
            elements: [
                {
                    type: 'Section',
                    label: 'Some Section',
                    description: 'test',
                    elements: [
                        {
                            type: 'Control',
                            scope: '#/properties/model/properties/categoryColumn',
                            options: {
                                format: 'columnSelection',
                                showRowKeys: false,
                                showNoneColumn: false
                            }
                        }
                    ]
                }
            ]
        };
        expect(hasAdvancedOptions(uiSchema)).not.toBeTruthy();
    });

    it('checks that it does not throw errors with an empty uischema', () => {
        expect(hasAdvancedOptions(undefined)).not.toBeTruthy();
    });
});
