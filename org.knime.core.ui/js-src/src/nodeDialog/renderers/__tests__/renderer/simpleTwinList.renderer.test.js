import { describe, expect, it } from 'vitest';
import { vanillaRenderers } from '@jsonforms/vue-vanilla';
import { fallbackRenderers, defaultRenderers } from '..';
import { determineRenderer } from '../rendererTestUtils';

const renderers = [...vanillaRenderers, ...fallbackRenderers, ...defaultRenderers];

describe('TwinlistInput', () => {
    const schema = {
        type: 'object',
        properties: {
            twinlist: {
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
    };

    it('twinListInput config error', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/twinlist',
            options: {
                format: 'integer'
            }
        };

        expect(determineRenderer(uiSchema, schema, renderers)).toBe('SimpleTwinListInput');
    });

    it('twinListInput with options', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/twinlist',
            options: {
                format: 'twinList'
            }
        };
        
        expect(determineRenderer(uiSchema, schema, renderers)).toBe('SimpleTwinListInput');
    });

    it('twinListInput without options uses oneOf fallback', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/twinlist'
        };

        expect(determineRenderer(uiSchema, schema, renderers)).toBe('SimpleTwinListInput');
    });
});
