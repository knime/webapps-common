import { describe, expect, it } from 'vitest';
import { vanillaRenderers } from '@jsonforms/vue-vanilla';
import { fallbackRenderers, defaultRenderers } from '..';
import { determineRenderer } from '../rendererTestUtils';

const renderers = [...vanillaRenderers, ...fallbackRenderers, ...defaultRenderers];

describe('controls with an anyOf schema', () => {
    const schema = {
        type: 'object',
        properties: {
            anyOfControl: {
                anyOf: [
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

    it('falls back to twinlist without format', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/anyOfControl'
        };

        expect(determineRenderer(uiSchema, schema, renderers)).toBe('AnyOfTwinlist');
    });
});
