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
 *   Dec 11, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog;

import java.util.Objects;
import java.util.Optional;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.webui.node.dialog.SettingsTreeTraversalUtil.VariableSettingsTree;
import org.knime.core.webui.node.dialog.internal.VariableSettings;

/**
 * For either model or view settings, this class is used in ApplyData to compare against the previous settings and
 * variables
 *
 * @author Paul Bärnreuther
 */
final class ApplyDataSettings {
    private final NodeSettings m_settings;

    private final Optional<NodeSettings> m_variables;

    private final NodeSettings m_previousSettings;

    private final Optional<NodeSettings> m_previousVariables;

    private final boolean m_changed;

    ApplyDataSettings(final NodeSettings nodeSettings, final NodeSettings previousNodeSettings, final SettingsType type)
        throws InvalidSettingsException {
        m_settings = ApplyData.getOrCreateSubSettings(nodeSettings, type);
        m_variables = getVariableSettings(nodeSettings, type);
        m_previousSettings = ApplyData.getOrCreateSubSettings(previousNodeSettings, type);
        m_previousVariables = getVariableSettings(previousNodeSettings, type);
        m_changed = settingsChanged() || variableSettingsChanged();
    }

    boolean hasChanged() {
        return m_changed;
    }

    private static Optional<NodeSettings> getVariableSettings(final NodeSettings nodeSettings, final SettingsType type)
        throws InvalidSettingsException {
        final String variablesConfigKey = type.getVariablesConfigKey();
        NodeSettings variablesSettingsTree;
        if (nodeSettings.containsKey(variablesConfigKey)
            && (variablesSettingsTree = nodeSettings.getNodeSettings(variablesConfigKey)).containsKey("tree")) {
            return Optional.of(variablesSettingsTree.getNodeSettings("tree"));
        }
        return Optional.empty();
    }

    private boolean settingsChanged() {
        if (getSettings() != null) {
            return !Objects.equals(getSettings(), getPreviousSettings());
        }
        return false;
    }

    private boolean variableSettingsChanged() {
        return settingsChanged(getVariables().orElse(null), getPreviousVariables().orElse(null));
    }

    private static boolean settingsChanged(final NodeSettings settings, final NodeSettings previousSettings) {
        if (settings != null) {
            return !Objects.equals(settings, previousSettings);
        }
        return false;
    }

    void revertSettingsOverwrittenByVariables() {
        if (getVariables().isPresent()) {
            SettingsTreeTraversalUtil.traverseSettingsTrees(
                new VariableSettingsTree(this),
                leaf -> {
                    if (isVariableControllingSetting(leaf.variables())) {
                        // replace the value of setting with the value of previousSetting
                        var parent = (NodeSettings)leaf.settings().getParent();
                        parent.addEntry(leaf.previousSettings());
                    }
                    return false;
                });
        }

    }

    private static boolean isVariableControllingSetting(final NodeSettingsRO variable) {
        return variable.getString(VariableSettings.USED_VARIABLE_CFG_KEY, null) != null;
    }

    /**
     * @return the previousVariables
     */
    public Optional<NodeSettings> getPreviousVariables() {
        return m_previousVariables;
    }

    /**
     * @return the previousSettings
     */
    public NodeSettings getPreviousSettings() {
        return m_previousSettings;
    }

    /**
     * @return the variables
     */
    public Optional<NodeSettings> getVariables() {
        return m_variables;
    }

    /**
     * @return the settings
     */
    public NodeSettings getSettings() {
        return m_settings;
    }
}
