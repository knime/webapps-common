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

import java.util.Collections;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.Node;
import org.knime.core.node.NodeDialogPane;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.NotConfigurableException;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.node.util.CheckUtils;
import org.knime.core.node.workflow.CredentialsProvider;
import org.knime.core.node.workflow.FlowObjectStack;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.node.workflow.NodeContainer;
import org.knime.core.node.workflow.NodeContext;
import org.knime.core.node.workflow.NodeID;
import org.knime.core.webui.UIExtension;
import org.knime.core.webui.data.ApplyDataService;
import org.knime.core.webui.data.DataServiceProvider;
import org.knime.core.webui.data.InitialDataService;
import org.knime.core.webui.node.dialog.impl.DefaultNodeSettings;

/**
 * Represents a dialog of a node.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 *
 * @since 4.5
 */
public abstract class NodeDialog implements UIExtension, DataServiceProvider {

    private final NodeContainer m_nc;

    private final Set<SettingsType> m_settingsTypes;

    private final OnApplyNodeModifier m_onApplyModifier;

    /**
     * Creates a new node dialog instance.
     *
     * NOTE: when called a {@link NodeContext} needs to be available
     *
     * @param onApplyModifier an {@link OnApplyNodeModifier} that will be invoked when cleaning up the
     *            {@link ApplyDataService} created in {@link #createApplyDataService()}
     * @param settingsTypes the list of {@link SettingsType}s the {@link NodeSettingsService} is able to deal with;
     *            must not be empty
     */
    protected NodeDialog(final OnApplyNodeModifier onApplyModifier, final SettingsType... settingsTypes) {
        CheckUtils.checkState(settingsTypes.length > 0, "At least one settings type must be provided");
        m_settingsTypes = Set.of(settingsTypes);
        m_nc = NodeContext.getContext().getNodeContainer();
        m_onApplyModifier = onApplyModifier;
    }

    /**
     * Creates a new node dialog instance.
     *
     * NOTE: when called a {@link NodeContext} needs to be available
     *
     * @param settingsTypes the list of {@link SettingsType}s the {@link NodeSettingsService} is able to deal with;
     *            must not be empty
     */
    protected NodeDialog(final SettingsType... settingsTypes) {
        this(null, settingsTypes);
    }

    @Override
    public final Optional<InitialDataService<String>> createInitialDataService() {
        var nodeSettingsService = getNodeSettingsService();
        var initialData = new InitialData(m_nc, m_settingsTypes, nodeSettingsService);
        return Optional.of(InitialDataService.builder(initialData::get).build());
    }

    @Override
    public final Optional<ApplyDataService<String>> createApplyDataService() {
        var applyData = new ApplyData(m_nc, m_settingsTypes, getNodeSettingsService(), getVariableSettingsService(),
            m_onApplyModifier);
        return Optional.of(ApplyDataService.builder(applyData::applyData) //
            .onCleanUp(applyData::cleanUp) //
            .build());
    }

    /**
     * Can be implemented and provided to the NodeDialog upon creation. Provides a method that is called when settings
     * are applied. May optionally modify the node based on the difference difference between previous and updated model
     * and view {@link DefaultNodeSettings settings}.
     */
    @FunctionalInterface
    public interface OnApplyNodeModifier {
        /**
         * Called when the dialog is closed. May optionally modify the node based on the difference difference between
         * previous and updated model and view {@link DefaultNodeSettings settings}. Note that for any settings
         * controlled via flow variables, the "updated" value is always equal to the "previous" value, i.e., settings
         * are not updated if controlled via a flow variable.
         *
         * @param nnc the native node container which should undergo modifications based on provided settings
         * @param previousModelSettings the previous model {@link DefaultNodeSettings settings}, i.e., the model
         *            settings prior to the apply call
         * @param updatedModelSettings the final, updated model {@link DefaultNodeSettings settings}, i.e., the model
         *            settings after the apply call
         * @param previousViewSettings the previous view {@link DefaultNodeSettings settings}, i.e., the view settings
         *            prior to the apply call
         * @param updatedViewSettings the final, updated view {@link DefaultNodeSettings settings}, i.e., the view
         *            settings after the apply call
         */
        void onApply(final NativeNodeContainer nnc, NodeSettingsRO previousModelSettings,
            NodeSettingsRO updatedModelSettings, NodeSettingsRO previousViewSettings,
            NodeSettingsRO updatedViewSettings);
    }

    /**
     * @return a {@link NodeSettingsService}-instance
     */
    protected abstract NodeSettingsService getNodeSettingsService();

    /**
     * @return a {@link VariableSettingsService}-instance
     */
    protected Optional<VariableSettingsService> getVariableSettingsService() {
        return Optional.empty();
    }

    /**
     * @return a legacy flow variable node dialog
     */
    public final NodeDialogPane createLegacyFlowVariableNodeDialog() {
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

        @Override
        protected NodeSettingsRO getDefaultViewSettings(final PortObjectSpec[] specs) {
            if (hasViewSettings()) {
                var ns = new NodeSettings("default_view_settings");
                getNodeSettingsService().getDefaultNodeSettings(Map.of(SettingsType.VIEW, ns), specs);
                return ns;
            } else {
                return super.getDefaultViewSettings(specs);
            }
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

}
