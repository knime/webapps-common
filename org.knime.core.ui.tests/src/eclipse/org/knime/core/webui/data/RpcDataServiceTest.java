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
 *   Sep 15, 2021 (hornm): created
 */
package org.knime.core.webui.data;

import static com.googlecode.jsonrpc4j.ErrorResolver.JsonError.CUSTOM_SERVER_ERROR_UPPER;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.knime.core.webui.data.RpcDataService.jsonRpcRequest;

import java.io.IOException;
import java.util.function.Supplier;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.node.workflow.WorkflowManager;
import org.knime.core.webui.data.rpc.json.impl.ObjectMapperUtil;
import org.knime.core.webui.node.NodeWrapper;
import org.knime.core.webui.node.view.NodeView;
import org.knime.core.webui.node.view.NodeViewManager;
import org.knime.core.webui.node.view.NodeViewManagerTest;
import org.knime.core.webui.node.view.NodeViewTest;
import org.knime.core.webui.page.Page;
import org.knime.testing.util.WorkflowManagerUtil;

/**
 * Tests for the {@link JsonRpcDataService}.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
@SuppressWarnings("java:S2698") // we accept assertions without messages
class RpcDataServiceTest {

    WorkflowManager m_wfm;

    @BeforeEach
    void createEmptyWorkflow() throws IOException {
        m_wfm = WorkflowManagerUtil.createEmptyWorkflow();
    }

    @AfterEach
    void disposeWorkflow() throws IOException {
        WorkflowManagerUtil.disposeWorkflow(m_wfm);
    }

    /**
     * Tests {@link JsonRpcDataServiceImpl} when used in a {@link NodeView}.
     *
     * @throws IOException
     */
    @Test
    void testRpcDataService() {
        NativeNodeContainer nnc = createNodeWithRPCDataService(() -> RpcDataService.builder(new MyService()).build());
        var jsonRpcRequest = jsonRpcRequest("myMethod");
        String response = sendRPCRequest(nnc, jsonRpcRequest);
        assertThat(response).isEqualTo(MyService.RESPONSE);

    }

    @Test
    void testNamedRpcDataService() throws IOException {
        NativeNodeContainer nnc =
            createNodeWithRPCDataService(() -> RpcDataService.builder().addService("myName", new MyService()).build());

        var jsonRpcRequest = jsonRpcRequest("myName.myMethod");
        String response = sendRPCRequest(nnc, jsonRpcRequest);
        assertThat(response).isEqualTo(MyService.RESPONSE);
    }

    @Test
    void testThrowsOnNamedAndUnnamedRpcDataService() throws IOException {
        NativeNodeContainer nnc = createNodeWithRPCDataService(
            () -> RpcDataService.builder(new MyService()).addService("myName", new MyService()).build());

        var jsonRpcRequest = jsonRpcRequest("myMethod");
        assertThrows(IllegalStateException.class, () -> sendRPCRequest(nnc, jsonRpcRequest));
    }

    @Test
    void testThrowsOnNoHandler() throws IOException {
        NativeNodeContainer nnc = createNodeWithRPCDataService(() -> RpcDataService.builder().build());

        var jsonRpcRequest = jsonRpcRequest("myMethod");
        assertThrows(IllegalStateException.class, () -> sendRPCRequest(nnc, jsonRpcRequest));
    }

    public static class MyService {

        public static final String RESPONSE =
            "{\"jsonrpc\":\"2.0\",\"id\":1,\"result\":\"my service method result\"}\n";

        public String myMethod() {
            return "my service method result"; // NOSONAR
        }
    }

    @Test
    void testJsonRpcDataServiceInternalError() throws IOException {
        NativeNodeContainer nnc =
            createNodeWithRPCDataService(() -> RpcDataService.builder(new ServiceThrowingInternalError()).build());

        var jsonRpcRequest = jsonRpcRequest("erroneusMethod", "foo");
        String response = sendRPCRequest(nnc, jsonRpcRequest);
        final var root = ObjectMapperUtil.getInstance().getObjectMapper().readTree(response);
        assertTrue(root.has("error"));
        final var error = root.get("error");
        assertTrue(error.has("code"));
        assertEquals(CUSTOM_SERVER_ERROR_UPPER, error.get("code").asInt());
        assertTrue(error.has("message"));
        assertEquals("foo", error.get("message").asText());
        assertTrue(error.has("data"));
        final var data = error.get("data");
        assertTrue(data.has("typeName"));
        assertEquals("java.lang.IllegalArgumentException", data.get("typeName").asText());
        assertTrue(data.has("stackTrace"));
    }

    public static class ServiceThrowingInternalError {
        public String erroneusMethod(final String param) {
            throw new IllegalArgumentException(param);
        }
    }

    @Test
    void testJsonRpcDataServiceUserError() throws IOException {
        NativeNodeContainer nnc =
            createNodeWithRPCDataService(() -> RpcDataService.builder(new ServiceThrowingUserError()).build());

        var jsonRpcRequest = jsonRpcRequest("erroneusMethod", "foo", "bar");
        String response = sendRPCRequest(nnc, jsonRpcRequest);
        final var root = ObjectMapperUtil.getInstance().getObjectMapper().readTree(response);
        assertTrue(root.has("error"));
        final var error = root.get("error");
        assertTrue(error.has("code"));
        assertEquals(CUSTOM_SERVER_ERROR_UPPER - 1, error.get("code").asInt());
        assertTrue(error.has("message"));
        assertEquals("foo", error.get("message").asText());
        assertTrue(error.has("data"));
        final var data = error.get("data");
        assertTrue(data.has("details"));
        assertEquals("bar", data.get("details").asText());
    }

    public static class ServiceThrowingUserError {
        public String erroneusMethod(final String param1, final String param2) {
            throw new DataServiceException(param1, param2);
        }
    }

    private NativeNodeContainer createNodeWithRPCDataService(final Supplier<RpcDataService> rpcDataServiceSupplier) {
        var page = Page.builder(() -> "content", "index.html").build();
        NativeNodeContainer nnc = NodeViewManagerTest.createNodeWithNodeView(m_wfm,
            m -> NodeViewTest.createNodeView(page, null, rpcDataServiceSupplier, null));
        m_wfm.executeAllAndWaitUntilDone();
        return nnc;
    }

    private static String sendRPCRequest(final NativeNodeContainer nnc, final String jsonRpcRequest) {
        return NodeViewManager.getInstance().getDataServiceManager().callRpcDataService(NodeWrapper.of(nnc),
            jsonRpcRequest);
    }

}
