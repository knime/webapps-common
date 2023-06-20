import { describe, expect, it } from 'vitest';
import { vanillaRenderers } from '@jsonforms/vue-vanilla';
import { fallbackRenderers, defaultRenderers } from '..';
import { determineRenderer } from '../rendererTestUtils';

const renderers = [...vanillaRenderers, ...fallbackRenderers, ...defaultRenderers];

describe('ButtonInput', () => {
    const schema = {
        type: 'object',
        properties: {
            buttonInput: {} // type does not matter for button input
        }
    };

    it('buttonInput without options', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/buttonInput'
        };

        expect(determineRenderer(uiSchema, schema, renderers)).toBeUndefined();
    });

    it('buttonInput with options', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/buttonInput',
            options: {
                format: 'button'
            }
        };
        
        expect(determineRenderer(uiSchema, schema, renderers)).toBe('ButtonInput');
    });

    it('buttonInput with string type', () => {
        const schema = {
            type: 'object',
            properties: {
                buttonInput: {} // type does not matter for button input
            }
        };
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/buttonInput',
            options: {
                format: 'button'
            }
        };
        expect(determineRenderer(uiSchema, schema, renderers)).toBe('ButtonInput');
    });

    it('string type without button format', () => {
        const schema = {
            type: 'object',
            properties: {
                buttonInput: {
                    type: 'string'
                }
            }
        };
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/buttonInput'
        };
        expect(determineRenderer(uiSchema, schema, renderers)).toBe('TextInput');
    });
});
