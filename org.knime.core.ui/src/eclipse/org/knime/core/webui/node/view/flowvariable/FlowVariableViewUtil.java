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
 *   Sep 4, 2024 (hornm): created
 */
package org.knime.core.webui.node.view.flowvariable;

import static org.knime.core.webui.node.view.table.RowHeightPersistorUtil.LEGACY_CUSTOM_ROW_HEIGHT_COMPACT;

import java.util.Arrays;
import java.util.Collection;
import java.util.concurrent.atomic.AtomicLong;
import java.util.function.BiFunction;
import java.util.function.Function;

import org.knime.core.data.DataCell;
import org.knime.core.data.DataColumnSpecCreator;
import org.knime.core.data.DataRow;
import org.knime.core.data.DataTableSpec;
import org.knime.core.data.DataTableSpecCreator;
import org.knime.core.data.DataType;
import org.knime.core.data.RowKey;
import org.knime.core.data.def.DefaultRow;
import org.knime.core.data.def.StringCell;
import org.knime.core.node.BufferedDataContainer;
import org.knime.core.node.BufferedDataTable;
import org.knime.core.webui.data.DataServiceContext;
import org.knime.core.webui.data.InitialDataService;
import org.knime.core.webui.node.dialog.defaultdialog.setting.selection.SelectionMode;
import org.knime.core.webui.node.view.table.TableViewViewSettings;
import org.knime.core.webui.node.view.table.TableViewViewSettings.AUTO_SIZE_COLUMNS;
import org.knime.core.webui.node.view.table.TableViewViewSettings.RowHeightMode;
import org.knime.core.webui.node.view.table.TableViewViewSettings.VerticalPaddingMode;

/**
 * Utility class to create an {@link InitialDataService}.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 * @author Kai Franze, KNIME GmbH, Germany
 */
public final class FlowVariableViewUtil {

    private static final DataTableSpec FLOW_VARIABLE_TABLE_SPEC = new DataTableSpecCreator() //
        .addColumns( //
            new DataColumnSpecCreator("Owner ID", StringCell.TYPE).createSpec(), //
            new DataColumnSpecCreator("Data Type", StringCell.TYPE).createSpec(), //
            new DataColumnSpecCreator("Variable Name", StringCell.TYPE).createSpec(), //
            new DataColumnSpecCreator("Value", StringCell.TYPE).createSpec()) //
        .createSpec();

    private FlowVariableViewUtil() {
        // utility class
    }

    /**
     * Creates a {@link BufferedDataTable} that contains the given list of
     * {@link org.knime.core.node.workflow.FlowVariable}s.
     *
     * @param flowVariables The list of {@link org.knime.core.node.workflow.FlowVariable}s to add to the table
     * @return The {@link BufferedDataTable}
     */
    public static BufferedDataTable
        getBufferedTable(final Collection<org.knime.core.node.workflow.FlowVariable> flowVariables) {
        final var exec = DataServiceContext.get().getExecutionContext();
        final var container = exec.createDataContainer(FLOW_VARIABLE_TABLE_SPEC);
        addFlowVariablesToContainer(container, flowVariables);
        container.close();
        // To make sure the returned table only contains empty column domains
        return exec.createSpecReplacerTable(container.getTable(), FLOW_VARIABLE_TABLE_SPEC);
    }

    private static void addFlowVariablesToContainer(final BufferedDataContainer container,
        final Collection<org.knime.core.node.workflow.FlowVariable> flowVariables) {
        flowVariables.stream()//
            .map(FlowVariable::create)//
            .map(withCounter((counter, variable) -> asDataRow(RowKey.createRowKey(counter),
                variable.getOwnerNodeId(), variable.getType(), variable.getName(), variable.getValue())))//
            .forEach(container::addRowToTable);
    }

    private static <T, R> Function<T, R> withCounter(final BiFunction<Long, T, R> function) {
        final var counter = new AtomicLong(0);
        return item -> function.apply(counter.getAndIncrement(), item);
    }

    private static DataRow asDataRow(final RowKey key, final String... values) {
        return new DefaultRow(key, Arrays.stream(values) //
            .map(value -> value != null ? new StringCell(value) : DataType.getMissingCell()) //
            .toArray(DataCell[]::new));
    }

    /**
     * @return The {@link TableViewViewSettings} for the flow variable table.
     */
    public static TableViewViewSettings getSettings() {
        final var settings = new TableViewViewSettings(FLOW_VARIABLE_TABLE_SPEC);

        // Default settings also used in 'TableSpecViewFactory'
        settings.m_enableGlobalSearch = false;
        settings.m_title = "";
        settings.m_enableSortingByHeader = false;
        settings.m_enableColumnSearch = false;
        settings.m_rowHeightMode = RowHeightMode.CUSTOM;
        settings.m_verticalPaddingMode = VerticalPaddingMode.COMPACT;
        settings.m_customRowHeight = LEGACY_CUSTOM_ROW_HEIGHT_COMPACT;
        settings.m_selectionMode = SelectionMode.OFF;
        settings.m_enableRendererSelection = false;
        settings.m_showRowKeys = false;
        settings.m_showRowIndices = false;
        settings.m_skipRemainingColumns = true;
        settings.m_showOnlySelectedRowsConfigurable = false;

        // Needs to be enabled to not lazily fetch data, 'ExpressionFlowVariableNodeDialog'
        // wouldn't show anything otherwise
        settings.m_enablePagination = true;

        // Custom settings for flow variable view
        settings.m_showColumnDataType = false;
        settings.m_showTableSize = false;
        settings.m_autoSizeColumnsToContent = AUTO_SIZE_COLUMNS.FIT_CONTENT_AND_HEADER;
        settings.m_enablePagination = true;

        return settings;
    }

}
