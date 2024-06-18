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
 *   Sep 12, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.webui.node.dialog.NodeAndVariableSettingsRO;
import org.knime.core.webui.node.dialog.NodeAndVariableSettingsWO;
import org.knime.core.webui.node.dialog.NodeDialogTest;
import org.knime.core.webui.node.dialog.NodeSettingsService;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.internal.VariableSettings;

/**
 *
 * @author Paul Bärnreuther
 */
class DefaultNodeSettingsServiceWithVariablesTest {

    class TestNodeSettingsService implements NodeSettingsService {

        private static String CFG_KEY = "textSettings";

        public static String NODE_SETTINGS_VALUE_FROM_DEFAULT_NODE_SETTINGS = "fromDefaultNodeSettings";

        @Override
        public String fromNodeSettings(final Map<SettingsType, NodeAndVariableSettingsRO> settings,
            final PortObjectSpec[] specs) {
            return getAddedNodeSettingsValue(settings);
        }

        @Override
        public void toNodeSettings(final String textSettings,
            final Map<SettingsType, NodeAndVariableSettingsRO> previousSettings,
            final Map<SettingsType, NodeAndVariableSettingsWO> settings) {
            setAddedNodeAndVariableSettingsValue(textSettings, settings);
        }

        public static String getAddedNodeSettingsValue(final Map<SettingsType, NodeAndVariableSettingsRO> settings) {
            try {
                return settings.get(SettingsType.MODEL).getString(CFG_KEY);
            } catch (InvalidSettingsException ex) {
                return null;
            }
        }

        public static void setAddedNodeAndVariableSettingsValue(final String textSettings,
            final Map<SettingsType, NodeAndVariableSettingsWO> settings) {
            settings.get(SettingsType.MODEL).addString(CFG_KEY, textSettings);
        }

        public static void setAddedNodeSettingsValue(final String textSettings,
            final Map<SettingsType, NodeSettingsWO> settings) {
            settings.get(SettingsType.MODEL).addString(CFG_KEY, textSettings);
        }
    }

    private NodeSettingsService getDefaultNodeSettingsServiceWithVariables() {
        return new DefaultNodeSettingsServiceWithVariables(new TestNodeSettingsService());
    }

    private static final Map<SettingsType, NodeAndVariableSettingsRO> createROSettings(final NodeSettings settings) {
        return Map.of(SettingsType.MODEL, NodeDialogTest.createNodeAndVariableSettingsRO(settings));

    }

    private static final Map<SettingsType, NodeAndVariableSettingsWO> createWOSettings(final NodeSettings settings) {
        return Map.of(SettingsType.MODEL, NodeDialogTest.createNodeAndVariableSettingsWO(settings));
    }

    private static final Map<SettingsType, NodeAndVariableSettingsRO> createROSettings(final NodeSettings settings,
        final VariableSettings variableSettings) {
        return Map.of(SettingsType.MODEL, NodeDialogTest.createNodeAndVariableSettingsRO(settings, variableSettings));

    }

    private static final Map<SettingsType, NodeAndVariableSettingsWO> createWOSettings(final NodeSettings settings,
        final VariableSettings variableSettings) {
        return Map.of(SettingsType.MODEL, NodeDialogTest.createNodeAndVariableSettingsWO(settings, variableSettings));
    }

    private static final Map<SettingsType, NodeAndVariableSettingsRO> createEmptyPreviousSettings() {
        return Map.of(SettingsType.MODEL,
            NodeDialogTest.createNodeAndVariableSettingsRO(new NodeSettings("previouseSettings")));
    }

    @Test
    void testDelegateToNodeSettings() {
        final var service = getDefaultNodeSettingsServiceWithVariables();
        final var textSettings = """
                {"data": "dummyData"}
                """;
        final var settings = new NodeSettings("model");
        service.toNodeSettings(textSettings, createEmptyPreviousSettings(), createWOSettings(settings));
        assertThat(TestNodeSettingsService.getAddedNodeSettingsValue(createROSettings(settings)))
            .isEqualTo(textSettings);
    }

    @Test
    void testDelegateFromNodeSettings() {
        final var service = getDefaultNodeSettingsServiceWithVariables();
        final var textSettings = """
                {"data": "dummyData"}
                """;
        final var settings = new NodeSettings("model");
        TestNodeSettingsService.setAddedNodeAndVariableSettingsValue(textSettings, createWOSettings(settings));
        assertThat(service.fromNodeSettings(createROSettings(settings), new PortObjectSpec[0])).isEqualTo("""
                {"data":"dummyData","flowVariableSettings":{}}""");
    }

    @Test
    void testVariableSettingsToNodeSettings() throws InvalidSettingsException {
        final var service = getDefaultNodeSettingsServiceWithVariables();
        final var textSettings = """
                {
                    "data": {"model": {"model setting": "1"}},
                    "flowVariableSettings": {
                        "model.model setting": {
                            "controllingFlowVariableName": "flowVar1"
                        }
                    }
                }""";
        final var settings = new NodeSettings("model");
        settings.addString("model setting", "dummyData");
        final var variableSettings = new VariableSettings(new NodeSettings("variables"), settings);
        service.toNodeSettings(textSettings, createEmptyPreviousSettings(),
            createWOSettings(settings, variableSettings));
        assertThat(variableSettings.getUsedVariable("model setting")).isEqualTo("flowVar1");
    }

    @Test
    void testVariableSettingsFromNodeSettings() throws InvalidSettingsException {
        final var service = getDefaultNodeSettingsServiceWithVariables();
        final var textSettings = """
                {
                    "data": {"model": {"model setting": "1"}}
                }""";
        final var settings = new NodeSettings("model");
        TestNodeSettingsService.setAddedNodeAndVariableSettingsValue(textSettings, createWOSettings(settings));
        settings.addString("model setting", "dummyData");
        final var variableSettings = new VariableSettings(new NodeSettings("variables"), settings);
        variableSettings.addUsedVariable("model setting", "flowVar1", false);
        assertThat(service.fromNodeSettings(createROSettings(settings, variableSettings), new PortObjectSpec[0]))
            .isEqualTo("""
                    {"data":{"model":{"model setting":"1"}},""" + """
                    "flowVariableSettings":{"model.model setting":{""" + """
                    "controllingFlowVariableName":"flowVar1",""" + """
                    "controllingFlowVariableFlawed":false,""" + """
                    "controllingFlowVariableAvailable":false""" + """
                    }}}""");
    }

}
