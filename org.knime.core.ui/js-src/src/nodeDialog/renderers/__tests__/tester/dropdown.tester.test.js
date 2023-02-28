import { describe, expect, it } from 'vitest';
import { dropDownTester } from '../../dropdownRenderer';
import { inputFormats } from '@/nodeDialog/constants/inputFormats';
import { dialogInitialData } from '@@/test-setup/mocks/dialogInitialData';

describe('dropDownTester', () => {
    it('applies on oneOf control with dropdown format', () => {
        expect(
            dropDownTester({
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
            dropDownTester({
                type: 'Control',
                scope: '#/properties/view/properties/xAxisColumn'
            },
            dialogInitialData.schema)
        ).toEqual(false);
    });

    it('does not apply if not a control', () => {
        expect(
            dropDownTester({
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
