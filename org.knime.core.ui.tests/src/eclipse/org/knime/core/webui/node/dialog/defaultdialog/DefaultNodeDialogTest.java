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
 *   Aug 28, 2023 (hornm): created
 */
package org.knime.core.webui.node.dialog.defaultdialog;

import static net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.IOException;
import java.util.Map;
import java.util.function.Supplier;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.knime.core.data.DataTableSpec;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.workflow.FlowVariable;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.node.workflow.WorkflowManager;
import org.knime.core.webui.node.NodeWrapper;
import org.knime.core.webui.node.dialog.NodeDialog;
import org.knime.core.webui.node.dialog.NodeDialogManager;
import org.knime.core.webui.node.dialog.NodeDialogManagerTest;
import org.knime.core.webui.node.dialog.NodeDialogTest;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.Persist;
import org.knime.core.webui.node.dialog.defaultdialog.settingsconversion.SettingsConverter;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.impl.AsyncChoicesHolder;
import org.knime.core.webui.page.Page;
import org.knime.testing.util.WorkflowManagerUtil;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Integration tests for {@link DefaultNodeDialog}-related logic.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
@SuppressWarnings("java:S2698") // we accept assertions without messages
public class DefaultNodeDialogTest {

    static class ModelSettings implements DefaultNodeSettings {
        @Widget
        @Persist(configKey = "model setting")
        String m_modelSetting = "1";
    }

    static class ViewSettings implements DefaultNodeSettings {

        enum MyEnum {
                A, B, C
        }

        @Widget
        @Persist(configKey = "view setting")
        MyEnum m_viewSetting = MyEnum.A;

        @Widget
        @Persist(configKey = "nested")
        NestedViewSettings m_nestedViewSetting = new NestedViewSettings();
    }

    static class NestedViewSettings implements DefaultNodeSettings {
        @Widget
        @Persist(configKey = "nested view setting")
        String m_nestedViewSettings = "3";

        @Widget
        @Persist(configKey = "nested view setting 2")
        String m_nestedViewSettings2 = "4";

    }

    private WorkflowManager m_wfm;

    private NativeNodeContainer m_nnc;

    private DefaultNodeSettingsService m_defaultNodeSettingsService;

    @BeforeEach
    void createWorkflowAndAddNode() throws IOException {
        m_wfm = WorkflowManagerUtil.createEmptyWorkflow();
        final var settingsClasses =
            Map.of(SettingsType.MODEL, ModelSettings.class, SettingsType.VIEW, ViewSettings.class);
        m_defaultNodeSettingsService =
            new DefaultNodeSettingsService(new SettingsConverter(settingsClasses), new AsyncChoicesHolder());
        Supplier<NodeDialog> nodeDialogCreator =
            () -> NodeDialogTest.createNodeDialog(Page.builder(() -> "page content", "page.html").build(),
                m_defaultNodeSettingsService, null);
        m_nnc = NodeDialogManagerTest.createNodeWithNodeDialog(m_wfm, nodeDialogCreator);
    }

    @AfterEach
    void disposeWorkflow() {
        WorkflowManagerUtil.disposeWorkflow(m_wfm);
    }

    @Nested
    class InitialDataTest {

        @BeforeEach
        void createWorkflowAndAddNode() throws InvalidSettingsException {
            var defModelSettings = new NodeSettings("model");
            var defViewSettings = new NodeSettings("view");
            m_defaultNodeSettingsService.getDefaultNodeSettings(
                Map.of(SettingsType.MODEL, defModelSettings, SettingsType.VIEW, defViewSettings),
                new DataTableSpec[]{new DataTableSpec()});
            initNodeSettings(m_nnc, defModelSettings, defViewSettings);
            m_nnc.getFlowObjectStack().push(new FlowVariable("flow variable 1", "foo"));
            m_nnc.getFlowObjectStack().push(new FlowVariable("flow variable 3", "bar"));
        }

