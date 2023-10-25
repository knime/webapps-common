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
 *  NodeDialog, and NodeDialog) and that only interoperate with KNIME through
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
 *   Oct 15, 2021 (hornm): created
 */
package org.knime.core.webui.node.dialog;

import java.util.Map;
import java.util.WeakHashMap;

import org.knime.core.node.NodeDialogPane;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.node.workflow.NodeContainer;
import org.knime.core.node.workflow.NodeContext;
import org.knime.core.node.workflow.SingleNodeContainer;
import org.knime.core.node.workflow.SubNodeContainer;
import org.knime.core.webui.node.DataServiceManager;
import org.knime.core.webui.node.NodeWrapper;
import org.knime.core.webui.node.PageResourceManager;
import org.knime.core.webui.node.PageResourceManager.PageType;
import org.knime.core.webui.node.util.NodeCleanUpCallback;

/**
 * Manages (web-ui) node dialog instances and provides associated functionality.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 *
 * @since 4.5
 */
public final class NodeDialogManager {

    private static NodeDialogManager instance;

    private final Map<NodeContainer, NodeDialogAdapter> m_nodeDialogAdapterMap = new WeakHashMap<>();

    private final PageResourceManager<NodeWrapper> m_pageResourceManager =
        new PageResourceManager<>(PageType.DIALOG, nw -> getNodeDialog(nw.get()).getPage());

    private final DataServiceManager<NodeWrapper> m_dataServiceManager =
        new DataServiceManager<>(nw -> getNodeDialog(nw.get()));

    /**
     * Returns the singleton instance for this class.
     *
     * @return the singleton instance
     */
    public static synchronized NodeDialogManager getInstance() {
        if (instance == null) {
            instance = new NodeDialogManager();
        }
        return instance;
    }

    private NodeDialogManager() {
        // singleton
    }

    /**
     * @param nc the node to check
     * @return whether the node provides a {@link NodeDialogAdapter}
     */
    public static boolean hasNodeDialog(final NodeContainer nc) {
        if (nc instanceof NativeNodeContainer) {
            var nodeFactory = ((NativeNodeContainer)nc).getNode().getFactory();
            return nodeFactory instanceof NodeDialogFactory && ((NodeDialogFactory)nodeFactory).hasNodeDialog();
        } else if (nc instanceof SubNodeContainer) {
            return new SubNodeContainerDialogFactory((SubNodeContainer)nc).hasNodeDialog();
        } else {
            return false;
        }
    }

    /**
     * Gets the {@link NodeDialogAdapter} for a given node container.
     *
     * @param nc the node to create the node dialog from
     * @return a node dialog instance
     * @throws IllegalArgumentException if the passed node does not provide a node dialog
     */
    NodeDialogAdapter getNodeDialog(final NodeContainer nc) {
        if (!hasNodeDialog(nc)) {
            throw new IllegalArgumentException("The node " + nc.getNameWithID() + " doesn't provide a node dialog");
        }

        if (nc instanceof NativeNodeContainer) {
            var nnc = (NativeNodeContainer)nc;
            return m_nodeDialogAdapterMap.computeIfAbsent(nc, id -> {
                NodeCleanUpCallback.builder(nnc, () -> deactivateDialog(nnc)).build();
                return createNativeNodeDialog(nnc);
            });
        } else if (nc instanceof SubNodeContainer) {
            var snc = (SubNodeContainer)nc;
            return m_nodeDialogAdapterMap.computeIfAbsent(nc, id -> {
                NodeCleanUpCallback.builder(nc, () -> deactivateDialog(nc)).build();
                return createSubNodeContainerDialog(snc);
            });
        } else {
            throw new IllegalArgumentException("The node " + nc.getNameWithID() + " is no supported node container");
        }
    }

    private static NodeDialogAdapter createNativeNodeDialog(final NativeNodeContainer nnc) {
        NodeDialogFactory fac = (NodeDialogFactory)nnc.getNode().getFactory();
        NodeContext.pushContext(nnc);
        try {
            return new NodeDialogAdapter(nnc, fac.createNodeDialog());
        } finally {
            NodeContext.removeLastContext();
        }
    }

    private static NodeDialogAdapter createSubNodeContainerDialog(final SubNodeContainer snc) {
        NodeContext.pushContext(snc);
        try {
            return new NodeDialogAdapter(snc, new SubNodeContainerDialogFactory(snc).createNodeDialog());
        } finally {
            NodeContext.removeLastContext();
        }
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
     * For testing purposes only.
     */
    void clearCaches() {
        m_nodeDialogAdapterMap.clear();
        m_pageResourceManager.clearPageCache();
    }

    /**
     * @param dialog
     *
     * @return a legacy flow variable node dialog
     */
    public static NodeDialogPane createLegacyFlowVariableNodeDialog(final NodeDialog dialog) {
        return new NodeDialogAdapter((SingleNodeContainer)NodeContext.getContext().getNodeContainer(), dialog)
            .createLegacyFlowVariableNodeDialog();
    }

    /**
     * @param snc
     * @return see {@link NodeDialog#canBeEnlarged()}
     */
    public boolean canBeEnlarged(final NodeContainer snc) {
        return getNodeDialog(snc).getNodeDialog().canBeEnlarged();
    }

    /**
     * deactivates the node dialog associated to the node container;
     * @param nc
     */
    public void deactivateDialog(final NodeContainer nc) {
        NodeContext.pushContext(nc);
        try {
            m_nodeDialogAdapterMap.get(nc).deactivate();
        } finally {
            NodeContext.removeLastContext();
        }
    }

}