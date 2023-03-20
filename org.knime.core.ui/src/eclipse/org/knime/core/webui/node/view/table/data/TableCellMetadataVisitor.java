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

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.knime.core.data.DataCell;
import org.knime.core.data.DataRow;
import org.knime.core.data.MissingCell;

/**
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 * @author Robin Gerling, KNIME GmbH, Konstanz, Germany
 */
public class TableCellMetadataVisitor implements TableCellVisitor<List<Map<String, CellMetadata>>> {

    private List<Map<String, CellMetadata>> m_metadata;

    private boolean m_hasAtLeastOneEntry;

    /**
     * @param numRows the number of rows to get
     */
    public TableCellMetadataVisitor(final int numRows) {
        m_metadata = new ArrayList<>(numRows);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void visitCell(final int rowIdx, final int colIdx, final DataCell cell) {
        if (cell.isMissing()) {
            final var missingCellErrorMsg = ((MissingCell)cell).getError();
            if (missingCellErrorMsg != null) {
                final var colIndex = String.valueOf(colIdx + ROWKEY_ROWINDEX_OFFSET);

                if (m_metadata.size() == rowIdx) {
                    final var rowMetadata = new HashMap<String, CellMetadata>();
                    rowMetadata.put(colIndex, () -> missingCellErrorMsg);
                    m_metadata.add(rowMetadata);
                } else {
                    final var rowMetadata = m_metadata.get(rowIdx);
                    rowMetadata.put(colIndex, () -> missingCellErrorMsg);
                    m_metadata.set(rowIdx, rowMetadata);
                }
            }
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public List<Map<String, CellMetadata>> getResult() {
        return m_hasAtLeastOneEntry ? m_metadata : new ArrayList<>(0);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void visitRow(final int rowIdx, final DataRow row) {
        final var addedMetadataForCurrentRow = m_metadata.size() - 1 == rowIdx;
        if (addedMetadataForCurrentRow) {
            m_hasAtLeastOneEntry = true;
        } else {
            m_metadata.add(null);
        }
    }

}
