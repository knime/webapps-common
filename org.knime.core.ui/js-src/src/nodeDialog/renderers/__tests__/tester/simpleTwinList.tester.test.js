import { expect, it } from 'vitest';
import { simpleTwinlistTester } from '../../simpleTwinlistRenderer';
import { inputFormats } from '@/nodeDialog/constants/inputFormats';
import { dialogInitialData } from '@@/test-setup/mocks/dialogInitialData';

it('simpleTwinlistTester', () => {
    expect(
        simpleTwinlistTester(
            {
                type: 'Control',
                scope: '#/properties/view/properties/simpleTwinlist',
                options: {
                    format: inputFormats.anyOfTwinList
                }
            },
            dialogInitialData.schema
        )
    ).toEqual(true);

    expect(
        simpleTwinlistTester({
            type: 'Control',
            scope: '#/properties/view/properties/simpleTwinlist'
        },
        dialogInitialData.schema)
    ).toEqual(false);

    expect(
        simpleTwinlistTester({
            type: 'Control',
            scope: '#/properties/view/properties/simpleTwinlist'
        },
        dialogInitialData.schema)
    ).toEqual(false);

    expect(
        simpleTwinlistTester({
            type: 'Section',
            scope: '#/properties/view/properties/simpleTwinlist',
            options: {
                format: inputFormats.anyOfTwinList
            }
        },
        dialogInitialData.schema)
    ).toEqual(false);

    expect(
        simpleTwinlistTester({
            type: 'Section',
            scope: '#/properties/view/properties/simpleTwinlist'
        },
        dialogInitialData.schema)
    ).toEqual(false);
});
