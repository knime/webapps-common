import { describe, expect, it } from 'vitest';
import { simpleColumnSelectTester } from '../../simpleColumnSelectRenderer';
import { inputFormats } from '@/nodeDialog/constants/inputFormats';
import { dialogInitialData } from '@@/test-setup/mocks/dialogInitialData';

describe('simpleColumnSelectTester', () => {
    it('applies on oneOf control with columnSelect format', () => {
        expect(
            simpleColumnSelectTester({
                type: 'Control',
                scope: '#/properties/view/properties/simpleColumnSelect',
                options: {
                    format: inputFormats.columnSelect
                }
            },
            dialogInitialData.schema)
        ).toBe(true);
    });

    it('does not apply without dropdown format', () => {
        expect(
            simpleColumnSelectTester({
                type: 'Control',
                scope: '#/properties/view/properties/simpleColumnSelect'
            },
            dialogInitialData.schema)
        ).toBe(false);
    });

    it('does not apply if not a control', () => {
        expect(
            simpleColumnSelectTester({
                type: 'Section',
                scope: '#/properties/view/properties/simpleColumnSelect',
                options: {
                    format: inputFormats.columnSelect
                }
            },
            dialogInitialData.schema)
        ).toBe(false);
    });
});
