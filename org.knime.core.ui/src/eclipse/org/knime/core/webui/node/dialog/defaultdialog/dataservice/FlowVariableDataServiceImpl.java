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
 *   Oct 24, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.dataservice;

import static java.util.stream.Collectors.toMap;
import static org.knime.core.webui.node.dialog.defaultdialog.dataservice.DefaultNodeDialogDataServiceImpl.createContext;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.FIELD_NAME_DATA;
import static org.knime.core.webui.node.dialog.defaultdialog.settingsconversion.TextToJsonUtil.textToJson;
import static org.knime.core.webui.node.dialog.defaultdialog.settingsconversion.VariableSettingsUtil.rootJsonToVariableSettings;

import java.util.Arrays;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.config.ConfigEditTreeModel;
import org.knime.core.node.workflow.FlowVariable;
import org.knime.core.node.workflow.VariableType;
import org.knime.core.node.workflow.VariableTypeRegistry;
import org.knime.core.webui.data.DataServiceException;
import org.knime.core.webui.node.dialog.NodeDialog;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeDialog;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.internal.VariableSettings;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * A data service used in the {@link DefaultNodeDialog} or any other {@link NodeDialog} using the same page and having
 * flow variables.
 *
 * @noreference because it indirectly leaks implementation details (jackson)
 *
 * @author Paul Bärnreuther
 */
public final class FlowVariableDataServiceImpl implements FlowVariableDataService {
    private static final int ABBREVIATION_THRESHOLD = 50;

    private final DefaultDialogDataConverter m_converter;

    /**
     * @param converter used to transform between text settings from the front-end to {@link NodeSettings} and back
     */
    public FlowVariableDataServiceImpl(final DefaultDialogDataConverter converter) {
        m_converter = converter;
    }

    @Override
    public Map<String, Collection<PossibleFlowVariable>> getAvailableFlowVariables(final String textSettings,
        final LinkedList<String> path) throws InvalidSettingsException {
        final var firstPathElement = path.pollFirst();
        final SettingsType settingsType = extractSettingsType(firstPathElement);
        final var nodeSettings =
            m_converter.dataJsonToNodeSettings(textToJson(textSettings).get(FIELD_NAME_DATA), settingsType);
        final var variableTypes = FlowVariableTypesExtractorUtil.getTypes(nodeSettings, path);
        final var context = createContext();
        return Arrays.asList(variableTypes).stream()
            .collect(toMap(VariableType::getIdentifier, type -> getPossibleFlowVariables(context, type)));
    }

    private static List<PossibleFlowVariable> getPossibleFlowVariables(final DefaultNodeSettingsContext context,
        final VariableType<?> type) {
        return context.getAvailableInputFlowVariables(type).values().stream()
            .map(FlowVariableDataServiceImpl::toPossibleFlowVariable).toList();
    }

    static PossibleFlowVariable toPossibleFlowVariable(final FlowVariable flowVariable) {
        var value = flowVariable.getValueAsString();
        boolean abbreviated = false;
        if (value != null && value.length() > ABBREVIATION_THRESHOLD) {
            value = StringUtils.abbreviate(value, ABBREVIATION_THRESHOLD);
            abbreviated = true;
        }
        return new PossibleFlowVariable(flowVariable.getName(), value, abbreviated);
    }

    @Override
    public Object getFlowVariableOverrideValue(final String textSettings, final LinkedList<String> dataPath)
        throws DataServiceException {
        try {
            var context = createContext();
            final var settingsType = extractSettingsType(dataPath.get(0));
            final var settingsTree = textSettingsToNodeAndVariableSettings(textSettings, settingsType, context);
            final var data = m_converter.nodeSettingsToDataJson(settingsType, settingsTree, context);
            return jsonAtPath(dataPath, data);
        } catch (InvalidSettingsException e) {
            throw new DataServiceException(e.getMessage(),
                String.format("Because of an invalid current value of the controlling flow variable, "
                    + "it is not possible to preview this value in the dialog.", String.join(".", dataPath)));
        }
    }

    private NodeSettings textSettingsToNodeAndVariableSettings(final String textSettings, final SettingsType type,
        final DefaultNodeSettingsContext context) throws InvalidSettingsException {
        final var root = textToJson(textSettings);
        final var nodeSettings = m_converter.dataJsonToNodeSettings(root.get(FIELD_NAME_DATA), type);
        final var variableNodeSettings = new NodeSettings(type.getVariablesConfigKey());
        final var variableSettings = new VariableSettings(variableNodeSettings, nodeSettings);
        rootJsonToVariableSettings(root, Map.of(type, variableSettings));
        final var allVariables =
            context.getAvailableInputFlowVariables(VariableTypeRegistry.getInstance().getAllTypes());
        final var configEdit = ConfigEditTreeModel.create(nodeSettings, variableNodeSettings);
        configEdit.overwriteSettings(nodeSettings, allVariables);
        return nodeSettings;
    }

    private static JsonNode jsonAtPath(final LinkedList<String> path, final JsonNode jsonData) {
        final var jsonPointer = "/" + String.join("/", path);
        return jsonData.at(jsonPointer);
    }

    private static SettingsType extractSettingsType(final String firstPathElement) {
        final SettingsType settingsType;
        if (SettingsType.MODEL.getConfigKey().equals(firstPathElement)) {
            settingsType = SettingsType.MODEL;
        } else if (SettingsType.VIEW.getConfigKey().equals(firstPathElement)) {
            settingsType = SettingsType.VIEW;
        } else {
            throw new IllegalArgumentException(String
                .format("First element of the path must be either 'view' or 'model' but was %s", firstPathElement));
        }
        return settingsType;
    }

}
