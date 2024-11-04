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
 */
package org.knime.core.webui.node.dialog;

import java.util.Collections;
import java.util.Optional;
import java.util.Set;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.Node;
import org.knime.core.node.NodeDialogPane;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.NotConfigurableException;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.node.util.CheckUtils;
import org.knime.core.node.workflow.CredentialsProvider;
import org.knime.core.node.workflow.FlowObjectStack;
import org.knime.core.node.workflow.NodeContext;
import org.knime.core.node.workflow.NodeID;
import org.knime.core.node.workflow.SingleNodeContainer;
import org.knime.core.webui.UIExtension;
import org.knime.core.webui.data.ApplyDataService;
import org.knime.core.webui.data.DataServiceProvider;
import org.knime.core.webui.data.InitialDataService;
import org.knime.core.webui.data.RpcDataService;
import org.knime.core.webui.node.dialog.NodeDialog.OnApplyNodeModifier;
import org.knime.core.webui.page.Page;

/**
 * Adapter for the {@link NodeDialog}-interface which 'adapts' it to the {@link DataServiceProvider}-interface. I.e. it
 * mostly provides the implementations of {@link DataServiceProvider#createInitialDataService()} and
 * {@link DataServiceProvider#createApplyDataService()} interface-methods.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 *
 * @since 5.2
 */
final class NodeDialogAdapter implements UIExtension, DataServiceProvider {

    private final SingleNodeContainer m_snc;

    private final NodeDialog m_dialog;

    private final Set<SettingsType> m_settingsTypes;

    private final OnApplyNodeModifier m_onApplyModifier;

    private final NodeSettingsService m_nodeSettingsService;

    NodeDialogAdapter(final SingleNodeContainer snc, final NodeDialog dialog) {
        m_dialog = dialog;
        m_settingsTypes = dialog.getSettingsTypes();
        CheckUtils.checkState(!m_settingsTypes.isEmpty(), "At least one settings type must be provided");
        m_snc = snc;
        m_onApplyModifier = dialog.getOnApplyNodeModifier().orElse(null);
        m_nodeSettingsService = dialog.getNodeSettingsService();
    }

    /**
     * Constructor only used when creating the dialog in the context of the remote workflow editor. In that case, e.g.,
     * no data services, e.g., {@link #createInitialDataService()} etc. are being used on the client side.
     *
     * @param dialog
     */
    NodeDialogAdapter(final NodeDialog dialog) {
        m_dialog = dialog;
        m_settingsTypes = dialog.getSettingsTypes();
        CheckUtils.checkState(!m_settingsTypes.isEmpty(), "At least one settings type must be provided");
        m_snc = null;
        m_onApplyModifier = null;
        m_nodeSettingsService = null;
    }

    @Override
    public Page getPage() {
        return m_dialog.getPage();
    }

    @Override
    public Optional<InitialDataService<String>> createInitialDataService() {
        var initialData = new InitialData(m_snc, m_settingsTypes, m_nodeSettingsService);
        return Optional.of(InitialDataService.builder(initialData::get).onDeactivate(this::deactivate).build());
    }

    @Override
    public Optional<RpcDataService> createRpcDataService() {
        return m_dialog.createRpcDataService();
    }

    @Override
    public Optional<ApplyDataService<String>> createApplyDataService() {
        var applyData = new ApplyData(m_snc, m_settingsTypes, m_nodeSettingsService, m_onApplyModifier);
        return Optional.of(ApplyDataService.builder(applyData::applyData) //
            .onDeactivate(applyData::cleanUp) //
            .build());
    }

    /**
     * @return the original dialog this dialog adapter wraps
     */
    public NodeDialog getNodeDialog() {
        return m_dialog;
    }

    /**
     * @return a legacy flow variable node dialog
     */
    NodeDialogPane createLegacyFlowVariableNodeDialog() {
        return new LegacyFlowVariableNodeDialog();
    }

    final class LegacyFlowVariableNodeDialog extends NodeDialogPane {

        private static final String FLOW_VARIABLES_TAB_NAME = "Flow Variables";

        private NodeSettingsRO m_modelSettings;

        @Override
        public void onOpen() {
            setSelected(FLOW_VARIABLES_TAB_NAME);
        }

        @Override
        protected boolean hasModelSettings() {
            return m_settingsTypes.contains(SettingsType.MODEL);
        }

        @Override
        protected boolean hasViewSettings() {
            return m_settingsTypes.contains(SettingsType.VIEW);
        }

        @Override
        protected void loadSettingsFrom(final NodeSettingsRO settings, final PortObjectSpec[] specs)
            throws NotConfigurableException {
            m_modelSettings = settings;
        }

        @Override
        protected void saveSettingsTo(final NodeSettingsWO settings) throws InvalidSettingsException {
            m_modelSettings.copyTo(settings);
        }

        /**
         * For testing purposes only!
         *
         * @throws NotConfigurableException
         */
        void initDialogForTesting(final NodeSettingsRO settings, final PortObjectSpec[] spec)
            throws NotConfigurableException {
            Node.invokeDialogInternalLoad(this, settings, spec, null,
                FlowObjectStack.createFromFlowVariableList(Collections.emptyList(), new NodeID(0)),
                CredentialsProvider.EMPTY_CREDENTIALS_PROVIDER, false);
            setSelected(FLOW_VARIABLES_TAB_NAME);
        }

    }

    private void deactivate() {
        NodeContext.pushContext(m_snc);
        try {
            m_nodeSettingsService.deactivate();
        } finally {
            NodeContext.removeLastContext();
        }
    }

}
