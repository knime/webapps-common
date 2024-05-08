/*
 * ------------------------------------------------------------------------
 *
 *  Copyright by KNIME AG, Zurich, Switzerland
 *  Website: http://www.knime.com; Email: contact@knime.com
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License, Version 3, as
 *  published by the Free Software Foundation.
 *
 *  This program is distributed in the hope that it will be useful, but
 *  WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, see <http://www.gnu.org/licenses>.
 *
 *  Additional permission under GNU GPL version 3 section 7:
 *
 *  KNIME interoperates with ECLIPSE solely via ECLIPSE's plug-in APIs.
 *  Hence, KNIME and ECLIPSE are both independent programs and are not
 *  derived from each other. Should, however, the interpretation of the
 *  GNU GPL Version 3 ("License") under any applicable laws result in
 *  KNIME and ECLIPSE being a combined program, KNIME AG herewith grants
 *  you the additional permission to use and propagate KNIME together with
 *  ECLIPSE with only the license terms in place for ECLIPSE applying to
 *  ECLIPSE and the GNU GPL Version 3 applying for KNIME, provided the
 *  license terms of ECLIPSE themselves allow for the respective use and
 *  propagation of ECLIPSE together with KNIME.
 *
 *  Additional permission relating to nodes for KNIME that extend the Node
 *  Extension (and in particular that are based on subclasses of NodeModel,
 *  NodeDialog, and NodeView) and that only interoperate with KNIME through
 *  standard APIs ("Nodes"):
 *  Nodes are deemed to be separate and independent programs and to not be
 *  covered works.  Notwithstanding anything to the contrary in the
 *  License, the License does not apply to Nodes, you are not required to
 *  license Nodes under the License, and you are granted a license to
 *  prepare and propagate Nodes, in each case even if such Nodes are
 *  propagated with or for interoperation with KNIME.  The owner of a Node
 *  may freely choose the license terms applicable to such Node, including
 *  when such Node is propagated with or for interoperation with KNIME.
 * ---------------------------------------------------------------------
 *
 * History
 *   Nov 26, 2021 (hornm): created
 */
package org.knime.core.webui.node.view.table.data;

import java.io.IOException;
import java.lang.ref.Cleaner;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import org.knime.core.data.DataCell;
import org.knime.core.data.DataColumnSpec;
import org.knime.core.data.DataRow;
import org.knime.core.data.DataTableSpec;
import org.knime.core.data.RowKey;
import org.knime.core.data.container.filter.TableFilter;
import org.knime.core.data.def.StringCell;
import org.knime.core.data.property.ColorAttr;
import org.knime.core.data.property.ColorModel;
import org.knime.core.data.sort.BufferedDataTableSorter;
import org.knime.core.data.sort.RowComparator;
import org.knime.core.node.BufferedDataTable;
import org.knime.core.node.CanceledExecutionException;
import org.knime.core.webui.data.DataServiceContext;
import org.knime.core.webui.data.DataServiceException;
import org.knime.core.webui.node.view.table.data.render.DataCellContentType;
import org.knime.core.webui.node.view.table.data.render.DataValueImageRenderer.ImageDimension;
import org.knime.core.webui.node.view.table.data.render.DataValueImageRendererRegistry;
import org.knime.core.webui.node.view.table.data.render.DataValueRendererFactory;
import org.knime.core.webui.node.view.table.data.render.internal.RowRenderer;
import org.knime.core.webui.node.view.table.data.render.internal.RowRendererWithIndicesCounter;
import org.knime.core.webui.node.view.table.data.render.internal.RowRendererWithIndicesFromColumn;
import org.knime.core.webui.node.view.table.data.render.internal.RowRendererWithRowKeys;
import org.knime.core.webui.node.view.table.data.render.internal.SimpleRowRenderer;
import org.knime.core.webui.node.view.table.data.render.internal.TableDataToStringConverter;
import org.knime.core.webui.node.view.table.data.render.internal.TableRenderer;
import org.knime.core.webui.node.view.table.data.render.internal.TableSectionRenderer;

