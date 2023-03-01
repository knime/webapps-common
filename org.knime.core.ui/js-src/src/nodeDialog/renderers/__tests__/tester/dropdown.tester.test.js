import { describe, expect, it } from 'vitest';
import { dropdownTester } from '../../dropdownRenderer';
import { inputFormats } from '@/nodeDialog/constants/inputFormats';
import { dialogInitialData } from '@@/test-setup/mocks/dialogInitialData';

describe('dropdownTester', () => {
    it('applies on oneOf control with dropdown format', () => {
        expect(
            dropdownTester({
                type: 'Control',
                scope: '#/properties/view/properties/xAxisColumn',
                options: {
                    format: inputFormats.oneOfDropdown
                }
            },
            dialogInitialData.schema)
        ).toEqual(true);
    });

    it('does not apply without dropdown format', () => {
        expect(
            dropdownTester({
                type: 'Control',
                scope: '#/properties/view/properties/xAxisColumn'
            },
            dialogInitialData.schema)
        ).toEqual(false);
    });

    it('does not apply if not a control', () => {
        expect(
            dropdownTester({
                type: 'Section',
                scope: '#/properties/view/properties/xAxisColumn',
                options: {
                    format: inputFormats.oneOfDropdown
                }
            },
            dialogInitialData.schema)
        ).toEqual(false);
    });
});
