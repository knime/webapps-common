import { describe, expect, it } from 'vitest';
import { columnFilterTester } from '../../columnFilterRenderer';
import { inputFormats } from '@/nodeDialog/constants/inputFormats';
import { dialogInitialData } from '@@/test-setup/mocks/dialogInitialData';

describe('ColumnFilterTester', () => {
    it('applies on anyOf control with columnFilter format', () => {
        expect(
            columnFilterTester({
                type: 'Control',
                scope: '#/properties/view/properties/frequencyColumns',
                options: {
                    format: inputFormats.columnFilter
                }
            },
            dialogInitialData.schema)
        ).toBe(true);
    });

    it('does not apply without columnFilter format', () => {
        expect(
            columnFilterTester({
                type: 'Control',
                scope: '#/properties/view/properties/frequencyColumns',
                options: {
                    format: inputFormats.twinList
                }
            },
            dialogInitialData.schema)
        ).toBe(false);
    });

    it('does not apply if not a control', () => {
        expect(
            columnFilterTester({
                type: 'Section',
                options: {
                    format: inputFormats.columnFilter
                }
            },
            dialogInitialData.schema)
        ).toBe(false);
    });
});
