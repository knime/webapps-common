import { describe, expect, it } from 'vitest';
import { vanillaRenderers } from '@jsonforms/vue-vanilla';
import { fallbackRenderers, defaultRenderers } from '@/nodeDialog/renderers';
import { determineRenderer } from '@@/test-setup/utils/rendererTestUtils';

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

    it('NumberInput config error', () => {
        const uiSchema = {
            type: 'Controll',
            scope: '#/properties/number'
        };

        expect(determineRenderer(uiSchema, schema, renderers)).not.toBeDefined();
    });

    it('NumberInput with options', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/number',
            options: {
                format: 'number'
            }
        };
        
        expect(determineRenderer(uiSchema, schema, renderers)).toBe('IntegerInput');
    });

    it('NumberInput without options', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/number'
        };

        expect(determineRenderer(uiSchema, schema, renderers)).toBe('IntegerInput');
    });
});
