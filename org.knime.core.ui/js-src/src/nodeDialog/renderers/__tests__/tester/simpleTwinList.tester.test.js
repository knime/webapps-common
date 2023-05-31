import { describe, expect, it } from 'vitest';
import { simpleTwinlistTester } from '../../twinlistRenderer';
import { inputFormats } from '@/nodeDialog/constants/inputFormats';
import { dialogInitialData } from '@@/test-setup/mocks/dialogInitialData';

describe('simpleTwinlistTester', () => {
    it('applies on anyOf control with twinlist format', () => {
        expect(
            simpleTwinlistTester(
                {
                    type: 'Control',
                    scope: '#/properties/view/properties/simpleTwinlist',
                    options: {
                        format: inputFormats.twinList
                    }
                },
                dialogInitialData.schema
            )
        ).toBe(true);
    });

    it('does not apply without twinlist format', () => {
        expect(
            simpleTwinlistTester({
                type: 'Control',
                scope: '#/properties/view/properties/simpleTwinlist'
            },
            dialogInitialData.schema)
        ).toBe(false);
    });

    it('does not apply if not a control', () => {
        expect(
            simpleTwinlistTester({
                type: 'Section',
                options: {
                    format: inputFormats.twinList
                }
            },
            dialogInitialData.schema)
        ).toBe(false);
    });
});
