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
 *   Mar 12, 2023 (hornm): created
 */
package org.knime.core.webui.node.view.table.data;

import java.util.function.Function;
import java.util.function.Supplier;

import org.knime.core.data.DataColumnSpecCreator;
import org.knime.core.data.DataTableSpec;
import org.knime.core.data.RowKey;
import org.knime.core.data.TableBackend.AppendConfig;
import org.knime.core.data.def.DefaultRow;
import org.knime.core.data.def.LongCell;
import org.knime.core.node.BufferedDataTable;
import org.knime.core.node.CanceledExecutionException;
import org.knime.core.node.ExecutionContext;
import org.knime.core.node.InternalTableAPI;

/**
 * Wraps another {@link BufferedDataTable}-supplier and preprends a index column to it. It also caches the newly created
 * table with the index column and updates it as soon as the original table (supplied by the wrapped table supplier)
 * chnages.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
class TableWithIndicesSupplier implements Function<ExecutionContext, BufferedDataTable> {

    private final Supplier<BufferedDataTable> m_originalSupplier;

    private BufferedDataTable m_originalTable;

    private BufferedDataTable m_tableWithIndices;

    TableWithIndicesSupplier(final Supplier<BufferedDataTable> originalSupplier) {
        m_originalSupplier = originalSupplier;
    }

    @Override
    public BufferedDataTable apply(final ExecutionContext exec) {
        final var originalTable = m_originalSupplier.get();
        if (m_originalTable != originalTable) {
            final var appendConfig = AppendConfig.rowIDsFromTable(1);
            final var indexColumnName = determineIndexColumnName(originalTable.getSpec());
            try {
                final var indices = createIndexColumn(originalTable.size(), indexColumnName, exec);
                m_tableWithIndices = InternalTableAPI.append(exec, appendConfig, indices, originalTable);
            } catch (CanceledExecutionException ex) { // NOSONAR
                // can never happen
                return null;
            }
            m_originalTable = originalTable;
        }
        return m_tableWithIndices;
    }

    private static String determineIndexColumnName(final DataTableSpec spec) {
        return DataTableSpec.getUniqueColumnName(spec, "<index>");
    }

    private static BufferedDataTable createIndexColumn(final long size, final String name,
        final ExecutionContext exec) {
        final var indicesColumnSpec = new DataColumnSpecCreator(name, LongCell.TYPE).createSpec();
        final var indicesSpec = new DataTableSpec(indicesColumnSpec);
        final var container = exec.createDataContainer(indicesSpec, false);
        for (var i = 0l; i < size; i++) {
            container.addRowToTable(new DefaultRow(new RowKey(Long.toString(i)), new LongCell(i)));
        }
        container.close();
        return container.getTable();
    }

    void clear(final ExecutionContext exec) {
        m_originalTable = null;
        if (m_tableWithIndices != null) {
            exec.clearTable(m_tableWithIndices);
            m_tableWithIndices = null;
        }
    }

}
