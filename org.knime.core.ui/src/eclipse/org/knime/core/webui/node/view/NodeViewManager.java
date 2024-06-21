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
 *   Aug 24, 2021 (hornm): created
 */
package org.knime.core.webui.node.view;

import java.util.Map;
import java.util.Optional;
import java.util.WeakHashMap;

import org.knime.core.data.DataTableSpec;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeModel;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.workflow.ConnectionContainer.ConnectionType;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.node.workflow.NodeContainer;
import org.knime.core.node.workflow.NodeContext;
import org.knime.core.node.workflow.NodeOutPort;
import org.knime.core.webui.node.DataServiceManager;
import org.knime.core.webui.node.NodeWrapper;
import org.knime.core.webui.node.PagePathSegments;
import org.knime.core.webui.node.PageResourceManager;
import org.knime.core.webui.node.PageResourceManager.PageType;
import org.knime.core.webui.node.util.NodeCleanUpCallback;
import org.knime.core.webui.node.view.table.TableView;
import org.knime.core.webui.node.view.table.TableViewManager;

/**
 * Manages (web-ui) node view instances and provides associated functionality.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 *
 * @since 4.5
 */
public final class NodeViewManager {

    private static NodeViewManager instance;

    private final Map<NodeContainer, NodeView> m_nodeViewMap = new WeakHashMap<>();

    private final PageResourceManager<NodeWrapper> m_pageResourceManager = new PageResourceManager<>(PageType.VIEW,
        nw -> getNodeView(nw.get()).getPage(), this::getPagePathSegments, this::decomposePagePath, false);

    private final DataServiceManager<NodeWrapper> m_dataServiceManager =
        new DataServiceManager<>(nw -> getNodeView(nw.get()));

    private final TableViewManager<NodeWrapper> m_tableViewManager = new TableViewManager<>(this::getTableView);

    /**
     * Returns the singleton instance for this class.
     *
     * @return the singleton instance
     */
    public static synchronized NodeViewManager getInstance() {
        if (instance == null) {
            instance = new NodeViewManager();
        }
        return instance;
    }

    private NodeViewManager() {
        // singleton
    }

    /**
     * @param nc the node container to check
     * @return whether the node container provides a {@link NodeView}
     */
    public static boolean hasNodeView(final NodeContainer nc) {
        if (nc instanceof NativeNodeContainer nnc) {
            var nodeFactory = nnc.getNode().getFactory();
            return nodeFactory instanceof NodeViewFactory nodeViewFactory && nodeViewFactory.hasNodeView();
        } else {
            return false;
        }
    }

    /**
     * Gets the {@link NodeView} for given node container or creates it if it hasn't been created, yet.
     *
     * @param nc the node container create the node view from
     * @return a new node view instance
     * @throws IllegalArgumentException if the passed node container does not provide a node view
     */
    NodeView getNodeView(final NodeContainer nc) {
        if (!hasNodeView(nc)) {
            throw new IllegalArgumentException("The node " + nc.getNameWithID() + " doesn't provide a node view");
        }
        var nnc = (NativeNodeContainer)nc;
        var nodeView = m_nodeViewMap.get(nnc);
        if (nodeView != null) {
            return nodeView;
        }
        return createAndRegisterNodeView(nnc);
    }

    private TableView getTableView(final NodeWrapper n) {
        var nc = n.get();
        if (!hasNodeView(nc)) {
            return null;
        }
        var nodeView = getNodeView(nc);
        if (nodeView instanceof TableView tv) {
            return tv;
        } else {
            return null;
        }
    }

    /**
     * Updates the view settings of a already created node view (i.e. a node view that has already been requested via
     * {@link #getNodeView(NodeContainer)} at least once).
     *
     * Updating the view settings means to get the current node settings from the node and provide them to the view (via
     * {@link NodeView#loadValidatedSettingsFrom(org.knime.core.node.NodeSettingsRO)}.
     *
     * NOTE: The settings (values) being passed to the node view are already combined with upstream flow variables (in
     * case settings are overwritten by flow variables).
     *
     * @param nnc the node container to update the node view for
     * @throws InvalidSettingsException if settings couldn't be updated
     * @throws IllegalArgumentException if the passed node container does not provide a node view
     */
    public void updateNodeViewSettings(final NativeNodeContainer nnc) throws InvalidSettingsException {
        var nodeView = getNodeView(nnc);
        var viewSettings = nnc.getViewSettingsUsingFlowObjectStack();
        if (viewSettings.isPresent()) {
            NodeContext.pushContext(nnc);
            try {
                nodeView.loadValidatedSettingsFrom(viewSettings.get());
            } finally {
                NodeContext.removeLastContext();
            }
        }
    }

    private NodeView createAndRegisterNodeView(final NativeNodeContainer nnc) {
        @SuppressWarnings("unchecked")
        NodeViewFactory<NodeModel> fac = (NodeViewFactory<NodeModel>)nnc.getNode().getFactory();
        NodeContext.pushContext(nnc);
        try {
            var nodeView = fac.createNodeView(nnc.getNodeModel());
            registerNodeView(nnc, nodeView);
            return nodeView;
        } finally {
            NodeContext.removeLastContext();
        }
    }

