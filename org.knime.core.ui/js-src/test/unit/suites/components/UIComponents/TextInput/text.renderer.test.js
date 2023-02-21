import { describe, expect, it } from 'vitest';
import { vanillaRenderers } from '@jsonforms/vue-vanilla';
import { fallbackRenderers, defaultRenderers } from '@/components/renderers';
import { determineRenderer } from '@@/test-setup/utils/rendererTestUtils';

const renderers = [...vanillaRenderers, ...fallbackRenderers, ...defaultRenderers];

describe('TextInput', () => {
    const schema = {
        type: 'object',
        properties: {
            text: {
                type: 'string'
            }
        }
    };

    it('TextInput config error', () => {
        const uiSchema = {
            type: 'Controll',
            scope: '#/properties/text'
        };

        expect(determineRenderer(uiSchema, schema, renderers)).not.toBeDefined();
    });

    it('TextInput with options', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/text',
            options: {
                format: 'string'
            }
        };
        
        expect(determineRenderer(uiSchema, schema, renderers)).toBe('TextInput');
    });

    it('TextInput without options', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/text'
        };

        expect(determineRenderer(uiSchema, schema, renderers)).toBe('TextInput');
    });
});
