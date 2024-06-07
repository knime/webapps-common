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
 *   Jan 5, 2022 (hornm): created
 */
package org.knime.core.webui.node.dialog.defaultdialog;

import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.FIELD_NAME_DATA;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.FIELD_NAME_SCHEMA;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.FIELD_NAME_UI_SCHEMA;
import static org.knime.core.webui.node.dialog.defaultdialog.settingsconversion.TextToJsonUtil.textToJson;
import static org.knime.core.webui.node.dialog.defaultdialog.settingsconversion.VariableSettingsUtil.addVariableSettingsToRootJson;
import static org.knime.core.webui.node.dialog.defaultdialog.settingsconversion.VariableSettingsUtil.rootJsonToVariableSettings;
import static org.knime.core.webui.node.dialog.defaultdialog.util.MapValuesUtil.restrictValues;

import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.node.workflow.NodeContext;
import org.knime.core.webui.node.dialog.NodeAndVariableSettingsRO;
import org.knime.core.webui.node.dialog.NodeAndVariableSettingsWO;
import org.knime.core.webui.node.dialog.NodeSettingsService;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.VariableSettingsRO;
import org.knime.core.webui.node.dialog.configmapping.NodeSettingsCorrectionUtil;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsDataUtil;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsSettings;
import org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.PasswordHolder;
import org.knime.core.webui.node.dialog.defaultdialog.settingsconversion.JsonDataToDefaultNodeSettingsUtil;
import org.knime.core.webui.node.dialog.defaultdialog.settingsconversion.NodeSettingsToJsonFormsSettings;
import org.knime.core.webui.node.dialog.defaultdialog.settingsconversion.ToNodeSettingsUtil;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.impl.AsyncChoicesHolder;
import org.knime.core.webui.node.dialog.internal.InternalVariableSettings;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * A {@link NodeSettingsService} that translates {@link DefaultNodeSettings}-implementations into
 * {@link NodeSettings}-objects (on data apply) and vice-versa (initial data).
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
final class DefaultNodeSettingsService implements NodeSettingsService {

    private final AsyncChoicesHolder m_asyncChoicesHolder;

    private final Map<SettingsType, Class<? extends DefaultNodeSettings>> m_settingsClasses;

    /**
     * @param settingsClasses map that associates a {@link DefaultNodeSettings} class-with a {@link SettingsType}
     * @param asyncChoicesHolder used to start asynchronous computations of choices during the ui-schema generation.
     */
    public DefaultNodeSettingsService(final Map<SettingsType, Class<? extends DefaultNodeSettings>> settingsClasses,
        final AsyncChoicesHolder asyncChoicesHolder) {
        m_settingsClasses = settingsClasses;
        m_asyncChoicesHolder = asyncChoicesHolder;
    }

    @Override
    public void toNodeSettings(final String textSettings, final Map<SettingsType, NodeSettingsRO> previousSettings,
        final Map<SettingsType, NodeAndVariableSettingsWO> settings) {

        final var root = textToJson(textSettings);
        final var defaultNodeSettings =
            JsonDataToDefaultNodeSettingsUtil.toDefaultNodeSettings(m_settingsClasses, root.get(FIELD_NAME_DATA));
        final var extractedNodeSettings = ToNodeSettingsUtil.toNodeSettings(defaultNodeSettings);
        final var extractedVariableSettings = extractVariableSettings(settings, root);

        alignSettingsWithFlowVariables(//
            extractedNodeSettings, previousSettings, extractedVariableSettings, defaultNodeSettings);
        copyLeftToRight(extractedNodeSettings, settings);
        rootJsonToVariableSettings(root, restrictValues(settings));
    }

    private static Map<SettingsType, VariableSettingsRO>
        extractVariableSettings(final Map<SettingsType, NodeAndVariableSettingsWO> settings, final JsonNode root) {
        final var currentFlowVars = settings.keySet().stream()
            .collect(Collectors.toMap(Function.identity(), k -> new InternalVariableSettings()));
        rootJsonToVariableSettings(root, restrictValues(currentFlowVars));
        return restrictValues(currentFlowVars);
    }

    private void alignSettingsWithFlowVariables( //
        final Map<SettingsType, NodeSettings> settings, //
        final Map<SettingsType, NodeSettingsRO> previousSettings, //
        final Map<SettingsType, VariableSettingsRO> extractedVariableSettings, //
        final Map<SettingsType, DefaultNodeSettings> defaultNodeSettingsMap //
    ) {
        for (var key : settings.keySet()) { // NOSONAR
            final var configMappings =
                DefaultNodeSettings.getConfigMappings(m_settingsClasses.get(key), defaultNodeSettingsMap.get(key));
            NodeSettingsCorrectionUtil.correctNodeSettingsRespectingFlowVariables(configMappings, settings.get(key),
                previousSettings.get(key), extractedVariableSettings.get(key));
        }
    }

    private static void copyLeftToRight(final Map<SettingsType, NodeSettings> extractedNodeSettings,
        final Map<SettingsType, NodeAndVariableSettingsWO> settings) {
        extractedNodeSettings.entrySet().forEach(entry -> entry.getValue().copyTo(settings.get(entry.getKey())));
    }

    @Override
    public String fromNodeSettings(final Map<SettingsType, NodeAndVariableSettingsRO> settings,
        final PortObjectSpec[] specs) {
        var context = createContext(specs);
        final var jsonFormsSettings = new NodeSettingsToJsonFormsSettings(context, m_settingsClasses)
            .nodeSettingsToJsonFormsSettingsOrDefault(restrictValues(settings));
        final var mapper = JsonFormsDataUtil.getMapper();
        final var root = jsonFormsSettingsToJson(jsonFormsSettings, mapper);
        addVariableSettingsToRootJson(root, restrictValues(settings), context);
        return jsonToString(root, mapper);
    }

    private ObjectNode jsonFormsSettingsToJson(final JsonFormsSettings jsonFormsSettings, final ObjectMapper mapper) {
        final var root = mapper.createObjectNode();
        root.set(FIELD_NAME_DATA, jsonFormsSettings.getData());
        root.set(FIELD_NAME_SCHEMA, jsonFormsSettings.getSchema());
        root.putRawValue(FIELD_NAME_UI_SCHEMA, jsonFormsSettings.getUiSchema(m_asyncChoicesHolder));
        return root;
    }

    private static String jsonToString(final ObjectNode root, final ObjectMapper mapper) {
        try {
            return mapper.writeValueAsString(root);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException(
                String.format("Exception when reading data from node settings: %s", e.getMessage()), e);
        }
    }

    @Override
    public void validateNodeSettingsAndVariables(final Map<SettingsType, NodeAndVariableSettingsRO> settings)
        throws InvalidSettingsException {
        for (var entry : settings.entrySet()) {
            DefaultNodeSettings.loadSettings(entry.getValue(), m_settingsClasses.get(entry.getKey()));
        }
    }

    private static DefaultNodeSettingsContext createContext(final PortObjectSpec[] specs) {
        return DefaultNodeSettings.createDefaultNodeSettingsContext(specs);
    }

    /**
     * {@inheritDoc}
     *
     * We need to clean up the passwords which were stored during serialization in {@link #fromNodeSettings}
     */
    @Override
    public void deactivate() {
        final var nodeId = NodeContext.getContext().getNodeContainer().getID();
        PasswordHolder.removeAllPasswordsOfDialog(nodeId);
    }

}
