import { describe, expect, it } from 'vitest';
import { vanillaRenderers } from '@jsonforms/vue-vanilla';
import { fallbackRenderers, defaultRenderers } from '..';
import { determineRenderer } from '../rendererTestUtils';

const renderers = [...vanillaRenderers, ...fallbackRenderers, ...defaultRenderers];

describe('ColumnSelect', () => {
    const schema = {
        type: 'object',
        properties: {
            columnselect: {
                oneOf: [
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
    };

    it('renders SimpleColumnSelect', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/columnselect',
            options: {
                format: 'columnSelection'
            }
        };
        
        expect(determineRenderer(uiSchema, schema, renderers)).toBe('SimpleColumnSelect');
    });
});