        @Test
        void testInitialDataWithFlowVariableSettings() throws InvalidSettingsException, IOException {
            // "B" is valid, as we overwrite "MyEnum" above
            m_nnc.getFlowObjectStack().push(new FlowVariable("flow variable 2", "B"));

            var initialData = getInitialData();

            var mapper = new ObjectMapper();
            var initialDataJson = mapper.readTree(initialData);
            assertFlowVariableSettings(initialDataJson, mapper);
            assertOverwrittenNodeSettings(initialDataJson, mapper);
        }

        @Test
        void testInitialDataWithFlawedFlowVariableSettings() throws InvalidSettingsException, IOException {
            // "NOT_A_B_OR_C" is flawed, as we overwrite "MyEnum" above
            m_nnc.getFlowObjectStack().push(new FlowVariable("flow variable 2", "NOT_A_B_OR_C"));

            var initialData = getInitialData();

            var mapper = new ObjectMapper();
            var initialDataJson = mapper.readTree(initialData);
            assertNonOverwrittenNodeSettings(initialDataJson, mapper);
        }

        private String getInitialData() {
            var initialData =
                NodeDialogManager.getInstance().getDataServiceManager().callInitialDataService(NodeWrapper.of(m_nnc));
            return initialData;
        }

        private static void assertFlowVariableSettings(final JsonNode initialData, final ObjectMapper mapper)
            throws JsonMappingException, JsonProcessingException {
            var expectedFlowVariableSettings = """
                    {
                      "model.model setting": {
                        "controllingFlowVariableAvailable": true,
                        "controllingFlowVariableFlawed": false,
                        "controllingFlowVariableName": "flow variable 1"
                      },
                      "view.view setting": {
                        "controllingFlowVariableAvailable": true,
                        "controllingFlowVariableFlawed": false,
                        "controllingFlowVariableName": "flow variable 2"
                      },
                      "view.nested.nested view setting 3": {
                        "controllingFlowVariableFlawed": false,
                        "exposedFlowVariableName": "exposed var name"
                      },
                      "view.nested.nested view setting 2": {
                        "controllingFlowVariableFlawed": false,
                        "exposedFlowVariableName": "exposed var name"
                      },
                      "view.nested.nested view setting": {
                        "controllingFlowVariableAvailable": true,
                        "controllingFlowVariableName": "flow variable 3",
                        "controllingFlowVariableFlawed": false,
                        "exposedFlowVariableName": "exposed var name"
                      }
                    }
                    """;
            var expectedJson = mapper.readTree(expectedFlowVariableSettings);
            assertThatJson(initialData.get("result").get("flowVariableSettings")).isEqualTo(expectedJson);
        }

        private static void assertOverwrittenNodeSettings(final JsonNode initialData, final ObjectMapper mapper)
            throws JsonMappingException, JsonProcessingException {
            var expectedData =
                """
                        {
                          "model": {"modelSetting":"foo"},
                          "view": {"nestedViewSetting":{"nestedViewSettings":"bar","nestedViewSettings2":"4"},"viewSetting":"B"}
                        }
                        """;

            var expectedJson = mapper.readTree(expectedData);
            assertThatJson(initialData.get("result").get("data")).isEqualTo(expectedJson);
        }

        private static void assertNonOverwrittenNodeSettings(final JsonNode initialData, final ObjectMapper mapper)
            throws JsonMappingException, JsonProcessingException {
            var expectedData =
                """
                        {
                          "model": {"modelSetting":"1"},
                          "view": {"nestedViewSetting":{"nestedViewSettings":"3","nestedViewSettings2":"4"},"viewSetting":"A"}
                        }
                        """;
            var expectedJson = mapper.readTree(expectedData);
            assertThatJson(initialData.get("result").get("data")).isEqualTo(expectedJson);
        }
    }

    @Nested
    class ApplyDataTest {

