import { describe, expect, it } from 'vitest';
import { vanillaRenderers } from '@jsonforms/vue-vanilla';
import { fallbackRenderers, defaultRenderers } from '..';
import { determineRenderer } from '../rendererTestUtils';

const renderers = [...vanillaRenderers, ...fallbackRenderers, ...defaultRenderers];

describe('ValueSwitchInput', () => {
    const schema = {
        type: 'object',
        properties: {
            valueSwitch: {
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

    it('check that the default renderer is used for invalid configs', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/valueSwitch',
            options: {
                format: 'integer'
            }
        };

        expect(determineRenderer(uiSchema, schema, renderers)).toBe('SimpleColumnSelect');
    });

    it('ensure a value switch is created if explicitly requested', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/valueSwitch',
            options: {
                format: 'valueSwitch'
            }
        };

        expect(determineRenderer(uiSchema, schema, renderers)).toBe('ValueSwitchInput');
    });

    it('check if default renderer is used if value switch isn\'t explicitly requested', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/valueSwitch'
        };

        expect(determineRenderer(uiSchema, schema, renderers)).toBe('SimpleColumnSelect');
    });
});
