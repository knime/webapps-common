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
 *   Mar 10, 2023 (hornm): created
 */
package org.knime.core.webui.node.dialog;

import static org.knime.core.webui.data.util.InputSpecUtil.getInputSpecsExcludingVariablePort;

import java.util.EnumMap;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeLogger;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.node.workflow.NodeContainer;
import org.knime.core.node.workflow.NodeContext;
import org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.PasswordHolder;
import org.knime.core.webui.node.dialog.internal.VariableSettings;

/**
 * Helper to assemble the initial-data object for node dialogs (which encompasses a representation of the model and view
 * settings).
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
final class InitialData {

    private static final NodeLogger LOGGER = NodeLogger.getLogger(InitialData.class);

    private final NodeContainer m_nc;

    private final Set<SettingsType> m_settingsTypes;

    private final NodeSettingsService m_nodeSettingsService;

    protected InitialData(final NodeContainer nc, final Set<SettingsType> settingsTypes,
        final NodeSettingsService nodeSettingsService) {
        m_nc = nc;
        m_settingsTypes = settingsTypes;
        m_nodeSettingsService = nodeSettingsService;
    }

    String get() {
        var specs = getInputSpecsExcludingVariablePort(m_nc);

        NodeContext.pushContext(m_nc);
        PasswordHolder.activate(m_nc.getID());
        try {
            Map<SettingsType, NodeAndVariableSettingsRO> settings = getSettingsOverwrittenByVariables(specs);

            return m_nodeSettingsService.fromNodeSettings(settings, specs);
        } finally {
            PasswordHolder.deactivate();
            NodeContext.removeLastContext();
        }
    }

    private Map<SettingsType, NodeAndVariableSettingsRO>
        getSettingsOverwrittenByVariables(final PortObjectSpec[] specs) {
        Map<SettingsType, NodeAndVariableSettingsRO> resultSettings = new EnumMap<>(SettingsType.class);
        if (m_nc instanceof NativeNodeContainer nnc) {
            var isInitialLoad = false;
            for (var type : m_settingsTypes) {
                var settings = getSettingsOverwrittenByFlowVariables(type, nnc);
                if (settings.isEmpty()) {
                    isInitialLoad = true;
                }
                resultSettings.put(type,
                    NodeAndVariableSettingsProxy.createROProxy(
                        settings.orElseGet(() -> getDefaultSettings(specs, type)),
                        new VariableSettings(nnc.getNodeSettings(), type)));
            }
            if (!isInitialLoad) {
                revertOverridesIfInvalid(resultSettings, nnc);
            }
        }
        // else: SubNodeContainers (aka components) are ignored here since those retrieve the settings
        // from the contained configuration nodes and not from the component settings directly
        return resultSettings;
    }

    /*
     * Returns Optional.empty if there aren't settings, yet.
     */
    private static Optional<NodeSettings> getSettingsOverwrittenByFlowVariables(final SettingsType settingsType,
        final NativeNodeContainer nnc) {
        if (nnc.getFlowObjectStack() != null) {
            try {
                // a flow object stack is available (usually in case the node is connected)
                if (settingsType == SettingsType.VIEW) {
                    return nnc.getViewSettingsUsingFlowObjectStack();
                } else {
                    return Optional.ofNullable(nnc.getModelSettingsUsingFlowObjectStack());
                }
            } catch (InvalidSettingsException e) {
                LOGGER.error(String.format("Error overwriting settings of type %s with flow variables. "
                    + "So the flow variables are ignored. Error message is: %s.", settingsType, e.getMessage()), e);
                return getSettingsWithoutFlowVariableOverrides(settingsType, nnc);
            }
        } else {
            final var settings = getSettingsWithoutFlowVariableOverrides(settingsType, nnc);
            if (settings.isPresent() && settings.get().getChildCount() == 0) {
                return Optional.empty();
            }
            return settings;

        }
    }

    private static Optional<NodeSettings> getSettingsWithoutFlowVariableOverrides(final SettingsType settingsType,
        final NativeNodeContainer nnc) {
        try {
            return Optional.ofNullable(nnc.getNodeSettings().getNodeSettings(settingsType.getConfigKey()));
        } catch (InvalidSettingsException ex) { //NOSONAR
            // return empty optional in order to fall back to the default settings
            return Optional.empty();
        }
    }

    /**
     * Important assumption here (which is given): We'll end up here when no (model or view) settings have been stored
     * with the node, yet. It's the case when no settings have been applied for the node, yet (via the dialog). And if
     * no settings have been applied, yet, there can also be no flow variables configured to overwrite a setting. Thus,
     * no need to merge the default settings with flow variable values (as done above).
     */
    private NodeSettings getDefaultSettings(final PortObjectSpec[] specs, final SettingsType type) {
        final var settings = new NodeSettings("default_settings");
        m_nodeSettingsService.getDefaultNodeSettings(
            Map.of(type, NodeAndVariableSettingsProxy.createWOProxy(settings, new VariableSettings(settings, type))),
            specs);
        return settings;
    }

    private void revertOverridesIfInvalid(final Map<SettingsType, NodeAndVariableSettingsRO> settings,
        final NativeNodeContainer nnc) {
        try {
            m_nodeSettingsService.validateNodeSettingsAndVariables(settings);
        } catch (InvalidSettingsException ex) {
            LOGGER.error(String.format("Settings overwritten by flow variables are invalid. "
                + "So the flow variables are ignored. Error message is: %s.", ex.getMessage()), ex);
            m_settingsTypes.forEach(type -> {
                final var nodeSettings = getSettingsWithoutFlowVariableOverrides(type, nnc);
                settings.put(type, NodeAndVariableSettingsProxy.createROProxy(nodeSettings.orElseThrow(),
                    new VariableSettings(nnc.getNodeSettings(), type)));
            });
        }
    }

}
