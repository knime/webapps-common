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

import java.lang.ref.Cleaner;
import java.util.Arrays;
import java.util.Comparator;
import java.util.HashMap;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Supplier;
import java.util.stream.Collectors;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import org.knime.core.data.DataCell;
import org.knime.core.data.DataColumnSpec;
import org.knime.core.data.DataRow;
import org.knime.core.data.DataTable;
import org.knime.core.data.DataTableSpec;
import org.knime.core.data.MissingCell;
import org.knime.core.data.RowKey;
import org.knime.core.data.StringValue;
import org.knime.core.data.container.CloseableRowIterator;
import org.knime.core.data.container.filter.TableFilter;
import org.knime.core.data.property.ColorHandler;
import org.knime.core.data.property.ColorModel;
import org.knime.core.data.sort.BufferedDataTableSorter;
import org.knime.core.data.sort.RowComparator;
import org.knime.core.node.BufferedDataTable;
import org.knime.core.node.CanceledExecutionException;
import org.knime.core.util.Pair;
import org.knime.core.webui.data.DataServiceContext;
import org.knime.core.webui.data.DataServiceException;
import org.knime.core.webui.node.view.table.data.render.DataValueImageRenderer;
import org.knime.core.webui.node.view.table.data.render.DataValueImageRendererRegistry;
import org.knime.core.webui.node.view.table.data.render.DataValueRenderer;
import org.knime.core.webui.node.view.table.data.render.DataValueRendererFactory;
import org.knime.core.webui.node.view.table.data.render.DataValueTextRenderer;

