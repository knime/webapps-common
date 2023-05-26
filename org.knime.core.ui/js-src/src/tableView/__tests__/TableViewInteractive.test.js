/* eslint-disable vitest/max-nested-describe */
/* eslint-disable max-nested-callbacks */
/* eslint-disable max-lines */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { JsonDataService, SelectionService } from '@knime/ui-extension-service';
import { shallowMountInteractive, changeViewSetting } from './utils/interactive';
import TableViewDisplay from '../TableViewDisplay.vue';
import flushPromises from 'flush-promises';
import { constants as tableUIConstants, TableUI } from '@knime/knime-ui-table';
import specialColumns from '../utils/specialColumns';

const { MIN_COLUMN_SIZE } = tableUIConstants;
const DEFAULT_COLUMN_SIZE = 100;

const GET_EMPTY_BOTTOM_DATA_FLAG = 11000;

describe('TableViewInteractive.vue', () => {
    const emptyColumnFilterValues = [[''], [], [], [''], ['']];
    const emptyRenderers = new Array(4).fill(null);

    let context,
        initialDataMock,
        dataRequestResult,
        getData,
        onInit,
        getTotalSelectedResult,
        getCurrentRowKeysResult;

    const rowCount = 4;
    const columnCount = 4;

    beforeEach(() => {
        initialDataMock = {
            table: {
                rows: [
                    ['1', 'row1', { metadata: 'row1col2' }, 'entry1col2', '<h1>1</h1>', 'view_x_y/datacell/hash1.png'],
                    ['2', 'row2', 'entry2col1', 'entry2col2', '<h1>2</h1>', 'view_x_y/datacell/hash2.png'],
                    ['3', 'row3', 'entry3col1', 'entry3col2', { metadata: 'row3col4' }, 'view_x_y/datacell/hash3.png'],
                    ['4', 'row4', 'entry4col1', 'entry4col2', '<h1>4</h1>', 'view_x_y/datacell/hash4.png']
                ],
                columnContentTypes: ['txt', 'txt', 'html', 'img_path'],
                columnDataTypeIds: ['datatype1', 'datatype1', 'datatype2', 'datatype3'],
                columnFormatterDescriptions: [null, 'Formatter(col2)', null, 'Formatter(col4)'],
                rowCount,
                columnCount,
                displayedColumns: ['col1', 'col2', 'col3', 'col4'],
                totalSelected: 0
            },
            dataTypes: {
                datatype1: {
                    name: 'col1And2TypeName',
                    renderers: [{ name: 'type1renderer1', id: 't1r1' }, { name: 'type1renderer2', id: 't1r2' },
                        { name: 'type1renderer3', id: 't1r3' }, { name: 'type1renderer4', id: 't1r4' }]
                },
                datatype2: {
                    name: 'col3TypeName',
                    renderers: [{ name: 'type2renderer1', id: 't2r1' }, { name: 'type2renderer2', id: 't2r2' }]
                },
                datatype3: {
                    name: 'col4TypeName',
                    renderers: [{ name: 'type3renderer1', id: 't3r1' }, { name: 'type3renderer2', id: 't3r2' },
                        { name: 'type3renderer3', id: 't2r3' }]
                }
            },
            columnDomainValues: {
                col1: ['entry1col1', 'entry2col1', 'entry3col1', 'entry4col1'],
                col2: ['entry1col2', 'entry2col2', 'entry3col2', 'entry4col2'],
                col3: null,
                col4: null
            },
            currentIndex: 0,
            currentPage: 1,
            currentSelection: [[false, false, false, false]],
            settings: {
                pageSize: 2,
                displayedColumns: { selected: ['col1', 'col2', 'col3', 'col4'] },
                enableRendererSelection: true,
                showRowKeys: false,
                showColumnDataType: false,
                showRowIndices: false,
                showTableSize: true,
                showTitle: true,
                enableColumnSearch: true,
                enableGlobalSearch: true,
                enablePagination: true,
                enableSortingByHeader: true,
                publishSelection: true,
                subscribeToSelection: true,
                compactMode: false,
                skipRemainingColumns: false
            }
        };

        // eslint-disable-next-line no-magic-numbers
        dataRequestResult = {
            ...initialDataMock.table,
            rows: initialDataMock.table.rows.slice(1, 3),
            columnCount: 2,
            columnContentTypes: ['txt', 'html']
        };
        getTotalSelectedResult = 2;
        getCurrentRowKeysResult = ['row1', 'row3'];
        getData = vi.fn();
        JsonDataService.mockImplementation(() => ({
            initialData: vi.fn().mockResolvedValue(initialDataMock),
            data: getData.mockImplementation((obj) => {
                switch (obj.method) {
                    case 'getTotalSelected':
                        return Promise.resolve(getTotalSelectedResult);
                    case 'getCurrentRowKeys':
                        return Promise.resolve(getCurrentRowKeysResult);
                    default:
                        if (obj.options[1] === GET_EMPTY_BOTTOM_DATA_FLAG) {
                            return { ...dataRequestResult, rows: [] };
                        }
                        return Promise.resolve(dataRequestResult);
                }
            }),
            addOnDataChangeCallback: vi.fn(),
            knimeService: {}
        }));

        onInit = vi.fn();

        SelectionService.mockImplementation(() => ({
            add: vi.fn(),
            remove: vi.fn(),
            replace: vi.fn(),
            addOnSelectionChangeCallback: vi.fn(),
            initialSelection: vi.fn().mockResolvedValue([]),
            onInit,
            publishOnSelectionChange: vi.fn(),
            onSettingsChange: vi.fn()
        }));

        context = {
            global: {
                provide: {
                    getKnimeService: () => ({ extensionConfig: { resourceInfo: { baseUrl: 'http://localhost:8080/base.url/' } } })
                },
                stubs: {
                    TableViewDisplay
                }
            }
        };
    });

    window.ResizeObserver = vi.fn(() => ({
        observe: vi.fn(),
        unobserve: vi.fn()
    }));

    window.IntersectionObserver = vi.fn(() => ({
        observe: () => null,
        unobserve: () => null,
        disconnect: () => null
    }));

    afterEach(() => {
        vi.clearAllMocks();
    });

    const findTableUI = (wrapper) => wrapper.findComponent(TableViewDisplay).findComponent(TableUI);

    describe('initialization and data fetching', () => {
        it('does not render the TableUI when no initialData is given', async () => {
            initialDataMock = null;
            const wrapper = await shallowMountInteractive(context);
            expect(findTableUI(wrapper).exists()).toBeFalsy();
        });

        it('fetches initialData', async () => {
            const wrapper = await shallowMountInteractive(context);
            const dataSpy = wrapper.vm.jsonDataService.initialData;
            expect(dataSpy).toHaveBeenCalled();
        });

        it('requests new data and updates table view', async () => {
            const wrapper = await shallowMountInteractive(context);
            await wrapper.vm.performRequest('getTable', [['col1', 'col2'], 0, rowCount]);
            expect(getData).toBeCalledWith({ method: 'getTable', options: [['col1', 'col2'], 0, rowCount] });
        });

        it('does not render the TableUI when no columns are to be displayed', async () => {
            initialDataMock.settings = {
                ...initialDataMock.settings,
                displayedColumns: { selected: [] },
                showRowIndices: false,
                showRowKeys: false
            };
            initialDataMock.table.displayedColumns = [];
            initialDataMock.table.columnCount = 0;
            const wrapper = await shallowMountInteractive(context);
            expect(findTableUI(wrapper).exists()).toBeFalsy();
            expect(wrapper.find('.no-columns').exists()).toBeTruthy();
        });

        it('renders the TableUI and passes the correct props', async () => {
            initialDataMock.settings.publishSelection = true;
            initialDataMock.settings.subscribeToSelection = true;

            const wrapper = await shallowMountInteractive(context);
            const tableUI = findTableUI(wrapper);
            expect(tableUI.exists()).toBe(true);
            const { data, currentSelection, totalSelected, dataConfig, tableConfig } = tableUI.vm.$props;
            expect(data).toEqual([initialDataMock.table.rows]);
            expect(currentSelection).toEqual(Array(1).fill(Array(rowCount).fill(false)));
            expect(totalSelected).toBe(0);
            expect(tableConfig).toMatchObject({
                subMenuItems: [],
                pageConfig: {
                    currentSize: 4,
                    tableSize: 4,
                    pageSize: 2,
                    currentPage: 1,
                    columnCount: 4,
                    showTableSize: true
                },
                sortConfig: {
                    sortColumn: null,
                    sortDirection: null
                },
                enableVirtualScrolling: true,
                showSelection: true,
                enableColumnResizing: true
            });
            const expectedColumnSize = DEFAULT_COLUMN_SIZE;
            const headline = { sectionHeadline: true, separator: true, text: 'Data renderer' };
            const normalRenderers = [
                { id: 't1r1', section: 'dataRendering', selected: false, text: 'type1renderer1' },
                { id: 't1r2', section: 'dataRendering', selected: false, text: 'type1renderer2' },
                { id: 't1r3', section: 'dataRendering', selected: false, text: 'type1renderer3' },
                { id: 't1r4', section: 'dataRendering', selected: false, text: 'type1renderer4' }
            ];
            expect(dataConfig).toMatchObject({
                columnConfigs: [
                    {
                        key: 2,
                        header: 'col1',
                        size: expectedColumnSize,
                        hasSlotContent: false,
                        headerSubMenuItems: [headline, ...normalRenderers]
                    },
                    {
                        key: 3,
                        header: 'col2',
                        size: expectedColumnSize,
                        hasSlotContent: false,
                        headerSubMenuItems: [headline, { text: 'Formatter(col2)', id: null }, ...normalRenderers]
                    },
                    { key: 4, header: 'col3', size: expectedColumnSize, hasSlotContent: true },
                    { key: 5, header: 'col4', size: expectedColumnSize, hasSlotContent: true }
                ],
                rowConfig: {
                    rowHeight: 80,
                    compactMode: false
                }
            });

            expect(findTableUI(wrapper).exists()).toBe(true);
            expect(tableConfig).toMatchObject({
                showSelection: true
            });
        });

        it('passes the correct dataConfig when showing rowkeys', async () => {
            initialDataMock.settings.showRowKeys = true;
            
            const wrapper = await shallowMountInteractive(context);
            const tableUI = findTableUI(wrapper);
            expect(tableUI.exists()).toBeTruthy();
            const expectedColumnSize = DEFAULT_COLUMN_SIZE;
            expect(tableUI.vm.dataConfig).toMatchObject({
                columnConfigs: [
                    { key: 1, header: 'RowID', size: MIN_COLUMN_SIZE },
                    { key: 2, header: 'col1', size: expectedColumnSize },
                    { key: 3, header: 'col2', size: expectedColumnSize },
                    { key: 4, header: 'col3', size: expectedColumnSize },
                    { key: 5, header: 'col4', size: expectedColumnSize }
                ]
            });
        });

        it('passes the correct dataConfig when showing content types', async () => {
            initialDataMock.settings.showColumnDataType = true;
            
            const wrapper = await shallowMountInteractive(context);

            const expectedColumnSize = DEFAULT_COLUMN_SIZE;
            const newColumnConfig = [
                {
                    key: 2,
                    header: 'col1',
                    subHeader: 'col1And2TypeName',
                    size: expectedColumnSize,
                    hasSlotContent: false
                },
                {
                    key: 3,
                    header: 'col2',
                    subHeader: 'col1And2TypeName',
                    size: expectedColumnSize,
                    hasSlotContent: false
                },
                { key: 4, header: 'col3', subHeader: 'col3TypeName', size: expectedColumnSize, hasSlotContent: true },
                { key: 5, header: 'col4', subHeader: 'col4TypeName', size: expectedColumnSize, hasSlotContent: true }
            ];

            const tableUI = findTableUI(wrapper);
            expect(tableUI.exists()).toBe(true);
            expect(tableUI.vm.dataConfig).toMatchObject({
                columnConfigs: newColumnConfig
            });
        });

        it('passes the correct tableConfig when publishSelection and subscribeToSelection are disabled', async () => {
            initialDataMock.settings.publishSelection = false;
            initialDataMock.settings.subscribeToSelection = false;

            const wrapper = await shallowMountInteractive(context);

            const tableUI = findTableUI(wrapper);
            expect(tableUI.exists()).toBe(true);
            expect(tableUI.vm.tableConfig).toMatchObject({
                showSelection: false
            });
        });

        it('ignores obsolete requests', async () => {
            const wrapper = await shallowMountInteractive(context);
            const updateInternalsSpy = vi.spyOn(wrapper.vm, 'updateInternals');
            const firstReqeust = wrapper.vm.updateData({});
            const secondRequest = wrapper.vm.updateData({});
            await firstReqeust;
            await secondRequest;
            expect(updateInternalsSpy).toHaveBeenCalledTimes(1);
        });

        describe('lazyloading and scrolling', () => {
            let wrapper, updateDataSpy;
    
            beforeEach(async () => {
                initialDataMock.settings.enablePagination = false;
                wrapper = await shallowMountInteractive(context);
                updateDataSpy = vi.spyOn(wrapper.vm, 'updateData');
            });
        
            it('sets correct currentScopeEndIndex when requesting more rows than possible', async () => {
                await wrapper.setData({
                    currentRowCount: 1000
                });

                wrapper.vm.updateData({ lazyLoad: {
                    loadFromIndex: 0,
                    newScopeStart: 0,
                    numRows: 1000
                } });
                await wrapper.vm.$nextTick();
                expect(wrapper.vm.currentScopeEndIndex).toBe(rowCount);
            });

            describe('initialization', () => {
                it('requests initial data for lazy loading for small rowCount', () => {
                    wrapper.vm.refreshTable();
                    expect(wrapper.vm.currentScopeStartIndex).toBe(0);
                    expect(wrapper.vm.currentScopeEndIndex).toBe(rowCount);
                    expect(updateDataSpy).toHaveBeenCalledWith(expect.objectContaining(
                        { lazyLoad: { loadFromIndex: 0, newScopeStart: 0, numRows: rowCount } }
                    ));
                });

                
                it('requests scopeSize rows as initial data for lazy loading', async () => {
                    await wrapper.setData({
                        currentRowCount: 300
                    });
                    wrapper.vm.refreshTable();
                    expect(updateDataSpy).toHaveBeenCalledWith(expect.objectContaining(
                        { lazyLoad: { loadFromIndex: 0, newScopeStart: 0, numRows: wrapper.vm.scopeSize } }
                    ));
                    await flushPromises();
                    expect(wrapper.vm.currentScopeStartIndex).toBe(0);
                    expect(wrapper.vm.currentScopeEndIndex).toBe(dataRequestResult.rowCount);
                });
            });

            it('refreshes the scroller when refreshing the table', () => {
                const tableUI = findTableUI(wrapper);
                tableUI.vm.refreshScroller = vi.fn();
                wrapper.vm.refreshTable();
                expect(tableUI.vm.refreshScroller).toHaveBeenCalled();
            });
            
            describe('on data update', () => {
                beforeEach(() => {
                    expect.extend({
                        arrayStartingWith(received, params) {
                            const message = `Expected ${received} to be an array starting with the entries ${params}`;
                            if (params.length > received.length) {
                                return { pass: false, message };
                            }
                            for (let i = 0; i < params.length; i++) {
                                expect(received[i]).toStrictEqual(params[i]);
                            }
                            return { pass: true };
                        }
                    });
                });
    
                it('appends buffer from previously fetched rows', async () => {
                    await wrapper.setData({
                        table: {
                            ...wrapper.vm.table,
                            rows: [['previousRow1'], ['previousRow2'], ['previousRow3'], ['previousRow4']]
                        }
                    });

                    wrapper.vm.updateData({ lazyLoad: {
                        direction: 1,
                        bufferStart: 0,
                        bufferEnd: 1,
                        loadFromIndex: 1,
                        newScopeStart: 0,
                        numRows: 2
                    } });
                    await flushPromises();
                    expect(wrapper.vm.table.rows.length).toBe(3);
                    expect(wrapper.vm.table.rows).toStrictEqual([
                        ['previousRow1'],
                        dataRequestResult.rows[0],
                        dataRequestResult.rows[1]
                    ]);
                });

                describe('bottomRowsMode', () => {
                    it('determines the number of top and bottom rows', async () => {
                        const maxNumRows = 5000;
                        await wrapper.setData({
                            maxNumRows
                        });
                        expect(wrapper.vm.numRowsTotal).toBe(dataRequestResult.rowCount);
                        expect(wrapper.vm.numRowsBottom).toBe(0);
                        expect(wrapper.vm.numRowsTop).toBe(dataRequestResult.rowCount);
                        await wrapper.setData({
                            currentRowCount: maxNumRows + 1
                        });
                        expect(wrapper.vm.numRowsTotal).toBe(wrapper.vm.maxNumRows);
                        expect(wrapper.vm.numRowsBottom).toBe(1000);
                        expect(wrapper.vm.numRowsTop).toBe(wrapper.vm.maxNumRows - 1000 - 1);
                    });

                    it('requests only top table if no bottom rows are required', async () => {
                        const maxNumRows = 5000;
                        await wrapper.setData({
                            maxNumRows,
                            currentRowCount: maxNumRows + 1
                        });
                        vi.clearAllMocks();
                        const loadFromIndex = 0;
                        const numRows = 200;
                        wrapper.vm.updateData({ lazyLoad: {
                            direction: 1,
                            bufferStart: 0,
                            bufferEnd: 0,
                            loadFromIndex,
                            newScopeStart: 0,
                            numRows
                        } });
                        expect(getData).toHaveBeenCalledTimes(1);
                        expect(getData).toHaveBeenCalledWith(expect.objectContaining({
                            options: expect.arrayStartingWith([expect.anything(), loadFromIndex, numRows])
                        }));
                    });

                    it('requests only bottom table if no top rows are required', async () => {
                        const maxNumRows = 5000;
                        await wrapper.setData({
                            maxNumRows,
                            currentRowCount: maxNumRows + 1
                        });
                        vi.clearAllMocks();
                        wrapper.vm.updateData({ lazyLoad: {
                            direction: 1,
                            bufferStart: 0,
                            bufferEnd: 0,
                            loadFromIndex: 4500,
                            newScopeStart: 0,
                            numRows: 200
                        } });
                        expect(getData).toHaveBeenCalledTimes(1);
                        const expectedLoadFromIndex = 4501;
                        const expectedNumRows = 200;
                        expect(getData).toHaveBeenCalledWith(expect.objectContaining({
                            options: expect.arrayStartingWith(
                                [expect.anything(), expectedLoadFromIndex, expectedNumRows]
                            )
                        }));
                    });

                    it('requests both top and bottom table if required', async () => {
                        const maxNumRows = 5000;
                        await wrapper.setData({
                            maxNumRows,
                            currentRowCount: maxNumRows + 1
                        });
                        vi.clearAllMocks();
                        wrapper.vm.updateData({ lazyLoad: {
                            direction: 1,
                            bufferStart: 0,
                            bufferEnd: 0,
                            loadFromIndex: 3900,
                            newScopeStart: 0,
                            numRows: 200
                        } });
                        expect(getData).toHaveBeenCalledTimes(2);
                        const expectedLoadFromIndexTop = 3900;
                        const expectedNumRowsTop = 99;
                        expect(getData).toHaveBeenNthCalledWith(1, expect.objectContaining({
                            options: expect.arrayStartingWith(
                                [expect.anything(), expectedLoadFromIndexTop, expectedNumRowsTop]
                            )
                        }));
                        const expectedLoadFromIndexBottom = 4001;
                        const expectedNumRowsBottom = 100;
                        expect(getData).toHaveBeenNthCalledWith(2, expect.objectContaining({
                            options: expect.arrayStartingWith(
                                [expect.anything(), expectedLoadFromIndexBottom, expectedNumRowsBottom]
                            )
                        }));
                    });
                    
                    it('requests top table if zero rows are to be fetched', async () => {
                        const maxNumRows = 5000;
                        await wrapper.setData({
                            maxNumRows,
                            currentRowCount: maxNumRows + 1
                        });
                        vi.clearAllMocks();
                        wrapper.vm.updateData({ lazyLoad: {
                            loadFromIndex: 0,
                            newScopeStart: 0,
                            numRows: 0
                        } });
                        expect(getData).toHaveBeenCalledTimes(1);
                        expect(getData).toHaveBeenNthCalledWith(1, expect.objectContaining({
                            options: expect.arrayStartingWith(
                                [expect.anything(), 0, 0]
                            )
                        }));
                    });

                    describe('appends buffer from previously fetched bottom rows', () => {
                        beforeEach(async () => {
                            const maxNumRows = 5000;
                            await wrapper.setData({
                                maxNumRows,
                                currentRowCount: maxNumRows + 1
                            });
                        });

                        it('scrolling down at the intersection of top and bottom', async () => {
                            await wrapper.setData({
                                table: {
                                    ...wrapper.vm.table,
                                    rows: [['previousRow1'], ['previousRow2'], ['previousRow3']]
                                },
                                bottomRows: [['previousBottomRow1'], ['previousBottomRow2']],
                                currentScopeStartIndex: 3996
                            });

                            await wrapper.vm.updateData({ lazyLoad: {
                                direction: 1,
                                bufferStart: 3997,
                                bufferEnd: 4003,
                                loadFromIndex: 4003,
                                newScopeStart: 3996,
                                numRows: 100
                            } });

                            expect(wrapper.vm.table.rows).toStrictEqual([
                                ['previousRow2'],
                                ['previousRow3']
                            ]);
                            expect(wrapper.vm.bottomRows).toStrictEqual([
                                ['previousBottomRow1'],
                                ['previousBottomRow2'],
                                ...dataRequestResult.rows
                            ]);
                        });

                        it('scrolling up at the intersection of top and bottom', async () => {
                            await wrapper.setData({
                                table: {
                                    ...wrapper.vm.table,
                                    rows: [['previousRow1'], ['previousRow2'], ['previousRow3']]
                                },
                                bottomRows: [['previousBottomRow1'], ['previousBottomRow2']],
                                currentScopeStartIndex: 3996
                            });

                            await wrapper.vm.updateData({ lazyLoad: {
                                direction: -1,
                                bufferStart: 3996,
                                bufferEnd: 4001,
                                loadFromIndex: 3994,
                                newScopeStart: 3994,
                                numRows: 2
                            } });

                            expect(wrapper.vm.table.rows).toStrictEqual([
                                ...dataRequestResult.rows,
                                ['previousRow1'],
                                ['previousRow2'],
                                ['previousRow3']
                            ]);
                            expect(wrapper.vm.bottomRows).toStrictEqual([
                                ['previousBottomRow1']
                            ]);
                        });

                        it('without previous top rows', async () => {
                            await wrapper.setData({
                                table: {
                                    ...wrapper.vm.table,
                                    rows: []
                                },
                                bottomRows: [['previousBottomRow1'], ['previousBottomRow2']],
                                currentScopeStartIndex: 4498
                            });

                            await wrapper.vm.updateData({ lazyLoad: {
                                direction: 1,
                                bufferStart: 4499,
                                bufferEnd: 4500,
                                loadFromIndex: 4500,
                                newScopeStart: 4499,
                                numRows: 200
                            } });

                            expect(wrapper.vm.table.rows).toStrictEqual([]);
                            expect(wrapper.vm.bottomRows).toStrictEqual([
                                ['previousBottomRow2'],
                                ...dataRequestResult.rows
                            ]);
                        });
                    });

                    describe('with pagination', () => {
                        beforeEach(async () => {
                            await wrapper.setData({
                                settings: {
                                    ...wrapper.vm.settings,
                                    enablePagination: true
                                },
                                currentRowCount: 11000,
                                maxNumRows: 5000
                            });
                        });

                        it('determines the number of top and bottom rows', async () => {
                            const smallPageSize = 4000;
                            await wrapper.setData({
                                settings: {
                                    ...wrapper.vm.settings,
                                    pageSize: smallPageSize
                                }
                            });
                            expect(wrapper.vm.numRowsTotal).toBe(smallPageSize);
                            expect(wrapper.vm.numRowsBottom).toBe(0);
                            expect(wrapper.vm.numRowsTop).toBe(smallPageSize);

                            const largePageSize = 6000;
                            await wrapper.setData({
                                settings: {
                                    ...wrapper.vm.settings,
                                    pageSize: largePageSize
                                }
                            });
                            expect(wrapper.vm.numRowsTotal).toBe(wrapper.vm.maxNumRows);
                            expect(wrapper.vm.numRowsBottom).toBe(1000);
                            expect(wrapper.vm.numRowsTop).toBe(wrapper.vm.maxNumRows - 1000 - 1);
                        });
    
                        it('requests only top table if no bottom rows are required', async () => {
                            const pageSize = 30;
                            await wrapper.setData({
                                settings: {
                                    ...wrapper.vm.settings,
                                    pageSize
                                }
                            });
                            vi.clearAllMocks();
                            wrapper.vm.updateData({});
                            expect(getData).toHaveBeenCalledTimes(1);
                            expect(getData).toHaveBeenCalledWith(expect.objectContaining({
                                options: expect.arrayStartingWith([expect.anything(), 0, pageSize])
                            }));
                        });
                        
                        /**
                         * TODO: Remove this together with GET_EMPTY_BOTTOM_DATA_FLAG in
                         * https://knime-com.atlassian.net/browse/UIEXT-527
                         */
                        it('requests bottom table again if it was empty', async () => {
                            const pageSize = 6000;
                            const currentIndex = pageSize;
                            await wrapper.setData({
                                settings: {
                                    ...wrapper.vm.settings,
                                    pageSize
                                },
                                currentPage: 2,
                                currentIndex
                            });

                            vi.clearAllMocks();
                            wrapper.vm.updateData({});
                            expect(getData).toHaveBeenCalledTimes(2);
                            expect(getData).toHaveBeenNthCalledWith(1, expect.objectContaining({
                                options: expect.arrayStartingWith(
                                    [expect.anything(), pageSize, wrapper.vm.numRowsTop]
                                )
                            }));
                            expect(getData).toHaveBeenNthCalledWith(2, expect.objectContaining({
                                options: expect.arrayStartingWith(
                                    [expect.anything(), GET_EMPTY_BOTTOM_DATA_FLAG]
                                )
                            }));

                            vi.clearAllMocks();
                            await flushPromises();

                            expect(getData).toHaveBeenCalledTimes(1);
                            expect(getData).toHaveBeenNthCalledWith(1, expect.objectContaining({
                                options: expect.arrayStartingWith(
                                    [expect.anything(), pageSize + wrapper.vm.numRowsTop]
                                )
                            }));
                        });

    
                        it('requests both top and bottom table if required', async () => {
                            const pageSize = 6000;
                            await wrapper.setData({
                                settings: {
                                    ...wrapper.vm.settings,
                                    pageSize
                                }
                            });
                            vi.clearAllMocks();

                            wrapper.vm.updateData({});

                            expect(getData).toHaveBeenCalledTimes(2);
                            const expectedLoadFromIndexTop = 0;
                            const expectedNumRowsTop = 3999;
                            expect(getData).toHaveBeenNthCalledWith(1, expect.objectContaining({
                                options: expect.arrayStartingWith(
                                    [expect.anything(), expectedLoadFromIndexTop, expectedNumRowsTop]
                                )
                            }));
                            const expectedLoadFromIndexBottom = 5000;
                            const expectedNumRowsBottom = 1000;
                            expect(getData).toHaveBeenNthCalledWith(2, expect.objectContaining({
                                options: expect.arrayStartingWith(
                                    [expect.anything(), expectedLoadFromIndexBottom, expectedNumRowsBottom]
                                )
                            }));
                        });

                        it('requests both top and bottom table if required on any page', async () => {
                            const pageSize = 5001;
                            const currentIndex = pageSize;
                            await wrapper.setData({
                                settings: {
                                    ...wrapper.vm.settings,
                                    pageSize
                                },
                                currentPage: 2,
                                currentIndex
                            });
                            vi.clearAllMocks();

                            wrapper.vm.updateData({});

                            expect(getData).toHaveBeenCalledTimes(2);
                            const expectedLoadFromIndexTop = currentIndex;
                            const expectedNumRowsTop = 3999;
                            expect(getData).toHaveBeenNthCalledWith(1, expect.objectContaining({
                                options: expect.arrayStartingWith(
                                    [expect.anything(), expectedLoadFromIndexTop, expectedNumRowsTop]
                                )
                            }));
                            const expectedLoadFromIndexBottom = currentIndex + pageSize - 1000;
                            const expectedNumRowsBottom = 1000;
                            expect(getData).toHaveBeenNthCalledWith(2, expect.objectContaining({
                                options: expect.arrayStartingWith(
                                    [expect.anything(), expectedLoadFromIndexBottom, expectedNumRowsBottom]
                                )
                            }));
                        });
                    });
                });
            });
    
            describe('on scroll event', () => {
                describe('downwards scroll', () => {
                    it('handles update on downwards scroll', async () => {
                        await wrapper.setData({
                            currentScopeStartIndex: 0,
                            currentScopeEndIndex: 2
                        });

                        wrapper.vm.onScroll({ direction: 1, startIndex: 1, endIndex: 2 });

                        expect(updateDataSpy).toHaveBeenCalledWith(expect.objectContaining(
                            { lazyLoad: {
                                direction: 1,
                                loadFromIndex: 2,
                                newScopeStart: 0,
                                bufferStart: 0,
                                bufferEnd: 2,
                                numRows: 2
                            } }
                        ));
                    });
                
    
                    it('does not update data if the distance to the end of the previous window exceeds the buffer size',
                        async () => {
                            await wrapper.setData({
                                currentScopeStartIndex: 0,
                                currentScopeEndIndex: 200,
                                currentRowCount: 1000
                            });

                            wrapper.vm.onScroll({ direction: 1, startIndex: 130, endIndex: 140 });

                            expect(updateDataSpy).toHaveBeenCalledTimes(0);
                        });
    
                    it('keeps a buffer of buffer size in the opposite direction and adjusts the number of loaded rows',
                        async () => {
                            const currentRowCount = 1000;
                            await wrapper.setData({
                                currentScopeStartIndex: 200,
                                currentScopeEndIndex: 400,
                                currentRowCount
                            });
                            dataRequestResult.rowCount = currentRowCount;

                            wrapper.vm.onScroll({ direction: 1, startIndex: 440, endIndex: 480 });

                            const lazyLoad = {
                                direction: 1,
                                loadFromIndex: 400,
                                newScopeStart: 390,
                                bufferStart: 390,
                                bufferEnd: 400,
                                numRows: 190
                            };
                            expect(updateDataSpy).toHaveBeenCalledWith(expect.objectContaining({ lazyLoad }));

                            await flushPromises();
                            
                            expect(wrapper.vm.currentScopeStartIndex).toBe(lazyLoad.newScopeStart);
                            expect(wrapper.vm.numRowsAbove).toBe(lazyLoad.newScopeStart);
                            const endIndex = 590;
                            expect(wrapper.vm.currentScopeEndIndex).toBe(endIndex);
                            expect(wrapper.vm.numRowsBelow).toBe(currentRowCount - endIndex);
                        });
    

                    it('adjusts the scopeSize if necessary',
                        async () => {
                            await wrapper.setData({
                                currentScopeStartIndex: 200,
                                currentScopeEndIndex: 400,
                                currentRowCount: 1000
                            });
                            const startIndex = 220;
                            const endIndex = 340;

                            wrapper.vm.onScroll({ direction: 1, startIndex, endIndex });

                            expect(wrapper.vm.scopeSize).toBe(endIndex - startIndex + 100);
                            expect(updateDataSpy).toHaveBeenCalledWith(expect.objectContaining(
                                { lazyLoad: {
                                    direction: 1,
                                    loadFromIndex: 400,
                                    newScopeStart: 200,
                                    bufferStart: 200,
                                    bufferEnd: 400,
                                    numRows: 20
                                } }
                            ));
                        });

                    it('does not update data on upwards scroll on the top of the table', async () => {
                        await wrapper.setData({
                            currentScopeStartIndex: 1,
                            currentScopeEndIndex: 4
                        });

                        wrapper.vm.onScroll({ direction: 1, startIndex: 1, endIndex: 2 });

                        expect(updateDataSpy).toHaveBeenCalledTimes(0);
                    });
                });
    
                describe('upwards scroll', () => {
                    it('handles update on upwards scroll', async () => {
                        await wrapper.setData({
                            currentScopeStartIndex: 1,
                            currentScopeEndIndex: 4
                        });

                        wrapper.vm.onScroll({ direction: -1, startIndex: 1, endIndex: 2 });

                        expect(updateDataSpy).toHaveBeenCalledWith(expect.objectContaining(
                            { lazyLoad: {
                                direction: -1,
                                loadFromIndex: 0,
                                newScopeStart: 0,
                                bufferStart: 1,
                                bufferEnd: 4,
                                numRows: 1
                            } }
                        ));
                    });
    
                    it('does not update data if the distance to the start of the previous window exceeds buffer size',
                        async () => {
                            await wrapper.setData({
                                currentScopeStartIndex: 0,
                                currentScopeEndIndex: 200,
                                rowCount: 1000
                            });

                            wrapper.vm.onScroll({ direction: -1, startIndex: 60, endIndex: 70 });

                            expect(updateDataSpy).toHaveBeenCalledTimes(0);
                        });
    
                    it('keeps a buffer of buffer size in the opposite direction and adjusts the number of loaded rows',
                        async () => {
                            const currentRowCount = 1000;
                            await wrapper.setData({
                                currentScopeStartIndex: 200,
                                currentScopeEndIndex: 400,
                                currentRowCount
                            });
                            dataRequestResult.rowCount = currentRowCount;

                            wrapper.vm.onScroll({ direction: -1, startIndex: 160, endIndex: 170 });

                            const lazyLoad = {
                                direction: -1,
                                loadFromIndex: 20,
                                newScopeStart: 20,
                                bufferStart: 200,
                                bufferEnd: 220,
                                numRows: 180
                            };
                            expect(updateDataSpy).toHaveBeenCalledWith(expect.objectContaining(
                                { lazyLoad }
                            ));

                            await flushPromises();

                            expect(wrapper.vm.currentScopeStartIndex).toBe(lazyLoad.newScopeStart);
                            expect(wrapper.vm.numRowsAbove).toBe(lazyLoad.newScopeStart);
                            const endIndex = 220;
                            expect(wrapper.vm.currentScopeEndIndex).toBe(endIndex);
                            expect(wrapper.vm.numRowsBelow).toBe(currentRowCount - endIndex);
                        });
        
                    it('adjusts the scopeSize if necessary',
                        async () => {
                            await wrapper.setData({
                                currentScopeStartIndex: 200,
                                currentScopeEndIndex: 400,
                                currentRowCount: 1000
                            });
                            const startIndex = 260;
                            const endIndex = 380;

                            wrapper.vm.onScroll({ direction: -1, startIndex, endIndex });

                            expect(wrapper.vm.scopeSize).toBe(endIndex - startIndex + 100);
                            expect(updateDataSpy).toHaveBeenCalledWith(expect.objectContaining(
                                { lazyLoad: {
                                    direction: -1,
                                    loadFromIndex: 180,
                                    newScopeStart: 180,
                                    bufferStart: 200,
                                    bufferEnd: 400,
                                    numRows: 20
                                } }
                            ));
                        });

                    it('does not update data on downwards scroll on the bottom of the table', async () => {
                        await wrapper.setData({
                            currentScopeStartIndex: 0,
                            currentScopeEndIndex: 2
                        });

                        wrapper.vm.onScroll({ direction: -1, startIndex: 1, endIndex: 2 });

                        expect(updateDataSpy).toHaveBeenCalledTimes(0);
                    });
                });
            });
        });
    });

    describe('settings change event', () => {
        let wrapper, updateDataSpy, refreshTableSpy;


        beforeEach(async () => {
            wrapper = await shallowMountInteractive(context);
            refreshTableSpy = vi.spyOn(wrapper.vm, 'refreshTable');
            updateDataSpy = vi.spyOn(wrapper.vm, 'updateData');
        });

        it.each([
            ['displayedColumns', { selected: ['col3'] }],
            ['pageSize', 3],
            ['enablePagination', false]
        ])('view setting %p change causes table to be refreshed',
            (settingsKey, newValue) => {
                changeViewSetting(wrapper, settingsKey, newValue);
                expect(refreshTableSpy).toHaveBeenCalled();
                expect(wrapper.vm.$data.settings[settingsKey]).toStrictEqual(newValue);
            });

        it.each([
            ['showRowKeys', true],
            ['showColumnDataType', true],
            ['showRowIndices', true],
            ['enableSortingByHeader', false],
            ['enableColumnSearch', false],
            ['enableGlobalSearch', false],
            ['showTitle', false],
            ['compactMode', true],
            ['showTableSize', true]
        ])('view setting %p change causes data NOT to be requested',
            (settingsKey, newValue) => {
                changeViewSetting(wrapper, settingsKey, newValue);
                expect(updateDataSpy).not.toHaveBeenCalled();
                expect(wrapper.vm.$data.settings[settingsKey]).toBe(newValue);
            });

        it('view setting "compactMode" change causes table to be refreshed if useLazyLoading is true', async () => {
            // TODO: Remove this with https://knime-com.atlassian.net/browse/UIEXT-527
            await wrapper.setData({
                settings: {
                    ...wrapper.vm.settings,
                    enablePagination: false
                }
            });

            changeViewSetting(wrapper, 'compactMode', true);

            expect(refreshTableSpy).toHaveBeenCalled();
        });

        it('hides title', async () => {
            expect(wrapper.find('.table-title').exists()).toBeTruthy();

            changeViewSetting(wrapper, 'showTitle', false);
            await wrapper.vm.$nextTick();

            expect(wrapper.find('.table-title').exists()).toBeFalsy();
        });

        it('updates displayed columns on displayed columns change', async () => {
            const newColumns = [
                ...initialDataMock.settings.displayedColumns.selected,
                'missing'
            ];
            changeViewSetting(wrapper, 'displayedColumns', { selected: newColumns });
            await flushPromises();

            expect(getData).toHaveBeenCalledWith({
                method: 'getTable',
                options: [newColumns, 0, 2, [null, null, null, null, null], true, true, false]
            });
            expect(wrapper.vm.displayedColumns).toStrictEqual(initialDataMock.table.displayedColumns);
            expect(findTableUI(wrapper).vm.tableConfig.pageConfig.columnCount).toBe(dataRequestResult.columnCount);
            expect(wrapper.vm.columnContentTypes).toStrictEqual(dataRequestResult.columnContentTypes);
        });

        it('adds additional column indicating that columns were skipped', async () => {
            initialDataMock.settings.skipRemainingColumns = true;
            const newColumns = ['col2', 'col3'];
            dataRequestResult.columnCount = 3;
            dataRequestResult.displayedColumns = newColumns;
            const wrapper = await shallowMountInteractive(context);

            changeViewSetting(wrapper, 'displayedColumns', { selected: newColumns });
            await flushPromises();

            expect(getData).toHaveBeenCalledWith({
                method: 'getTable',
                options: [newColumns, 0, 2, [null, null], true, true, true]
            });
            const expectedColumnSize = DEFAULT_COLUMN_SIZE;
            const newColumnConfig = [
                { key: 2, header: 'col2', size: expectedColumnSize, hasSlotContent: false },
                { key: 3, header: 'col3', size: expectedColumnSize, hasSlotContent: true },
                {
                    filterConfig: {
                        is: '',
                        modelValue: ''
                    },
                    hasSlotContent: false,
                    header: '(skipped remaining columns)',
                    isSortable: false,
                    key: 4,
                    size: specialColumns.SKIPPED_REMAINING_COLUMNS_COLUMN.defaultSize,
                    // eslint-disable-next-line no-undefined
                    subHeader: undefined
                }
            ];
            const tableUI = findTableUI(wrapper);
            expect(tableUI.vm.dataConfig).toMatchObject({
                columnConfigs: newColumnConfig
            });
            expect(tableUI.vm.tableConfig.pageConfig.columnCount).toBe(dataRequestResult.columnCount);
            expect(tableUI.vm.data[0][0]).toStrictEqual(
                ['2', 'row2', 'entry2col1', 'entry2col2', '<h1>2</h1>', 'view_x_y/datacell/hash2.png', '…']
            );
        });

        it('updates columnDataTypeIds on displayes columns update', async () => {
            initialDataMock.settings.showColumnDataType = true;
            const wrapper = await shallowMountInteractive(context);

            const expectedColumnSize = DEFAULT_COLUMN_SIZE;
            const newColumns = ['col2', 'col3'];
            dataRequestResult.columnDataTypeIds = ['datatype1', 'datatype2'];
            dataRequestResult.displayedColumns = newColumns;

            changeViewSetting(wrapper, 'displayedColumns', { selected: newColumns });
            await flushPromises();

            expect(getData).toHaveBeenCalledWith({
                method: 'getTable',
                options: [newColumns, 0, 2, [null, null], true, true, false]
            });
            const newColumnConfig = [
                {
                    key: 2,
                    header: 'col2',
                    subHeader: 'col1And2TypeName',
                    size: expectedColumnSize,
                    hasSlotContent: false
                },
                { key: 3, header: 'col3', subHeader: 'col3TypeName', size: expectedColumnSize, hasSlotContent: true }
            ];
            expect(findTableUI(wrapper).vm.dataConfig).toMatchObject({
                columnConfigs: newColumnConfig
            });
        });

        describe('sort parameter update', () => {
            let sortColumn;

            beforeEach(() => {
                const tableUI = findTableUI(wrapper);
                sortColumn = (index) => {
                    tableUI.vm.$emit('columnSort', index);
                };
            });


            it('updates the sort parameters when a sorting is active and columns are changed',
                () => {
                    sortColumn(2);
                    const updateSortingParamsSpy = vi.spyOn(wrapper.vm, 'updateSortingParams');

                    changeViewSetting(wrapper, 'displayedColumns', { selected: ['col2', 'col3', 'col4'] });

                    expect(updateSortingParamsSpy).toHaveBeenCalled();
                    expect(wrapper.vm.columnSortIndex).toBe(1);
                });
        
            it('does not update the sort parameters when no sorting is active', () => {
                const updateSortingParamsSpy = vi.spyOn(wrapper.vm, 'updateSortingParams');
                changeViewSetting(wrapper, 'displayedColumns', { selected: ['col2', 'col3', 'col4'] });
                expect(updateSortingParamsSpy).not.toHaveBeenCalled();
            });

            it('resets the sort parameters when the sorted column gets removed', () => {
                const resetSortingSpy = vi.spyOn(wrapper.vm, 'resetSorting');
                const updateDataSpy = vi.spyOn(wrapper.vm, 'updateData');
                sortColumn(2);
                changeViewSetting(wrapper, 'displayedColumns', { selected: ['col1', 'col2', 'col4'] });
                expect(resetSortingSpy).toHaveBeenCalled();
                expect(updateDataSpy).toHaveBeenCalledWith(expect.objectContaining({ updateDisplayedColumns: true }));
            });

            it('resets the sort parameters when the sorted row key column gets removed', async () => {
                await wrapper.setData({
                    settings: {
                        ...wrapper.vm.settings,
                        showRowKeys: true
                    }
                });
                const resetSortingSpy = vi.spyOn(wrapper.vm, 'resetSorting');

                sortColumn(0);
                changeViewSetting(wrapper, 'showRowKeys', false);

                expect(resetSortingSpy).toHaveBeenCalled();
                expect(wrapper.vm.columnSortColumnName).toBeNull();
                expect(wrapper.vm.columnSortIndex).toBeNull();
                expect(wrapper.vm.columnSortDirection).toBeNull();
                expect(wrapper.vm.currentPage).toBe(1);
                expect(wrapper.vm.currentIndex).toBe(0);
            });

            it.each([
                ['showRowKeys', 2, 3],
                ['showRowIndices', 2, 3]
            ])('enabling viewSetting %p when sorting is active leads to incrementation of sortColIndex from %p to %p',
                (settingsKey, colSortIndex, newColSortIndex) => {
                    sortColumn(colSortIndex);
                    const updateSortingParamsSpy = vi.spyOn(wrapper.vm, 'updateSortingParams');

                    changeViewSetting(wrapper, settingsKey, true);

                    expect(wrapper.vm.columnSortIndex).toEqual(newColSortIndex);
                    expect(updateSortingParamsSpy).toHaveBeenCalled();
                });

            it.each([
                ['showRowKeys', 4, 3],
                ['showRowIndices', 4, 3]
            ])('disabling viewSetting %p when sorting is active leads to decrementation of sortColIndex from %p to %p',
                async (settingsKey, colSortIndex, newColSortIndex) => {
                    await wrapper.setData({
                        settings: {
                            ...wrapper.vm.settings,
                            [settingsKey]: true
                        }
                    });
                    sortColumn(colSortIndex);
                    const updateSortingParamsSpy = vi.spyOn(wrapper.vm, 'updateSortingParams');

                    changeViewSetting(wrapper, settingsKey, false);

                    expect(wrapper.vm.columnSortIndex).toEqual(newColSortIndex);
                    expect(updateSortingParamsSpy).toHaveBeenCalled();
                });
        });
    });

    describe('sorting and pagination', () => {
        let wrapper, sortColumn;

        beforeEach(async () => {
            wrapper = await shallowMountInteractive(context);
            const tableUI = findTableUI(wrapper);
            sortColumn = (colIndex) => {
                tableUI.vm.$emit('columnSort', colIndex);
            };
        });

        it('sets the correct parameters on next page and requests new data with updated parameters',
            () => {
                wrapper.vm.onPageChange(1);
                expect(getData).toBeCalledWith({
                    method: 'getTable',
                    options: [initialDataMock.table.displayedColumns, 2, 2, emptyRenderers, false, true, false]
                });
                expect(wrapper.vm.currentPage).toBe(2);
            });

        it('sets the correct parameters on prev page and requests new data with updated parameters', () => {
            wrapper.vm.onPageChange(1);
            wrapper.vm.onPageChange(-1);

            expect(getData).toHaveBeenNthCalledWith(2, {
                method: 'getTable',
                options: [initialDataMock.table.displayedColumns, 0, 2, emptyRenderers, false, true, false]
            });
            expect(wrapper.vm.currentPage).toBe(1);
        });

        it('disables sorting', async () => {
            initialDataMock.settings.enableSortingByHeader = false;
            const wrapper = await shallowMountInteractive(context);

            const columnHeaders = wrapper.findAll('.column-header');
            columnHeaders.forEach(colHeaderWrapper => {
                expect(colHeaderWrapper.element.classList.contains('sortable')).toBe(false);
            });
            const { tableConfig } = findTableUI(wrapper).vm.$props;
            expect(tableConfig).toMatchObject({
                subMenuItems: [],
                pageConfig: {
                    currentSize: rowCount,
                    tableSize: rowCount,
                    pageSize: 2,
                    currentPage: 1
                }
            });
        });

        it('sorts descending on any new column and requests new data with updated parameters', () => {
            sortColumn(0);
            expect(getData).toBeCalledWith({
                method: 'getFilteredAndSortedTable',
                options: [initialDataMock.table.displayedColumns,
                    0, 2, 'col1', false, '', emptyColumnFilterValues, false, emptyRenderers, false, false, true, false]
            });
            expect(wrapper.vm.currentPage).toBe(1);
        });

        it('sorts in the different direction when sorting the same column again', () => {
            sortColumn(0);

            sortColumn(0);
            expect(getData).toBeCalledWith({
                method: 'getFilteredAndSortedTable',
                options: [initialDataMock.table.displayedColumns,
                    0, 2, 'col1', true, '', emptyColumnFilterValues, false, emptyRenderers, false, false, true, false]
            });
            expect(wrapper.vm.currentPage).toBe(1);

            sortColumn(0);
            expect(getData).toBeCalledWith({
                method: 'getFilteredAndSortedTable',
                options: [initialDataMock.table.displayedColumns,
                    0, 2, 'col1', false, '', emptyColumnFilterValues, false, emptyRenderers, false, false, true, false]
            });
        });

        it('requests new sorted data with updated parameters on changing page after sorting', () => {
            sortColumn(0);
            wrapper.vm.onPageChange(1);

            expect(getData).toHaveBeenNthCalledWith(2, {
                method: 'getFilteredAndSortedTable',
                options: [initialDataMock.table.displayedColumns,
                    2, 2, 'col1', false, '', emptyColumnFilterValues, false, emptyRenderers, false, false, true, false]
            });
            expect(wrapper.vm.currentPage).toBe(2);
        });

        it('passes the correct parameters when sorting by rowKeys', async () => {
            initialDataMock.settings.showRowKeys = true;
            const wrapper = await shallowMountInteractive(context);
            const tableUI = findTableUI(wrapper);
            tableUI.vm.$emit('columnSort', 0);

            expect(getData).toHaveBeenCalledWith({
                method: 'getFilteredAndSortedTable',
                options: [initialDataMock.table.displayedColumns, 0, 2, '-1', false, '', emptyColumnFilterValues,
                    true, emptyRenderers, false, false, true, false]
            });
        });
    });

    describe('selection', () => {
        it('resets the selection on clearSelection', async () => {
            const wrapper = await shallowMountInteractive(context);

            await wrapper.setData({
                currentSelection: [false, false, true, false]
            });

            expect(wrapper.vm.currentSelection).toEqual([false, false, true, false]);

            wrapper.vm.clearSelection();

            expect(wrapper.vm.currentSelection).toEqual([false, false, false, false]);
            expect(wrapper.vm.currentSelectedRowKeys).toEqual(new Set());
            expect(wrapper.vm.totalSelected).toBe(0);
        });

        it('calls selectionService.onInit with correct parameters when mounting the view', async () => {
            await shallowMountInteractive(context);

            const { publishSelection, subscribeToSelection } = initialDataMock.settings;
            expect(onInit).toHaveBeenCalledWith(expect.any(Function), publishSelection,
                subscribeToSelection);
        });

        describe('emit selection', () => {
            let wrapper, publishOnSelectionChangeSpy, tableViewDisplay;

            beforeEach(async () => {
                initialDataMock.settings.publishSelection = true;
                wrapper = await shallowMountInteractive(context);
                publishOnSelectionChangeSpy = vi.spyOn(wrapper.vm.selectionService, 'publishOnSelectionChange');
                tableViewDisplay = findTableUI(wrapper);
            });

            it('calls the selection service and updates local selection on select single row',
                async () => {
                    // select row
                    await tableViewDisplay.vm.$emit('rowSelect', true, 1, 0, true);

                    expect(publishOnSelectionChangeSpy).toHaveBeenCalledWith('add', ['row2']);
                    expect(wrapper.vm.currentSelection).toEqual([false, true, false, false]);
                    expect(wrapper.vm.currentBottomSelection).toEqual([]);
                    expect(wrapper.vm.totalSelected).toBe(1);

                    // unselect row
                    await tableViewDisplay.vm.$emit('rowSelect', false, 1, 0, true);
                    expect(publishOnSelectionChangeSpy).toHaveBeenCalledWith('remove', ['row2']);
                    expect(wrapper.vm.currentSelection).toEqual([false, false, false, false]);
                    expect(wrapper.vm.currentBottomSelection).toEqual([]);
                    expect(wrapper.vm.totalSelected).toBe(0);
                });


            it('calls the selection service and updates local selection on select bottom row',
                async () => {
                    await wrapper.setData({
                        bottomRows: [['7', 'bottomRow1'], ['8', 'bottomRow2']]
                    });

                    // select row
                    await tableViewDisplay.vm.$emit('rowSelect', true, 1, 0, false);

                    expect(publishOnSelectionChangeSpy).toHaveBeenCalledWith('add', ['bottomRow2']);
                    expect(wrapper.vm.currentSelection).toEqual([false, false, false, false]);
                    expect(wrapper.vm.currentBottomSelection).toEqual([false, true]);
                    expect(wrapper.vm.totalSelected).toBe(1);

                    // unselect row
                    await tableViewDisplay.vm.$emit('rowSelect', false, 1, 0, false);
                    expect(publishOnSelectionChangeSpy).toHaveBeenCalledWith('remove', ['bottomRow2']);
                    expect(wrapper.vm.currentSelection).toEqual([false, false, false, false]);
                    expect(wrapper.vm.currentBottomSelection).toEqual([false, false]);
                    expect(wrapper.vm.totalSelected).toBe(0);
                });

            describe('onSelectAll', () => {
                it('calls the selection service and updates local selection on selectAll rows',
                    async () => {
                        const currentRowCount = 2;
                        await wrapper.setData({
                            currentRowCount
                        });

                        await tableViewDisplay.vm.$emit('selectAll', true);
                        await flushPromises();

                        expect(publishOnSelectionChangeSpy).toHaveBeenCalledWith(
                            'add', getCurrentRowKeysResult
                        );
                        expect(wrapper.vm.currentSelection).toEqual([true, false, true, false]);
                        expect(wrapper.vm.totalSelected).toEqual(currentRowCount);
    
                        await tableViewDisplay.vm.$emit('selectAll', false);
                        await flushPromises();

                        expect(publishOnSelectionChangeSpy).toHaveBeenNthCalledWith(2,
                            'remove', getCurrentRowKeysResult);
                        expect(wrapper.vm.currentSelection).toEqual([false, false, false, false]);
                        expect(wrapper.vm.totalSelected).toBe(0);
                    });

                it('calls the selection service and updates local selection on selectAll rows with no filters',
                    async () => {
                        const currentRowCount = dataRequestResult.rowCount;
                        getCurrentRowKeysResult = ['row1', 'row2', 'row3', 'row4'];
                        await wrapper.setData({
                            currentRowCount,
                            totalRowCount: currentRowCount
                        });
    
                        await tableViewDisplay.vm.$emit('selectAll', true);
                        await flushPromises();

                        expect(publishOnSelectionChangeSpy).toHaveBeenCalledWith(
                            'add', getCurrentRowKeysResult
                        );
                        expect(wrapper.vm.currentSelection).toEqual([true, true, true, true]);
                        expect(wrapper.vm.totalSelected).toEqual(currentRowCount);

    
                        await tableViewDisplay.vm.$emit('selectAll', false);
                        await flushPromises();

                        expect(publishOnSelectionChangeSpy).toHaveBeenNthCalledWith(2,
                            'replace', []);
                        expect(wrapper.vm.currentSelection).toEqual([false, false, false, false]);
                        expect(wrapper.vm.totalSelected).toBe(0);
                    });
            });
        });

        describe('receive selection', () => {
            let wrapper, rowKey1, rowKey2;

            beforeEach(async () => {
                wrapper = await shallowMountInteractive(context);
                rowKey1 = initialDataMock.table.rows[0][1];
                rowKey2 = initialDataMock.table.rows[1][1];
            });

            it('updates the local selection on addSelection', async () => {
                wrapper.vm.onSelectionChange({ mode: 'ADD', selection: [rowKey2] });
                await flushPromises();

                expect(wrapper.vm.currentSelection).toEqual([false, true, false, false]);
                expect(wrapper.vm.totalSelected).toBe(1);
                expect(wrapper.vm.currentSelectedRowKeys).toEqual(new Set([rowKey2]));
            });

            it('updates the local selection on removeSelection', async () => {
                wrapper.vm.onSelectionChange({ mode: 'ADD', selection: [rowKey1, rowKey2] });
                wrapper.vm.onSelectionChange({ mode: 'REMOVE', selection: [rowKey2] });
                await flushPromises();

                expect(wrapper.vm.currentSelection).toEqual([true, false, false, false]);
                expect(wrapper.vm.currentSelectedRowKeys).toEqual(new Set([rowKey1]));
                expect(wrapper.vm.totalSelected).toBe(1);
            });

            it('updates the local selection on replace with subscribe to selection', async () => {
                wrapper.vm.onSelectionChange({ mode: 'ADD', selection: [rowKey1] });
                wrapper.vm.onSelectionChange({ mode: 'REPLACE', selection: [rowKey2] });
                await flushPromises();

                expect(wrapper.vm.currentSelection).toEqual([false, true, false, false]);
                expect(wrapper.vm.currentSelectedRowKeys).toEqual(new Set([rowKey2]));
                expect(wrapper.vm.totalSelected).toBe(1);
            });

            it('calls selectionService.onSettingsChange with the correct parameters on settings change', () => {
                const selectionServiceOnSettingsChangeSpy = vi.spyOn(wrapper.vm.selectionService, 'onSettingsChange');
                const publishSelection = initialDataMock.settings.publishSelection;
                const subscribeToSelection = false;

                changeViewSetting(wrapper, 'subscribeToSelection', subscribeToSelection);

                expect(selectionServiceOnSettingsChangeSpy).toHaveBeenCalledWith(expect.any(Function),
                    expect.any(Function), publishSelection, subscribeToSelection);
            });
        });
    });

    describe('global and column search', () => {
        let wrapper, setColumnFilter, clearColumnFilter;

        beforeEach(async () => {
            wrapper = await shallowMountInteractive(context);
            const tableUI = findTableUI(wrapper);
            setColumnFilter = (colIndex, filterVal) => {
                tableUI.vm.$emit('columnFilter', colIndex, filterVal);
            };
            clearColumnFilter = () => {
                tableUI.vm.$emit('clearFilter');
            };
        });

        it('requests new data on column search', async () => {
            const columnSearchTerm = 'entry1col1';

            await setColumnFilter(0, columnSearchTerm);
            const columnFilterValues = [[''], [columnSearchTerm], [], [''], ['']]; // row keys + 4 columns
            expect(getData).toBeCalledWith({
                method: 'getFilteredAndSortedTable',
                options: [initialDataMock.table.displayedColumns,
                    0,
                    2,
                    null,
                    false,
                    '',
                    columnFilterValues,
                    initialDataMock.settings.showRowKeys,
                    emptyRenderers,
                    false,
                    true,
                    true,
                    false]
            });
        });

        it('requests new data on global search', () => {
            const globalSearchTerm = 'entry1';

            findTableUI(wrapper).vm.$emit('search', globalSearchTerm);

            expect(getData).toBeCalledWith({
                method: 'getFilteredAndSortedTable',
                options: [initialDataMock.table.displayedColumns,
                    0,
                    2,
                    null,
                    false,
                    globalSearchTerm,
                    emptyColumnFilterValues,
                    initialDataMock.settings.showRowKeys,
                    emptyRenderers,
                    false,
                    true,
                    true,
                    false]
            });
        });

        it('clears column filters', async () => {
            const columnSearchTerm = 'entry1col1';

            await setColumnFilter(0, columnSearchTerm);
            await clearColumnFilter();

            expect(getData).toHaveBeenNthCalledWith(2, {
                method: 'getTable',
                options: [initialDataMock.table.displayedColumns, 0, 2, emptyRenderers, false, true, false]
            });
        });

        it('clears column filters on displayed columns change', async () => {
            const columnSearchTerm = 'entry1col1';
            await setColumnFilter(0, columnSearchTerm);
            const newColumns = [
                ...initialDataMock.settings.displayedColumns.selected,
                'missing'
            ];
            changeViewSetting(wrapper, 'displayedColumns', { selected: newColumns });
            await flushPromises();
            expect(wrapper.vm.columnFiltersMap).toStrictEqual(
                wrapper.vm.getDefaultFilterConfigsMap(initialDataMock.table.displayedColumns)
            );
        });
    });

    describe('column renderer selection', () => {
        let wrapper, setHeaderSubMenuItem;

        beforeEach(async () => {
            wrapper = await shallowMountInteractive(context);
            const tableUI = findTableUI(wrapper);
            setHeaderSubMenuItem = (item, colIndex) => {
                tableUI.vm.$emit('header-sub-menu-item-selection', item, colIndex);
            };
        });

        it('requests new data on renderer change', () => {
            const renderer = {
                text: 'renderer1',
                id: 'renderer1',
                section: 'dataRendering'
            };
            expect(Object.keys(wrapper.vm.colNameSelectedRendererId).length).toBe(0);

            setHeaderSubMenuItem(renderer, 2);

            expect(wrapper.vm.colNameSelectedRendererId).toEqual({ col3: 'renderer1' });
            expect(getData).toBeCalledWith({
                method: 'getTable',
                options: [initialDataMock.table.displayedColumns,
                    0,
                    2,
                    [null, null, renderer.id, null],
                    false, true, false]
            });
        });

        it('sets the selected renderer in colNameSelectedRendererId on headerSubMenuSelectionChange', () => {
            setHeaderSubMenuItem(
                { id: 't1r4', section: 'dataRendering', selected: false, text: 'type1renderer4' },
                0
            );
            expect(wrapper.vm.colNameSelectedRendererId).toEqual({ col1: 't1r4' });

            setHeaderSubMenuItem(
                { id: 't3r2', section: 'dataRendering', selected: false, text: 'type3renderer2' },
                3
            );
            expect(wrapper.vm.colNameSelectedRendererId).toEqual({ col1: 't1r4', col4: 't3r2' });
        });

        it('does not update the colNameSelectedRendererId when the section is not dataRendering', () => {
            setHeaderSubMenuItem(
                { id: 'loremId', section: 'dataSection', selected: false, text: 'lorem' },
                2
            );
            expect(Object.keys(wrapper.vm.colNameSelectedRendererId).length).toBe(0);
        });

        it('uses settings.displayedColumns instead of displayedColumns to adjust renderers on displayedColumns change',
            () => {
                setHeaderSubMenuItem(
                    { id: 't2r1', section: 'dataRendering', selected: false, text: 'type2renderer1' },
                    2
                );
                const newColumns = ['col3', 'col4'];

                changeViewSetting(wrapper, 'displayedColumns', { selected: newColumns });

                expect(getData).toHaveBeenNthCalledWith(2, {
                    method: 'getTable',
                    options: [newColumns, 0, 2, ['t2r1', null], true, true, false]
                });
            });
    });

    describe('column resizing', () => {
        let wrapper, tableUI, setColumnWidth, setAllColumnsWidth;

        const setColumnWidthSettings = async (
            wrapper,
            { availableWidth }
        ) => {
            await wrapper.setData({
                currentAvailableWidth: availableWidth,
                settings: {
                    ...wrapper.vm.settings,
                    showRowIndices: true,
                    showRowKeys: true
                }
            });
            await flushPromises(); // needed for the computation of wrapper.vm.currentAvailableWidth
        };

        const availableWidth = 1002;

        beforeEach(async () => {
            wrapper = await shallowMountInteractive(context);
            tableUI = wrapper.findComponent(TableUI);
            setColumnWidth = async (colIndex, newSize) => {
                await tableUI.vm.$emit('column-resize', colIndex, newSize);
            };
            setAllColumnsWidth = async (newSize) => {
                await tableUI.vm.$emit('all-columns-resize', newSize);
            };
        });

        // TODO UIEXT-525 lets rethink these tests
        it.each([
            [{ availableWidth: 0 }, DEFAULT_COLUMN_SIZE],
            [{ availableWidth }, 225.5]
        ])('divides available width into equal sizes',
            async (settings, columnWidth) => {
                await setColumnWidthSettings(wrapper, settings);
                expect(wrapper.findComponent(TableViewDisplay).vm.columnSizes).toStrictEqual([
                    MIN_COLUMN_SIZE,
                    MIN_COLUMN_SIZE,
                    columnWidth,
                    columnWidth,
                    columnWidth,
                    columnWidth
                ]);
            });

        it('provides expected column sizes for empty tables', async () => {
            initialDataMock.settings = {
                ...initialDataMock.settings,
                showRowIndices: false,
                showRowKeys: false
            };
            initialDataMock.table.displayedColumns = [];
            initialDataMock.table.columnCount = 0;

            const wrapper = await shallowMountInteractive(context);

            expect(wrapper.findComponent(TableViewDisplay).vm.columnSizes).toStrictEqual([0, 0]);
        });

        it('correctly overrides column sizes', async () => {
            await setColumnWidthSettings(wrapper, { availableWidth });
            await setColumnWidth(0, 1);
            await setColumnWidth(1, 2);
            await setColumnWidth(2, 1);
            expect(wrapper.findComponent(TableViewDisplay).vm.columnSizes).toStrictEqual([
                1,
                2,
                1,
                expect.anything(),
                expect.anything(),
                547 // The rest of the space
            ]);
        });

        it('correctly overrides all column sizes', async () => {
            await setColumnWidthSettings(wrapper, { availableWidth });
            await setColumnWidth(0, 1); // not overwritten since this is the index column
            await setColumnWidth(2, 1); // this will be overwritten
            const defaultSizeOverride = 30;
            await setAllColumnsWidth(defaultSizeOverride);
            await setColumnWidth(3, 1); // this owerwrites the default again

            expect(wrapper.findComponent(TableViewDisplay).vm.columnSizes).toStrictEqual([
                1,
                MIN_COLUMN_SIZE,
                defaultSizeOverride,
                1,
                defaultSizeOverride,
                890 // The rest of the space
            ]);

            const largeDefaultSizeOverride = 1000;
            await setAllColumnsWidth(largeDefaultSizeOverride);

            expect(wrapper.findComponent(TableViewDisplay).vm.columnSizes).toStrictEqual([
                1,
                50,
                largeDefaultSizeOverride,
                largeDefaultSizeOverride,
                largeDefaultSizeOverride,
                largeDefaultSizeOverride
            ]);
        });

        it('updates column sizes from availableWidth', async () => {
            const wrapper = await shallowMountInteractive(context);

            let availableWidth = 100;
            wrapper.vm.updateAvailableWidth(availableWidth);
            expect(wrapper.vm.currentAvailableWidth).toBe(availableWidth);

            const allColumnsResizeSize = 123;

            await wrapper.findComponent(TableUI).vm.$emit('all-columns-resize', allColumnsResizeSize);
            expect(wrapper.findComponent(TableViewDisplay).vm.columnSizes).toStrictEqual([
                0,
                0,
                allColumnsResizeSize,
                allColumnsResizeSize,
                allColumnsResizeSize,
                allColumnsResizeSize
            ]);

            availableWidth = 200;
            wrapper.vm.updateAvailableWidth(availableWidth);
            expect(wrapper.vm.currentAvailableWidth).toBe(availableWidth);
            await flushPromises();
            expect(wrapper.findComponent(TableViewDisplay).vm.columnSizes).toStrictEqual([
                0,
                0,
                allColumnsResizeSize * 2,
                allColumnsResizeSize * 2,
                allColumnsResizeSize * 2,
                allColumnsResizeSize * 2
            ]);
        });
        
        it('sets columnResizeActive state', () => {
            const columnResizeActive = wrapper.findComponent(TableViewDisplay).vm.columnResizeActive;
            expect(columnResizeActive.state).toBeFalsy();
            tableUI.vm.$emit('columnResizeStart');
            expect(columnResizeActive.state).toBeTruthy();

            tableUI.vm.$emit('columnResizeEnd');
            expect(columnResizeActive.state).toBeFalsy();
        });
    });
});
