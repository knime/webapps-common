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
 *   Mar 23, 2022 (hornm): created
 */
package org.knime.core.webui.node.dialog.defaultdialog;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeLogger;
import org.knime.core.webui.node.dialog.VariableSettingsRO;
import org.knime.core.webui.node.dialog.VariableSettingsWO;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Utilities around {@link VariableSettingsRO} and {@link VariableSettingsWO}.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
final class VariableSettingsUtil {

    private VariableSettingsUtil() {
        // utility
    }

    /**
     * Serializes variable settings trees in to a json-object.
     *
     * @param modelVariableSettings the model variable settings, or {@code null}
     * @param viewVariableSettings the view variable settings or {@code null}
     * @param availableFlowVariableNames
     * @param mapper the mapper used to create the resulting {@link JsonNode}s
     * @return a new JsonNode-instance
     */
    static JsonNode fromVariableSettingsToJson(final VariableSettingsRO modelVariableSettings,
        final VariableSettingsRO viewVariableSettings, final Set<String> availableFlowVariableNames,
        final ObjectMapper mapper) {
        var root = mapper.createObjectNode();
        if (modelVariableSettings != null) {
            root.set("modelVariables", toJson(modelVariableSettings, availableFlowVariableNames, mapper));
        }
        if (viewVariableSettings != null) {
            root.set("viewVariables", toJson(viewVariableSettings, availableFlowVariableNames, mapper));
        }
        return root;
    }

    private static JsonNode toJson(final VariableSettingsRO variableSettings,
        final Set<String> availableFlowVariableNames, final ObjectMapper mapper) {
        if (availableFlowVariableNames.isEmpty()) {
            return mapper.createObjectNode();
        } else {
            return mapper.valueToTree(createSettingsTree(variableSettings, availableFlowVariableNames));
        }
    }

    private static Map<String, Object> createSettingsTree(final VariableSettingsRO variableSettings,
        final Set<String> flowVariables) {
        var settingsTree = new HashMap<String, Object>();
        createSettingsTree(variableSettings, flowVariables, settingsTree);
        return settingsTree;
    }

    private static void createSettingsTree(final VariableSettingsRO variableSettings, final Set<String> flowVariables,
        final Map<String, Object> settingsTreeNodeEnts) {
        for (var key : variableSettings.getVariableSettingsIterable()) {
            if (variableSettings.isVariableSetting(key)) {
                String usedVariable = null;
                String exposedVariable = null;
                try {
                    usedVariable = variableSettings.getUsedVariable(key);
                    exposedVariable = variableSettings.getExposedVariable(key);
                } catch (InvalidSettingsException ex) {
                    // should never happen
                }
                var isUsedVariableAvailable = usedVariable != null && flowVariables.contains(usedVariable);
                settingsTreeNodeEnts.put(key,
                    new SettingsTreeLeafEnt(usedVariable, isUsedVariableAvailable, exposedVariable));
            } else {
                VariableSettingsRO subSettings;
                try {
                    subSettings = variableSettings.getVariableSettings(key);
                } catch (InvalidSettingsException ex) {
                    NodeLogger.getLogger(VariableSettingsUtil.class).warn("No variable setting found for key " + key,
                        ex);
                    continue;
                }
                var settingsTree = new HashMap<String, Object>();
                createSettingsTree(subSettings, flowVariables, settingsTree);
                settingsTreeNodeEnts.put(key, settingsTree);
            }
        }
    }

    private static class SettingsTreeLeafEnt {

        private final String m_controllingFlowVariableName;

        private final String m_exposedFlowVariableName;

        private final boolean m_isControllingFlowVariableAvailable;

        SettingsTreeLeafEnt(final String controllingFlowVariableName, final boolean isControllingFlowVariableAvailable,
            final String exposedFlowVariableName) {
            m_controllingFlowVariableName = controllingFlowVariableName;
            m_isControllingFlowVariableAvailable = isControllingFlowVariableAvailable;
            m_exposedFlowVariableName = exposedFlowVariableName;
        }

        @SuppressWarnings("unused")
        public boolean isLeaf() {
            return true;
        }

        @SuppressWarnings("unused")
        public String getControllingFlowVariableName() {
            return m_controllingFlowVariableName;
        }

        @SuppressWarnings("unused")
        public Boolean isControllingFlowVariableAvailable() {
            return m_controllingFlowVariableName == null ? null : m_isControllingFlowVariableAvailable;
        }

        @SuppressWarnings("unused")
        public String getExposedFlowVariableName() {
            return m_exposedFlowVariableName;
        }

    }

}
