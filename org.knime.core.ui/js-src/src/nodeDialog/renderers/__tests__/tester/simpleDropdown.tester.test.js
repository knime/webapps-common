import { describe, expect, it } from 'vitest';
import { simpleDropdownTester } from '../../simpleDropdownRenderer';
import { inputFormats } from '@/nodeDialog/constants/inputFormats';
import { dialogInitialData } from '@@/test-setup/mocks/dialogInitialData';

describe('simpleDropdownTester', () => {
    it('applies on oneOf control with dropdown format', () => {
        expect(
            simpleDropdownTester({
                type: 'Control',
                scope: '#/properties/view/properties/xAxisColumn',
                options: {
                    format: inputFormats.oneOfDropdown
                }
            },
            dialogInitialData.schema)
        ).toBe(true);
    });

    it('does not apply without dropdown format', () => {
        expect(
            simpleDropdownTester({
                type: 'Control',
                scope: '#/properties/view/properties/xAxisColumn'
            },
            dialogInitialData.schema)
        ).toBe(false);
    });

    it('does not apply if not a control', () => {
        expect(
            simpleDropdownTester({
                type: 'Section',
                scope: '#/properties/view/properties/xAxisColumn',
                options: {
                    format: inputFormats.oneOfDropdown
                }
            },
            dialogInitialData.schema)
        ).toBe(false);
    });
});
