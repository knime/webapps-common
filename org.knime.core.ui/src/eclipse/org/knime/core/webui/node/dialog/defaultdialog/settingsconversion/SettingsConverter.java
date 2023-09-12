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
 *   Aug 29, 2023 (hornm): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.settingsconversion;

import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.FIELD_NAME_DATA;
import static org.knime.core.webui.node.dialog.defaultdialog.util.MapValuesUtil.mapValues;

import java.util.Collection;
import java.util.Map;
import java.util.Set;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.config.ConfigEditTreeModel;
import org.knime.core.node.workflow.VariableTypeRegistry;
import org.knime.core.webui.node.dialog.NodeAndVariableSettingsWO;
import org.knime.core.webui.node.dialog.NodeSettingsService;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.VariableSettingsRO;
import org.knime.core.webui.node.dialog.VariableSettingsWO;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsDataUtil;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsSettings;
import org.knime.core.webui.node.dialog.internal.VariableSettings;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * This class is used to transform between the several representation of the data underlying a node dialog using the
 * DefaultNodeSettingsService:
 * <ul>
 * <li>Persist level: {@link NodeSettings} with associated {@link VariableSettings}</li>
 * <li>{@link DefaultNodeSettings}: Can be constructed without any other representation, from the persist level or
 * de-serialized from JSON.</li>
 * <li>Front-end/JSON representation: A representation of the data serialized from {@link DefaultNodeSettings} is part
 * of the {@link JsonFormsSettings}. Also flow variables are stored as JSON as defined in {@link VariableSettingsUtil}.
 * I.e. this class assumes that this representation is received by /sent to the frontend as follows:
 *
 * <pre>
 * {
 *  {@link JsonFormsConsts#FIELD_NAME_DATA "data"}: {
 *      "model": ... (optional)
 *      "view": ... (optional)
 *  },
 *  {@link SettingsConverter#FLOW_VARIABLE_SETTINGS_KEY "flowVariableSettings"}: ...,
 *  ...
 * }
 * </pre>
 *
 * </li>
 * <ul>
 *
 * The converter is meant to be used in the {@link NodeSettingsService} as well as in the data service of the default
 * node dialog. Hereby it is possible to use this converter for only a part of the conversion defined by one
 * {@link SettingsType} even if both model and view settings are present in any of the conversion steps.
 *
 *
 * @author Paul Bärnreuther
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
public final class SettingsConverter {

    private static final String FLOW_VARIABLE_SETTINGS_KEY = "flowVariableSettings";

    private final Map<SettingsType, Class<? extends DefaultNodeSettings>> m_settingsClasses;

    /**
     * @param settingsClasses the classes of the {@link DefaultNodeSettings} associated to the settings types (model
     *            and/or view).
     */
    public SettingsConverter(final Map<SettingsType, Class<? extends DefaultNodeSettings>> settingsClasses) {
        m_settingsClasses = settingsClasses;

    }

    /**
     * Converter for only converting one type of settings. Note that some of its conversion methods might fail when they
     * are used with a different type.
     *
     * @param type the type of the settings
     * @param settingsClass the default node setting of this type
     */
    public SettingsConverter(final SettingsType type, final Class<? extends DefaultNodeSettings> settingsClass) {
        this(Map.of(type, settingsClass));
    }

    /**
     * Transforms textSettings from the front-end to nodeSettings and variableSettings and writes them to the given
     * {@link NodeAndVariableSettingsWO} objects.
     *
     * @param textSettings with a key {@link JsonFormsConsts#FIELD_NAME_DATA "data"} with nested
     *            {@link SettingsType#getConfigKey() configKey} of the given types ("model" and/or "view") as well as a
     *            key {@link SettingsConverter#FLOW_VARIABLE_SETTINGS_KEY "flowVariableSettings"} containing the current
     *            controlling/exposed flow variables in the schema as created in
     *            {@link VariableSettingsUtil#fromVariableSettingsToJson}.
     * @param settings the map of objects which the result of the extraction is written to. Note that the keys of this
     *            map define which types of nodeSettings are extracted.
     */
    public void textSettingsToNodeAndVariableSettings(final String textSettings,
        final Map<SettingsType, NodeAndVariableSettingsWO> settings) {
        final var root = textToJson(textSettings);
        rootJsonToNodeSettings(root, mapValues(settings, v -> v));
        rootJsonToVariableSettings(root, mapValues(settings, v -> v));
    }

    /**
     * Transforms textSettings from the front-end to variableSettings and writes them to the given
     * {@link VariableSettingsWO} objects.
     *
     * @param textSettings with a key {@link SettingsConverter#FLOW_VARIABLE_SETTINGS_KEY "flowVariableSettings"}
     *            containing the current controlling/exposed flow variables in the schema as created in
     *            {@link VariableSettingsUtil#fromVariableSettingsToJson}.
     * @param settings the map of objects which the result of the extraction is written to. Note that the keys of this
     *            map define which types of nodeSettings are extracted.
     */
    public static void textSettingsToVariableSettings(final String textSettings,
        final Map<SettingsType, VariableSettingsWO> settings) {
        final var root = textToJson(textSettings);
        rootJsonToVariableSettings(root, settings);
    }

    /**
     * Transforms textSettings form the front-end to node settings with an associated variables mask of a certain type.
     *
     * @param textSettings with a key {@link JsonFormsConsts#FIELD_NAME_DATA "data"} with a nested
     *            {@link SettingsType#getConfigKey() configKey} of the given types ("model" or "view") as well as a key
     *            {@link SettingsConverter#FLOW_VARIABLE_SETTINGS_KEY "flowVariableSettings"} containing the current
     *            controlling/exposed flow variables in the schema as created in
     *            {@link VariableSettingsUtil#fromVariableSettingsToJson}.
     * @param type the type of the to be extracted node settings
     * @return node settings together with a variable mask
     */
    public NodeSettingsWithVariableMask textSettingsToNodeAndVariableSettings(final String textSettings,
        final SettingsType type) {
        final var root = textToJson(textSettings);
        final var nodeSettings = rootJsonToNodeSettings(root, type);
        final var variableNodeSettings = new NodeSettings(type.getVariablesConfigKey());
        final var variableSettings = new VariableSettings(variableNodeSettings, nodeSettings);
        rootJsonToVariableSettings(root, Map.of(type, variableSettings));
        return new NodeSettingsWithVariableMask(nodeSettings, variableNodeSettings);
    }

    /**
     * This record is used as result of the combined extraction of node and variable settings from a front-end
     * representation of these data.
     *
     * @param settingsTree the extracted node settings (not overwritten by the variable settings)
     * @param variableMask the underlying {@link NodeSettings} representation of the variable settings.
     */
    public record NodeSettingsWithVariableMask(NodeSettings settingsTree, NodeSettings variableMask) {

        private void overwriteSettingsWithVariables(final DefaultNodeSettingsContext context)
            throws InvalidSettingsException {
            final var allVariables =
                context.getAvailableInputFlowVariables(VariableTypeRegistry.getInstance().getAllTypes());
            final var configEdit = ConfigEditTreeModel.create(settingsTree, variableMask);
            configEdit.overwriteSettings(settingsTree, allVariables);
        }

        /**
         * Overrides the settingsTree using the given variableMask
         *
         * @param context form which the available flow variables are fetched
         * @return the settingsTree with overwritten entries as defined by the given variableMask
         * @throws InvalidSettingsException if the settings can't be overwritten by the supplied variableMask
         */
        public NodeSettings getOverwrittenSettingsTree(final DefaultNodeSettingsContext context)
            throws InvalidSettingsException {
            overwriteSettingsWithVariables(context);
            return settingsTree;
        }

    }

    private static void rootJsonToVariableSettings(final JsonNode root,
        final Map<SettingsType, VariableSettingsWO> settings) {
        VariableSettingsUtil.fromJsonToVariableSettings(root.get(FLOW_VARIABLE_SETTINGS_KEY), settings,
            JsonFormsDataUtil.getMapper());
    }

    private static JsonNode textToJson(final String textSettings) {
        var mapper = JsonFormsDataUtil.getMapper();
        try {
            return mapper.readTree(textSettings);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException(
                String.format("Exception when writing data to node settings: %s", e.getMessage()), e);
        }
    }

    /**
     * Transforms the JSON representation of the settings form the front-end to node settings.
     *
     * @param root with a key {@link JsonFormsConsts#FIELD_NAME_DATA "data"} and nested
     *            {@link SettingsType#getConfigKey() configKeys} of the given types of the nodeSettings ("model" and/or
     *            "view").
     * @param nodeSettings the map of node settings which the result of the extraction is written to. Note that the keys
     *            of this map define which types of nodeSettings are extracted.
     */
    public void rootJsonToNodeSettings(final JsonNode root, final Map<SettingsType, NodeSettingsWO> nodeSettings) {
        new JsonDataToNodeSettings(m_settingsClasses).toNodeSettings(getDataJson(root), nodeSettings);
    }

    /**
     * Transforms the JSON representation of the settings form the front-end to node settings of a certain type.
     *
     * @param root with a key {@link JsonFormsConsts#FIELD_NAME_DATA "data"} and a nested
     *            {@link SettingsType#getConfigKey() configKey} of the type ("model" or "view")
     * @param type the type of the to be extracted node settings
     * @return the node settings of the given type
     */
    public NodeSettings rootJsonToNodeSettings(final JsonNode root, final SettingsType type) {
        return new JsonDataToNodeSettings(m_settingsClasses).toNodeSettings(getDataJson(root), type);
    }

    private static JsonNode getDataJson(final JsonNode root) {
        return root.get(FIELD_NAME_DATA);
    }

    /**
     * Transforms textSettings form the front-end to node settings of a certain type.
     *
     * @param textSettings with a key {@link JsonFormsConsts#FIELD_NAME_DATA "data"} and a nested
     *            {@link SettingsType#getConfigKey() configKey} of the type ("model" or "view")
     * @param type the type of the to be extracted node settings
     * @return the node settings of the given type
     */
    public NodeSettings textSettingsToNodeSettings(final String textSettings, final SettingsType type) {
        return rootJsonToNodeSettings(textToJson(textSettings), type);
    }

    /**
     * Loads node settings to {@link DefaultNodeSettings} constructing them freshly if this fails. Then the
     * {@link DefaultNodeSettings} are transformed to {@link JsonFormsSettings}.
     *
     * @param type the type of settings that is used
     * @param nodeSettings the input node settings of the given type
     * @param context used to construct fresh {@link DefaultNodeSettings} if necessary and supplied to the output
     *            {@link JsonFormsSettings}
     * @return The resulting representation as {@link JsonFormsSettings}.
     */
    public JsonFormsSettings nodeSettingsToJsonFormsSettings(final SettingsType type, final NodeSettingsRO nodeSettings,
        final DefaultNodeSettingsContext context) {
        return nodeSettingsToJsonFormsSettings(Map.of(type, nodeSettings), context);
    }

    /**
     * Loads node settings to {@link DefaultNodeSettings} constructing them freshly if this fails. Then the
     * {@link DefaultNodeSettings} are transformed to {@link JsonFormsSettings}.
     *
     * @param settings the input node settings
     * @param context used to construct fresh {@link DefaultNodeSettings} if necessary and supplied to the output
     *            {@link JsonFormsSettings}
     * @return The resulting representation as {@link JsonFormsSettings}.
     */
    public JsonFormsSettings nodeSettingsToJsonFormsSettings(final Map<SettingsType, NodeSettingsRO> settings,
        final DefaultNodeSettingsContext context) {
        return new NodeSettingsToJsonFormsSettings(context, m_settingsClasses)
            .nodeSettingsToJsonFormsSettings(settings);
    }

    /**
     * Transforms the given variable settings to an object node which is to be provide within the top-level node of the
     * data provided to the front-end (i.e. it already contains the key
     * {@link SettingsConverter#FLOW_VARIABLE_SETTINGS_KEY}).
     *
     * @param settings a map of variable settings
     * @param context used to get the available flow variables
     * @return an {@link ObjectNode} of with a key {@link SettingsConverter#FLOW_VARIABLE_SETTINGS_KEY} under which the
     *         variables are listed as constructed in {@link VariableSettingsUtil#fromVariableSettingsToJson}
     */
    public static ObjectNode variableSettingsToJsonObject(final Map<SettingsType, VariableSettingsRO> settings,
        final DefaultNodeSettingsContext context) {
        final var mapper = JsonFormsDataUtil.getMapper();
        final var objectNode = mapper.createObjectNode();
        final var variableSettingsJson = VariableSettingsUtil.fromVariableSettingsToJson(settings,
            Set.of(context.getAvailableFlowVariableNames()), mapper);
        objectNode.set(FLOW_VARIABLE_SETTINGS_KEY, variableSettingsJson);
        return objectNode;
    }

    /**
     * Construct new default node settings and save them to node settings.
     *
     * @param settings to which the constructed node settings are written
     * @param context the {@link DefaultNodeSettingsContext} used to construct the intermediate
     *            {@link DefaultNodeSettings} objects.
     */
    public void saveDefaultNodeSettings(final Map<SettingsType, NodeSettingsWO> settings,
        final DefaultNodeSettingsContext context) {
        new DefaultNodeSettingsClassToNodeSettings(context, m_settingsClasses).saveDefaultNodeSetting(settings);
    }

    /**
     * @return the {@link DefaultNodeSettings}-classes this settings converter is associated with
     */
    public Collection<Class<? extends DefaultNodeSettings>> getSettingsClasses() {
        return m_settingsClasses.values();
    }

}