        @Test
        void testApplyDataWithFlowVariableSettings() throws IOException, InvalidSettingsException {
            var applyData = """
                    {
                      "data": {
                        "model": {
                          "model setting": "2"
                        },
                        "view": {
                          "view setting": "3",
                          "nested": {
                            "nested view setting": "4",
                            "nested view setting 2": "5"
                          }
                        }
                      },
                      "flowVariableSettings": {
                        "model.model setting": {
                          "controllingFlowVariableAvailable": false,
                          "controllingFlowVariableName": "flow variable 1"
                        },
                        "view.view setting": {
                          "controllingFlowVariableAvailable": true,
                          "controllingFlowVariableName": "flow variable 2"
                        },
                        "view.nested.nested view setting 3": {
                          "exposedFlowVariableName": "exposed var name"
                        },
                        "view.nested.nested view setting 2": {
                          "exposedFlowVariableName": "exposed var name"
                        },
                        "view.nested.nested view setting": {
                          "controllingFlowVariableAvailable": false,
                          "controllingFlowVariableName": "flow variable 3",
                          "exposedFlowVariableName": "exposed var name"
                        }
                      }
                    }
                    """;
            callApplyData(applyData);

            var nodeSettingsToCheck = m_nnc.getNodeSettings();

            var expectedNodeSettings = new NodeSettings("configuration");
            var modelSettings = expectedNodeSettings.addNodeSettings("model");
            var viewSettings = expectedNodeSettings.addNodeSettings("view");
            m_defaultNodeSettingsService.getDefaultNodeSettings(
                Map.of(SettingsType.MODEL, modelSettings, SettingsType.VIEW, viewSettings),
                new DataTableSpec[]{new DataTableSpec()});
            initModelVariableSettings(expectedNodeSettings);
            initViewVariableSettings(expectedNodeSettings, false);

            assertSubNodeSettingsForKey(nodeSettingsToCheck, expectedNodeSettings, "model");
            assertSubNodeSettingsForKey(nodeSettingsToCheck, expectedNodeSettings, "variables");
            assertSubNodeSettingsForKey(nodeSettingsToCheck, expectedNodeSettings, "view");
            assertSubNodeSettingsForKey(nodeSettingsToCheck, expectedNodeSettings, "view_variables");
        }

        @Test
        void testApplyDataWithOnlyViewFlowVariableSettings() throws IOException, InvalidSettingsException {

            initializeViewSettingsForApplyTest();

            /**
             * Essential here is that the settings and the model variables did not change, i.e. only new view variables
             * get applied.
             */
            var applyViewVariablesData = """
                    {
                      "data": {
                        "model": {},
                        "view": {}
                       },
                      "flowVariableSettings": {
                        "view.view setting": {
                          "controllingFlowVariableAvailable": true,
                          "controllingFlowVariableName": "flow variable 2"
                        },
                        "view.nested.nested view setting 3": {
                          "exposedFlowVariableName": "exposed var name"
                        },
                        "view.nested.nested view setting 2": {
                          "exposedFlowVariableName": "exposed var name"
                        },
                        "view.nested.nested view setting": {
                          "controllingFlowVariableAvailable": false,
                          "controllingFlowVariableName": "flow variable 3",
                          "exposedFlowVariableName": "exposed var name"
                        }
                      }
                    }
                    """;
            callApplyData(applyViewVariablesData);

            var nodeSettingsToCheck = m_nnc.getNodeSettings();
            var expectedNodeSettings = new NodeSettings("configuration");
            var modelSettings = expectedNodeSettings.addNodeSettings("model");
            var viewSettings = expectedNodeSettings.addNodeSettings("view");
            m_defaultNodeSettingsService.getDefaultNodeSettings(
                Map.of(SettingsType.MODEL, modelSettings, SettingsType.VIEW, viewSettings),
                new DataTableSpec[]{new DataTableSpec()});
            initViewVariableSettings(expectedNodeSettings, false);
            assertTrue(m_nnc.getNodeContainerState().isExecuted());
            assertSubNodeSettingsForKey(nodeSettingsToCheck, expectedNodeSettings, "view_variables");
        }

