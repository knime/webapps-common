import { describe, expect, it } from 'vitest';
import { vanillaRenderers } from '@jsonforms/vue-vanilla';
import { fallbackRenderers, defaultRenderers } from '..';
import { determineRenderer } from '../rendererTestUtils';

const renderers = [...vanillaRenderers, ...fallbackRenderers, ...defaultRenderers];

describe('controls with an oneOf schema', () => {
    const schema = {
        type: 'object',
        properties: {
            oneOfControl: {
                oneOf: [
                    {
                        const: '1',
                        title: 'One'
                    },
                    {
                        const: '2',
                        title: 'Two'
                    }
                ]
            }
        }
    };

    it('creates a value switch if requested', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/oneOfControl',
            options: {
                format: 'valueSwitch'
            }
        };

        expect(determineRenderer(uiSchema, schema, renderers)).toBe('ValueSwitchInput');
    });

    it('creates radio buttons if requested', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/oneOfControl',
            options: {
                format: 'radio'
            }
        };

        expect(determineRenderer(uiSchema, schema, renderers)).toBe('RadioInput');
    });

    it('falls back to dropdown without format', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/oneOfControl'
        };

        expect(determineRenderer(uiSchema, schema, renderers)).toBe('OneOfDropdown');
    });
});
