import { expect, it } from 'vitest';
import { dropDownTester } from '@/nodeDialog/renderers/dropdownRenderer';
import { inputFormats } from '@/nodeDialog/constants/inputFormats';
import { dialogInitialData } from '@@/test-setup/mocks/dialogInitialData';

it('dropDownTester', () => {
    expect(
        dropDownTester({
            type: 'Control',
            scope: '#/properties/view/properties/xAxisColumn',
            options: {
                format: inputFormats.oneOfDropdown
            }
        },
        dialogInitialData.schema)
    ).toEqual(true);

    expect(
        dropDownTester({
            type: 'Control',
            scope: '#/properties/view/properties/xAxisColumn'
        },
        dialogInitialData.schema)
    ).toEqual(false);

    expect(
        dropDownTester({
            type: 'Section',
            scope: '#/properties/view/properties/xAxisColumn',
            options: {
                format: inputFormats.oneOfDropdown
            }
        },
        dialogInitialData.schema)
    ).toEqual(false);

    expect(
        dropDownTester({
            type: 'Section',
            scope: '#/properties/view/properties/xAxisColumn'
        },
        dialogInitialData.schema)
    ).toEqual(false);
});
