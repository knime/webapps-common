import { describe, expect, it } from 'vitest';
import { radioTester } from '../../radioRenderer';
import { dialogInitialData } from '@@/test-setup/mocks/dialogInitialData';

describe('radioTester', () => {
    it('applies on oneOf control with radio format', () => {
        expect(
            radioTester({
                type: 'Control',
                scope: '#/properties/view/properties/yAxisScale',
                options: {
                    format: 'radio'
                }
            },
            dialogInitialData.schema)
        ).toEqual(true);
    });

    it('does not apply without radio format', () => {
        expect(
            radioTester({
                type: 'Control',
                scope: '#/properties/view/properties/yAxisScale',
                options: {
                    format: 'columnSelection'
                }
            },
            dialogInitialData.schema)
        ).toEqual(false);
    });

    it('does not apply if not a control', () => {
        expect(
            radioTester({
                type: 'Section',
                scope: '#/properties/view/properties/yAxisScale',
                options: {
                    format: 'radio'
                }
            },
            dialogInitialData.schema)
        ).toEqual(false);
    });
});
