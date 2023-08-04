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
 *   Aug 4, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.view.table.data.render.internal;

import java.util.ArrayList;
import java.util.List;

import org.knime.core.data.container.filter.TableFilter;
import org.knime.core.node.BufferedDataTable;

/**
 * This class is used to apply a {@link RowRenderer} to a section from/to an index in a table.
 *
 * @author Paul Bärnreuther
 * @param <R> output type
 */
public final class TableSectionRenderer<R> {

    private final RowRenderer<R> m_rowRenderer;

    private final long m_fromIndex;

    private final long m_toIndex;

    /**
     * @param rowRenderer which is applied to each row
     * @param fromIndex from which to start
     * @param toIndex until which (inclusive) rows should be rendered
     */
    public TableSectionRenderer(final RowRenderer<R> rowRenderer, final long fromIndex, final long toIndex) {
        m_rowRenderer = rowRenderer;
        m_fromIndex = fromIndex;
        m_toIndex = toIndex;
    }

    /**
     * @param table
     * @return the result of the row renderer for all rows in the section
     */
    public List<List<R>> renderRows(final BufferedDataTable table) {
        final var size = (int)getSize();
        List<List<R>> out = new ArrayList<List<R>>(size);
        if (size > 0) {
            try (final var iterator = table.filter(getFilter()).iterator()) {
                iterator.forEachRemaining(row -> out.add(m_rowRenderer.renderRow(row)));
            }
        }
        return out;
    }

    private long getSize() {
        return m_toIndex - m_fromIndex + 1;
    }

    private int[] getMaterializedColumnIndices() {
        return m_rowRenderer.getMaterializedColumnIndices();
    }

    private TableFilter getFilter() {
        final var filter = new TableFilter.Builder();
        filter.withFromRowIndex(m_fromIndex); // will throw exception when fromIndex < 0
        filter.withToRowIndex(m_toIndex); // will throw exception when toIndex < fromIndex
        filter.withMaterializeColumnIndices(getMaterializedColumnIndices());
        return filter.build();
    }
}
