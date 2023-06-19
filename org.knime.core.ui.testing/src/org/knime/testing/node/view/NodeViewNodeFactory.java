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
 *   Sep 13, 2021 (hornm): created
 */
package org.knime.testing.node.view;

import java.io.IOException;
import java.util.Optional;
import java.util.function.BooleanSupplier;
import java.util.function.Function;

import org.apache.xmlbeans.XmlException;
import org.assertj.core.api.Assertions;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NoDescriptionProxy;
import org.knime.core.node.NodeDescription;
import org.knime.core.node.NodeDialogPane;
import org.knime.core.node.NodeFactory;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.node.workflow.NodeContext;
import org.knime.core.webui.data.ApplyDataService;
import org.knime.core.webui.data.ApplyDataService.Applier;
import org.knime.core.webui.data.InitialDataService;
import org.knime.core.webui.data.RpcDataService;
import org.knime.core.webui.node.NodeWrapper;
import org.knime.core.webui.node.NodeWrapper.CustomNodeWrapperTypeIdProvider;
import org.knime.core.webui.node.view.NodeTableView;
import org.knime.core.webui.node.view.NodeView;
import org.knime.core.webui.node.view.NodeViewFactory;
import org.knime.core.webui.node.view.NodeViewManager;
import org.knime.core.webui.page.Page;
import org.xml.sax.SAXException;

