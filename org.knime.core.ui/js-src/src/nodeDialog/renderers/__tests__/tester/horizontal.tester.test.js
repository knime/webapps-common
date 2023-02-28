import { describe, expect, it } from 'vitest';
import { dialogInitialData } from '@@/test-setup/mocks/dialogInitialData';
import { horizontalLayoutTester } from '../../horizontalLayoutRenderer';

describe('horizontalLayoutTester', () => {
    it('applies on type HorizontalLayout', () => {
        expect(
            horizontalLayoutTester({
                type: 'HorizontalLayout'
            },
            dialogInitialData.schema)
        ).toEqual(true);
    });
    
    it('does not apply if type is not HorizontalLayout', () => {
        expect(
            horizontalLayoutTester({
                type: 'Section',
                label: 'Data'
            },
            dialogInitialData.schema)
        ).toEqual(false);
    
        expect(
            horizontalLayoutTester({
                type: 'Control',
                scope: '#/properties/view/properties/xAxisColumn'
            },
            dialogInitialData.schema)
        ).toEqual(false);
    });
});
