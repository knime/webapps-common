import { expect, it } from 'vitest';
import { integerTester } from '../../integerRenderer';
import { inputFormats } from '@/nodeDialog/constants/inputFormats';
import { dialogInitialData } from '@@/test-setup/mocks/dialogInitialData';

it('integerTester', () => {
    expect(
        integerTester({
            type: 'Control',
            scope: '#/properties/view/properties/maxRows',
            options: {
                format: inputFormats.integer
            }
        },
        dialogInitialData.schema)
    ).toEqual(true);

    expect(
        integerTester({
            type: 'Control',
            scope: '#/properties/view/properties/maxRows'
        },
        dialogInitialData.schema)
    ).toEqual(false);

    expect(
        integerTester({
            type: 'Section',
            scope: '#/properties/view/properties/maxRows',
            options: {
                format: inputFormats.integer
            }
        },
        dialogInitialData.schema)
    ).toEqual(false);

    expect(
        integerTester({
            type: 'Section',
            scope: '#/properties/view/properties/maxRows'
        },
        dialogInitialData.schema)
    ).toEqual(false);
});
