import { describe, expect, it } from 'vitest';
import { vanillaRenderers } from '@jsonforms/vue-vanilla';
import { fallbackRenderers, defaultRenderers } from '..';
import { determineRenderer } from '../rendererTestUtils';

const renderers = [...vanillaRenderers, ...fallbackRenderers, ...defaultRenderers];

describe('NumberInput', () => {
    const schema = {
        type: 'object',
        properties: {
            number: {
                type: 'number'
            }
        }
    };

    it('numberInput config error', () => {
        const uiSchema = {
            type: 'Controll',
            scope: '#/properties/number'
        };

        expect(determineRenderer(uiSchema, schema, renderers)).toBeUndefined();
    });

    it('numberInput with options', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/number',
            options: {
                format: 'number'
            }
        };
        
        expect(determineRenderer(uiSchema, schema, renderers)).toBe('IntegerInput');
    });

    it('numberInput without options', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/number'
        };

        expect(determineRenderer(uiSchema, schema, renderers)).toBe('IntegerInput');
    });
});
