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
 *   Nov 25, 2021 (hornm): created
 */
package org.knime.gateway.impl.service.events;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.function.BiConsumer;
import java.util.function.BiFunction;
import java.util.function.Consumer;

import org.knime.core.data.RowKey;
import org.knime.core.node.NodeLogger;
import org.knime.core.node.property.hilite.HiLiteHandler;
import org.knime.core.node.property.hilite.HiLiteListener;
import org.knime.core.node.property.hilite.KeyEvent;
import org.knime.core.node.workflow.NodeID;
import org.knime.core.node.workflow.SingleNodeContainer;
import org.knime.core.node.workflow.SubNodeContainer;
import org.knime.core.util.Pair;
import org.knime.core.webui.node.NodeWrapper;
import org.knime.core.webui.node.view.table.TableViewManager;
import org.knime.gateway.api.entity.NodeIDEnt;

/**
 * An event source that emits selection events (i.e. hiliting events) to the given event consumer.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 * @param <N>
 *
 * @since 4.5
 */
public final class SelectionEventSource<N extends NodeWrapper> extends EventSource<N, SelectionEvent> {

    /**
     * The mode of selection event.
     */
    @SuppressWarnings("javadoc")
    public enum SelectionEventMode {
            ADD, REMOVE, REPLACE
    }

    private final Map<NodeID, Pair<HiLiteHandler, HiLiteListener>> m_hiLiteListeners = new HashMap<>();

    private final TableViewManager<N> m_tableViewManager;

