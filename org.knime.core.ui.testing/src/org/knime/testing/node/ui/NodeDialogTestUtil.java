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
 *   Dec 15, 2023 (hornm): created
 */
package org.knime.testing.node.ui;

import java.io.IOException;
import java.io.StringReader;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Set;
import java.util.function.Consumer;
import java.util.function.Supplier;
import java.util.stream.Collectors;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.config.base.JSONConfig;
import org.knime.core.node.config.base.JSONConfig.WriterConfig;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.webui.data.RpcDataService;
import org.knime.core.webui.data.rpc.json.impl.ObjectMapperUtil;
import org.knime.core.webui.node.dialog.NodeAndVariableSettingsRO;
import org.knime.core.webui.node.dialog.NodeAndVariableSettingsWO;
import org.knime.core.webui.node.dialog.NodeDialog;
import org.knime.core.webui.node.dialog.NodeDialog.OnApplyNodeModifier;
import org.knime.core.webui.node.dialog.NodeSettingsService;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.VariableSettingsRO;
import org.knime.core.webui.node.dialog.VariableSettingsWO;
import org.knime.core.webui.page.Page;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * Allows one to create {@link NodeDialog NodeDialogs} for testing purposes.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
public final class NodeDialogTestUtil {

    private NodeDialogTestUtil() {
        // utility
    }

    /**
     * Helper to create a {@link NodeDialog}.
     *
     * @param page the page to create the node dialog with
     *
     * @return a new dialog instance
     */
    public static NodeDialog createNodeDialog(final Page page) {
        var settingsMapper = new NodeSettingsService() {

            @Override
            public void toNodeSettings(final String textSettings,
                final Map<SettingsType, NodeAndVariableSettingsRO> previousSettings,
                final Map<SettingsType, NodeAndVariableSettingsWO> settings) {
                //
            }

            @Override
            public String fromNodeSettings(final Map<SettingsType, NodeAndVariableSettingsRO> settings,
                final PortObjectSpec[] specs) {
                return "test settings";
            }

        };
        return createNodeDialog(page, settingsMapper, null);
    }

    /**
     * Helper to create a {@link NodeDialog}.
     *
     * @param page
     * @param settingsDataService
     * @param dataService
     * @return a new dialog instance
     */
    public static NodeDialog createNodeDialog(final Page page, final NodeSettingsService settingsDataService,
        final RpcDataService dataService) {
        return createNodeDialog(page, settingsDataService, dataService, null);
    }

    /**
     * Helper to create a {@link NodeDialog}.
     *
     * @param page
     * @param settingsDataService
     * @param dataService
     * @param onApplyModifier
     * @return
     */
    public static NodeDialog createNodeDialog(final Page page, final NodeSettingsService settingsDataService,
        final RpcDataService dataService, final OnApplyNodeModifier onApplyModifier) {
        return new NodeDialog() { // NOSONAR

            @Override
            public Set<SettingsType> getSettingsTypes() {
                return Set.of(SettingsType.MODEL, SettingsType.VIEW);
            }

            @Override
            public Optional<RpcDataService> createRpcDataService() {
                return Optional.ofNullable(dataService);
            }

            @Override
            public NodeSettingsService getNodeSettingsService() {
                return settingsDataService;
            }

            @Override
            public Page getPage() {
                return page;
            }

            @Override
            public Optional<OnApplyNodeModifier> getOnApplyNodeModifier() {
                return Optional.ofNullable(onApplyModifier);
            }

        };
    }

    /**
     * Helper to create a {@link NodeSettingsService}-instance for testing.
     *
     * @return a new instance
     */
    public static NodeSettingsService createNodeSettingsService() {
        return createNodeSettingsService(null);
    }

    /**
     * Helper to create a {@link NodeSettingsService}-instance for testing.
     *
     * @param variableSettingsWriter optional logic that fills the {@link VariableSettingsWO}
     *
     * @return a new instance
     */
    public static NodeSettingsService
        createNodeSettingsService(final Consumer<Map<SettingsType, VariableSettingsWO>> variableSettingsWriter) {
        return new NodeSettingsService() {

            @Override
            public String fromNodeSettings(final Map<SettingsType, NodeAndVariableSettingsRO> settings,
                final PortObjectSpec[] specs) {
                return settingsToString(settings.get(SettingsType.MODEL), settings.get(SettingsType.VIEW),
                    settings.get(SettingsType.MODEL), settings.get(SettingsType.VIEW));
            }

            @Override
            public void toNodeSettings(final String textSettings,
                final Map<SettingsType, NodeAndVariableSettingsRO> previousSettings,
                final Map<SettingsType, NodeAndVariableSettingsWO> settings) {
                stringToSettings(textSettings, settings.get(SettingsType.MODEL), settings.get(SettingsType.VIEW),
                    settings.get(SettingsType.MODEL), settings.get(SettingsType.VIEW));
                if (variableSettingsWriter != null) {
                    variableSettingsWriter.accept(
                        settings.entrySet().stream().map(e -> Map.entry(e.getKey(), (VariableSettingsWO)e.getValue()))
                            .collect(Collectors.toMap(Entry::getKey, Entry::getValue)));
                }
            }
        };
    }

