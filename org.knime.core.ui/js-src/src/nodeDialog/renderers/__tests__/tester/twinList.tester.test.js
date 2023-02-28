import { describe, expect, it } from 'vitest';
import { twinlistTester } from '../../twinlistRenderer';
import { inputFormats } from '@/nodeDialog/constants/inputFormats';
import { dialogInitialData } from '@@/test-setup/mocks/dialogInitialData';

describe('twinlistTester', () => {
    it('applies on anyOf control with twinlist format and selected property', () => {
        expect(
            twinlistTester(
                {
                    type: 'Control',
                    scope: '#/properties/view/properties/frequencyColumns',
                    options: {
                        format: inputFormats.anyOfTwinList
                    }
                },
                dialogInitialData.schema
            )
        ).toEqual(true);
    });

    it('does not apply without twinlist format', () => {
        expect(
            twinlistTester({
                type: 'Control',
                scope: '#/properties/view/properties/frequencyColumns'
            },
            dialogInitialData.schema)
        ).toEqual(false);
    });

    it('does not apply if not a control', () => {
        expect(
            twinlistTester({
                type: 'Section',
                scope: '#/properties/view/properties/frequencyColumns',
                options: {
                    format: inputFormats.anyOfTwinList
                }
            },
            dialogInitialData.schema)
        ).toEqual(false);
    });

    it('does not apply without selected property', () => {
        expect(
            twinlistTester({
                type: 'Control',
                scope: '#/properties/view/properties/simpleTwinlist',
                options: {
                    format: inputFormats.anyOfTwinList
                }
            },
            dialogInitialData.schema)
        ).toEqual(false);
    });
});
