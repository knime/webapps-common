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

    it('checkboxInput config error', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/checkbox',
            options: {
                format: 'integer'
            }
        };

        expect(determineRenderer(uiSchema, schema)).toBe('CheckboxInput');
    });

    it('checkboxInput with options', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/checkbox',
            options: {
                format: 'checkbox'
            }
        };
        
        expect(determineRenderer(uiSchema, schema)).toBe('CheckboxInput');
    });

    it('checkboxInput without options', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/checkbox'
        };

        expect(determineRenderer(uiSchema, schema)).toBe('CheckboxInput');
    });
});
