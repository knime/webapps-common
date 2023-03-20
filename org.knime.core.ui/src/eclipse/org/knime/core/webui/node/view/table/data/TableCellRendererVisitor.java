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
 *   Mar 16, 2023 (hornm): created
 */
package org.knime.core.webui.node.view.table.data;

import org.knime.core.data.DataCell;
import org.knime.core.data.DataRow;
import org.knime.core.webui.node.view.table.data.render.DataValueImageRenderer;
import org.knime.core.webui.node.view.table.data.render.DataValueImageRendererRegistry;
import org.knime.core.webui.node.view.table.data.render.DataValueRenderer;
import org.knime.core.webui.node.view.table.data.render.DataValueTextRenderer;

/**
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 * @author Robin Gerling, KNIME GmbH, Konstanz, Germany
 */
public class TableCellRendererVisitor implements TableCellVisitor<String[][]> {

    private String[][] m_cells;

    private DataValueRenderer[] m_renderers;

    private DataValueImageRendererRegistry m_rendererRegistry;

    private String m_tableId;

    /**
     *
     * @param numRows the number of rows to get
     * @param numCols the number of columns to get
     * @param rendererRegistry lazily supplied image content for cells that are rendered into images (cleared and
     *            filled)
     * @param tableId the table to add the renderer for; must be globally unique
     * @param renderers the renderers for each column
     */
    public TableCellRendererVisitor(final int numRows, final int numCols,
        final DataValueImageRendererRegistry rendererRegistry, final String tableId,
        final DataValueRenderer[] renderers) {
        this.m_rendererRegistry = rendererRegistry;
        this.m_tableId = tableId;
        m_cells = new String[numRows][numCols + ROWKEY_ROWINDEX_OFFSET];
        m_renderers = renderers;
    }

    @Override
    public void visitRow(final int rowIdx, final DataRow row) {
        final var rowIndex = row.getCell(0).toString();
        final var rowKey = row.getKey().toString();
        m_cells[rowIdx][0] = rowIndex;
        m_cells[rowIdx][1] = rowKey;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void visitCell(final int rowIdx, final int colIdx, final DataCell cell) {
        if (cell.isMissing()) {
            m_cells[rowIdx][colIdx + ROWKEY_ROWINDEX_OFFSET] = null;
        } else {
            m_cells[rowIdx][colIdx + ROWKEY_ROWINDEX_OFFSET] =
                renderCell(cell, m_renderers[colIdx], m_rendererRegistry, m_tableId);
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public String[][] getResult() {
        return m_cells;
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

}
