/* eslint-disable vitest/max-nested-describe */
import type { VueWrapper } from '@vue/test-utils';
import { describe, it, beforeEach, expect } from 'vitest';
// @ts-ignore
import { TableUI } from '@knime/knime-ui-table';
import type { TableViewDisplayProps } from '../types';
import { getDefaultProps, shallowMountDisplay } from './utils/display';
import specialColumns from '../utils/specialColumns';

describe('TableViewDisplay.vue', () => {
    let props: TableViewDisplayProps;

    beforeEach(() => {
        props = getDefaultProps();
    });

    describe('tableUI props', () => {
        const getTableUIProps = (wrapper: VueWrapper, propName: string) => {
            const tableUI = wrapper.findComponent(TableUI);
            const attributes = tableUI.vm.$props;
            return attributes[propName];
        };

        describe('data', () => {
            const getData = (wrapper: VueWrapper) => getTableUIProps(wrapper, 'data');
            const getBottomData = (wrapper: VueWrapper) => getTableUIProps(wrapper, 'bottomData');


            it('sets data', () => {
                const wrapper = shallowMountDisplay({ props });
                const data = getData(wrapper);
                expect(data).toStrictEqual([props.rows.top]);
                const bottomData = getBottomData(wrapper);
                expect(bottomData).toStrictEqual(props.rows.bottom);
            });

            it('defaults to empty bottom data', () => {
                props.rows.bottom = undefined;
                const wrapper = shallowMountDisplay({ props });
                const bottomData = getBottomData(wrapper);
                expect(bottomData).toStrictEqual([]);
            });

            it('appends dots', () => {
                props.header.indicateRemainingColumnsSkipped = true;
                const wrapper = shallowMountDisplay({ props });
                const data = getData(wrapper);
                expect(data[0][0]).toStrictEqual(['cell(0,0)', 'cell(0,1)', 'cell(0,2)', '…']);
                const bottomData = getBottomData(wrapper);
                expect(bottomData[0]).toStrictEqual(['bottomCell(0,0)', 'bottomCell(0,1)', 'bottomCell(0,2)', '…']);
            });
        });

        describe('dataConfig', () => {
            const getDataConfig = (wrapper: VueWrapper) => getTableUIProps(wrapper, 'dataConfig');

            it('sets dataConfig without special columns', () => {
                const wrapper = shallowMountDisplay({ props });
                const dataConfig = getDataConfig(wrapper);
                expect(dataConfig).toMatchObject({
                    columnConfigs: [
                        expect.objectContaining({ header: 'col1' }),
                        expect.objectContaining({ header: 'col2' }),
                        expect.objectContaining({ header: 'col3' })
                    ],
                    columnIds: props.header.displayedColumns,
                    rowConfig: { enableResizing: false }
                });

                expect(dataConfig.columnConfigs[0]).toStrictEqual({
                    filterConfig: { is: '', modelValue: '' },
                    formatter: expect.anything(),
                    hasSlotContent: false,
                    header: 'col1',
                    isSortable: true,
                    key: 2,
                    size: 100,
                    subHeader: undefined
                });
            });
            
            const { INDEX, ROW_ID, SKIPPED_REMAINING_COLUMNS_COLUMN: SKIPPED } = specialColumns;
            
            it('sets dataConfig with special columns', () => {
                props.settings.showRowIndices = true;
                props.settings.showRowKeys = true;
                props.header.indicateRemainingColumnsSkipped = true;
                const wrapper = shallowMountDisplay({ props });
                const dataConfig = getDataConfig(wrapper);
                expect(dataConfig).toMatchObject({
                    columnConfigs: [
                        expect.objectContaining({ header: INDEX.name }),
                        expect.objectContaining({ header: ROW_ID.name }),
                        expect.objectContaining({ header: 'col1' }),
                        expect.objectContaining({ header: 'col2' }),
                        expect.objectContaining({ header: 'col3' }),
                        expect.objectContaining({ header: SKIPPED.name })
                    ],
                    columnIds: [INDEX.id, ROW_ID.id, ...props.header.displayedColumns, SKIPPED.id]
                });

                expect(dataConfig.columnConfigs[0]).toStrictEqual({
                    filterConfig: { is: '', modelValue: '' },
                    formatter: expect.anything(),
                    hasSlotContent: false,
                    header: INDEX.name,
                    isSortable: false,
                    key: 0,
                    size: INDEX.defaultSize,
                    subHeader: undefined
                });

                expect(dataConfig.columnConfigs[1]).toStrictEqual({
                    filterConfig: { is: '', modelValue: '' },
                    formatter: expect.anything(),
                    hasSlotContent: false,
                    header: ROW_ID.name,
                    isSortable: true,
                    key: 1,
                    size: ROW_ID.defaultSize,
                    subHeader: undefined
                });

                expect(dataConfig.columnConfigs[5]).toStrictEqual({
                    filterConfig: { is: '', modelValue: '' },
                    formatter: expect.anything(),
                    hasSlotContent: false,
                    header: SKIPPED.name,
                    isSortable: false,
                    key: 5,
                    size: SKIPPED.defaultSize,
                    subHeader: undefined
                });
            });

            describe('columnConfig', () => {
                const getColumnConfigs = (wrapper: VueWrapper) => getDataConfig(wrapper).columnConfigs;

                it('sets minimal column config', () => {
                    const wrapper = shallowMountDisplay({ props });
                    const columnConfigs = getColumnConfigs(wrapper);
    
                    expect(columnConfigs[1]).toStrictEqual({
                        filterConfig: { is: '', modelValue: '' },
                        formatter: expect.anything(),
                        hasSlotContent: false,
                        header: 'col2',
                        isSortable: true,
                        key: 3,
                        size: 100,
                        subHeader: undefined
                    });
                });

                it('sets filter config', () => {
                    const customColumnFilter = { is: 'Dropdown', modelValue: 'foo' };
                    const columnFiltersMap = new Map();
                    columnFiltersMap.set('col2', customColumnFilter);
                    props.header.columnFiltersMap = columnFiltersMap;
                    const wrapper = shallowMountDisplay({ props });
                    const columnConfigs = getColumnConfigs(wrapper);
    
                    expect(columnConfigs[1]).toMatchObject({
                        filterConfig: customColumnFilter
                    });
                });

                it('sets size overrides', () => {
                    const customSize = 123;
                    props.header.columnSizeOverrides = { col2: customSize };
                    const wrapper = shallowMountDisplay({ props });
                    const columnConfigs = getColumnConfigs(wrapper);
    
                    expect(columnConfigs[1]).toMatchObject({
                        size: customSize
                    });
                });

                it('sets default size override', () => {
                    const customDefaultSize = 123;
                    props.header.defaultColumnSizeOverride = customDefaultSize;
                    const wrapper = shallowMountDisplay({ props });
                    const columnConfigs = getColumnConfigs(wrapper);
                    
                    expect(columnConfigs[1]).toMatchObject({
                        size: customDefaultSize
                    });
                });

                it('sets sub header', () => {
                    props.settings.showColumnDataType = true;
                    const wrapper = shallowMountDisplay({ props });
                    const columnConfigs = getColumnConfigs(wrapper);
                    
                    expect(columnConfigs[1]).toMatchObject({
                        subHeader: props.header.dataTypes[props.header.columnDataTypeIds[1]].name
                    });
                });

                describe('renderers', () => {
                    beforeEach(() => {
                        props.settings.enableRendererSelection = true;
                    });

                    it('sets renderers', () => {
                        const wrapper = shallowMountDisplay({ props });
                        const columnConfigs = getColumnConfigs(wrapper);
                        
                        expect(columnConfigs[1]).toMatchObject({
                            headerSubMenuItems: [
                                expect.objectContaining({ text: 'Data renderer' }),
                                expect.objectContaining({ id: 't2r1' }),
                                expect.objectContaining({ id: 't2r2' })
                            ]
                        });
                    });

                    it('sets selected renderer', () => {
                        props.header.colNameSelectedRendererId = {
                            col2: 't2r2'
                        };
                        const wrapper = shallowMountDisplay({ props });
                        const columnConfigs = getColumnConfigs(wrapper);
                        expect(columnConfigs[1]).toMatchObject({
                            headerSubMenuItems: [
                                expect.objectContaining({ text: 'Data renderer' }),
                                expect.objectContaining({ id: 't2r1', selected: false }),
                                expect.objectContaining({ id: 't2r2', selected: true })
                            ]
                        });
                    });

                    it('sets renderer attached to column', () => {
                        props.header.columnFormatterDescriptions = ['Col1-Formatter', 'Col2-Formatter', null];
                        const wrapper = shallowMountDisplay({ props });
                        const columnConfigs = getColumnConfigs(wrapper);
                        expect(columnConfigs[0]).toMatchObject({
                            headerSubMenuItems: [
                                expect.objectContaining({ text: 'Data renderer' }),
                                expect.objectContaining({ id: null, text: 'Col1-Formatter' }),
                                expect.objectContaining({ id: 't1r1' }),
                                expect.objectContaining({ id: 't1r2' }),
                                expect.objectContaining({ id: 't1r3' }),
                                expect.objectContaining({ id: 't1r4' })
                            ]
                        });
                        expect(columnConfigs[1]).toMatchObject({
                            headerSubMenuItems: [
                                expect.objectContaining({ text: 'Data renderer' }),
                                expect.objectContaining({ id: null, text: 'Col2-Formatter' }),
                                expect.objectContaining({ id: 't2r1' }),
                                expect.objectContaining({ id: 't2r2' })
                            ]
                        });
                        expect(columnConfigs[2]).toMatchObject({
                            headerSubMenuItems: [
                                expect.objectContaining({ text: 'Data renderer' }),
                                expect.objectContaining({ id: 't3r1' }),
                                expect.objectContaining({ id: 't3r2' }),
                                expect.objectContaining({ id: 't3r3' })
                            ]
                        });
                    });
                });
            });

            describe('rowConfig', () => {
                const getRowConfig = (wrapper: VueWrapper) => getDataConfig(wrapper).rowConfig;

                it('sets minimal row config', () => {
                    const wrapper = shallowMountDisplay({ props });
                    expect(getRowConfig(wrapper).rowHeight).toBeFalsy();
                    expect(getRowConfig(wrapper).compactMode).toBeFalsy();
                    expect(getRowConfig(wrapper).enableResizing).toBeFalsy();
                });
                
                it('sets rowHeight to 80 if images are present', () => {
                    props.header.columnContentTypes[1] = 'img_path';
                    const wrapper = shallowMountDisplay({ props });
                    expect(getRowConfig(wrapper).rowHeight).toBe(80);
                });

                it('sets compactMode', () => {
                    props.settings.compactMode = true;
                    const wrapper = shallowMountDisplay({ props });
                    expect(getRowConfig(wrapper).compactMode).toBeTruthy();
                });

                it('enables row resizing', () => {
                    props.enableRowResizing = true;
                    const wrapper = shallowMountDisplay({ props });
                    expect(getRowConfig(wrapper).enableResizing).toBeTruthy();
                });
            });
        });

        describe('tableConfig', () => {
            const getTableConfig = (wrapper: VueWrapper) => getTableUIProps(wrapper, 'tableConfig');

            it('sets basic tableConfig', () => {
                const wrapper = shallowMountDisplay({ props });
                const tableConfig = getTableConfig(wrapper);
                expect(tableConfig).toMatchObject({
                    enableColumnResizing: false,
                    enableVirtualScrolling: false,
                    pageConfig: {
                        showTableSize: false,
                        currentSize: 0,
                        pageSize: 0
                    },
                    showColumnFilters: false,
                    showSelection: false,
                    subMenuItems: []
                });
            });

            it('enables selection when subscribing to selection', () => {
                props.settings.subscribeToSelection = true;
                const wrapper = shallowMountDisplay({ props });
                const tableConfig = getTableConfig(wrapper);
                expect(tableConfig).toMatchObject({
                    showSelection: true
                });
            });

            it('enables selection when publishing selection', () => {
                props.settings.publishSelection = true;
                const wrapper = shallowMountDisplay({ props });
                const tableConfig = getTableConfig(wrapper);
                expect(tableConfig).toMatchObject({
                    showSelection: true
                });
            });

            it('enables column filters', () => {
                props.settings.enableColumnSearch = true;
                const wrapper = shallowMountDisplay({ props });
                const tableConfig = getTableConfig(wrapper);
                expect(tableConfig).toMatchObject({
                    showColumnFilters: true
                });
            });

            it('enables column resizing', () => {
                props.enableColumnResizing = true;
                const wrapper = shallowMountDisplay({ props });
                const tableConfig = getTableConfig(wrapper);
                expect(tableConfig).toMatchObject({
                    enableColumnResizing: true
                });
            });

            it('enables virtual scrolling', () => {
                props.enableVirtualScrolling = true;
                const wrapper = shallowMountDisplay({ props });
                const tableConfig = getTableConfig(wrapper);
                expect(tableConfig).toMatchObject({
                    enableVirtualScrolling: true
                });
            });

            it('sets pageConfig', () => {
                props.page = {
                    currentPage: 1,
                    currentRowCount: 2,
                    totalRowCount: 3,
                    columnCount: 4
                };
                const wrapper = shallowMountDisplay({ props });
                const tableConfig = getTableConfig(wrapper);
                expect(tableConfig).toMatchObject({
                    pageConfig: {
                        currentPage: 1,
                        currentSize: 2,
                        pageSize: 2,
                        tableSize: 3,
                        columnCount: 4,
                        showTableSize: false
                    }
                });
            });

            it('does not hide table sizes in case of pagination', () => {
                props.page = {
                    currentPage: 1,
                    currentRowCount: 2,
                    totalRowCount: 3,
                    columnCount: 4
                };
                props.settings.enablePagination = true;
                props.settings.showTableSize = false;
                const wrapper = shallowMountDisplay({ props });
                const tableConfig = getTableConfig(wrapper);
                expect(tableConfig).toMatchObject({
                    pageConfig: expect.objectContaining({
                        showTableSize: true
                    })
                });
            });

            it('sets sortConfig', () => {
                props.sorting = {
                    columnSortIndex: 1,
                    columnSortDirection: -1
                };
                props.settings.enableSortingByHeader = true;
                const wrapper = shallowMountDisplay({ props });
                const tableConfig = getTableConfig(wrapper);
                expect(tableConfig).toMatchObject({
                    sortConfig: {
                        sortColumn: 1,
                        sortDirection: -1
                    }
                });
            });

            it('sets searchConfig', () => {
                props.settings.enableGlobalSearch = true;
                props.globalSearchQuery = 'test';
                const wrapper = shallowMountDisplay({ props });
                expect(getTableConfig(wrapper)).toMatchObject({
                    searchConfig: { searchQuery: props.globalSearchQuery }
                });
            });
        });
    });
});
