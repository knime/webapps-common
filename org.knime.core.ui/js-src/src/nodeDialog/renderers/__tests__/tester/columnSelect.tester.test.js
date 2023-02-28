import { describe, expect, it } from 'vitest';
import { columnSelectTester } from '../../columnSelectRenderer';
import { inputFormats } from '@/nodeDialog/constants/inputFormats';
import { dialogInitialData } from '@@/test-setup/mocks/dialogInitialData';

describe('columnSelectTester', () => {
    it('applies on oneOf control with columnSelect format', () => {
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
    });

    it('does not apply without columnSelect format', () => {
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
    });

    it('does not apply if not a control', () => {
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
    });
});
