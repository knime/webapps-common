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

import java.util.function.Supplier;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import org.knime.core.data.DataCell;
import org.knime.core.data.DataRow;
import org.knime.core.data.container.CloseableRowIterator;

/**
 *
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 * @author Robin Gerling, KNIME GmbH, Konstanz, Germany
 * @param <T> the type of the visitor
 */
public interface TableCellVisitor<T> {

    /**
     * Offset of the column index, because the row key/index are also sent to the frontend when not requested
     */
    int ROWKEY_ROWINDEX_OFFSET = 2;

    /**
     *
     * @param colIndices the indices of the columns that are to be displayed
     * @param numRows the number of rows to get
     * @param rowIteratorSupplier the iterator that supplies the rows
     * @param visitors the visitors for which to compute cell/row data
     */
    static void iterateTable(final int[] colIndices, final int numRows,
        final Supplier<CloseableRowIterator> rowIteratorSupplier, final TableCellVisitor<?>... visitors) {
        try (final var iterator = rowIteratorSupplier.get()) {
            IntStream.range(0, numRows).forEach(rowIndex -> {
                final var row = iterator.next();
                IntStream.range(0, colIndices.length).forEach(colIndex -> {
                    var colIndexFiltered = colIndices[colIndex];
                    var cell = row.getCell(colIndexFiltered);
                    Stream.of(visitors).forEach(visitor -> visitor.visitCell(rowIndex, colIndex, cell));
                });
                Stream.of(visitors).forEach(visitor -> visitor.visitRow(rowIndex, row));
            });
        }
    }

    /**
     * @param rowIdx the index of the current row
     * @param row the data of the current row
     */
    void visitRow(final int rowIdx, final DataRow row);

    /**
     *
     * @param rowIdx the index of the current row
     * @param colIdx the index of the current column
     * @param cell the data contained in the table at the current rowIdx and colIdx
     */
    void visitCell(int rowIdx, int colIdx, DataCell cell);

    /**
     *
     * @return the collected cell data
     */
    T getResult();
}