    private static final ObjectMapper MAPPER = ObjectMapperUtil.getInstance().getObjectMapper();

    /**
     * @param modelSettings
     * @param viewSettings
     * @return the model and view settings serialized into a single string
     */
    public static String settingsToString(final NodeSettingsRO modelSettings, final NodeSettingsRO viewSettings) {
        return settingsToString(modelSettings, viewSettings, null, null);
    }

    /**
     * @param modelSettings
     * @param viewSettings
     * @param modelVariablesSettings can be {@code null}
     * @param viewVariablesSettings can be {@code null}
     * @return the model and view settings serialized into a single string
     */
    public static String settingsToString(final NodeSettingsRO modelSettings, final NodeSettingsRO viewSettings,
        final VariableSettingsRO modelVariablesSettings, final VariableSettingsRO viewVariablesSettings) {
        var root = MAPPER.createObjectNode();
        try {
            root.set("model",
                MAPPER.readTree(JSONConfig.toJSONString(extractNodeSettings(modelSettings), WriterConfig.DEFAULT)));
            root.set("view",
                MAPPER.readTree(JSONConfig.toJSONString(extractNodeSettings(viewSettings), WriterConfig.DEFAULT)));
            if (modelVariablesSettings != null) {
                var variables = MAPPER.createObjectNode();
                variableSettingsToJson(modelVariablesSettings, variables);
                root.set("modelVariables", variables);
            }

            if (viewVariablesSettings != null) {
                var variables = MAPPER.createObjectNode();
                variableSettingsToJson(viewVariablesSettings, variables);
                root.set("viewVariables", variables);
            }

        } catch (JsonProcessingException | InvalidSettingsException ex) {
            throw new RuntimeException(ex); // NOSONAR
        }
        return root.toString();
    }

    private static void variableSettingsToJson(final VariableSettingsRO variableSettings, final ObjectNode root)
        throws InvalidSettingsException {
        for (var key : variableSettings.getVariableSettingsIterable()) {
            var variable = MAPPER.createObjectNode();
            var used = variableSettings.getUsedVariable(key);
            if (used != null) {
                variable.put("used", used);
            }
            var exposed = variableSettings.getExposedVariable(key);
            if (exposed != null) {
                variable.put("exposed", exposed);
            }

            if (used == null && exposed == null) {
                variableSettingsToJson(variableSettings.getVariableSettings(key), variable);
            }
            root.set(key, variable);
        }
    }

    private static void stringToSettings(final String s, final NodeSettingsWO modelSettings,
        final NodeSettingsWO viewSettings, final VariableSettingsWO modelVariablesSettings,
        final VariableSettingsWO viewVariablesSettings) {
        try {
            var jsonNode = MAPPER.readTree(s);
            JSONConfig.readJSON(extractNodeSettings(modelSettings), new StringReader(jsonNode.get("model").toString()));
            JSONConfig.readJSON(extractNodeSettings(viewSettings), new StringReader(jsonNode.get("view").toString()));

            jsonToVariableSettings(jsonNode.get("modelVariables"), modelVariablesSettings);
            jsonToVariableSettings(jsonNode.get("viewVariables"), viewVariablesSettings);
        } catch (IOException | InvalidSettingsException ex) {
            throw new RuntimeException(ex); // NOSONAR
        }
    }

    private static void jsonToVariableSettings(final JsonNode root, final VariableSettingsWO variableSettings)
        throws InvalidSettingsException {
        if (root == null) {
            return;
        }
        var iterator = root.fieldNames();
        while (iterator.hasNext()) {
            var key = iterator.next();
            var variable = root.get(key);
            if (!variable.has("used") && !variable.has("exposed")) {
                jsonToVariableSettings(root.get(key), variableSettings.getOrCreateVariableSettings(key));
            } else {
                if (variable.has("used")) {
                    variableSettings.addUsedVariable(key, variable.get("used").textValue());
                }
                if (variable.has("exposed")) {
                    variableSettings.addExposedVariable(key, variable.get("exposed").textValue());
                }
            }
        }
    }

    private static <C> C extractNodeSettings(final C settings) {
        if (settings instanceof Supplier wrapper) {
            return (C)wrapper.get();
        } else {
            return settings;
        }
    }

}
