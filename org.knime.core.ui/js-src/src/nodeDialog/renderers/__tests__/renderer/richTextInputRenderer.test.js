import { describe, expect, it } from 'vitest';
import { vanillaRenderers } from '@jsonforms/vue-vanilla';
import { fallbackRenderers, defaultRenderers } from '..';
import { determineRenderer } from '../rendererTestUtils';
import { inputFormats } from '@/nodeDialog/constants';

const renderers = [...vanillaRenderers, ...fallbackRenderers, ...defaultRenderers];

describe('RichTextInput', () => {
    const schema = {
        type: 'object',
        properties: {
            richTextContent: {
                type: 'string'
            }
        }
    };

    it('richTextInput config error', () => {
        const uiSchema = {
            type: 'Controll',
            scope: '#/properties/richTextContent',
            options: {
                format: inputFormats.richTextInput
            }
        };
        expect(determineRenderer(uiSchema, schema, renderers)).toBeUndefined();
    });

    it('richTextInput with options', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/richTextContent',
            options: {
                format: 'richTextInput'
            }
        };
        
        expect(determineRenderer(uiSchema, schema, renderers)).toBe('RichTextInput');
    });

    it('richTextInput without options uses fallback text renderer', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/richTextContent'
        };

        expect(determineRenderer(uiSchema, schema, renderers)).toBe('TextInput');
    });
});
