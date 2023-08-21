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
 *   Aug 18, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.dataservice;

import java.util.List;
import java.util.Map;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.workflow.VariableType;
import org.knime.core.node.workflow.VariableTypeRegistry;
import org.knime.core.webui.node.dialog.NodeSettingsService;
import org.knime.core.webui.node.dialog.SettingsType;

/**
 * Used to extract the possible types of flow variables from text settings given a node settings service. These text
 * settings come from the front-end and it is necessary to depend on them since the possible flow variables are defined
 * by the {@link NodeSettings} they would be persisted to.
 *
 * @author Paul Bärnreuther
 */
class FlowVariableTypesExtractor {

    private final NodeSettingsService m_nodeSettingsService;

    private final VariableTypeRegistry m_valueTypeReqistry;

    FlowVariableTypesExtractor(final NodeSettingsService nodeSettingsService) {
        m_nodeSettingsService = nodeSettingsService;
        m_valueTypeReqistry = VariableTypeRegistry.getInstance();
    }

    VariableType<?>[] getTypes(final SettingsType settingsType, final List<String> path, final String configKey,
        final String textSettings) throws InvalidSettingsException {
        final var nodeSettings = toNodeSettings(settingsType, textSettings);
        final var fieldNodeSetting = atPath(nodeSettings, path);
        return getTypes(fieldNodeSetting, configKey);
    }

    private NodeSettings toNodeSettings(final SettingsType settingsType, final String textSettings) {
        final var nodeSettings = new NodeSettings("current_dialog_settings");
        m_nodeSettingsService.toNodeSettings(textSettings, Map.of(settingsType, nodeSettings));
        return nodeSettings;
    }

    private static NodeSettings atPath(final NodeSettings nodeSettings, final List<String> path)
        throws InvalidSettingsException {
        var nodeSettingsAtPath = nodeSettings;
        for (var key : path) {
            nodeSettingsAtPath = nodeSettingsAtPath.getNodeSettings(key);
        }
        return nodeSettingsAtPath;
    }

    private VariableType<?>[] getTypes(final NodeSettings nodeSettings, final String configKey) {
        return m_valueTypeReqistry.getOverwritingTypes(nodeSettings, configKey);
    }

}
