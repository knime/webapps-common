import { describe, expect, it } from 'vitest';
import { optionsMapper,
    isModelSettingAndHasNodeView,
    hasAdvancedOptions,
    optionsMapperWithType,
    getFlowVariablesMap,
    mergeDeep } from '@/nodeDialog/utils';

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

    it('isModelSettingsAndhasNodeView', () => {
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
        // eslint-disable-next-line no-undefined
        expect(hasAdvancedOptions(undefined)).not.toBeTruthy();
    });

    describe('getFlowVariablesMap', () => {
        const createFlowSetting = (
            controllingFlowVariableAvailable,
            controllingFlowVariableName,
            exposedFlowVariableName
        ) => ({
            controllingFlowVariableAvailable,
            controllingFlowVariableName,
            exposedFlowVariableName
        });

        // eslint-disable-next-line no-undefined
        const CONTROLLING_FLOW_SETTINGS = createFlowSetting(true, 'my_controlling_variable', undefined);
        // eslint-disable-next-line no-undefined
        const EXPOSING_FLOW_SETTINGS = createFlowSetting(false, undefined, 'my_exposed_variable');
        // eslint-disable-next-line no-undefined
        const NOTHING_FLOW_SETTINGS = createFlowSetting(false, undefined, undefined);
        const MERGED_FLOW_SETTINGS = createFlowSetting(true, 'my_controlling_variable', 'my_exposed_variable');

        it('should return null for an missing flowVariablesMap', () => {
            expect(getFlowVariablesMap({ rootSchema: {}, path: '', schema: {} })).toBeNull();
        });

        it('should return undefined for missing flow setting for path', () => {
            expect(getFlowVariablesMap({
                path: 'path.to.another_setting',
                rootSchema: { flowVariablesMap: { 'path.to.my_setting': CONTROLLING_FLOW_SETTINGS } },
                schema: {}
            })).toBeNull();

            expect(getFlowVariablesMap({
                path: 'path.to.another_setting',
                rootSchema: { flowVariablesMap: { 'path.to.my_setting': CONTROLLING_FLOW_SETTINGS } },
                schema: { configKeys: ['also_another_setting'] }
            })).toBeNull();
        });

        it('should use path if configKeys is undefined', () => {
            const path = 'path.to.my_setting';
            expect(getFlowVariablesMap({
                path,
                rootSchema: { flowVariablesMap: { [path]: CONTROLLING_FLOW_SETTINGS } },
                schema: {}
            })).toEqual(CONTROLLING_FLOW_SETTINGS);
        });

        it('should use configKeys', () => {
            expect(getFlowVariablesMap({
                path: 'path.to.my_setting',
                rootSchema: { flowVariablesMap: { 'path.to.my_real_setting_name': CONTROLLING_FLOW_SETTINGS } },
                schema: { configKeys: ['my_real_setting_name'] }
            })).toEqual(CONTROLLING_FLOW_SETTINGS);
        });

        it('should merge flow settings for configKeys', () => {
            expect(getFlowVariablesMap({
                path: 'path.to.my_setting',
                rootSchema: { flowVariablesMap: {
                    'path.to.setting_1': EXPOSING_FLOW_SETTINGS,
                    'path.to.setting_2': CONTROLLING_FLOW_SETTINGS
                } },
                schema: { configKeys: ['setting_1', 'setting_2', 'not_overwritten_setting'] }
            })).toEqual(MERGED_FLOW_SETTINGS);

            expect(getFlowVariablesMap({
                path: 'path.to.my_setting',
                rootSchema: { flowVariablesMap: {
                    'path.to.setting_1': NOTHING_FLOW_SETTINGS,
                    'path.to.setting_2': CONTROLLING_FLOW_SETTINGS,
                    'path.to.setting_3': EXPOSING_FLOW_SETTINGS
                } },
                schema: { configKeys: ['setting_1', 'setting_2', 'setting_3', 'not_overwritten_setting'] }
            })).toEqual(MERGED_FLOW_SETTINGS);
        });
    });
});
