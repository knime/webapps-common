import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getDefaultProps, mountDisplay } from './utils/display';
import ImageRenderer from '../ImageRenderer.vue';
import HTMLRenderer from '../HtmlRenderer.vue';
// @ts-ignore
import { TableUI } from '@knime/knime-ui-table';
import type { VueWrapper } from '@vue/test-utils';
import type { TableViewDisplayProps } from '../types';

// Stubbing TableUI with shallowMount is not working with script setup. Therefore we mount it instead.
vi.mock('@knime/knime-ui-table', () => ({
    constants: {
        MIN_COLUMN_SIZE: 1,
        SPECIAL_COLUMN_SIZE: 1
    },
    TableUI: {
        template: `<div>
            <slot
                name="cellContent-3"
                :data="{ cell: 'dummyImagePath.png', height: 20, width: 40 }"
            />
            <slot
                name="cellContent-4"
                :data="{ cell: '<h1>dummyHtml</h1>' }"
            />
        </div>`
    }
}));

vi.mock('../ImageRenderer.vue', () => ({
    default: {
        template: '<div/>'
    }
}));


vi.mock('../HtmlRenderer.vue', () => ({
    default: {
        template: '<div/>'
    }
}));

describe('slot rendering', () => {
    let wrapper: VueWrapper, props: TableViewDisplayProps, tableUI: any;

    beforeEach(async () => {
        props = getDefaultProps();
        props.header.columnContentTypes = ['txt', 'img_path', 'html'];
        props.header.displayedColumns = ['col1', 'col2', 'col3'];
        wrapper = await mountDisplay({ props });
        tableUI = wrapper.getComponent(TableUI);
    });

    it('creates the correct source urls', () => {
        expect(tableUI.findComponent(ImageRenderer).attributes()).toMatchObject({
            path: 'dummyImagePath.png',
            // @ts-ignore baseUrl not present in resourceInfo
            'base-url': props.knimeService.extensionConfig.resourceInfo?.baseUrl,
            height: '20',
            width: '40',
            update: 'true'
        });
    });

    it('prevents size update if resizing is active', async () => {
        await tableUI.vm.$emit('columnResizeStart');
        expect(tableUI.findComponent(ImageRenderer).attributes().update).toBe('false');
    });

    it('creates the correct content for html', () => {
        expect(tableUI.findComponent(HTMLRenderer).attributes()).toMatchObject({
            content: '<h1>dummyHtml</h1>'
        });
    });
});