/**
 * @author Konrad Amtenbrink, KNIME GmbH, Berlin, Germany
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
public class TableViewDataServiceImpl implements TableViewDataService {

    private final Supplier<BufferedDataTable> m_tableSupplier;

    private final TableWithIndicesSupplier m_tableWithIndicesSupplier;

    private final TableCache m_sortedTableCache = new TableCache();

    private final TableCache m_filteredAndSortedTableCache = new TableCache();

    private static final Cleaner CLEANER = Cleaner.create();

    private final DataValueImageRendererRegistry m_rendererRegistry;

    private final DataValueRendererFactory m_rendererFactory;

    private final String m_tableId;

    private final Supplier<Set<RowKey>> m_selectionSupplier;

    /**
     * @param tableSupplier supplier for the table from which to obtain data
     * @param tableId a globally unique id; used to uniquely identify images in the renderer-registry which belong to
     *            the table supplied here
     * @param rendererFactory required to turn data values into text or images
     * @param rendererRegistry lazily supplied image content for cells that are rendered into images (cleared and filled
     *            whenever new rows are being requested, e.g., via
     *            {@link #getTable(String[], long, int, String[], boolean, boolean, boolean)}
     */
    public TableViewDataServiceImpl(final Supplier<BufferedDataTable> tableSupplier, final String tableId,
        final DataValueRendererFactory rendererFactory, final DataValueImageRendererRegistry rendererRegistry) {
        Objects.requireNonNull(tableSupplier, () -> "Table supplier must not be null.");
        m_tableSupplier = tableSupplier;
        m_tableWithIndicesSupplier = new TableWithIndicesSupplier(tableSupplier);
        m_tableId = tableId;
        m_rendererFactory = rendererFactory;
        m_rendererRegistry = rendererRegistry;
        m_selectionSupplier = null;
        CLEANER.register(this, () -> { // NOSONAR exposing a partially constructed instance is no problem here
            /** because it's not really used (just to determine whether 'this' is phantom-reachable) */
            m_sortedTableCache.clear();
            m_filteredAndSortedTableCache.clear();
            m_tableWithIndicesSupplier.clear();
        });
    }

    /**
     * @param tableSupplier supplier for the table from which to obtain data
     * @param selectionSupplier provides the currently selected rows, can be {@code null}
     * @param tableId a globally unique id; used to uniquely identify images in the renderer-registry which belong to
     *            the table supplied here
     * @param rendererFactory required to turn data values into text or images
     * @param rendererRegistry lazily supplied image content for cells that are rendered into images (cleared and filled
     *            whenever new rows are being requested, e.g., via
     *            {@link #getTable(String[], long, int, String[], boolean, boolean, boolean)})
     */
    public TableViewDataServiceImpl(final Supplier<BufferedDataTable> tableSupplier,
        final Supplier<Set<RowKey>> selectionSupplier, final String tableId,
        final DataValueRendererFactory rendererFactory, final DataValueImageRendererRegistry rendererRegistry) {
        m_selectionSupplier = selectionSupplier;
        Objects.requireNonNull(tableSupplier, () -> "Table supplier must not be null.");
        m_tableSupplier = tableSupplier;
        m_tableWithIndicesSupplier = new TableWithIndicesSupplier(tableSupplier);
        m_tableId = tableId;
        m_rendererFactory = rendererFactory;
        m_rendererRegistry = rendererRegistry;
        CLEANER.register(this, () -> { // NOSONAR exposing a partially constructed instance is no problem here
            /** because it's not really used (just to determine whether 'this' is phantom-reachable) */
            m_sortedTableCache.clear();
            m_filteredAndSortedTableCache.clear();
            m_tableWithIndicesSupplier.clear();
        });
    }

    @Override
    public Table getTable(final String[] columns, final long fromIndex, final int numRows, final String[] rendererIds,
        final boolean updateDisplayedColumns, final boolean forceClearImageDataCache, final boolean trimColumns,
        final boolean showOnlySelectedRows) {
        return getFilteredAndSortedTable(columns, fromIndex, numRows, null, false, null, null, false, rendererIds,
            updateDisplayedColumns, false, forceClearImageDataCache, trimColumns, showOnlySelectedRows);
    }

    @Override
    public Table getFilteredAndSortedTable(final String[] columns, final long fromIndex, final int numRows,
        final String sortColumn, final boolean sortAscending, final String globalSearchTerm,
        final String[][] columnFilterValue, final boolean filterRowKeys, final String[] rendererIdsParam,
        final boolean updateDisplayedColumns, final boolean updateTotalSelected, final boolean forceClearImageDataCache,
        final boolean trimColumns, final boolean showOnlySelectedRows) {
        var bufferedDataTable = m_tableSupplier.get();
        if (bufferedDataTable == null) {
            return createEmptyTable();
        }

        final var allDisplayedColumns =
            updateDisplayedColumns ? filterInvalids(columns, bufferedDataTable.getSpec()) : columns;
        final var numDisplayedColumns = allDisplayedColumns.length;
        final String[] displayedColumns =
            trimColumns ? getTrimmedColumns(numDisplayedColumns, allDisplayedColumns) : allDisplayedColumns;

        var currentSelection = getCurrentSelection();

        /**
         * we sort first (even though it is more expensive) because filtering happens more frequently and therefore we
         * do not have to re-sort every time we filter
         */
        m_sortedTableCache.conditionallyUpdateCachedTable(
            () -> sortTable(m_tableWithIndicesSupplier.get(), sortColumn, sortAscending),
            sortColumn == null || bufferedDataTable.size() <= 1, sortColumn, sortAscending);
        // updates m_filteredAndSortedTableCache
        filterSortedTableConditionally(columns, sortColumn, sortAscending, globalSearchTerm, columnFilterValue,
            filterRowKeys, showOnlySelectedRows, currentSelection);
        updateRendererRegistryIfNecessary(numRows, forceClearImageDataCache);
        String[] rendererIds =
            getRendererIds(columns, rendererIdsParam, updateDisplayedColumns, bufferedDataTable, displayedColumns);

        final var cachedProcessedTable = getCachedProcessedTable();
        final var toBeRenderedTable = cachedProcessedTable.orElseGet(m_tableSupplier);
        final var tableDataRendererUtil = new TableRenderer(m_rendererFactory, toBeRenderedTable.getSpec(),
            displayedColumns, rendererIds, m_rendererRegistry, m_tableId);
        final var rows = tableDataRendererUtil.renderTableContent(toBeRenderedTable, fromIndex, numRows,
            cachedProcessedTable.isEmpty());
        final var contentTypes = tableDataRendererUtil.getColumnContentTypes();
        final var firstRowImageDimensions = getFirstRowImageDimensions(rows, contentTypes, displayedColumns);
        final var spec = toBeRenderedTable.getSpec();
        return new Table() {

            @Override
            public String[] getDisplayedColumns() {
                return displayedColumns;
            }

            @Override
            public String[] getColumnContentTypes() {
                return contentTypes;
            }

            @Override
            public String[] getColumnDataTypeIds() {
                return Arrays.stream(displayedColumns)
                    .map(c -> TableViewInitialDataImpl.getDataTypeId(spec.getColumnSpec(c).getType()))
                    .toArray(String[]::new);
            }

            @Override
            public String[] getColumnFormatterDescriptions() {
                return Arrays.asList(displayedColumns).stream().map(spec::getColumnSpec)
                    .map(DataColumnSpec::getValueFormatHandler).map(f -> f == null ? null : "Attached formatter")
                    .toArray(String[]::new);
            }

            @Override
            public String[] getColumnNamesColors() {
                final var columnNamesColorHandler = spec.getColumnNamesColorHandler();
                if (columnNamesColorHandler.isEmpty()) {
                    return new String[0];
                }
                final var colorModel = columnNamesColorHandler.get().getColorModel();
                return Arrays.asList(displayedColumns).stream().map(StringCell::new).map(colorModel::getColorAttr)
                    .map(ColorAttr::getColor).map(ColorModel::colorToHexString).toArray(String[]::new);
            }

            @Override
            public List<List<Object>> getRows() {
                return rows;
            }

            @Override
            public long getRowCount() {
                return toBeRenderedTable.size();
            }

            @Override
            public long getColumnCount() {
                return numDisplayedColumns;
            }

            @Override
            public Long getTotalSelected() {
                return m_filteredAndSortedTableCache.getCachedTable().isEmpty() ? currentSelection.size()
                    : countSelectedRows(toBeRenderedTable, currentSelection);
            }

            @Override
            public Map<String, ImageDimension> getFirstRowImageDimensions() {
                return firstRowImageDimensions;
            }

        };
    }

    /**
     * @return the cached filtered and sorted table or an empty optional if not filtered or sorted
     */
    private Optional<BufferedDataTable> getCachedProcessedTable() {
        final var filteredAndSortedTable = m_filteredAndSortedTableCache.getCachedTable();
        if (filteredAndSortedTable.isPresent()) {
            return filteredAndSortedTable;
        }
        return m_sortedTableCache.getCachedTable();
    }

    private static String[] getTrimmedColumns(final int numDisplayedColumns, final String[] allDisplayedColumns) {
        final var maxNumColumns = 100;
        if (numDisplayedColumns > maxNumColumns) {
            return Arrays.copyOfRange(allDisplayedColumns, 0, maxNumColumns);
        }
        return allDisplayedColumns;
    }

    private static String[] filterInvalids(final String[] columns, final DataTableSpec spec) {
        final var dataServiceContext = DataServiceContext.get();

        final var partition = Stream.of(columns).collect(Collectors.partitioningBy(spec::containsName));

        final var invalidCols = partition.get(false);

        if (!invalidCols.isEmpty()) {
            dataServiceContext.addWarningMessage(String.format("The selected column%s not present in the table.",
                String.format(invalidCols.size() == 1 ? " %s is" : "s %s are", String.join(", ", invalidCols))));
        }
        return partition.get(true).stream().toArray(String[]::new);
    }

    private static BufferedDataTable sortTable(final BufferedDataTable table, final String sortColumn,
        final boolean sortAscending) {
        final var dts = table.getSpec();
        final var sortColIndex = dts.findColumnIndex(sortColumn);
        final var rc = RowComparator.on(dts);
        if (sortColIndex < 0) {
            rc.thenComparingRowKey(rk -> rk.withAlphanumericComparison().withDescendingSortOrder(!sortAscending));
        } else {
            final var colType = dts.getColumnSpec(sortColIndex).getType();
            rc.thenComparingColumn(sortColIndex,
                col -> col.withAlphanumericComparison(StringCell.TYPE.equals(colType))
                    .withDescendingSortOrder(!sortAscending));
        }
        final Comparator<DataRow> comp = rc.build();
        try {
            var exec = DataServiceContext.get().getExecutionContext();
            return new BufferedDataTableSorter(table, comp).sort(exec);
        } catch (CanceledExecutionException e) {
            throw new DataServiceException("Table sorting has been cancelled", e);
        }
    }

    private void filterSortedTableConditionally(final String[] columns, final String sortColumn,
        final boolean sortAscending, final String globalSearchTerm, final String[][] columnFilterValue,
        final boolean filterRowKeys, final boolean showOnlySelectedRows, final Set<RowKey> currentSelection) {
        final Optional<BufferedDataTable> cachedSortedTable = m_sortedTableCache.getCachedTable();
        final Supplier<BufferedDataTable> sortedTableSupplier =
            cachedSortedTable.isPresent() ? cachedSortedTable::get : m_tableWithIndicesSupplier;
        /** Keys are only interesting if showOnlySelected is true otherwise we don't want to reset the cache */
        final var currentSelectedKeys = showOnlySelectedRows ? currentSelection : Set.of();
        m_filteredAndSortedTableCache.conditionallyUpdateCachedTable(
            () -> filterTable(sortedTableSupplier.get(), columns, globalSearchTerm, columnFilterValue, filterRowKeys,
                showOnlySelectedRows),
            (globalSearchTerm == null && columnFilterValue == null) && !showOnlySelectedRows, globalSearchTerm,
            columnFilterValue, columns, sortColumn, sortAscending, showOnlySelectedRows, currentSelectedKeys);
    }

    private BufferedDataTable filterTable(final BufferedDataTable table, final String[] columns,
        final String globalSearchTerm, final String[][] columnFilterValue, final boolean filterRowKeys,
        final boolean showOnlySelectedRows) {
        final var spec = table.getDataTableSpec();
        var exec = DataServiceContext.get().getExecutionContext();
        var resultContainer = exec.createDataContainer(spec);
        try (final var iterator = table.iterator()) {
            while (iterator.hasNext()) {
                final var row = iterator.next();
                if (filtersMatch(row, spec, globalSearchTerm, columnFilterValue, columns, filterRowKeys,
                    showOnlySelectedRows)) {
                    resultContainer.addRowToTable(row);
                }
            }
        }
        resultContainer.close();
        return resultContainer.getTable();
    }

    @SuppressWarnings("java:S107") // accept the large number of parameters
    private boolean filtersMatch(final DataRow row, final DataTableSpec spec, final String globalSearchTerm,
        final String[][] columnFilterValue, final String[] columns, final boolean filterRowKeys,
        final boolean showOnlySelectedRows) {

        if (showOnlySelectedRows && !isSelected(row)) {
            return false;
        }

        final var globalSearchTermPresent = globalSearchTerm == null || globalSearchTerm.isEmpty();
        var globalSearchTermMatch = globalSearchTermPresent;
        if (filterRowKeys) {
            final var rowKeyValue = row.getKey().toString().toLowerCase();
            if (!globalSearchTermMatch && matchesGlobalSearchTerm(rowKeyValue, globalSearchTerm)) {
                globalSearchTermMatch = true;
            }
            if (!matchesColumnFilter(rowKeyValue, columnFilterValue, 0, false)) {
                return false;
            }
        }

        final var colIndices = spec.columnsToIndices(columns);
        for (var i = 0; i < columns.length; i++) {

            final var colIndex = colIndices[i];
            final var cellStringValue = row.getCell(colIndex).toString().toLowerCase();

            if (!globalSearchTermMatch && matchesGlobalSearchTerm(cellStringValue, globalSearchTerm)) {
                globalSearchTermMatch = true;
            }
            /**
             * if the domain values exists we want an exact match, otherwise we just check if the cell value matches the
             * search term
             */
            var needsExactMatch = spec.getColumnSpec(colIndex).getDomain().getValues() != null;
            /** The first entry of the columnFilters is for row keys. Thus we have an offset of one for the others. */
            final var columnFilterIndex = i + 1;
            if (!matchesColumnFilter(cellStringValue, columnFilterValue, columnFilterIndex, needsExactMatch)) {
                return false;
            }
        }
        return globalSearchTermMatch;
    }

    private boolean isSelected(final DataRow row) {
        return getCurrentSelection().contains(row.getKey());
    }

    private static boolean matchesColumnFilter(final String cellStringValue, final String[][] columnFilters,
        final int columnFilterIndex, final boolean needsExactMatch) {
        if (allColumnFiltersEmpty(columnFilters)) {
            return true;
        }
        var currentColumnFilters = columnFilters[columnFilterIndex];
        if (columnFiltersEmpty(currentColumnFilters)) {
            return true;
        }
        return Arrays.stream(currentColumnFilters).map(String::toLowerCase)
            .anyMatch(needsExactMatch ? cellStringValue::equals : cellStringValue::contains);
    }

    private static boolean allColumnFiltersEmpty(final String[][] columnFilters) {
        return columnFilters == null || columnFilters.length == 0;
    }

    private static boolean columnFiltersEmpty(final String[] columnFilter) {
        return columnFilter == null || columnFilter.length == 0 || columnFilter[0].isEmpty();
    }

    private static boolean matchesGlobalSearchTerm(final String cellStringValue, final String globalSearchTerm) {
        return cellStringValue.contains(globalSearchTerm.toLowerCase());
    }

    private void updateRendererRegistryIfNecessary(final int numRows, final boolean forceClearImageDataCache) {
        if (m_rendererRegistry != null) {
            if (forceClearImageDataCache || m_sortedTableCache.wasUpdated()
                || m_filteredAndSortedTableCache.wasUpdated()) {
                /*
                 * Clears the image data cache if it's forced to be cleared. That's usually done when 'pagination' is
                 * enabled because in that case a new batch of rows is request with every page change and there is no
                 * need to keep the older one. If, however, 'pagination' is disabled (i.e. 'infinite scrolling' is used
                 * instead), then it's almost certain that images of two different consecutive(!) 'row-batches' are
                 * being requested at the same time. I.e. we must _not_ clear previous row-batches too early. However,
                 * we _can_ clear the image data cache if 'pagination' is disabled or if the entire table is being
                 * updated/replaced (e.g. because it's sorted or filtered). Because images of row-batches of different
                 * tables won't be requested at the same time (e.g. a row-batch of the sorted table won't be displayed
                 * together with a row-batch of the un-sorted table).
                 */
                m_rendererRegistry.clearImageDataCache(m_tableId);
            }
            if (numRows > 0) {
                m_rendererRegistry.startNewBatchOfTableRows(m_tableId);
            }
        }
    }

    private static String[] getRendererIds(final String[] columns, final String[] rendererIdsParam,
        final boolean updateDisplayedColumns, final BufferedDataTable bufferedDataTable,
        final String[] displayedColumns) {
        String[] rendererIds;
        if (rendererIdsParam == null || rendererIdsParam.length == 0) {
            rendererIds = new String[displayedColumns.length];
        } else {
            if (updateDisplayedColumns) {
                rendererIds = adjustColumnRenderers(columns, bufferedDataTable.getSpec(), rendererIdsParam);
            } else {
                rendererIds = rendererIdsParam;
            }
        }
        return rendererIds;
    }

    private static String[] adjustColumnRenderers(final String[] columns, final DataTableSpec spec,
        final String[] rendererIds) {
        return IntStream.range(0, columns.length).filter(i -> spec.containsName(columns[i]))
            .mapToObj(i -> rendererIds[i]).collect(Collectors.toList()).toArray(String[]::new);

    }

    @Override
    public Long getTotalSelected() {
        var filteredTable = m_filteredAndSortedTableCache.getCachedTable().orElse(null);
        var currentSelection = getCurrentSelection();
        return filteredTable == null ? currentSelection.size() : countSelectedRows(filteredTable, currentSelection);
    }

    private Set<RowKey> getCurrentSelection() {
        return m_selectionSupplier == null ? Set.of() : m_selectionSupplier.get();
    }

    @Override
    public void clearCache() {
        m_sortedTableCache.clear();
        m_filteredAndSortedTableCache.clear();
    }

    /**
     * @param table
     * @return the number of selected rows in the given table
     */
    private static Long countSelectedRows(final BufferedDataTable table, final Set<RowKey> currentSelection) {
        if (currentSelection.isEmpty()) {
            return 0l;
        }
        var totalSelected = 0l;
        try (final var iterator = table.filter(createRowKeysFilter()).iterator()) {
            while (iterator.hasNext()) {
                final var row = iterator.next();
                if (currentSelection.contains(row.getKey())) {
                    totalSelected += 1;
                }
            }
        }
        return totalSelected;
    }

    private Map<String, ImageDimension> getFirstRowImageDimensions(final List<List<Object>> rows,
        final String[] contentTypes, final String[] displayedColumns) {
        if (rows.isEmpty()) {
            return new HashMap<>(0);
        }
        final var firstRow = rows.get(0);

        final var firstRowImageDimensions = new HashMap<String, ImageDimension>(firstRow.size());
        IntStream.range(0, contentTypes.length).forEach(index -> {
            if (!contentTypes[index].equals(DataCellContentType.IMG_PATH.toString())) {
                return;
            }
            final var imageCell = firstRow.get(index + 2);
            String imageCellContent = null;
            if (imageCell instanceof String imageCellString) {
                imageCellContent = imageCellString;
            } else if (imageCell instanceof Cell cell) {
                imageCellContent = cell.getValue();
            }
            if (imageCellContent == null) {
                return;
            }
            final var originalDims = m_rendererRegistry.getImageDimensions(imageCellContent);
            if (originalDims != null) {
                firstRowImageDimensions.put(displayedColumns[index], originalDims);
            }
        });
        return firstRowImageDimensions;
    }

    @Override
    public String[] getCurrentRowKeys() {
        final var filteredAndSortedTable = getCachedProcessedTable().orElseGet(m_tableSupplier);
        final var size = (int)filteredAndSortedTable.size();
        final var rowKeys = new String[size];
        final var filter = new TableFilter.Builder();
        filter.withMaterializeColumnIndices(new int[0]);
        try (final var iterator = filteredAndSortedTable.filter(filter.build()).iterator()) {
            IntStream.range(0, size).forEach(index -> {
                final var row = iterator.next();
                rowKeys[index] = row.getKey().toString();
            });
        }
        return rowKeys;
    }

    private static TableFilter createRowKeysFilter() {
        final var filter = new TableFilter.Builder();
        filter.withMaterializeColumnIndices(new int[0]);
        return filter.build();
    }

    @Override
    public HTMLAndCSV getCopyContent(final SpecialColumnConfig rowIndexConfig, final SpecialColumnConfig rowKeyConfig,
        final boolean withHeaders, final String[] dataColumns, final int fromIndex, final int toIndex)
        throws IOException {
        final var cachedProcessedTable = getCachedProcessedTable();
        final var toBeRenderedTable = cachedProcessedTable.orElseGet(m_tableSupplier);
        final var colIndices = toBeRenderedTable.getSpec().columnsToIndices(dataColumns);
        final var rowRenderer =
            getCopyContentRowRenderer(rowIndexConfig, rowKeyConfig, colIndices, cachedProcessedTable.isEmpty());
        final var tableRenderer = new TableSectionRenderer<String>(rowRenderer, fromIndex, toIndex);
        final var rows = tableRenderer.renderRows(toBeRenderedTable);
        final var columnHeaders = getCopyContentColumnHeaders(rowIndexConfig, rowKeyConfig, dataColumns);
        final var tableDataToStringUtil = new TableDataToStringConverter(columnHeaders, rows, withHeaders);
        return new HTMLAndCSV(tableDataToStringUtil.toHTML(), tableDataToStringUtil.toCSV());
    }

    private static List<String> getCopyContentColumnHeaders(final SpecialColumnConfig rowIndexConfig,
        final SpecialColumnConfig rowKeyConfig, final String[] dataColumns) {
        final var columnHeaders = new ArrayList<String>(Arrays.asList(dataColumns));
        if (rowKeyConfig.isIncluded()) {
            columnHeaders.add(0, rowKeyConfig.columnName());
        }
        if (rowIndexConfig.isIncluded()) {
            columnHeaders.add(0, rowIndexConfig.columnName());
        }
        return columnHeaders;
    }

    private static RowRenderer<String> getCopyContentRowRenderer(final SpecialColumnConfig rowIndexConfig,
        final SpecialColumnConfig rowKeyConfig, final int[] colIndices, final boolean isRawInputTable) {
        RowRenderer<String> rowRenderer = new SimpleRowRenderer<>(colIndices, i -> DataCell::toString);
        if (rowKeyConfig.isIncluded()) {
            rowRenderer = new RowRendererWithRowKeys<>(rowRenderer, RowKey::toString);
        }
        if (rowIndexConfig.isIncluded()) {
            if (isRawInputTable) {
                rowRenderer = new RowRendererWithIndicesCounter<>(rowRenderer, l -> Long.toString(l));
            } else {
                rowRenderer = new RowRendererWithIndicesFromColumn<>(rowRenderer, DataCell::toString);
            }
        }
        return rowRenderer;
    }

    private static Table createEmptyTable() {
        return new Table() {

            @Override
            public String[] getDisplayedColumns() {
                return new String[0];
            }

            @Override
            public String[] getColumnContentTypes() {
                return new String[0];
            }

            @Override
            public String[] getColumnDataTypeIds() {
                return new String[0];
            }

            @Override
            public String[] getColumnFormatterDescriptions() {
                return new String[0];
            }

            @Override
            public String[] getColumnNamesColors() {
                return new String[0];
            }

            @Override
            public List<List<Object>> getRows() {
                return new ArrayList<>(0);
            }

            @Override
            public long getRowCount() {
                return 0;
            }

            @Override
            public long getColumnCount() {
                return 0;
            }

            @Override
            public Long getTotalSelected() {
                return 0l;
            }

            @Override
            public Map<String, ImageDimension> getFirstRowImageDimensions() {
                return new HashMap<>(0);
            }

        };

    }

}
