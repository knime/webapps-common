import { describe, expect, it } from 'vitest';
import { vanillaRenderers } from '@jsonforms/vue-vanilla';
import { fallbackRenderers, defaultRenderers } from '@/components/renderers';
import { determineRenderer } from '@@/test-setup/utils/rendererTestUtils';

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

    it('IntegerInput config error', () => {
        const uiSchema = {
            type: 'Controll',
            scope: '#/properties/integer'
        };

        expect(determineRenderer(uiSchema, schema, renderers)).not.toBeDefined();
    });

    it('IntegerInput with options', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/integer',
            options: {
                format: 'integer'
            }
        };
        
        expect(determineRenderer(uiSchema, schema, renderers)).toBe('IntegerInput');
    });

    it('IntegerInput without options', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/integer'
        };

        expect(determineRenderer(uiSchema, schema, renderers)).toBe('IntegerInput');
    });
});
