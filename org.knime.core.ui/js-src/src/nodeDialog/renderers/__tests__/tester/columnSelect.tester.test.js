import { describe, expect, it } from 'vitest';
import { columnSelectTester } from '../../columnSelectRenderer';
import { dialogInitialData } from '@@/test-setup/mocks/dialogInitialData';

describe('columnSelectTester', () => {
    it('applies on oneOf control with columnSelect format', () => {
        expect(
            columnSelectTester({
                type: 'Control',
                scope: '#/properties/view/properties/xAxisColumn'
            },
            dialogInitialData.schema)
        ).toBe(true);
    });

    it('does not apply if not a control', () => {
        expect(
            columnSelectTester({
                type: 'Section',
                scope: '#/properties/view/properties/xAxisColumn'
            },
            dialogInitialData.schema)
        ).toBe(false);
    });
});
