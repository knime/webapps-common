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
package org.knime.core.webui.node.port;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.WeakHashMap;
import java.util.function.Supplier;

import org.knime.core.node.port.PortType;
import org.knime.core.webui.data.DataServiceProvider;
import org.knime.core.webui.node.AbstractNodeUIManager;
import org.knime.core.webui.node.NodePortWrapper;
import org.knime.core.webui.node.util.NodeCleanUpCallback;
import org.knime.core.webui.page.Page;

/**
 * Manages (web-ui) port view instances and provides associated functionality.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 * @author Benjamin Moser, KNIME GmbH, Konstanz, Germany
 */
public final class PortViewManager extends AbstractNodeUIManager<NodePortWrapper> {

    private static PortViewManager instance;

    private static final Map<PortType, PortViews> m_portViews = new HashMap<>();

    private final Map<NodePortWrapper, PortView> m_portViewMap = new WeakHashMap<>();

    /**
     * Associate a {@link PortType} with one or several {@link PortViewDescriptor}s.
     *
     * @param portType The given port type.
     * @param viewDescriptors The views to associate with this port type.
     * @param configuredIndices Indices into {@code viewDescriptors} of views that are to be displayed when the node is
     *            in "configured" state.
     * @param executedIndices Indices into {@code viewDescriptors} of views that are to be displayed when the node is in
     *            "executed" state.
     */
    public static void registerPortViews(final PortType portType, final List<PortViewDescriptor> viewDescriptors,
        final List<Integer> configuredIndices, final List<Integer> executedIndices) {
        m_portViews.put(portType, new PortViews(viewDescriptors, configuredIndices, executedIndices));
    }

    /**
     * Returns the singleton instance for this class.
     *
     * @return the singleton instance
     */
    public static synchronized PortViewManager getInstance() {
        if (instance == null) {
            instance = new PortViewManager();
        }
        return instance;
    }

    /**
     * @param portType
     * @param viewIdx
     * @return the {@link PortViewDescriptor} for the given port type and view-index or an empty optional if there isn't
     *         any
     */
    public static Optional<PortViewDescriptor> getPortViewDescriptor(final PortType portType, final int viewIdx) {
        return Optional.of(m_portViews.get(portType)).map(views -> {
            try {
                return views.viewDescriptors().get(viewIdx);
            } catch (IndexOutOfBoundsException e) { // NOSONAR
                return null;
            }
        });
    }

    /**
     * Obtain views associated to a given port type.
     *
     * @param portType The port type.
     * @return A {@link PortViews} instance, or {@code null} if none available.
     */
    public static PortViews getPortViews(final PortType portType) {
        return m_portViews.get(portType);
    }

    private PortViewManager() {
        // singleton
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected Page createPage(final NodePortWrapper nodePortWrapper) {
        return getPortView(nodePortWrapper).getPage();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected DataServiceProvider getDataServiceProvider(final NodePortWrapper nodePortWrapper) {
        return getPortView(nodePortWrapper);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public PageType getPageType() {
        return PageType.PORT;
    }

    /**
     * Obtain the {@link PortView} as identified by...
     * <ul>
     * <li>Node container</li>
     * <li>Port index</li>
     * <li>View index</li>
     * </ul>
     *
     * The port view will be either retrieved from a cache or newly created if it hasn't been accessed, yet.
     *
     * @param nodePortWrapper identifying the requested port view
     * @return a (new) port view instance
     * @throws NoSuchElementException if there is no port view for the given node-port combination
     */
    @SuppressWarnings({"unchecked", "rawtypes"})
    public PortView getPortView(final NodePortWrapper nodePortWrapper) {
        var portView = m_portViewMap.get(nodePortWrapper); // NOSONAR
        if (portView != null) {
            return portView;
        }
        var nc = nodePortWrapper.get();
        var portIdx = nodePortWrapper.getPortIdx();
        if (portIdx < 0 || portIdx >= nc.getNrOutPorts()) {
            throw new NoSuchElementException("No port at index " + portIdx);
        }
        var outPort = nc.getOutPort(portIdx);
        var portType = outPort.getPortType();
        var viewIdx = nodePortWrapper.getViewIdx();

        var viewDescriptor = getPortViewDescriptor(portType, viewIdx).orElseThrow();
        try {
            PortContext.pushContext(outPort);

            PortView view;
            if (viewDescriptor.viewFactory() instanceof PortSpecViewFactory factory) {
                view = factory.createPortView(outPort.getPortObjectSpec());
            } else if (viewDescriptor.viewFactory() instanceof PortViewFactory factory) {
                view = factory.createPortView(outPort.getPortObject());
            } else {
                throw new NoSuchElementException("Port view factory is of unexpected type");
            }

            m_portViewMap.put(nodePortWrapper, view);

            NodeCleanUpCallback.builder(nc, () -> m_portViewMap.remove(nodePortWrapper))
                    .cleanUpOnNodeStateChange(true).build();
            return view;
        } finally {
            PortContext.removeLastContext();
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected boolean shouldCleanUpPageAndDataServicesOnNodeStateChange() {
        return true;
    }

    /**
     * For testing purposes only.
     */
    int getPortViewMapSize() {
        return m_portViewMap.size();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected <T> T getWithContext(final NodePortWrapper nodeWrapper, final Supplier<T> supplier) {
        PortContext.pushContext(nodeWrapper.get().getOutPort(nodeWrapper.getPortIdx()));
        try {
            return supplier.get();
        } finally {
            PortContext.removeLastContext();
        }
    }

    /**
     * Describes the views associated with some {@link PortType}.
     *
     * @param viewDescriptors Individual views associated with this {@link PortType}.
     * @param configuredIndices Views that are available when the node is in "configured" state. Indices into
     *            {@code viewDescriptors}.
     * @param executedIndices Views that are available when the node is in "executed" state. Indices into
     *            {@code viewDescriptors}.
     */
    public record PortViews(List<PortViewDescriptor> viewDescriptors, List<Integer> configuredIndices,
        List<Integer> executedIndices) {
        //
    }

    /**
     * @param label the view display label
     * @param viewFactory the factory to create the view (either {@link PortSpecViewFactory} or
     *            {@link PortViewFactory}).
     */
    public record PortViewDescriptor(String label, Object viewFactory) {
        //
    }

}