    /**
     * @param eventConsumer selection events will be forwarded to this consumer
     * @param tableViewManager
     */
    public SelectionEventSource(final BiConsumer<String, Object> eventConsumer,
        final TableViewManager<N> tableViewManager) {
        super(eventConsumer);
        m_tableViewManager = tableViewManager;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected String getName() {
        return "SelectionEvent";
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public Optional<SelectionEvent> addEventListenerAndGetInitialEventFor(final N nw) {
        var handler = m_tableViewManager.getHiLiteHandler(nw).orElse(null);
        if (handler == null) {
            return Optional.empty();
        }
        // guaranteed to be a single node container because
        // * node views (and, hence, selection) only available for native nodes
        // * in case of port views on metanode output ports, the actual original node the port belongs to is provided
        //   (see CEFNodeView(NodeContainer), ...)
        var snc = (SingleNodeContainer)nw.get();
        synchronized (handler) {
            var hiLitKeys = handler.getHiLitKeys();
            var listener = new PerNodeWrapperHiliteListener(this::sendEvent, nw, this::translateSelections);
            SelectionEvent selectionEvent = null;
            selectionEvent = listener.createSelectionEvent(SelectionEventMode.ADD, hiLitKeys);
            var nodeID = snc.getID();
            if (!m_hiLiteListeners.containsKey(nodeID)) {
                handler.addHiLiteListener(listener);
                m_hiLiteListeners.put(snc.getID(), Pair.create(handler, listener));
            }
            return Optional.of(selectionEvent);
        }
    }

    private SelectionTranslationResult translateSelections(final N nw, final Set<RowKey> rowKeys) {
        try {
            return new SelectionTranslationResult(m_tableViewManager.callSelectionTranslationService(nw, rowKeys),
                null);
        } catch (IOException ex) {
            NodeLogger.getLogger(this.getClass()).error("Selection event couldn't be created", ex);
            return new SelectionTranslationResult(null, ex.getMessage());
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void removeAllEventListeners() {
        m_hiLiteListeners.values().forEach(p -> p.getFirst().removeHiLiteListener(p.getSecond()));
        m_hiLiteListeners.clear();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void removeEventListener(final N nw) {
        var snc = nw.get();
        var nodeId = snc.getID();
        var p = m_hiLiteListeners.get(nodeId);
        p.getFirst().removeHiLiteListener(p.getSecond());
        m_hiLiteListeners.remove(nodeId);
    }

    /**
     * The total number of event listener registered for the event source. Mainly for testing purposes.
     *
     * @return the total number of event listeners registered
     */
    public int getNumEventListeners() {
        return m_hiLiteListeners.size();
    }

    /**
     * Forwards selection events to the given hilite-handler.
     *
     * @param hiLiteHandler hilite-handler to use
     * @param nodeId the id of the node the hilite-handler is associated with
     * @param selectionEventMode the selection event mode
     * @param async if {@code true}, it will return immediately; if {@code false} it will return once the selection has
     *            been processed completely (i.e. once all associated nodes have received the selection change, too).
     * @param rowKeys the keys to be (un-)selected
     */
    public static void processSelectionEvent(final HiLiteHandler hiLiteHandler, final NodeID nodeId,
        final SelectionEventMode selectionEventMode, final boolean async, final Set<RowKey> rowKeys) {
        final var keyEvent = new KeyEvent(nodeId, rowKeys);
        switch (selectionEventMode) {
            case ADD:
                hiLiteHandler.fireHiLiteEvent(keyEvent, async);
                break;
            case REMOVE:
                hiLiteHandler.fireUnHiLiteEvent(keyEvent, async);
                break;
            case REPLACE:
                hiLiteHandler.fireReplaceHiLiteEvent(keyEvent, async);
                break;
            default:
        }
    }

    private class PerNodeWrapperHiliteListener implements HiLiteListener {

        private final Consumer<SelectionEvent> m_eventConsumer;

        private final NodeID m_nodeId;

        private final String m_projectId;

        private final String m_workflowId;

        private final String m_nodeIdString;

        private final N m_nw;

        private final BiFunction<N, Set<RowKey>, SelectionTranslationResult> m_translateSelection;

        PerNodeWrapperHiliteListener(final Consumer<SelectionEvent> eventConsumer, final N nw,
            final BiFunction<N, Set<RowKey>, SelectionTranslationResult> translateSelection) {
            m_eventConsumer = eventConsumer;
            m_nw = nw;
            m_translateSelection = translateSelection;
            var snc = m_nw.get();
            var parent = snc.getParent();
            var projectWfm = parent.getProjectWFM();
            m_projectId = projectWfm.getNameWithID();
            NodeID ncParentId = parent.getDirectNCParent() instanceof SubNodeContainer
                ? ((SubNodeContainer)parent.getDirectNCParent()).getID() : parent.getID();
            m_workflowId = new NodeIDEnt(ncParentId).toString();
            m_nodeId = snc.getID();
            m_nodeIdString = new NodeIDEnt(m_nodeId).toString();
        }

        @Override
        public void hiLite(final KeyEvent event) {
            consumeSelectionEvent(event, SelectionEventMode.ADD);
        }

        @Override
        public void unHiLite(final KeyEvent event) {
            consumeSelectionEvent(event, SelectionEventMode.REMOVE);
        }

        @Override
        public void unHiLiteAll(final KeyEvent event) {
            consumeSelectionEvent(new KeyEvent(event.getSource()), SelectionEventMode.REPLACE);
        }

        @Override
        public void replaceHiLite(final KeyEvent event) {
            consumeSelectionEvent(event, SelectionEventMode.REPLACE);
        }

        private void consumeSelectionEvent(final KeyEvent event, final SelectionEventMode mode) {
            // do not consume selection events that have been fired by the node this listener is registered on
            if (!m_nodeId.equals(event.getSource())) {
                m_eventConsumer.accept(createSelectionEvent(mode, event.keys()));
            }
        }

        private SelectionEvent createSelectionEvent(final SelectionEventMode mode, final Set<RowKey> keys) {
            SelectionTranslationResult result = m_translateSelection.apply(m_nw, keys);
            return createSelectionEvent(mode, result.selection, result.error);
        }

        private SelectionEvent createSelectionEvent(final SelectionEventMode mode, final List<String> selection,
            final String error) {
            return new SelectionEvent() { // NOSONAR

                @Override
                public SelectionEventMode getMode() {
                    return mode;
                }

                @Override
                public List<String> getSelection() {
                    return selection;
                }

                @Override
                public String getProjectId() {
                    return m_projectId;
                }

                @Override
                public String getWorkflowId() {
                    return m_workflowId;
                }

                @Override
                public String getNodeId() {
                    return m_nodeIdString;
                }

                @Override
                public String getError() {
                    return error;
                }

            };
        }
    }

    public static record SelectionTranslationResult(List<String> selection, String error) {

    }

}
