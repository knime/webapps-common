import { describe, expect, it } from 'vitest';
import { determineRenderer } from '../rendererTestUtils';

describe('CheckboxInput', () => {
    const schema = {
        type: 'object',
        properties: {
            checkbox: {
                type: 'boolean'
            }
        }
    };

    it('CheckboxInput config error', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/checkbox',
            options: {
                format: 'integer'
            }
        };

        expect(determineRenderer(uiSchema, schema)).toBe('CheckboxInput');
    });

    it('CheckboxInput with options', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/checkbox',
            options: {
                format: 'checkbox'
            }
        };
        
        expect(determineRenderer(uiSchema, schema)).toBe('CheckboxInput');
    });

    it('CheckboxInput without options', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/checkbox'
        };

        expect(determineRenderer(uiSchema, schema)).toBe('CheckboxInput');
    });
});
