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
 *   14 Feb 2022 (albrecht): created
 */
package org.knime.testing.node.view;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Collections;
import java.util.Set;
import java.util.function.Consumer;
import java.util.function.Supplier;

import org.knime.core.data.RowKey;
import org.knime.core.node.NodeFactory;
import org.knime.core.node.NodeModel;
import org.knime.core.node.workflow.FileNativeNodeContainerPersistor;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.webui.data.InitialDataService;
import org.knime.core.webui.data.RpcDataService;
import org.knime.core.webui.node.NodeWrapper;
import org.knime.core.webui.node.view.NodeView;
import org.knime.core.webui.node.view.NodeViewManager;
import org.knime.core.webui.page.Page;
import org.knime.testing.util.WorkflowManagerUtil;

/**
 * Unit test util class which can be used to test a node providing a {@link NodeView}.
 *
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
public final class NodeTestUtil {

    /**
     * Instantiates a given node factory, connects it to a data generator node, executes it, and checks
     * for the presence of its services. Returns the {@link Page} of the node's view.
     *
     * @param nodeFactorySupplier a supplier for the to-be-instantiated factory
     * @param initialDataType the type of the node's initial data, or null, if the node has no initial data
     * @param dataServiceType the type of the node's data service, or null, if the node has no data service
     * @return the page of the node view for further assertions
     * @throws Exception
     */
    public static Page testNodeAndGetNodeViewPage(final Supplier<NodeFactory<? extends NodeModel>> nodeFactorySupplier,
        final Class<?> initialDataType, final Class<?> dataServiceType) throws Exception {
        return testNodeAndGetNodeViewPage(nodeFactorySupplier, initialDataType, dataServiceType, null);
    }

    /**
     * Instantiates a given node factory, connects it to a data generator node, executes it, and checks
     * for the presence of its services. Returns the {@link Page} of the node's view.
     *
     * @param nodeFactorySupplier a supplier for the to-be-instantiated factory
     * @param initialDataType the type of the node's initial data, or null, if the node has no initial data
     * @param dataServiceType the type of the node's data service, or null, if the node has no data service
     * @param configureNode optional logic to configure the node before it's executed
     * @return the page of the node view for further assertions
     * @throws Exception
     */
    public static Page testNodeAndGetNodeViewPage(final Supplier<NodeFactory<? extends NodeModel>> nodeFactorySupplier,
        final Class<?> initialDataType, final Class<?> dataServiceType, final Consumer<NativeNodeContainer> configureNode)
        throws Exception {

        final var wfm = WorkflowManagerUtil.createEmptyWorkflow();
        final var node = WorkflowManagerUtil.createAndAddNode(wfm, nodeFactorySupplier.get());
        final var nodeWrapper = NodeWrapper.of(node);
        final var dataGeneratorNodeFactory = FileNativeNodeContainerPersistor
            .loadNodeFactory("org.knime.base.node.util.sampledata.SampleDataNodeFactory");
        final var dataGeneratorNode = WorkflowManagerUtil.createAndAddNode(wfm, dataGeneratorNodeFactory);
        wfm.addConnection(dataGeneratorNode.getID(), 1, node.getID(), 1);
        wfm.executeAllAndWaitUntilDone();
        if (configureNode != null) {
            configureNode.accept(node);
            wfm.executeAllAndWaitUntilDone();
        }

        final var nodeViewManager = NodeViewManager.getInstance();

        // check for presence of initial data service
        final var initialDataService =
            nodeViewManager.getDataServiceOfType(nodeWrapper, InitialDataService.class);
        if (initialDataType != null) {
            assertThat(initialDataService).isNotEmpty();
            assertThat(initialDataService.get().getInitialData()).startsWith("{\"result\":");
        } else {
            assertThat(initialDataService).isEmpty();
        }

        // check for presence of data service
        final var rpcDataService = nodeViewManager.getDataServiceOfType(nodeWrapper, RpcDataService.class);
        if (dataServiceType != null) {
            assertThat(rpcDataService).isNotEmpty();
            assertThat(rpcDataService.get().getRpcServer().getHandler(dataServiceType)).isNotNull();
        } else {
            assertThat(rpcDataService).isEmpty();
        }

        // check for presence of selection translation service
        assertThat(nodeViewManager.callSelectionTranslationService(node, Set.of(RowKey.createRowKey(0L)))).isNotNull();
        assertThat(nodeViewManager.callSelectionTranslationService(node, Collections.emptyList())).isNotNull();

        return nodeViewManager.getPage(nodeWrapper);
    }

}
