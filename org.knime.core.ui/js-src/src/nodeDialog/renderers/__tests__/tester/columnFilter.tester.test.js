import { expect, it } from 'vitest';
import { columnFilterTester } from '../../columnFilterRenderer';
import { inputFormats } from '@/nodeDialog/constants/inputFormats';
import { dialogInitialData } from '@@/test-setup/mocks/dialogInitialData';

it('ColumnFilterTester', () => {
    expect(
        columnFilterTester({
            type: 'Control',
            scope: '#/properties/view/properties/frequencyColumns',
            options: {
                format: inputFormats.columnFilter
            }
        },
        dialogInitialData.schema)
    ).toEqual(true);

    expect(
        columnFilterTester({
            type: 'Control',
            scope: '#/properties/view/properties/frequencyColumns',
            options: {
                format: inputFormats.anyOfTwinList
            }
        },
        dialogInitialData.schema)
    ).toEqual(false);

    expect(
        columnFilterTester({
            type: 'Section',
            scope: '#/properties/view/properties/frequencyColumns',
            options: {
                format: inputFormats.columnFilter
            }
        },
        dialogInitialData.schema)
    ).toEqual(false);

    expect(
        columnFilterTester({
            type: 'Section',
            scope: '#/properties/view/properties/frequencyColumns',
            options: {
                format: inputFormats.anyOfTwinList
            }
        },
        dialogInitialData.schema)
    ).toEqual(false);
});