/**
 * Dummy node factory for tests around the {@link NodeView}.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
public class NodeViewNodeFactory extends NodeFactory<NodeViewNodeModel>
    implements NodeViewFactory<NodeViewNodeModel>, CustomNodeWrapperTypeIdProvider {

    private static int instanceCount = 0;

    private final Function<NodeViewNodeModel, NodeView> m_nodeViewCreator;

    private final int m_numInputs;

    private final int m_numOutputs;

    private String m_initialData = "the initial data";

    private final BooleanSupplier m_hasView;

    /**
     *
     */
    public NodeViewNodeFactory() {
        this(1, 0);
    }

    /**
     * @param nodeViewCreator
     */
    public NodeViewNodeFactory(final Function<NodeViewNodeModel, NodeView> nodeViewCreator) {
        m_nodeViewCreator = nodeViewCreator;
        m_numInputs = 0;
        m_numOutputs = 0;
        m_hasView = () -> true;
        instanceCount++;
    }

    /**
     * @param nodeViewCreator
     * @param hasView allows one to control the {@link #hasNodeView()} return value
     */
    public NodeViewNodeFactory(final Function<NodeViewNodeModel, NodeView> nodeViewCreator,
        final BooleanSupplier hasView) {
        m_nodeViewCreator = nodeViewCreator;
        m_numInputs = 0;
        m_numOutputs = 0;
        m_hasView = hasView;
        instanceCount++;
    }

    /**
     * @param numInputs
     * @param numOutputs
     */
    public NodeViewNodeFactory(final int numInputs, final int numOutputs) {
        m_numInputs = numInputs;
        m_numOutputs = numOutputs;
        m_nodeViewCreator = m -> { // NOSONAR
            return createNodeView(m,
                Page.builder(() -> "foo", "index.html").addResourceFromString(() -> "bar", "resource.html").build(),
                InitialDataService.builder(() -> m_initialData).build(),
                RpcDataService.builder(new RpcServiceHandler()).build(), createApplyDataService());
        };
        m_hasView = () -> true;
        instanceCount++;
    }

    public NodeViewNodeFactory(final int numInputs, final int numOutputs,
        final Function<NodeViewNodeModel, NodeView> nodeViewCreator) {
        m_numInputs = numInputs;
        m_numOutputs = numOutputs;
        m_nodeViewCreator = nodeViewCreator;
        m_hasView = () -> true;
        instanceCount++;
    }

    private ApplyDataService<String> createApplyDataService() {
        return ApplyDataService.builder((Applier<String>)data -> m_initialData = data)
            .validator(data -> {
                if (data.startsWith("ERROR")) {
                    return data;
                } else {
                    return null;
                }
            }).build();
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public NodeView createNodeView(final NodeViewNodeModel nodeModel) {
        Assertions.assertThat(NodeContext.getContext().getNodeContainer()).as("A node context is expected to be given")
            .isNotNull();
        return m_nodeViewCreator.apply(nodeModel);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public NodeViewNodeModel createNodeModel() {
        return new NodeViewNodeModel(m_numInputs, m_numOutputs);
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected int getNrNodeViews() {
        return 0;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public org.knime.core.node.NodeView<NodeViewNodeModel> createNodeView(final int viewIndex,
        final NodeViewNodeModel nodeModel) {
        return null;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected boolean hasDialog() {
        return false;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected NodeDialogPane createNodeDialogPane() {
        return null;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected NodeDescription createNodeDescription() throws SAXException, IOException, XmlException {
        return new NoDescriptionProxy(getClass());
    }

    private static NodeView createNodeView(final NodeViewNodeModel model, final Page page,
        final InitialDataService<?> initDataService, final RpcDataService rpcDataService,
        final ApplyDataService<?> applyDataService) {
        if (model.hasTableInputPort()) {
            return new NodeTableView() { // NOSONAR

                @Override
                public Optional<InitialDataService<?>> createInitialDataService() {
                    return Optional.ofNullable(initDataService);
                }

                @Override
                public Optional<RpcDataService> createRpcDataService() {
                    return Optional.ofNullable(rpcDataService);
                }

                @Override
                public Optional<ApplyDataService<?>> createApplyDataService() {
                    return Optional.ofNullable(applyDataService);
                }

                @Override
                public void validateSettings(final NodeSettingsRO settings) throws InvalidSettingsException {
                    //
                }

                @Override
                public void loadValidatedSettingsFrom(final NodeSettingsRO settings) {
                    //
                }

                @Override
                public Page getPage() {
                    return page;
                }

            };
        } else {
            return createNodeView(page, initDataService, rpcDataService, applyDataService);
        }
    }

    @SuppressWarnings("javadoc")
    public static NodeView createNodeView(final Page page, final InitialDataService<?> initDataService,
        final RpcDataService rpcDataService, final ApplyDataService<?> applyDataService) {
        return new NodeView() { // NOSONAR

            @Override
            public Optional<InitialDataService<?>> createInitialDataService() {
                return Optional.ofNullable(initDataService);
            }

            @Override
            public Optional<RpcDataService> createRpcDataService() {
                return Optional.ofNullable(rpcDataService);
            }

            @Override
            public Optional<ApplyDataService<?>> createApplyDataService() {
                return Optional.ofNullable(applyDataService);
            }

            @Override
            public void validateSettings(final NodeSettingsRO settings) throws InvalidSettingsException {
                //
            }

            @Override
            public void loadValidatedSettingsFrom(final NodeSettingsRO settings) {
                //
            }

            @Override
            public Page getPage() {
                return page;
            }

        };
    }

    @Override
    public boolean hasNodeView() {
        return m_hasView.getAsBoolean();
    }

    public static class RpcServiceHandler {

        public String method(final String param) {
            return "rpc method result with param: " + param;
        }

    }

    @Override
    public String getNodeWrapperTypeId(final NativeNodeContainer nnc) {
        return getNodeWrapperTypeIdStatic(nnc);
    }

    /**
     * The node-wrapper-type-id returned by {@link NodeWrapper#getNodeWrapperTypeId()} for this node factory. Required
     * to be able to assert the path returned by {@link NodeViewManager#getPagePath(NodeWrapper)} because the
     * node-wrapper-type-id does NOT remain constant for this factory (usually it does). It's not constant because
     * multiple tests use this factory to create views (and pages associated with the views) which in turn are kept in
     * global static caches. And mutating the node-wrapper-type-id with every new instance of this factory essentially
     * 'invalidates' the cache entries.
     *
     * @param nnc
     * @return the id
     */
    public static String getNodeWrapperTypeIdStatic(final NativeNodeContainer nnc) {
        var factory = nnc.getNode().getFactory();
        return factory.getClass().getName() + "_" + instanceCount;
    }

}