/**
 * @author Konrad Amtenbrink, KNIME GmbH, Berlin, Germany
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
public class TableViewDataServiceImpl implements TableViewDataService {

    private final TableWithIndicesSupplier m_tableSupplier;

    private final TableCache m_sortedTableCache = new TableCache();

    private final TableCache m_filteredAndSortedTableCache = new TableCache();

    private static final Cleaner CLEANER = Cleaner.create();

    private final DataValueImageRendererRegistry m_rendererRegistry;

    private final DataValueRendererFactory m_rendererFactory;

    /*
     * Caches data value renderers for the key [column-name, renderer-id].
     * Allows one to re-use the renderers and to not create them over and over again (e.g. when paging the table).
     */
    private final Map<Pair<String, String>, DataValueRenderer> m_renderersMap = new HashMap<>();

    private final String m_tableId;

    private final Supplier<Set<RowKey>> m_selectionSupplier;

    /**
     * @param tableSupplier supplier for the table from which to obtain data
     * @param tableId a globally unique id; used to uniquely identify images in the renderer-registry which belong to
     *            the table supplied here
     * @param rendererFactory required to turn data values into text or images
     * @param rendererRegistry lazily supplied image content for cells that are rendered into images (cleared and filled
     *            whenever new rows are being requested, e.g., via
     *            {@link #getTable(String[], long, int, String[], boolean, boolean)}
     */
    public TableViewDataServiceImpl(final Supplier<BufferedDataTable> tableSupplier, final String tableId,
        final DataValueRendererFactory rendererFactory, final DataValueImageRendererRegistry rendererRegistry) {
        Objects.requireNonNull(tableSupplier, () -> "Table supplier must not be null.");
        m_tableSupplier = new TableWithIndicesSupplier(tableSupplier);
        m_tableId = tableId;
        m_rendererFactory = rendererFactory;
        m_rendererRegistry = rendererRegistry;
        m_selectionSupplier = null;
        CLEANER.register(this, () -> { // NOSONAR exposing a partially constructed instance is no problem here
            m_sortedTableCache.clear(); // because it's not really used (just to determine whether 'this' is phantom-reachable)
            m_filteredAndSortedTableCache.clear();
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
     *            {@link #getTable(String[], long, int, String[], boolean, boolean)})
     */
    public TableViewDataServiceImpl(final Supplier<BufferedDataTable> tableSupplier,
        final Supplier<Set<RowKey>> selectionSupplier, final String tableId,
        final DataValueRendererFactory rendererFactory, final DataValueImageRendererRegistry rendererRegistry) {
        m_selectionSupplier = selectionSupplier;
        Objects.requireNonNull(tableSupplier, () -> "Table supplier must not be null.");
        m_tableSupplier = new TableWithIndicesSupplier(tableSupplier);
        m_tableId = tableId;
        m_rendererFactory = rendererFactory;
        m_rendererRegistry = rendererRegistry;
        CLEANER.register(this, () -> { // NOSONAR exposing a partially constructed instance is no problem here
            m_sortedTableCache.clear(); // because it's not really used (just to determine whether 'this' is phantom-reachable)
            m_filteredAndSortedTableCache.clear();
        });
    }

    @Override
    public Table getTable(final String[] columns, final long fromIndex, final int numRows, final String[] rendererIds,
        final boolean updateDisplayedColumns, final boolean forceClearImageDataCache, final boolean trimColumns) {
        return getFilteredAndSortedTable(columns, fromIndex, numRows, null, false, null, null, false, rendererIds,
            updateDisplayedColumns, false, forceClearImageDataCache, trimColumns);
    }

    @Override
    public Table getFilteredAndSortedTable(final String[] columns, final long fromIndex, final int numRows,
        final String sortColumn, final boolean sortAscending, final String globalSearchTerm,
        final String[][] columnFilterValue, final boolean filterRowKeys, final String[] rendererIdsParam,
        final boolean updateDisplayedColumns, final boolean updateTotalSelected, final boolean forceClearImageDataCache,
        final boolean trimColumns) {
        var bufferedDataTable = m_tableSupplier.get();
        if (bufferedDataTable == null) {
            return createEmptyTable();
        }

        var displayedColumns = updateDisplayedColumns ? filterInvalids(columns, bufferedDataTable.getSpec()) : columns;
        final var numDisplayedColumns = displayedColumns.length;
        if (trimColumns) {
            final var maxNumColumns = 100;
            if (numDisplayedColumns > maxNumColumns) {
                displayedColumns = Arrays.copyOfRange(displayedColumns, 0, maxNumColumns);
            }
        }

        // we sort first (even though it is more expensive) because filtering happens more frequently
        // and therefore we do not have to re-sort every time we filter
        m_sortedTableCache.conditionallyUpdateCachedTable(() -> sortTable(bufferedDataTable, sortColumn, sortAscending),
            sortColumn == null || bufferedDataTable.size() <= 1, sortColumn, sortAscending);
        final var sortedTable = m_sortedTableCache.getCachedTable().orElseGet(() -> bufferedDataTable);
        m_filteredAndSortedTableCache.conditionallyUpdateCachedTable(
            () -> filterTable(sortedTable, columns, globalSearchTerm, columnFilterValue, filterRowKeys),
            globalSearchTerm == null && columnFilterValue == null, globalSearchTerm, columnFilterValue, columns,
            sortColumn, sortAscending);
        final var filteredAndSortedTable = m_filteredAndSortedTableCache.getCachedTable().orElseGet(() -> sortedTable);

        final var spec = bufferedDataTable.getSpec();
        if (m_rendererRegistry != null) {
            if (forceClearImageDataCache || m_sortedTableCache.wasUpdated()
                || m_filteredAndSortedTableCache.wasUpdated()) {
                // Clears the image data cache if it's forced to be cleared. That's usually done when 'pagination' is enabled because in that
                // case a new batch of rows is request with every page change and the is no need to keep the older one.
                // If, however, 'pagination' is disabled (i.e. 'infinite scrolling' is used instead), then it's almost certain
                // that images of two different consecutive(!) 'row-batches' are being requested at the same time. I.e. we must
                // _not_ clear previous row-batches too early.
                // However, we _can_ clear the image data cache if 'pagination' is disabled or if the entire table is being
                // updated/replaced (e.g. because it's sorted or filtered). Because images of row-batches of different tables
                // won't be requested at the same time (e.g. a row-batch of the sorted table won't be displayed together with a
                // row-batch of the un-sorted table).
                m_rendererRegistry.clearImageDataCache(m_tableId);
            }
            if (numRows > 0) {
                m_rendererRegistry.startNewBatchOfTableRows(m_tableId);
            }
        }
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
        updateRenderersMap(spec, displayedColumns, rendererIds);

        final var tableSize = filteredAndSortedTable.size();
        final var toIndex = Math.min(fromIndex + numRows, tableSize) - 1;
        final var size = (int)(toIndex - fromIndex + 1);

        final Object[][] rows;
        if (size > 0) {
            final var colIndices = spec.columnsToIndices(displayedColumns);
            final var colorHandlers = IntStream.of(colIndices).mapToObj(spec::getColumnSpec)
                .map(DataColumnSpec::getColorHandler).toArray(ColorHandler[]::new);
            final var filter = new TableFilter.Builder();
            filter.withFromRowIndex(fromIndex); // will throw exception when fromIndex < 0
            filter.withToRowIndex(toIndex); // will throw exception when toIndex < fromIndex
            filter.withMaterializeColumnIndices(colIndices);
            rows = renderRows(displayedColumns, colIndices, colorHandlers, rendererIds, size,
                () -> filteredAndSortedTable.filter(filter.build()).iterator(), m_rendererRegistry, m_renderersMap,
                m_tableId);
        } else {
            rows = new String[0][];
        }
        final var tableSpec = bufferedDataTable.getDataTableSpec();
        final var contentTypes = getColumnContentTypes(displayedColumns, rendererIds, m_renderersMap);
        final var dataTypeIds = getColumnDataTypeIds(displayedColumns, tableSpec);
        var currentSelection = getCurrentSelection();
        var totalSelected = m_filteredAndSortedTableCache.getCachedTable().isEmpty() ? currentSelection.size()
            : countSelectedRows(filteredAndSortedTable, currentSelection);
        return createTable(displayedColumns, contentTypes, dataTypeIds, rows, tableSize, numDisplayedColumns,
            totalSelected);
    }

    @Override
    public Long getTotalSelected() {
        var filteredTable = m_filteredAndSortedTableCache.getCachedTable().orElse(null);
        var currentSelection = getCurrentSelection();
        return filteredTable == null ? currentSelection.size() : countSelectedRows(filteredTable, currentSelection);
    }

    private static String[] adjustColumnRenderers(final String[] columns, final DataTableSpec spec,
        final String[] rendererIds) {
        return IntStream.range(0, columns.length).filter(i -> spec.containsName(columns[i]))
            .mapToObj(i -> rendererIds[i]).collect(Collectors.toList()).toArray(String[]::new);

    }

    @Override
    public void clearCache() {
        m_sortedTableCache.clear();
        m_filteredAndSortedTableCache.clear();
        m_tableSupplier.clear();
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
                col -> col.withAlphanumericComparison(colType.isCompatible(StringValue.class))
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

    private static BufferedDataTable filterTable(final DataTable table, final String[] columns,
        final String globalSearchTerm, final String[][] columnFilterValue, final boolean filterRowKeys) {
        final var spec = table.getDataTableSpec();
        var exec = DataServiceContext.get().getExecutionContext();
        var resultContainer = exec.createDataContainer(spec);
        try (final var iterator = (CloseableRowIterator)table.iterator()) {
            while (iterator.hasNext()) {
                final var row = iterator.next();
                if (filtersMatch(row, spec, globalSearchTerm, columnFilterValue, columns, filterRowKeys)) {
                    resultContainer.addRowToTable(row);
                }
            }
        }
        resultContainer.close();
        return resultContainer.getTable();
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

    private Set<RowKey> getCurrentSelection() {
        return m_selectionSupplier == null ? Set.of() : m_selectionSupplier.get();
    }

    @SuppressWarnings("java:S107") // accept the large number of parameters
    private static boolean filtersMatch(final DataRow row, final DataTableSpec spec, final String globalSearchTerm,
        final String[][] columnFilterValue, final String[] columns, final boolean filterRowKeys) {

        var globalMatch = false;

        if (filterRowKeys) {
            final var rowKeyValue = row.getKey().toString().toLowerCase();
            if (matchesGlobalSearchTerm(rowKeyValue, globalSearchTerm)) {
                globalMatch = true;
            }
            if (!matchesColumnFilter(rowKeyValue, columnFilterValue, 0, false)) {
                return false;
            }
        }

        final var colIndices = spec.columnsToIndices(columns);
        for (var i = 0; i < columns.length; i++) {

            final var colIndex = colIndices[i];
            final var cellStringValue = row.getCell(colIndex).toString().toLowerCase();

            if (matchesGlobalSearchTerm(cellStringValue, globalSearchTerm)) {
                globalMatch = true;
            }
            // if the domain values exists we want an exact match, otherwise we
            // just check if the cell value matches the search term
            var needsExactMatch = spec.getColumnSpec(colIndex).getDomain().getValues() != null;
            // The first entry of the columnFilters is for row keys. Thus we have an offset of one for the others.
            final var columnFilterIndex = i + 1;
            if (!matchesColumnFilter(cellStringValue, columnFilterValue, columnFilterIndex, needsExactMatch)) {
                return false;
            }
        }
        return globalMatch;
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
        return columnFilter.length == 0 || columnFilter[0].isEmpty();
    }

    private static boolean matchesGlobalSearchTerm(final String cellStringValue, final String globalSearchTerm) {
        return globalSearchTerm == null || globalSearchTerm.isEmpty()
            || cellStringValue.contains(globalSearchTerm.toLowerCase());
    }

    @SuppressWarnings("java:S107") // accept the large number of parameters
    private static Object[][] renderRows(final String[] columns, final int[] colIndices,
        final ColorHandler[] colorHandlers, final String[] rendererIds, final int size,
        final Supplier<CloseableRowIterator> rowIteratorSupplier, final DataValueImageRendererRegistry rendererRegistry,
        final Map<Pair<String, String>, DataValueRenderer> renderersMap, final String tableId) {
        var renderers = IntStream.range(0, columns.length)
            .mapToObj(i -> renderersMap.get(Pair.create(columns[i], rendererIds[i]))).toArray(DataValueRenderer[]::new);
        final var rows = new Object[size][];
        try (final var iterator = rowIteratorSupplier.get()) {
            IntStream.range(0, size).forEach(index -> {
                final var row = iterator.next();
                rows[index] = renderRow(row, colIndices, colorHandlers, renderers, rendererRegistry, tableId);
            });
        }
        return rows;
    }

    private static Object createCell(final DataCell cell, final DataValueRenderer renderer, final String color,
        final DataValueImageRendererRegistry rendererRegistry, final String tableId) {
        if (cell.isMissing()) {
            return createCellMetadata(cell, color);
        }
        final var renderedValue =  renderCell(cell, renderer, rendererRegistry, tableId);
        if (color != null) {
            return new Cell() {

                @Override
                public String getValue() {
                    return renderedValue;
                }

                @Override
                public String getColor() {
                    // TODO Auto-generated method stub
                    return color;
                }
            };
        }
        return renderedValue;
    }

    private static Object createCellMetadata(final DataCell cell, final String color) {
        final var missingCellErrorMsg = ((MissingCell)cell).getError();
        return missingCellErrorMsg == null && color == null ? null : new MissingCellWithMessage() {

            @Override
            public String getMetadata() {
                return missingCellErrorMsg;
            }

            @Override
            public String getColor() {
                return color;
            }
        };
    }

    private static Object[] renderRow(final DataRow row, final int[] colIndices, final ColorHandler[] colorHandlers,
        final DataValueRenderer[] renderers, final DataValueImageRendererRegistry rendererRegistry,
        final String tableId) {
        final var rowIndex = row.getCell(0).toString();
        final var rowKey = row.getKey().toString();
        return Stream.concat(Stream.of(rowIndex, rowKey), //
            IntStream.range(0, colIndices.length) //
                .mapToObj(i -> {
                    final var cell = row.getCell(colIndices[i]);
                    final var renderer = renderers[i];
                    final var color = getColor(colorHandlers[i], cell);
                    return createCell(cell, renderer, color, rendererRegistry, tableId);
                }))
            .toArray(Object[]::new);
    }

    private static String getColor(final ColorHandler colorHandler, final DataCell cell) {
        if (colorHandler == null) {
            return null;
        }
        return ColorModel.colorToHexString(colorHandler.getColorAttr(cell).getColor());
    }

    private static String renderCell(final DataCell cell, final DataValueRenderer renderer,
        final DataValueImageRendererRegistry rendererRegistry, final String tableId) {
        if (renderer instanceof DataValueTextRenderer) {
            return ((DataValueTextRenderer)renderer).renderText(cell);
        } else if (renderer instanceof DataValueImageRenderer) {
            return rendererRegistry.addRendererAndGetImgPath(tableId, cell, (DataValueImageRenderer)renderer);
        } else {
            throw new UnsupportedOperationException(
                "Unsupported data value renderer: " + renderer.getClass().getName());
        }
    }

    private void updateRenderersMap(final DataTableSpec spec, final String[] columns, final String[] rendererIds) {
        for (var i = 0; i < columns.length; i++) {
            var key = Pair.create(columns[i], rendererIds[i]);
            m_renderersMap.computeIfAbsent(key,
                k -> m_rendererFactory.createDataValueRenderer(spec.getColumnSpec(k.getFirst()), k.getSecond()));
        }
    }

    private static String[] getColumnContentTypes(final String[] columns, final String[] rendererIds,
        final Map<Pair<String, String>, DataValueRenderer> renderersMap) {
        return IntStream.range(0, columns.length)
            .mapToObj(i -> renderersMap.get(Pair.create(columns[i], rendererIds[i])).getContentType().toString())
            .toArray(String[]::new);
    }

    private static String[] getColumnDataTypeIds(final String[] columns, final DataTableSpec spec) {
        return Arrays.stream(columns).map(c -> String.valueOf(spec.getColumnSpec(c).getType().hashCode()))
            .toArray(String[]::new);
    }

    private static Table createEmptyTable() {
        return createTable(new String[0], new String[0], new String[0], new String[0][], 0, 0, 0l);
    }

    private static Table createTable(final String[] displayedColumns, final String[] contentTypes,
        final String[] columnDataTypeIds, final Object[][] rows, final long rowCount, final long columnCount,
        final Long totalSelected) {
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
                return columnDataTypeIds;
            }

            @Override
            public Object[][] getRows() {
                return rows;
            }

            @Override
            public long getRowCount() {
                return rowCount;
            }

            @Override
            public long getColumnCount() {
                return columnCount;
            }

            @Override
            public Long getTotalSelected() {
                return totalSelected;
            }

        };
    }

    @Override
    public String[] getCurrentRowKeys() {
        final var filteredAndSortedTable =
            m_filteredAndSortedTableCache.getCachedTable().orElseGet(m_tableSupplier::get);
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

}
