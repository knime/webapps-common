import { describe, expect, it } from 'vitest';
import { vanillaRenderers } from '@jsonforms/vue-vanilla';
import { fallbackRenderers, defaultRenderers } from '@/nodeDialog/renderers';
import { determineRenderer } from '@@/test-setup/utils/rendererTestUtils';

const renderers = [...vanillaRenderers, ...fallbackRenderers, ...defaultRenderers];

describe('Section', () => {
    const schema = {};

    it('Empty SectionLayout', () => {
        const uiSchema = {
            type: 'Section',
            scope: '#/properties/test'
        };

        expect(determineRenderer(uiSchema, schema, renderers)).toBe('SectionLayout');
    });
});
