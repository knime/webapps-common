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

import java.io.IOException;
import java.util.EnumMap;
import java.util.Objects;
import java.util.Set;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.config.base.AbstractConfigEntry;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.node.workflow.NodeContainer;
import org.knime.core.node.workflow.NodeID;
import org.knime.core.node.workflow.WorkflowManager;
import org.knime.core.webui.node.dialog.NodeDialog.OnApplyNodeModifier;
import org.knime.core.webui.node.dialog.internal.VariableSettings;
import org.knime.core.webui.node.view.NodeViewManager;

/**
 * Helper to parse and apply data representing node settings to a node.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
final class ApplyData {

    private final NodeContainer m_nc;

    private final Set<SettingsType> m_settingsTypes;

    private final NodeSettingsService m_nodeSettingsService;

    private final OnApplyNodeModiferWrapper m_onApplyModifierWrapper;

    ApplyData(final NodeContainer nc, final Set<SettingsType> settingsTypes,
        final NodeSettingsService nodeSettingsService, final OnApplyNodeModifier onApplyModifier) {
        m_nc = nc;
        m_settingsTypes = settingsTypes;
        m_nodeSettingsService = nodeSettingsService;
        m_onApplyModifierWrapper = (onApplyModifier != null && nc instanceof NativeNodeContainer)
            ? new OnApplyNodeModiferWrapper((NativeNodeContainer)nc, onApplyModifier) : null;
    }

    void applyData(final String data) throws IOException {
        var nodeSettings = new NodeSettings("node_settings");
        // to keep another copy of the settings to be able to tell whether
        // settings have been changed
        var wfm = m_nc.getParent();
        var nodeID = m_nc.getID();
        try {
            // write settings into nodeSettings
            wfm.saveNodeSettings(nodeID, nodeSettings);
            var previousNodeSettings = cloneSettings(nodeSettings, "previous_settings");

            // transfer data into settings, i.e., apply the data to the settings
            populateNewSettings(data, nodeSettings);

            // extract model and view settings from nodeSettings objects
            var modelSettings = getSubSettings(nodeSettings, SettingsType.MODEL);
            var viewSettings = getSubSettings(nodeSettings, SettingsType.VIEW);
            var previousModelSettings = getSubSettings(previousNodeSettings, SettingsType.MODEL);
            var previousViewSettings = getSubSettings(previousNodeSettings, SettingsType.VIEW);

            // determine whether model or view settings changed by comparing against the previousNodeSettings
            var modelSettingsChanged = settingsChanged(modelSettings, previousModelSettings)
                || variableSettingsChanged(SettingsType.MODEL, nodeSettings, previousNodeSettings);
            var viewSettingsChanged = settingsChanged(viewSettings, previousViewSettings)
                || variableSettingsChanged(SettingsType.VIEW, nodeSettings, previousNodeSettings);

            NodeSettings viewVariables = null;
            if (viewSettingsChanged) {
                if (nodeSettings.containsKey(SettingsType.VIEW.getVariablesConfigKey())) {
                    // if setting is overwritten by a flow variable, then replace the setting in 'viewSettings' by
                    // by the value given by 'previousViewSettings'
                    viewVariables =
                        nodeSettings.getNodeSettings(SettingsType.VIEW.getVariablesConfigKey()).getNodeSettings("tree");
                    replaceVariableControlledSettingsWithPreviousSettings(viewVariables, //
                        viewSettings, // NOSONAR: viewSettingsChanged is false if viewSettings is null
                        previousViewSettings);
                }

                // validate settings
                NodeViewManager.getInstance().validateSettings(m_nc, viewSettings);
            }

            if (modelSettingsChanged) {
                if (nodeSettings.containsKey(SettingsType.MODEL.getVariablesConfigKey())) {
                    // if setting is overwritten by flow variable, then replace the setting in 'modelSettings' by
                    // by the value given by 'previousModelSettings'
                    var modelVariables = nodeSettings.getNodeSettings(SettingsType.MODEL.getVariablesConfigKey())
                        .getNodeSettings("tree");
                    replaceVariableControlledSettingsWithPreviousSettings(modelVariables, //
                        modelSettings, // NOSONAR: modelSettingsChanged is false if modelSettings is null
                        previousModelSettings);
                }

                // 'persist' settings and load model settings into the node model
                wfm.loadNodeSettings(nodeID, nodeSettings);
            } else if (viewSettingsChanged) {
                loadViewSettingsIntoNode(wfm, nodeID, viewVariables, viewSettings, previousViewSettings, nodeSettings);
            }

            if (m_onApplyModifierWrapper != null) {
                // Note that if model settings passed to the close modifier have been overridden by flow variables,
                // these settings have been replaced with their value from previous settings (see above). This means
                // that (i) the close modifier cannot be controlled by flow variables and (ii) any changes applied
                // to settings controlled by flow variables are ignored by the close modifier. In other words, if a
                // setting is controlled by a flow variable, its previous and updated values, as passed to the close
                // modifier, are always identical.
                m_onApplyModifierWrapper.onApply(modelSettings, viewSettings, previousModelSettings,
                    previousViewSettings);
            }
        } catch (InvalidSettingsException ex) {
            throw new IOException("Invalid node settings: " + ex.getMessage(), ex);
        }
    }

    private void populateNewSettings(final String data, final NodeSettings nodeSettings)
        throws InvalidSettingsException {
        var settingsMap = new EnumMap<SettingsType, NodeAndVariableSettingsWO>(SettingsType.class);
        for (var settingsType : SettingsType.values()) {
            if (m_settingsTypes.contains(settingsType)) {
                var subSettings = getSubSettings(nodeSettings, settingsType);
                settingsMap.put(settingsType, NodeAndVariableSettingsProxy.createWOProxy(subSettings,
                    new VariableSettings(nodeSettings, settingsType)));
            }
        }
        m_nodeSettingsService.toNodeSettings(data, settingsMap);
    }

    private void loadViewSettingsIntoNode(final WorkflowManager wfm, final NodeID nodeID,
        final NodeSettings viewVariables, final NodeSettings viewSettings, final NodeSettings previousViewSettings,
        final NodeSettings nodeSettings) throws InvalidSettingsException {
        /**
         * We reset the node and trigger configure when
         * <ul>
         * <li>There are any flawed controlling view variables set in the dialog</li>
         * <li>The value of an exposed view setting changed</li>
         * <li>The node is idle. Here we need to trigger the configure again in case configure errors were resolved by
         * changing view variables.
         * </ul>
         */
        if (m_nc.getNodeContainerState().isIdle()
            || (viewVariables != null && variablesInduceReset(viewVariables, viewSettings, previousViewSettings))) {
            /** 'persist' settings and reset the node (i.e., do as if model settings had changed) */
            wfm.loadNodeSettings(nodeID, nodeSettings);
        } else {
            /** 'persist' view settings only (without resetting the node) */
            wfm.loadNodeViewSettings(nodeID, nodeSettings);
        }
    }

    private static boolean variablesInduceReset(final NodeSettingsRO variables, final NodeSettings settings,
        final NodeSettingsRO previousSettings) throws InvalidSettingsException {
        return exposedSettingsChanged(variables, settings, previousSettings) || variableSettingsFlawed(variables);

    }

    /**
     * Helper method to recursively determine whether there is any setting that has changed and that is exposed as a
     * variable
     */
    private static boolean exposedSettingsChanged(final NodeSettingsRO variables, final NodeSettings settings,
        final NodeSettingsRO previousSettings) {
        return traverseSettingsTrees(variables, settings, previousSettings,
            (variable, setting, previousSetting) -> isExposedAsVariableButNotControlledByAVariable(variable)
                && !setting.isIdentical(previousSetting));
    }

    private static String IS_FLAWED_CFG_KEY = VariableSettings.USED_VARIABLE_FLAWED_CFG_KEY;

    private static boolean variableSettingsFlawed(final NodeSettingsRO varSettings) throws InvalidSettingsException {

        if (varSettings.getBoolean(IS_FLAWED_CFG_KEY, false)) {
            return true;
        }
        for (var children = varSettings.children(); children.hasMoreElements();) {
            final var child = children.nextElement();

            if (child instanceof NodeSettingsRO nodeSettingsRO && variableSettingsFlawed(nodeSettingsRO)) {
                return true;
            }
        }
        return false;

    }

    private static void replaceVariableControlledSettingsWithPreviousSettings(final NodeSettingsRO variables,
        final NodeSettings settings, final NodeSettingsRO previousSettings) {
        traverseSettingsTrees(variables, settings, previousSettings, (variable, setting, previousSetting) -> {
            if (isVariableControllingSetting(variable)) {
                // replace the value of setting with the value of previousSetting
                var parent = (NodeSettings)setting.getParent();
                parent.addEntry(previousSetting);
            }
            return false;
        });
    }

    /**
     * Traverses the variable-settings-tree (i.e. whether a setting is controlled by a variable or exposed as a
     * variable) and a settings tree at the same time and evaluates the 'stopCriterion' at every leaf. Returns 'true' if
     * the stop criterion has been evaluated to 'true' during the traversal.
     */
    private static boolean traverseSettingsTrees(final NodeSettingsRO variables, final NodeSettings settings,
        final NodeSettingsRO previousSettings, final StopCriterion stopCriterion) {
        for (String key : variables) { // NOSONAR
            // runtime is quadratic in number of settings, since the getSettingsChildByKey has linear runtime
            var variable = getSettingsChildByKey(variables, key);
            if (!(variable instanceof NodeSettingsRO)) {
                continue; // unexpected (yet not unrecoverable) state: variable should have children
            }
            var setting = getSettingsChildByKey(settings, key);
            if (setting == null) {
                continue; // unexpected (yet not unrecoverable) state: setting should be present
            }
            var previousSetting = getSettingsChildByKey(previousSettings, key);
            if (previousSetting == null) {
                continue; // unexpected (yet not unrecoverable) state: setting should be present
            }

            if (setting instanceof NodeSettingsRO && previousSetting instanceof NodeSettingsRO) {
                if (traverseSettingsTrees((NodeSettingsRO)variable, (NodeSettings)setting,
                    (NodeSettingsRO)previousSetting, stopCriterion)) {
                    return true;
                }
            } else if (stopCriterion.stop((NodeSettingsRO)variable, setting, previousSetting)) {
                return true;
            }
        }
        return false;
    }

    private interface StopCriterion {
        boolean stop(NodeSettingsRO variable, AbstractConfigEntry setting, AbstractConfigEntry previousSetting);
    }

    // Helper method to get a child of arbitrary type by its key / name
    private static AbstractConfigEntry getSettingsChildByKey(final NodeSettingsRO settings, final String key) {
        for (var i = 0; i < settings.getChildCount(); i++) {
            var treeNode = settings.getChildAt(i);
            if (!(treeNode instanceof AbstractConfigEntry)) {
                continue; // unexpected (yet not unrecoverable) state: setting should be of type AbstractConfigEntry
            }
            var ace = (AbstractConfigEntry)treeNode;
            if (ace.getKey().equals(key)) {
                return ace;
            }
        }
        return null;
    }

    private static boolean isVariableControllingSetting(final NodeSettingsRO variable) {
        return variable.getString(VariableSettings.USED_VARIABLE_CFG_KEY, null) != null;
    }

    // Helper method to determine whether a given setting is exposed as a variable
    private static boolean isExposedAsVariableButNotControlledByAVariable(final NodeSettingsRO variable) {
        return variable.getString(VariableSettings.EXPOSED_VARIABLE_CFG_KEY, null) != null
            && variable.getString(VariableSettings.USED_VARIABLE_CFG_KEY, null) == null;
    }

    private static boolean settingsChanged(final NodeSettings settings, final NodeSettings previousSettings) {
        if (settings != null) {
            return !Objects.equals(settings, previousSettings);
        }
        return false;
    }

    private static boolean variableSettingsChanged(final SettingsType type, final NodeSettings nodeSettings,
        final NodeSettings previousNodeSettings) throws InvalidSettingsException {
        final String variablesConfigKey = type.getVariablesConfigKey();
        final var varSettings = nodeSettings.containsKey(variablesConfigKey) //
            ? nodeSettings.getNodeSettings(variablesConfigKey) //
            : null;
        final var previousVarSettings = previousNodeSettings.containsKey(variablesConfigKey) //
            ? previousNodeSettings.getNodeSettings(variablesConfigKey) //
            : null;
        return settingsChanged(varSettings, previousVarSettings);
    }

    private NodeSettings getSubSettings(final NodeSettings settings, final SettingsType type)
        throws InvalidSettingsException {
        if (hasSettings(type)) {
            return getOrCreateSubSettings(settings, type.getConfigKey());
        } else if (type == SettingsType.MODEL) {
            // even if the node has no model settings,
            // we still have to add empty model settings since the wfm expects node settings to be present
            settings.addNodeSettings(type.getConfigKey());
        }
        return null;
    }

    private static NodeSettings cloneSettings(final NodeSettings s, final String key) {
        var res = new NodeSettings(key);
        s.copyTo(res);
        return res;
    }

    private static NodeSettings getOrCreateSubSettings(final NodeSettings settings, final String key)
        throws InvalidSettingsException {
        NodeSettings subSettings;
        if (settings.containsKey(key)) {
            subSettings = settings.getNodeSettings(key);
        } else {
            subSettings = new NodeSettings(key);
            settings.addNodeSettings(subSettings);
        }
        return subSettings;
    }

    private boolean hasSettings(final SettingsType type) {
        return m_settingsTypes.contains(type);
    }

    void cleanUp() {
        if (m_onApplyModifierWrapper != null) {
            m_onApplyModifierWrapper.onClose();
        }
    }

    /**
     * Wraps an {@link OnApplyNodeModifier}, stores / defers settings updates on apply and finally delegates the applied
     * updates to the underlying {@link OnApplyNodeModifier} on dialog close.
     */
    private static final class OnApplyNodeModiferWrapper {

        private final NativeNodeContainer m_nnc;

        private final OnApplyNodeModifier m_modifier;

        private NodeSettingsRO m_initialModelSettings;

        private NodeSettingsRO m_initialViewSettings;

        private NodeSettingsRO m_updatedModelSettings;

        private NodeSettingsRO m_updatedViewSettings;

        private OnApplyNodeModiferWrapper(final NativeNodeContainer nnc, final OnApplyNodeModifier modifier) {
            m_nnc = nnc;
            m_modifier = modifier;
        }

        private void onApply(final NodeSettings modelSettings, final NodeSettings viewSettings,
            final NodeSettings previousModelSettings, final NodeSettings previousViewSettings) {
            if (modelSettings != null) {
                if (m_initialModelSettings == null) {
                    m_initialModelSettings = previousModelSettings;
                }
                m_updatedModelSettings = modelSettings;
            }
            if (viewSettings != null) {
                if (m_initialViewSettings == null) {
                    m_initialViewSettings = previousViewSettings;
                }
                m_updatedViewSettings = viewSettings;
            }
        }

        private void onClose() {
            m_modifier.onApply(m_nnc, m_initialModelSettings, m_updatedModelSettings, m_initialViewSettings,
                m_updatedViewSettings);
            m_initialModelSettings = m_initialViewSettings = m_updatedModelSettings = m_updatedViewSettings = null;
        }
    }

}
