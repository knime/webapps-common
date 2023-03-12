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
package org.knime.core.webui.data;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.Optional;
import java.util.function.Supplier;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.knime.core.node.CanceledExecutionException;
import org.knime.core.node.ExecutionContext;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.node.workflow.WorkflowManager;
import org.knime.core.webui.node.NodeWrapper;
import org.knime.core.webui.node.view.NodeView;
import org.knime.core.webui.node.view.NodeViewManager;
import org.knime.core.webui.page.Page;
import org.knime.testing.node.view.NodeViewNodeFactory;
import org.knime.testing.node.view.TableTestUtil;
import org.knime.testing.util.WorkflowManagerUtil;

/**
 * Tests the {@link DataServiceContext}.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
public class DataServiceContextTest {

    private WorkflowManager m_wfm;

    @Test
    void testDataServiceContext() throws IOException, CanceledExecutionException {
        var dataServiceContext = DataServiceContext.initAndGet((NativeNodeContainer)null);
        assertThat(DataServiceContext.get()).isNotNull();
        dataServiceContext.addWarningMessage("warning 1");
        dataServiceContext.addWarningMessage("warning 2");
        assertThat(dataServiceContext.getWarningMessages()).isEqualTo(new String[]{"warning 1", "warning 2"});
        assertThatThrownBy(() -> dataServiceContext.createTable(null)).isInstanceOf(IllegalStateException.class);
        DataServiceContext.remove();
        assertThat(DataServiceContext.get()).isNull();

        // create properly set-up node with a view
        m_wfm = WorkflowManagerUtil.createEmptyWorkflow();
        var nnc = WorkflowManagerUtil.createAndAddNode(m_wfm, new NodeViewNodeFactory(m -> createNodeView()));

        // test data service initialized with a node
        var dataServiceContext2 = DataServiceContext.initAndGet(nnc);
        assertThat(DataServiceContext.get()).isNotNull();
        var testTable = TableTestUtil.createDefaultTestTable(1).get();
        var table = dataServiceContext2.createTable(exec -> {
            return exec.createBufferedDataTable(testTable, exec);
        });
        assertThat(table).isSameAs(testTable);
        DataServiceContext.remove();
        assertThat(DataServiceContext.get()).isNull();

        // verify that the data service context is available within the data services
        var initialData = NodeViewManager.getInstance().callInitialDataService(NodeWrapper.of(nnc));
        assertThat(InitialDataServiceTestUtil.parseResult(initialData, true)).isEqualTo("initial data");
        var rpcData = NodeViewManager.getInstance().callRpcDataService(NodeWrapper.of(nnc),
            RpcDataService.jsonRpcRequest("method"));
        assertThat(rpcData).isEqualTo("{\"jsonrpc\":\"2.0\",\"id\":1,\"result\":\"rpc data\"}\n");
    }

    private static NodeView createNodeView() {
        Supplier<String> initialDataSupplier = () -> {
            assertDataServiceContextAvailable();
            return "initial data";
        };
        InitialDataService initialDataService = InitialDataService.builder(initialDataSupplier).build();
        var rpcDataServiceHandler = new RpcDataServiceHandler();
        var rpcDataService = RpcDataService.builder(rpcDataServiceHandler).build();
        var nodeView = mock(NodeView.class);
        var page = Page.builder(() -> "content", "page.html").build();
        when(nodeView.getPage()).thenReturn(page);
        when(nodeView.createInitialDataService()).thenReturn(Optional.of(initialDataService));
        when(nodeView.createRpcDataService()).thenReturn(Optional.of(rpcDataService));
        return nodeView;
    }

    @AfterEach
    void cleanUp() {
        WorkflowManagerUtil.disposeWorkflow(m_wfm);
    }

    @SuppressWarnings("javadoc")
    public static class RpcDataServiceHandler {

        public String method() {
            assertDataServiceContextAvailable();
            return "rpc data";
        }
    }

    private static void assertDataServiceContextAvailable() {
        var dataServiceContext = DataServiceContext.get();
        assertThat(dataServiceContext).isNotNull();
        // ensure that this method can be called
        try {
            assertThat(dataServiceContext.createTable(exec -> null)).isNull();
        } catch (CanceledExecutionException ex) {
            throw new RuntimeException(ex);
        }
    }

    /**
     * Helper to init the data service context for the current thread.
     *
     * @param execSupplier
     */
    public static void initDataServiceContext(final Supplier<ExecutionContext> execSupplier) {
        DataServiceContext.initAndGet(execSupplier);
    }

    /**
     * Helper to remove the data service context for the current thread.
     */
    public static void removeDataServiceContext() {
        DataServiceContext.remove();
    }

}