    private void registerNodeView(final NativeNodeContainer nnc, final NodeView nodeView) {
        if (m_nodeViewMap.putIfAbsent(nnc, nodeView) == null) {
            NodeCleanUpCallback.builder(nnc, () -> m_nodeViewMap.remove(nnc)).build();
        }
    }

    /**
     * For testing purposes only.
     */
    void clearCaches() {
        m_nodeViewMap.clear();
        m_pageResourceManager.clearPageCache();
        m_tableViewManager.clearCaches();
    }

    /**
     * For testing purposes only.
     *
     * @return
     */
    int getNodeViewMapSize() {
        return m_nodeViewMap.size();
    }

    /**
     * @return the {@link DataServiceManager} instance
     */
    public DataServiceManager<NodeWrapper> getDataServiceManager() {
        return m_dataServiceManager;
    }

    /**
     * @return the {@link PageResourceManager} instance
     */
    public PageResourceManager<NodeWrapper> getPageResourceManager() {
        return m_pageResourceManager;
    }

    /**
     * @return the {@link TableViewManager} instance
     */
    public TableViewManager<NodeWrapper> getTableViewManager() {
        return m_tableViewManager;
    }

    private PagePathSegments getPagePathSegments(final NodeWrapper nodeWrapper, final PagePathSegments segments) {
        var page = m_pageResourceManager.getPage(segments.pageId());
        if (page.isCompletelyStatic()) {
            return segments;
        } else {
            // Why is a pageContentId needed for non-static node view pages?
            // Every time the content of a page changes, the page itself (and the associated resources) need to
            // be provided at a new page-path to make sure it gets updated in the browser (and is not taken from the
            // browser cache).
            // And since the page-content of a non-static view-page (i.e. a backend-rendered (java, python, etc.))
            // can change every time a node is re-executed (because a node-view uses a NodeModel as its underlying 'data'
            // - see org.knime.core.webui.node.view.NodeViewFactory.createNodeView(NodeModel)) a page-content-id
            // needs to be included in the page path which reflects the 'node execution cycle'.
            var pageContentId = Integer.toString(getIdForNodeExecutionCycle((NativeNodeContainer)nodeWrapper.get()));
            return new PagePathSegments(segments.pathPrefix(), segments.pageId(), pageContentId,
                segments.relativePagePath());
        }
    }

    private PagePathSegments decomposePagePath(final String path, final PagePathSegments segments) {
        var page = m_pageResourceManager.getPage(segments.pageId());
        if (page == null) {
            return null;
        }
        var relPath = segments.relativePagePath();

        // conditionally remove page-content-id from path
        if (!page.isCompletelyStatic()) {
            relPath = relPath.substring(relPath.indexOf("/") + 1, relPath.length());
        }

        return new PagePathSegments(segments.pathPrefix(), segments.pageId(), null, relPath);
    }

    static int getIdForNodeExecutionCycle(final NativeNodeContainer nnc) {
        return System.identityHashCode(nnc.getNodeAndBundleInformation());
    }

    /**
     * @param nnc
     * @return see {@link NodeView#canBeUsedInReport()}
     */
    public boolean canBeUsedInReport(final NativeNodeContainer nnc) {
        return getNodeView(nnc).canBeUsedInReport();
    }

    /**
     * @param nc
     * @return the {@link DataTableSpec} if the node view is also a {@link TableView} otherwise an empty optional
     */
    public Optional<DataTableSpec> getInputDataTableSpecIfTableView(final NodeContainer nc) {
        var nodeView = getNodeView(nc);
        if (nodeView instanceof NodeTableView tnv) {
            var wfm = nc.getParent();
            var inPortIndex = tnv.getPortIndex();
            // plus 1 because the inPortIdx excludes the flow variable port
            return Optional.ofNullable(wfm.getIncomingConnectionFor(nc.getID(), inPortIndex + 1)) // connection
                .map(conn -> {
                    if (conn.getType() == ConnectionType.WFMIN) {
                        return wfm.getWorkflowIncomingPort(conn.getSourcePort());
                    } else {
                        return wfm.getNodeContainer(conn.getSource()).getOutPort(conn.getSourcePort());
                    }
                }) // output port
                .map(NodeOutPort::getPortObjectSpec) // port object spec
                .map(spec -> spec instanceof DataTableSpec tableSpec ? tableSpec : null); // table spec
        } else {
            return Optional.empty();
        }

    }

    /**
     * Calls {@link NodeView#validateSettings(org.knime.core.node.NodeSettingsRO)}.
     *
     * @param nc
     * @param viewSettings
     * @throws InvalidSettingsException
     */
    public void validateSettings(final NodeContainer nc, final NodeSettings viewSettings)
        throws InvalidSettingsException {
        getNodeView(nc).validateSettings(viewSettings);
    }

    /**
     * @param nc
     * @return see {@link NodeView#getDefaultPageFormat()}
     */
    public PageFormat getDefaultPageFormat(final NodeContainer nc) {
        return getNodeView(nc).getDefaultPageFormat();
    }

}
