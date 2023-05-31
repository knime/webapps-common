import { describe, expect, it } from 'vitest';
import { vanillaRenderers } from '@jsonforms/vue-vanilla';
import { fallbackRenderers, defaultRenderers } from '..';
import { determineRenderer } from '../rendererTestUtils';

const renderers = [...vanillaRenderers, ...fallbackRenderers, ...defaultRenderers];

describe('ColumnSelect', () => {
    const schema = {
        type: 'object',
        properties: {
            twinlistSetting: {
                type: 'object',
                properties: {
                    selected: {
                        type: 'array'
                    }
                }
            },
            simpleTwinlistSetting: {
                type: 'array'
            }
        }
    };

    it('determines ColumnSelect renderer', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/twinlistSetting',
            options: {
                showRowKeys: false,
                showNoneColumn: false,
                format: 'columnSelection'
            }
        };
        expect(determineRenderer(uiSchema, schema, renderers)).toBe('ColumnSelect');
    });

    it('determines TwinList renderer', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/twinlistSetting',
            options: {
                format: 'twinList'
            }
        };
        
        expect(determineRenderer(uiSchema, schema, renderers)).toBe('TwinListInput');
    });

    it('determines SimpleTwinList renderer', () => {
        const uiSchema = {
            type: 'Control',
            scope: '#/properties/simpleTwinlistSetting',
            options: {
                format: 'twinList'
            }
        };
        
        expect(determineRenderer(uiSchema, schema, renderers)).toBe('SimpleTwinListInput');
    });
});
