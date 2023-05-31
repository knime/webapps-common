import { describe, expect, it } from 'vitest';
import { columnSelectTester } from '../../columnSelectRenderer';
import { dialogInitialData } from '@@/test-setup/mocks/dialogInitialData';

describe('columnSelectTester', () => {
    it('applies control with columnSelect format', () => {
        expect(
            columnSelectTester({
                type: 'Control',
                scope: '#/properties/view/properties/xAxisColumn',
                options: {
                    format: 'columnSelection'
                }
            },
            dialogInitialData.schema)
        ).toBe(true);
    });

    it('does not apply if not a control', () => {
        expect(
            columnSelectTester({
                type: 'Section'
            },
            dialogInitialData.schema)
        ).toBe(false);
    });
});
