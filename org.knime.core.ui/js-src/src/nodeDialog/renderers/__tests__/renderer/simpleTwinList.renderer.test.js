import { describe, expect, it } from 'vitest';
import { vanillaRenderers } from '@jsonforms/vue-vanilla';
import { fallbackRenderers, defaultRenderers } from '..';
import { determineRenderer } from '../rendererTestUtils';

const renderers = [...vanillaRenderers, ...fallbackRenderers, ...defaultRenderers];

describe('TwinlistInput', () => {
    const schema = {
        type: 'object',
        properties: {
            twinlist: {
                type: 'array'
            }
        }
    };

    it('twinListInput with options', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/twinlist',
            options: {
                format: 'twinList'
            }
        };
        
        expect(determineRenderer(uiSchema, schema, renderers)).toBe('SimpleTwinListInput');
    });
});
