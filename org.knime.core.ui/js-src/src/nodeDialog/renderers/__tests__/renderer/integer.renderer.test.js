import { describe, expect, it } from 'vitest';
import { vanillaRenderers } from '@jsonforms/vue-vanilla';
import { fallbackRenderers, defaultRenderers } from '..';
import { determineRenderer } from '../rendererTestUtils';

const renderers = [...vanillaRenderers, ...fallbackRenderers, ...defaultRenderers];

describe('IntegerInput', () => {
    const schema = {
        type: 'object',
        properties: {
            integer: {
                type: 'integer'
            }
        }
    };

    it('integerInput config error', () => {
        const uiSchema = {
            type: 'Controll',
            scope: '#/properties/integer'
        };

        expect(determineRenderer(uiSchema, schema, renderers)).toBeUndefined();
    });

    it('integerInput with options', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/integer',
            options: {
                format: 'integer'
            }
        };
        
        expect(determineRenderer(uiSchema, schema, renderers)).toBe('IntegerInput');
    });

    it('integerInput without options', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/integer'
        };

        expect(determineRenderer(uiSchema, schema, renderers)).toBe('IntegerInput');
    });
});
