import { expect, it } from 'vitest';
import { radioTester } from '@/components/renderers/radioRenderer';
import { dialogInitialData } from '@@/test-setup/mocks/dialogInitialData';

it('radioTester', () => {
    expect(
        radioTester({
            type: 'Control',
            scope: '#/properties/view/properties/yAxisScale',
            options: {
                format: 'radio'
            }
        },
        dialogInitialData.schema)
    ).toEqual(true);

    expect(
        radioTester({
            type: 'Control',
            scope: '#/properties/view/properties/yAxisScale',
            options: {
                format: 'columnSelection'
            }
        },
        dialogInitialData.schema)
    ).toEqual(false);

    expect(
        radioTester({
            type: 'Section',
            scope: '#/properties/view/properties/yAxisScale',
            options: {
                format: 'radio'
            }
        },
        dialogInitialData.schema)
    ).toEqual(false);

    expect(
        radioTester({
            type: 'Section',
            scope: '#/properties/view/properties/yAxisScale',
            options: {
                format: 'columnSelect'
            }
        },
        dialogInitialData.schema)
    ).toEqual(false);
});
