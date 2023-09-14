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
 *   Sep 13, 2023 (hornm): created
 */
package org.knime.core.webui.node.view.table;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.WeakHashMap;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.knime.core.data.RowKey;
import org.knime.core.node.property.hilite.HiLiteHandler;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.node.workflow.NodeContainer;
import org.knime.core.node.workflow.SingleNodeContainer;
import org.knime.core.node.workflow.SubNodeContainer;
import org.knime.core.webui.node.NodePortWrapper;
import org.knime.core.webui.node.NodeWrapper;
import org.knime.core.webui.node.view.table.selection.SelectionTranslationService;

/**
 * Manages {@link TableView}-instances.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 * @param <N>
 */
public final class TableViewManager<N extends NodeWrapper> {

    private final Map<N, SelectionTranslationService> m_selectionServices = new WeakHashMap<>();

    private final Function<N, TableView> m_getTableView;

    /**
     * @param getTableView a function that returns the table view if there is one, otherwise {@code null}
     */
    public TableViewManager(final Function<N, TableView> getTableView) {
        m_getTableView = getTableView;
    }

    /**
     * Helper to call the {@link SelectionTranslationService#toRowKeys(List)}.
     *
     * @param node the node wrapper to call the data service for
     * @param selection the selection to translate
     * @return the result of the translation, i.e., an array of row keys
     * @throws IOException if applying the selection failed
     */
    public Set<RowKey> callSelectionTranslationService(final N node, final List<String> selection)
        throws IOException {
        var service = getSelectionTranslationService(node).orElse(null);
        if (service != null) {
            return service.toRowKeys(selection);
        } else {
            // if no selection translation service is available,
            // turn the list of strings directly into a list of row keys
            return selection.stream().map(RowKey::new).collect(Collectors.toSet());
        }
    }

    /**
     * Helper to call the {@link SelectionTranslationService#fromRowKeys(Set)}.
     *
     * @param node the node wrapper to call the data service for
     * @param rowKeys the row keys to translate
     * @return the result of the translation, i.e., a text-representation of the selection
     * @throws IOException if the translation failed
     */
    public List<String> callSelectionTranslationService(final N node, final Set<RowKey> rowKeys) throws IOException {
        var service =
            getSelectionTranslationService(node).filter(SelectionTranslationService.class::isInstance).orElse(null);
        if (service != null) {
            return service.fromRowKeys(rowKeys);
        } else {
            // if no selection translation service is available, we just turn the row keys into strings
            return rowKeys.stream().map(RowKey::toString).toList();
        }
    }

    private Optional<SelectionTranslationService> getSelectionTranslationService(final N node) {
        return Optional.ofNullable(
            m_selectionServices.computeIfAbsent(node, k -> createSelectionTranslationService(node).orElse(null)));
    }

    private Optional<? extends SelectionTranslationService> createSelectionTranslationService(final N node) {
        final var tableView = m_getTableView.apply(node);
        if (tableView == null) {
            throw new IllegalArgumentException(
                "Trying to call a selection translation service of a node view which is not a table view.");
        }
        return tableView.createSelectionTranslationService();
    }

    /**
     * @param nw
     * @return the {@link HiLiteHandler} for the given node/port or an empty optional if there is none, because it's not
     *         a {@link TableView}
     */
    public Optional<HiLiteHandler> getHiLiteHandler(final N nw) {
        var tableView = m_getTableView.apply(nw);
        if (tableView == null) {
            return Optional.empty();
        }
        if (nw instanceof NodePortWrapper) {
            return getOutHiLiteHandler(nw.get(), tableView.getPortIndex());
        } else {
            return getInHiLiteHandler(nw.get(), tableView.getPortIndex());
        }
    }

    /**
     * @param nc
     * @param portIndex the input port index, excluding the flow variable port
     * @return the input {@link HiLiteHandler} at the given port or an empty optional if there is none
     */
    private static Optional<HiLiteHandler> getInHiLiteHandler(final NodeContainer nc, final int portIndex) {
        if (portIndex + 1 >= nc.getNrInPorts()) {
            return Optional.empty();
        }
        if (nc instanceof NativeNodeContainer nnc) {
            // TODO see UIEXT-51
            return Optional.of(nnc.getNodeModel().getInHiLiteHandler(portIndex));
        } else if (nc instanceof SubNodeContainer snc) {
            return Optional.of(snc.getInHiliteHandler(portIndex + 1));
        }
        return Optional.empty();
    }

    /**
     * @param nc
     * @param portIndex the output port index, excluding the flow variable port
     * @return the output {@link HiLiteHandler} at the given port or an empty optional if there is none
     */
    public static Optional<HiLiteHandler> getOutHiLiteHandler(final NodeContainer nc, final int portIndex) {
        if (portIndex + 1 >= nc.getNrOutPorts()) {
            return Optional.empty();
        }
        if (nc instanceof SingleNodeContainer snc) {
            return Optional.of(snc.getOutputHiLiteHandler(portIndex + 1));
        }
        return Optional.empty();
    }

    /**
     * Clears the cached selection services.
     */
    public void clearCaches() {
        m_selectionServices.clear();
    }

}
