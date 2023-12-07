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
 *   Sep 14, 2021 (hornm): created
 */
package org.knime.core.webui.data;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.knime.core.node.workflow.NodeContainer;
import org.knime.core.node.workflow.NodeContext;
import org.knime.core.webui.data.rpc.RpcServer;
import org.knime.core.webui.data.rpc.RpcServerManager;
import org.knime.core.webui.data.rpc.json.impl.JsonRpcServer;
import org.knime.core.webui.data.rpc.json.impl.JsonRpcSingleServer;
import org.knime.core.webui.data.rpc.json.impl.ObjectMapperUtil;

import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * A {@link RpcDataService} where the requests result in actual method-calls of registered handler(s) (aka remote
 * procedure calls).
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 *
 * @since 4.5
 */
public final class RpcDataService implements DataService {

    private final RpcServer m_rpcServer;

    private Runnable m_deactivate;

    private final Runnable m_dispose;

    private final NodeContainer m_nc;

    private RpcDataService(final RpcDataServiceBuilder builder) {
        final var hasUnnamedHandler = builder.m_unnamedHandler != null;
        final var hasNamedHandlers = !builder.m_namedHandlers.isEmpty();
        if (hasUnnamedHandler) {
            if (hasNamedHandlers) {
                throw new IllegalStateException(
                    "Having named and unnamed handlers at the same time is not supported at the moment.");
            }
            m_rpcServer = new JsonRpcSingleServer<>(builder.m_unnamedHandler);
        } else if (hasNamedHandlers) {
            final var jsonRpcServer = new JsonRpcServer();
            builder.m_namedHandlers.forEach(jsonRpcServer::addService);
            m_rpcServer = jsonRpcServer;
        } else {
            throw new IllegalStateException(
                "No handler was supplied to this RPCDataService");
        }
        m_deactivate = builder.m_deactivate;
        m_dispose = builder.m_dispose;
        m_nc = DataServiceUtil.getNodeContainerFromContext();
    }

    /**
     * @param request the rpc request (e.g. encoded in json-rpc)
     * @return the rpc-response (e.g. a json-rpc response)
     */
    public String handleRpcRequest(final String request) {
        if (m_nc != null) {
            NodeContext.pushContext(m_nc);
        }
        try {
            DataServiceContext.init(m_nc);
            final var response = RpcServerManager.doRpc(m_rpcServer, request);
            // We have to get the DataServiceContext again here, since the context may have changed since (or as a
            // consequence of) clearing it
            final var warningMessages = DataServiceContext.get().getWarningMessages();
            if (warningMessages != null && warningMessages.length > 0) {
                final var mapper = ObjectMapperUtil.getInstance().getObjectMapper();
                final var root = (ObjectNode)mapper.readTree(response);
                if (root.has("result")) {
                    return root.set("warningMessages", mapper.valueToTree(warningMessages)).toString();
                }
            }
            return response;
        } catch (IOException ex) {
            throw new IllegalStateException("A problem occurred while making a rpc call.", ex);
        } finally {
            DataServiceContext.remove();
            if (m_nc != null) {
                NodeContext.removeLastContext();
            }
        }
    }

    /**
     * @return the rpc server being used
     */
    public RpcServer getRpcServer() {
        return m_rpcServer;
    }

    /**
     * Helper to create a json rpc request string.
     *
     * @param method
     * @param params
     * @return the json rpc request as json string
     */
    public static String jsonRpcRequest(final String method, final String... params) {
        var mapper = ObjectMapperUtil.getInstance().getObjectMapper();
        var paramsArrayNode = mapper.createArrayNode();
        for (var param : params) {
            paramsArrayNode.add(param);
        }
        return mapper.createObjectNode().put("jsonrpc", "2.0").put("id", 1).put("method", method)
            .set("params", paramsArrayNode).toPrettyString();
    }

    @Override
    public Optional<Runnable> disposeRunnable() {
        return Optional.ofNullable(m_dispose);
    }

    @Override
    public Optional<Runnable> deactivateRunnable() {
        return Optional.ofNullable(m_deactivate);
    }

    /**
     * @param <S>
     * @param handler the handler whose methods are called. Whenever any of the methods are being called, a
     *            {@link DataServiceContext} is available within the method.
     * @return a new builder instance
     */
    public static <S> RpcDataServiceBuilder builder(final S handler) {
        return new RpcDataServiceBuilder(handler);
    }

    /**
     * @return a new builder instance
     */
    public static RpcDataServiceBuilder builder() {
        return new RpcDataServiceBuilder();
    }

    /**
     * The builder.
     */
    public static final class RpcDataServiceBuilder implements DataServiceBuilder {

        private final Object m_unnamedHandler;

        private Map<String, Object> m_namedHandlers = new HashMap<>();

        private Runnable m_dispose;

        private Runnable m_deactivate;

        private RpcDataServiceBuilder(final Object handler) {
            m_unnamedHandler = handler;
        }

        private RpcDataServiceBuilder() {
            m_unnamedHandler = null;
        }

        /**
         * Add a named service which can be accessed via RPC of the form [name].[methodName] i.e. the method name of the
         * given handler prefixed by the name and a "dot".
         *
         * @param name
         * @param handler the handler whose methods are called for the respective requests. Whenever any of the methods
         *            are being called, a {@link DataServiceContext} is available within the method.
         * @return the builder
         */
        public RpcDataServiceBuilder addService(final String name, final Object handler) {
            m_namedHandlers.put(name, handler);
            return this;
        }

        @Override
        public RpcDataServiceBuilder onDispose(final Runnable dispose) {
            m_dispose = dispose;
            return this;
        }

        @Override
        public RpcDataServiceBuilder onDeactivate(final Runnable deactivate) {
            m_deactivate = deactivate;
            return this;
        }

        /**
         * @return a new instance
         */
        public RpcDataService build() {
            return new RpcDataService(this);
        }

    }

}
