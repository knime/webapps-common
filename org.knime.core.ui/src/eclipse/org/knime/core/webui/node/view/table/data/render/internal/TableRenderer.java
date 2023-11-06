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
 *   Aug 10, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.view.table.data.render.internal;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.IntStream;

import org.knime.core.data.DataCell;
import org.knime.core.data.DataTableSpec;
import org.knime.core.data.RowKey;
import org.knime.core.node.BufferedDataTable;
import org.knime.core.util.Pair;
import org.knime.core.webui.node.view.table.data.render.DataCellContentType;
import org.knime.core.webui.node.view.table.data.render.DataValueImageRenderer;
import org.knime.core.webui.node.view.table.data.render.DataValueImageRendererRegistry;
import org.knime.core.webui.node.view.table.data.render.DataValueRenderer;
import org.knime.core.webui.node.view.table.data.render.DataValueRendererFactory;
import org.knime.core.webui.node.view.table.data.render.DataValueTextRenderer;

/**
 * A utility which temporarily created a map of renderers per column and is used to render a section of the present
 * table to a 2d collection of objects.
 *
 * @author Paul Bärnreuther
 */
public class TableRenderer {

    private final DataValueRendererFactory m_rendererFactory;

    private final String[] m_displayedColumns;

    private final String[] m_rendererIds;

    private Map<Pair<String, String>, DataValueRenderer> m_renderersMap;

    private final DataValueImageRendererRegistry m_rendererRegistry;

    private final String m_tableId;

    /**
     * @param rendererFactory
     * @param spec the input table spec
     * @param displayedColumns the (already validated non-missing) columns to be displayed
     * @param rendererIds
     * @param rendererRegistry
     * @param tableId
     */
    public TableRenderer(final DataValueRendererFactory rendererFactory, final DataTableSpec spec,
        final String[] displayedColumns, final String[] rendererIds,
        final DataValueImageRendererRegistry rendererRegistry, final String tableId) {
        m_displayedColumns = displayedColumns;
        m_rendererIds = rendererIds;
        m_rendererFactory = rendererFactory;
        m_renderersMap = createRenderers(spec);
        m_rendererRegistry = rendererRegistry;
        m_tableId = tableId;
    }

    private Map<Pair<String, String>, DataValueRenderer> createRenderers(final DataTableSpec spec) {
        var result = new HashMap<Pair<String, String>, DataValueRenderer>();
        for (var i = 0; i < m_displayedColumns.length; i++) {
            var key = getRendererKey(i);
            var renderer =
                m_rendererFactory.createDataValueRenderer(spec.getColumnSpec(m_displayedColumns[i]), m_rendererIds[i]);
            result.put(key, renderer);
        }
        return result;
    }

    private Pair<String, String> getRendererKey(final int indexInDisplayedColumns) {
        return Pair.create(m_displayedColumns[indexInDisplayedColumns], m_rendererIds[indexInDisplayedColumns]);
    }

    private DataValueRenderer getConstructedDataValueRenderer(final int indexInDisplayedColumns) {
        return m_renderersMap.get(getRendererKey(indexInDisplayedColumns));
    }

    /**
     *
     * @param table the table from which a section should be rendered
     * @param fromIndex index to start from
     * @param numRows index to end (inclusive)
     * @param isRawInputTable whether the given table is the input table or a processed one. This is important since the
     *            input table contains no indices while processed ones do.
     * @return a list containing rendered rows, where these rendered rows start with index and row key followed by the
     *         rendered cells for the displayed columns.
     */
    public List<List<Object>> renderTableContent(final BufferedDataTable table, final long fromIndex, final int numRows,
        final boolean isRawInputTable) {

        final var rowRenderer = getRowRenderer(table.getSpec());
        final var rowRendererWithRowKeys = new RowRendererWithRowKeys<Object>(rowRenderer, RowKey::toString);
        final RowRenderer<Object> rowRendererWithRowKeysAndIndices =
            addIndices(rowRendererWithRowKeys, !isRawInputTable);

        final var tableSize = table.size();
        final var toIndex = Math.min(fromIndex + numRows, tableSize) - 1;
        final var tableSelectionRenderer =
            new TableSectionRenderer<Object>(rowRendererWithRowKeysAndIndices, fromIndex, toIndex);

        return tableSelectionRenderer.renderRows(table);
    }

    private RowRenderer<Object> getRowRenderer(final DataTableSpec spec) {
        final var colIndices = spec.columnsToIndices(m_displayedColumns);
        return new SimpleRowRenderer<Object>(colIndices,
            indexInDisplayedColumns -> getCellRenderer(indexInDisplayedColumns, colIndices[indexInDisplayedColumns],
                spec));
    }

    private CellRenderer<Object> getCellRenderer(final int indexInDisplayedColumns, final int colIndex,
        final DataTableSpec spec) {
        final var renderer = getConstructedDataValueRenderer(indexInDisplayedColumns);
        final var cellContentRenderer = new DataValueRendererAdapter(renderer);
        return new MetadataCellRenderer(cellContentRenderer, spec.getColumnSpec(colIndex).getColorHandler());
    }

    /**
     * An adapter class which transforming a {@link DataValueRenderer} to an internally used {@link CellRenderer}.
     */
    private class DataValueRendererAdapter implements CellRenderer<String> {

        private final DataValueRenderer m_dataValueRenderer;

        DataValueRendererAdapter(final DataValueRenderer dataValueRenderer) {
            m_dataValueRenderer = dataValueRenderer;
        }

        @Override
        public String renderCell(final DataCell cell) {
            if (m_dataValueRenderer instanceof DataValueTextRenderer txtRenderer) {
                return txtRenderer.renderText(cell);
            } else if (m_dataValueRenderer instanceof DataValueImageRenderer imgRenderer) {
                return m_rendererRegistry.addRendererAndGetImgPath(m_tableId, cell, imgRenderer);
            } else {
                throw new UnsupportedOperationException(
                    "Unsupported data value renderer: " + m_dataValueRenderer.getClass().getName());
            }
        }
    }

    private static RowRenderer<Object> addIndices(final RowRenderer<Object> rowRenderer,
        final boolean tableHasIndices) {
        if (tableHasIndices) {
            return new RowRendererWithIndicesFromColumn<Object>(rowRenderer, DataCell::toString);
        } else {
            return new RowRendererWithIndicesCounter<Object>(rowRenderer, index -> Long.toString(index));
        }
    }

    /**
     * @return the content types given by the current renderers as an array of the same length as the displayed columns.
     */
    public String[] getColumnContentTypes() {
        return IntStream.range(0, m_displayedColumns.length) //
            .mapToObj(this::getConstructedDataValueRenderer) //
            .map(DataValueRenderer::getContentType) //
            .map(DataCellContentType::toString) //
            .toArray(String[]::new);
    }

}
