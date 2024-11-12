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
 *   Nov 12, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.view.table.data.render.internal;

import java.util.function.ObjLongConsumer;

import org.knime.core.data.DataRow;
import org.knime.core.data.container.filter.TableFilter;
import org.knime.core.node.BufferedDataTable;

/**
 * @param <R> the type of the row renderer
 * @author Paul Bärnreuther
 */
abstract class TableSectionRenderer<R> {

    private final long m_fromIndex;

    private final long m_toIndex;

    protected TableSectionRenderer(final long fromIndex, final long toIndex) {
        m_fromIndex = fromIndex;
        m_toIndex = toIndex;

    }

    protected int getSize() {
        // If we run into an integer overflow here, the table is misconfigured.
        return (int) (m_toIndex - m_fromIndex) + 1;
    }

    /**
     * @param table
     * @return the result of the row renderer for all rows in the section
     */
    abstract R renderRows(BufferedDataTable table);

    protected void fillOutput(final BufferedDataTable table, final ObjLongConsumer<DataRow> fillOutputRow) {

        if (getSize() > 0) {
            var rowIndex = m_fromIndex;
            try (final var iterator = table.filter(getFilter()).iterator()) {
                while (iterator.hasNext()) {
                    final var row = iterator.next();
                    fillOutputRow.accept(row, rowIndex);
                    rowIndex++;
                }
            }
        }
    }

    private TableFilter getFilter() {
        final var filter = new TableFilter.Builder();
        filter.withFromRowIndex(m_fromIndex); // will throw exception when fromIndex < 0
        filter.withToRowIndex(m_toIndex); // will throw exception when toIndex < fromIndex
        filter.withMaterializeColumnIndices(getMaterializedColumnIndices());
        return filter.build();
    }

    protected abstract int[] getMaterializedColumnIndices();

}
