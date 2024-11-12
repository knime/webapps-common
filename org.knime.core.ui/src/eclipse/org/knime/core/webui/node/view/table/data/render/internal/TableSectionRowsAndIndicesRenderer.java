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
import java.util.stream.IntStream;

import org.knime.core.node.BufferedDataTable;
import org.knime.core.util.Pair;

/**
 * This class is used to apply a {@link RowRenderer} and a {@link IndexExtractor} to a section from/to an index in a
 * table.
 *
 * @author Paul Bärnreuther
 * @param <R> output type
 */
public final class TableSectionRowsAndIndicesRenderer<R> extends TableSectionRenderer<Pair<List<List<R>>, long[]>> {

    private final RowRenderer<R> m_rowRenderer;

    private final IndexExtractor m_indexExtractor;

    /**
     * @param rowRenderer which is applied to each row
     * @param indexExtractor which extracts the index from the row
     * @param fromIndex from which to start
     * @param toIndex until which (inclusive) rows should be rendered
     */
    public TableSectionRowsAndIndicesRenderer(final RowRenderer<R> rowRenderer, final IndexExtractor indexExtractor,
        final long fromIndex, final long toIndex) {
        super(fromIndex, toIndex);
        m_rowRenderer = rowRenderer;
        m_indexExtractor = indexExtractor;
    }

    @Override
    public Pair<List<List<R>>, long[]> renderRows(final BufferedDataTable table) {
        final var size = getSize();
        final List<List<R>> out = new ArrayList<>(size);
        final List<Long> indices = new ArrayList<>(size);
        fillOutput(table, (row, rowIndex) -> {
            out.add(m_rowRenderer.renderRow(row, rowIndex));
            indices.add(m_indexExtractor.extractIndex(row, rowIndex));
        });
        return new Pair<>(out, toArray(indices));
    }

    private static long[] toArray(final List<Long> indices) {
        return indices.stream().mapToLong(i -> i).toArray();
    }

    @Override
    protected int[] getMaterializedColumnIndices() {
        return IntStream.concat(//
            IntStream.of(m_indexExtractor.getMaterializedColumnIndices()), //
            IntStream.of(m_rowRenderer.getMaterializedColumnIndices()) //
        ).distinct().toArray();
    }

}
