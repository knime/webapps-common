import { describe, expect, it } from 'vitest';
import { dialogInitialData } from '@@/test-setup/mocks/dialogInitialData';
import { sectionLayoutTester } from '../../sectionLayoutRenderer';

describe('uses section layout', () => {
    it('applies on Section type', () => {
        expect(
            sectionLayoutTester({
                type: 'Section',
                label: 'Data'
            },
            {})
        ).toBe(true);
    });

    it('does not apply on a type other than Section', () => {
        expect(
            sectionLayoutTester({
                type: 'Group',
                label: 'Data'
            },
            {})
        ).toBe(false);
        
        expect(
            sectionLayoutTester({
                type: 'Control',
                scope: '#/properties/view/properties/xAxisColumn'
            },
            dialogInitialData.schema)
        ).toBe(false);
    });
});
