import { expect, describe, it } from 'vitest';
import { dialogInitialData } from '@@/test-setup/mocks/dialogInitialData';
import { arrayLayoutTester } from '../../arrayLayoutRenderer';

describe('array tester', () => {
    it('uses array layout', () => {
        expect(
            arrayLayoutTester({
                type: 'Section',
                label: 'Reference lines',
                scope: '#/properties/view/properties/referenceLines',
                elements: [
                ]
            },
            dialogInitialData.schema)
        ).toBe(true);
    });
    
    it('does not use array layout without reference to object array', () => {
        expect(
            arrayLayoutTester({
                type: 'Group',
                label: 'Data'
            },
            dialogInitialData.schema)
        ).toBe(false);
        expect(
            arrayLayoutTester({
                type: 'Control',
                scope: '#/properties/view/properties/xAxisColumn'
            },
            dialogInitialData.schema)
        ).toBe(false);
    });
});