        @Test
        void testApplyDataResetsNodeOnFlawedViewVariables() throws IOException, InvalidSettingsException {

            initializeViewSettingsForApplyTest();

            var flawedViewVariablesData = """
                    {
                      "data": {
                        "model": {},
                        "view": {}
                       },
                      "flowVariableSettings": {
                        "view.view setting": {
                          "controllingFlowVariableFlawed": true,
                          "controllingFlowVariableAvailable": true,
                          "controllingFlowVariableName": "flow variable 2"
                        }
                      }
                    }
                    """;
            callApplyData(flawedViewVariablesData);

            assertFalse(m_nnc.getNodeContainerState().isExecuted());
        }

        private void initializeViewSettingsForApplyTest() throws IOException {
            var initialApplyData = """
                    {
                      "data": {
                        "model": {},
                        "view": {}
                      },
                      "flowVariableSettings": {}
                    }
                    """;

            callApplyData(initialApplyData);
            m_wfm.executeAllAndWaitUntilDone();
        }

        private void callApplyData(final String applyData) throws IOException {
            NodeDialogManager.getInstance().getDataServiceManager().callApplyDataService(NodeWrapper.of(m_nnc),
                applyData);
        }

        private static void assertSubNodeSettingsForKey(final NodeSettings test, final NodeSettings expected,
            final String key) throws InvalidSettingsException {
            assertThat(test.getNodeSettings(key)).isEqualTo(expected.getNodeSettings(key));
        }

    }

    private static void initNodeSettings(final NativeNodeContainer nnc, final NodeSettings defaultModelSettings,
        final NodeSettings defaultViewSettings) throws InvalidSettingsException {
        var parent = nnc.getParent();
        var nodeSettings = new NodeSettings("node_settings");
        parent.saveNodeSettings(nnc.getID(), nodeSettings);

        nodeSettings.addNodeSettings(defaultModelSettings);
        initModelVariableSettings(nodeSettings);
        nodeSettings.addNodeSettings(defaultViewSettings);
        initViewVariableSettings(nodeSettings, true);

        parent.loadNodeSettings(nnc.getID(), nodeSettings);
        parent.executeAllAndWaitUntilDone();
    }

    private static void initModelVariableSettings(final NodeSettings ns) {
        var modelVariables = ns.addNodeSettings("variables");
        modelVariables.addString("version", "V_2019_09_13");
        var variableTree = modelVariables.addNodeSettings("tree");
        var variableTreeNode = variableTree.addNodeSettings("model setting");
        variableTreeNode.addString("used_variable", "flow variable 1");
        variableTreeNode.addBoolean("used_variable_flawed", false);
        variableTreeNode.addString("exposed_variable", null);
    }

    private static void initViewVariableSettings(final NodeSettings ns,
        final boolean includeVariableSettingForNonexistentNodeSetting) {
        var viewVariables = ns.addNodeSettings("view_variables");
        viewVariables.addString("version", "V_2019_09_13");
        var variableTree = viewVariables.addNodeSettings("tree");
        var variableTreeNode1 = variableTree.addNodeSettings("view setting");
        variableTreeNode1.addString("used_variable", "flow variable 2");
        variableTreeNode1.addBoolean("used_variable_flawed", false);
        variableTreeNode1.addString("exposed_variable", null);

        var nested = variableTree.addNodeSettings("nested");
        var variableTreeNode2 = nested.addNodeSettings("nested view setting");
        variableTreeNode2.addString("used_variable", "flow variable 3");
        variableTreeNode2.addBoolean("used_variable_flawed", false);
        variableTreeNode2.addString("exposed_variable", "exposed var name");

        var variableTreeNode3 = nested.addNodeSettings("nested view setting 2");
        variableTreeNode3.addString("used_variable", null);
        variableTreeNode3.addBoolean("used_variable_flawed", false);
        variableTreeNode3.addString("exposed_variable", "exposed var name");

        if (includeVariableSettingForNonexistentNodeSetting) {
            var variableTreeNode4 = nested.addNodeSettings("nested view setting 3");
            variableTreeNode4.addString("used_variable", null);
            variableTreeNode4.addBoolean("used_variable_flawed", false);
            variableTreeNode4.addString("exposed_variable", "exposed var name");
        }
    }

}
