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
 *   Jul 18, 2022 (hornm): created
 */
package org.knime.gateway.api.entity;

import java.util.Collections;
import java.util.List;
import java.util.function.BiConsumer;
import java.util.function.Supplier;

import org.knime.core.webui.node.NodePortWrapper;
import org.knime.core.webui.node.PageResourceManager.PageType;
import org.knime.core.webui.node.port.PortViewManager;
import org.knime.gateway.impl.service.events.SelectionEvent;
import org.knime.gateway.impl.service.events.SelectionEventSource;

/**
 * Port view entity containing the info required by the UI (i.e. frontend) to be able to display a port view.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
public class PortViewEnt extends NodeUIExtensionEnt<NodePortWrapper> {

    private final NodeInfoEnt m_info;

    private final List<String> m_initialSelection;

    /**
     * Helper to create a port with and at the same time initialize the {@link SelectionEventSource} while also
     * determining the initial selection.
     *
     * The listeners for the {@link SelectionEventSource} on the node are removed on node state change.
     *
     * @param npw
     * @param manager
     * @param eventConsumer consumer of the {@link SelectionEventSource}-events
     * @return a new port view ent instance
     */
    public static PortViewEnt createPortViewEntAndInitSelectionEventSource(final NodePortWrapper npw,
        final PortViewManager manager, final BiConsumer<String, Object> eventConsumer) {
        var initialSelectionSupplier = createInitialSelectionSupplierAndInitSelectionEventSource(npw, eventConsumer);
        return new PortViewEnt(npw, manager, initialSelectionSupplier);
    }

    /**
     * Creates a new initial selection supplier and initializes associated {@link SelectionEventSource}.
     *
     * @param npw the port to create the selection event source from
     * @param eventConsumer the event consumer that will receive the events emitted by the initialized event source
     * @return the initial selection supplier
     */
    @SuppressWarnings("unused")
    private static Supplier<List<String>> createInitialSelectionSupplierAndInitSelectionEventSource(
        final NodePortWrapper npw, final BiConsumer<String, Object> eventConsumer) {
        var selectionEventSource =
            new SelectionEventSource<>(eventConsumer, PortViewManager.getInstance().getTableViewManager());
        Supplier<List<String>> initialSelectionSupplier =
            () -> selectionEventSource.addEventListenerAndGetInitialEventFor(npw).map(SelectionEvent::getSelection)
                .orElse(Collections.emptyList());

        new NodeViewEnt.RemoveAllEventListenersOnNodeStateChange(npw.get(), selectionEventSource);

        return initialSelectionSupplier;
    }

    /**
     * @param wrapper
     * @param manager
     * @param initialSelectionSupplier supplies the initial selection; can be {@code null} if selection is not supported
     *            by the port view
     */
    public PortViewEnt(final NodePortWrapper wrapper, final PortViewManager manager,
        final Supplier<List<String>> initialSelectionSupplier) {
        super(wrapper, manager.getPageResourceManager(), manager.getDataServiceManager(), PageType.PORT);
        m_info = new NodeInfoEnt(wrapper.get());
        m_initialSelection = initialSelectionSupplier == null ? null : initialSelectionSupplier.get();
    }

    /**
     * @return custom styling of the iframe that displays the port view's page
     */
    public String getIFrameStyle() {
        return "border: none; width: 100%; height: 100%;";
    }

    /**
     * @return additional info for the node providing the view
     */
    public NodeInfoEnt getNodeInfo() {
        return m_info;
    }

    /**
     * @return the initial selection (e.g. a list of row keys)
     */
    public List<String> getInitialSelection() {
        return m_initialSelection;
    }
}
