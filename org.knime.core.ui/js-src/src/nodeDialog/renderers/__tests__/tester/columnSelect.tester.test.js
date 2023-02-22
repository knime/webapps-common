import { expect, it } from 'vitest';
import { columnSelectTester } from '../../columnSelectRenderer';
import { inputFormats } from '@/nodeDialog/constants/inputFormats';
import { dialogInitialData } from '@@/test-setup/mocks/dialogInitialData';

it('columnSelectTester', () => {
    expect(
        columnSelectTester({
            type: 'Control',
            scope: '#/properties/view/properties/xAxisColumn',
            options: {
                format: inputFormats.columnSelect
            }
        },
        dialogInitialData.schema)
    ).toEqual(true);

    expect(
        columnSelectTester({
            type: 'Control',
            scope: '#/properties/view/properties/xAxisColumn',
            options: {
                format: inputFormats.oneOfDropdown
            }
        },
        dialogInitialData.schema)
    ).toEqual(false);

    expect(
        columnSelectTester({
            type: 'Section',
            scope: '#/properties/view/properties/xAxisColumn',
            options: {
                format: inputFormats.columnSelect
            }
        },
        dialogInitialData.schema)
    ).toEqual(false);

    expect(
        columnSelectTester({
            type: 'Section',
            scope: '#/properties/view/properties/xAxisColumn',
            options: {
                format: inputFormats.oneOfDropdown
            }
        },
        dialogInitialData.schema)
    ).toEqual(false);
});
