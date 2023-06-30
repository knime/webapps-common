import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getDefaultProps, mountDisplay } from './utils/display';
import ImageRenderer from '../ImageRenderer.vue';
import HTMLRenderer from '../HtmlRenderer.vue';
// @ts-ignore
import { TableUI } from '@knime/knime-ui-table';
import type { VueWrapper } from '@vue/test-utils';
import type { TableViewDisplayProps } from '../types';
import * as vuexModule from 'vuex';

describe('slot rendering', () => {
    let wrapper: VueWrapper, props: TableViewDisplayProps, tableUI: any;

    beforeEach(async () => {
        props = getDefaultProps();
        props.header.columnContentTypes = ['txt', 'img_path', 'html'];
        props.header.displayedColumns = ['col1', 'col2', 'col3'];
        props.rows.top = [
            ['0', 'Row0', 'cell(0,0)', 'dummyImagePath0.png', '<h1>dummyHtml0</h1>'],
            ['1', 'Row1', 'cell(1,0)', 'dummyImagePath1.png', '<h1>dummyHtml1</h1>'],
            ['2', 'Row2', 'cell(2,0)', 'dummyImagePath2.png', '<h1>dummyHtml2</h1>']
        ];
        vi.spyOn(vuexModule, 'useStore').mockReturnValue({ getters: { 'api/uiExtResourceLocation': vi.fn() } } as any);
        wrapper = await mountDisplay({ props });
        tableUI = wrapper.getComponent(TableUI);
    });

    it('creates the correct source urls', () => {
        expect(tableUI.findComponent(ImageRenderer).props()).toMatchObject({
            path: 'dummyImagePath0.png',
            // @ts-ignore baseUrl not present in resourceInfo
            baseUrl: props.knimeService.extensionConfig.resourceInfo?.baseUrl,
            height: 80,
            width: 90,
            update: true
        });
    });

    it('prevents size update if resizing is active', async () => {
        await tableUI.vm.$emit('columnResizeStart');
        expect(tableUI.findComponent(ImageRenderer).props().update).toBe(false);
    });

    it('creates the correct content for html', () => {
        expect(tableUI.findComponent(HTMLRenderer).props()).toMatchObject({
            content: '<h1>dummyHtml0</h1>'
        });
    });
});
