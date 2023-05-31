import { describe, expect, it } from 'vitest';
import { vanillaRenderers } from '@jsonforms/vue-vanilla';
import { fallbackRenderers, defaultRenderers } from '..';
import { determineRenderer } from '../rendererTestUtils';

const renderers = [...vanillaRenderers, ...fallbackRenderers, ...defaultRenderers];

describe('ColumnFilter', () => {
    const schema = {
        type: 'object',
        properties: {
            columnFilter: {
                type: 'object',
                properties: {
                    selected: {
                        anyOf: [
                            {
                                const: '1',
                                title: 'One'
                            },
                            {
                                const: '2',
                                title: 'Two'
                            },
                            {
                                const: '3',
                                title: 'Three'
                            }
                        ]
                    }
                }
            }
        }
    };

    it('columnFilter with options', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/columnFilter',
            options: {
                format: 'columnFilter'
            }
        };
        
        expect(determineRenderer(uiSchema, schema, renderers)).toBe('ColumnFilter');
    });
});
