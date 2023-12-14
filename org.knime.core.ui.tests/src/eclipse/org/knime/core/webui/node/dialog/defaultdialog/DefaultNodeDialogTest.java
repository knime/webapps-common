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
import static org.knime.testing.node.ui.NodeDialogTestUtil.createNodeDialog;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.knime.core.node.CanceledExecutionException;
import org.knime.core.node.ExecutionContext;
import org.knime.core.node.ExecutionMonitor;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeDialogPane;
import org.knime.core.node.NodeFactory;
import org.knime.core.node.NodeModel;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.NodeView;
import org.knime.core.node.port.PortObject;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.node.port.flowvariable.FlowVariablePortObjectSpec;
import org.knime.core.node.workflow.CredentialsStore;
import org.knime.core.node.workflow.FlowVariable;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.node.workflow.WorkflowManager;
import org.knime.core.webui.node.NodeWrapper;
import org.knime.core.webui.node.dialog.NodeDialog;
import org.knime.core.webui.node.dialog.NodeDialogManager;
import org.knime.core.webui.node.dialog.NodeDialogManagerTest;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.Persist;
import org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.Credentials;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.impl.AsyncChoicesHolder;
import org.knime.core.webui.page.Page;
import org.knime.testing.util.WorkflowManagerUtil;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonMappingException;
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

        Credentials m_objectSetting = new Credentials();
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

    private NativeNodeContainer m_previousNode;

    static class FlowVariablesInputNodeModel extends NodeModel {

        FlowVariablesInputNodeModel() {
            super(0, 0);
        }

        @Override
        protected void loadInternals(final File nodeInternDir, final ExecutionMonitor exec)
            throws IOException, CanceledExecutionException {
            //
        }

        @Override
        protected void saveInternals(final File nodeInternDir, final ExecutionMonitor exec)
            throws IOException, CanceledExecutionException {
            //
        }

        @Override
        protected void saveSettingsTo(final NodeSettingsWO settings) {
            //
        }

        @Override
        protected void validateSettings(final NodeSettingsRO settings) throws InvalidSettingsException {
            //
        }

        @Override
        protected void loadValidatedSettingsFrom(final NodeSettingsRO settings) throws InvalidSettingsException {
            //
        }

        @Override
        protected void reset() {
            //
        }

        @Override
        protected PortObjectSpec[] configure(final PortObjectSpec[] inSpecs) {
            return new PortObjectSpec[]{FlowVariablePortObjectSpec.INSTANCE};
        }

        @Override
        protected PortObject[] execute(final PortObject[] inObjects, final ExecutionContext exec) {
            return new PortObject[]{};
        }

    }

    static class FlowVariablesInputNodeFactory extends NodeFactory<FlowVariablesInputNodeModel> {
        @Override
        public FlowVariablesInputNodeModel createNodeModel() {
            return new FlowVariablesInputNodeModel();
        }

        @Override
        protected int getNrNodeViews() {
            return 0;
        }

        @Override
        public NodeView<FlowVariablesInputNodeModel> createNodeView(final int viewIndex,
            final FlowVariablesInputNodeModel nodeModel) {
            return null;
        }

        @Override
        protected boolean hasDialog() {
            return false;
        }

        @Override
        protected NodeDialogPane createNodeDialogPane() {
            return null;
        }
    }

    @BeforeEach
    void createWorkflowAndAddNode() throws IOException {
        m_wfm = WorkflowManagerUtil.createEmptyWorkflow();
        final var settingsClasses =
            Map.of(SettingsType.MODEL, ModelSettings.class, SettingsType.VIEW, ViewSettings.class);
        final var defaultNodeSettingsService =
            new DefaultNodeSettingsService(settingsClasses, new AsyncChoicesHolder());
        Supplier<NodeDialog> nodeDialogCreator =
            () -> createNodeDialog(Page.builder(() -> "page content", "page.html").build(),
                defaultNodeSettingsService, null);
        m_nnc = NodeDialogManagerTest.createNodeWithNodeDialog(m_wfm, nodeDialogCreator);
        m_previousNode = WorkflowManagerUtil.createAndAddNode(m_wfm, new FlowVariablesInputNodeFactory());
        m_wfm.addConnection(m_previousNode.getID(), 0, m_nnc.getID(), 0);
        m_wfm.executeAllAndWaitUntilDone();

    }

    @AfterEach
    void disposeWorkflow() {
        WorkflowManagerUtil.disposeWorkflow(m_wfm);
    }

    private void addFlowVariablesAndExecuteWorkflow(final FlowVariable... flowVariables) {
        final var flowObjectStack = m_previousNode.getOutgoingFlowObjectStack();
        for (var flowVar : flowVariables) {
            flowObjectStack.push(flowVar);
        }
        m_wfm.resetAndConfigureNode(m_nnc.getID());
        m_wfm.executeAllAndWaitUntilDone();
    }

    final static FlowVariable validFlowVariable1 = new FlowVariable("flow variable 1", "foo");

    // "B" is valid, as we overwrite "MyEnum" above
    final static FlowVariable validFlowVariable2 = new FlowVariable("flow variable 2", "B");

    final static FlowVariable validFlowVariable3 = new FlowVariable("flow variable 3", "bar");

    @Nested
    class InitialDataTest {

        @BeforeEach
        void saveInitialNodeSettingsToNode() throws InvalidSettingsException {
            final var initialNodeSettings =
                new TestNodeSettingsBuilder().withIncludeVariableSettingsForNonExistentNodeSettings().build();
            setNodeSettingsAndExecute(m_nnc, initialNodeSettings);
        }

        private static void setNodeSettingsAndExecute(final NativeNodeContainer nnc, final NodeSettings nodeSettings)
            throws InvalidSettingsException {
            var parent = nnc.getParent();
            parent.saveNodeSettings(nnc.getID(), nodeSettings);
            parent.loadNodeSettings(nnc.getID(), nodeSettings);
            parent.executeAllAndWaitUntilDone();
        }

        @Test
        void testInitialDataWithFlowVariableSettings() throws InvalidSettingsException, IOException {
            addFlowVariablesAndExecuteWorkflow(validFlowVariable1, validFlowVariable2, validFlowVariable3);

            var initialData = getInitialData();

            assertFlowVariableSettings(initialData);
            assertOverwrittenNodeSettings(initialData);
        }

        @Test
        void testInitialDataWithFlawedFlowVariableSettings() throws InvalidSettingsException, IOException {
            // "NOT_A_B_OR_C" is flawed, as we overwrite "MyEnum" above
            final var inValidFlowVariable2 = new FlowVariable("flow variable 2", "NOT_A_B_OR_C");
            addFlowVariablesAndExecuteWorkflow(validFlowVariable1, inValidFlowVariable2, validFlowVariable3);

            var initialData = getInitialData();

            assertNonOverwrittenNodeSettings(initialData);
        }

        private String getInitialData() {
            final var dataServiceManager = NodeDialogManager.getInstance().getDataServiceManager();
            return dataServiceManager.callInitialDataService(NodeWrapper.of(m_nnc));
        }

        private static void assertFlowVariableSettings(final String initialData)
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
            var mapper = new ObjectMapper();
            var expectedJson = mapper.readTree(expectedFlowVariableSettings);
            assertThatJson(mapper.readTree(initialData).get("result").get("flowVariableSettings"))
                .isEqualTo(expectedJson);
        }

        private static void assertOverwrittenNodeSettings(final String initialData)
            throws JsonMappingException, JsonProcessingException {
            var mapper = new ObjectMapper();
            final var initialDataJson = mapper.readTree(initialData).get("result").get("data");
            assertThatJson(initialDataJson.get("model").get("modelSetting")).isString()
                .isEqualTo(validFlowVariable1.getStringValue());
            assertThatJson(initialDataJson.get("view").get("viewSetting")).isString()
                .isEqualTo(validFlowVariable2.getStringValue());
            assertThatJson(initialDataJson.get("view").get("nestedViewSetting").get("nestedViewSettings")).isString()
                .isEqualTo(validFlowVariable3.getStringValue());
        }

        private static void assertNonOverwrittenNodeSettings(final String initialData)
            throws JsonMappingException, JsonProcessingException {
            var mapper = new ObjectMapper();
            final var initialDataJson = mapper.readTree(initialData).get("result").get("data");
            assertThatJson(initialDataJson.get("model").get("modelSetting")).isString()//
                .isEqualTo("1");
            assertThatJson(initialDataJson.get("view").get("viewSetting")).isString() //
                .isEqualTo("A");
            assertThatJson(initialDataJson.get("view").get("nestedViewSetting").get("nestedViewSettings")).isString()
                .isEqualTo("3");
        }
    }

    @Nested
    class ApplyDataTest {

        @BeforeEach
        void addValidFlowVariables() {
            addFlowVariablesAndExecuteWorkflow(validFlowVariable1, validFlowVariable2, validFlowVariable3);
        }

        @Test
        void testApplyDataWithFlowVariableSettings() throws IOException, InvalidSettingsException {

            initializeEmptySettingsAndExecuteWorkflow();

            var applyData = """
                    {
                      "data": {
                        "model": {
                          "modelSetting": "2"
                        },
                        "view": {
                          "viewSetting": "C",
                          "nested": {
                            "nestedViewSetting": "4",
                            "nestedViewSetting 2": "5"
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

            var expectedNodeSettings = new TestNodeSettingsBuilder() //
                /**
                 * This is the only settings value that is expected to be different. All other changes are overwritten
                 * by flow variables
                 */
                .withSettingsValue("view.nested.nested view setting 2", "4").build();
            for (var key : List.of("model", "variables", "view", "view_variables")) {
                assertSubNodeSettingsForKey(expectedNodeSettings, key);
            }
        }

        @Test
        void testApplyDataWithOnlyViewFlowVariableSettings() throws IOException, InvalidSettingsException {

            var initialApplyData = """
                      {
                      "data": {
                        "model": {},
                        "view": {}
                       },
                      "flowVariableSettings": {
                        "view.nested.nested view setting 3": {
                          "exposedFlowVariableName": "exposed var name"
                        },
                        "view.nested.nested view setting 2": {
                          "exposedFlowVariableName": "exposed var name"
                        },
                        "view.nested.nested view setting": {
                          "controllingFlowVariableAvailable": false,
                          "controllingFlowVariableName": "flow variable 1",
                          "exposedFlowVariableName": "exposed var name"
                        }
                      }
                    }
                    """;

            callApplyData(initialApplyData);
            m_wfm.executeAllAndWaitUntilDone();
            assertTrue(m_nnc.getNodeContainerState().isExecuted());

            /**
             * Essential here is that the settings and the model variables did not change, i.e. only new view variables
             * get applied and that the exposed settings which are not controlled by a flow variable did not change.
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

            assertTrue(m_nnc.getNodeContainerState().isExecuted());
            var expectedNodeSettings = new TestNodeSettingsBuilder().build();
            assertSubNodeSettingsForKey(expectedNodeSettings, "view_variables");
        }

        @Test
        void testApplyDataResetsObjectSettingsToPreviousStateWhenOverwritten()
            throws IOException, InvalidSettingsException {

            final var credentialsFlowVariable = CredentialsStore.newCredentialsFlowVariable("credentials flow variable",
                "varUsername", "varPassword", "varSecondFactor");
            addFlowVariablesAndExecuteWorkflow(credentialsFlowVariable);

            initializeEmptySettingsAndExecuteWorkflow();

            var objectSettingsOverwrittenByVariablesData = """
                    {
                      "data": {
                        "model": {},
                        "view": {
                           "objectSetting": {
                             "isHiddenPassword": true,
                             "username": "username"
                           }
                         }
                       },
                       "flowVariableSettings": {
                         "view.objectSetting": {
                           "controllingFlowVariableAvailable": true,
                           "controllingFlowVariableName": "credentials flow variable"
                         }
                       }
                    }
                    """;
            callApplyData(objectSettingsOverwrittenByVariablesData);
            final var savedNodeSettings = m_nnc.getNodeSettings();
            assertThat(savedNodeSettings.getNodeSettings("view").getNodeSettings("objectSetting").getString("login"))
                .isEmpty();
        }

        @Test
        void testApplyDataResetsNodeOnFlawedViewVariables() throws IOException, InvalidSettingsException {

            initializeEmptySettingsAndExecuteWorkflow();

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

        @Test
        void testApplyDataResetsNodeOnExposedVariableChange() throws IOException, InvalidSettingsException {

            var initialApplyData = """
                    {
                      "data": {
                        "model": {},
                        "view": {}
                      },
                      "flowVariableSettings": {
                        "view.view setting": {
                          "exposedFlowVariableName": "previous name"
                        }
                      }
                    }
                    """;

            callApplyData(initialApplyData);
            m_wfm.executeAllAndWaitUntilDone();
            assertTrue(m_nnc.getNodeContainerState().isExecuted());

            var newExposedViewVariablesData = """
                    {
                      "data": {
                        "model": {},
                        "view": {}
                       },
                      "flowVariableSettings": {
                        "view.view setting": {
                          "exposedFlowVariableName": "new name"
                        }
                      }
                    }
                    """;
            callApplyData(newExposedViewVariablesData);

            assertFalse(m_nnc.getNodeContainerState().isExecuted());
        }

        @Test
        void testApplyDataResetsNodeOnSettingsUnderlyingExposedVariableChange()
            throws IOException, InvalidSettingsException {

            var initialApplyData = """
                    {
                      "data": {
                        "model": {},
                        "view": {
                            "viewSetting": "C"
                        }
                      },
                      "flowVariableSettings": {
                        "view.view setting": {
                          "exposedFlowVariableName": "exposed name"
                        }
                      }
                    }
                    """;

            callApplyData(initialApplyData);
            m_wfm.executeAllAndWaitUntilDone();
            assertTrue(m_nnc.getNodeContainerState().isExecuted());
            assertThat(m_nnc.getNodeSettings().getNodeSettings("view").getString("view setting")).isEqualTo("C");

            var newExposedViewVariablesData = """
                    {
                      "data": {
                        "model": {},
                        "view": {
                            "viewSetting": "B"
                        }
                       },
                      "flowVariableSettings": {
                        "view.view setting": {
                          "exposedFlowVariableName": "exposed name"
                        }
                      }
                    }
                    """;
            callApplyData(newExposedViewVariablesData);

            assertFalse(m_nnc.getNodeContainerState().isExecuted());
        }

        private void initializeEmptySettingsAndExecuteWorkflow() throws IOException {
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

        private void assertSubNodeSettingsForKey(final NodeSettings expected, final String key)
            throws InvalidSettingsException {
            assertThat(m_nnc.getNodeSettings().getNodeSettings(key)).isEqualTo(expected.getNodeSettings(key));
        }

    }

    private final static class TestNodeSettingsBuilder {

        boolean includeVariableSettingForNonExistentNodeSetting;

        Map<String, String> settingsValues = new HashMap<>();

        NodeSettings build() {
            var nodeSettings = new NodeSettings("configuration");
            var modelSettings = nodeSettings.addNodeSettings("model");
            var viewSettings = nodeSettings.addNodeSettings("view");
            DefaultNodeSettings.saveSettings(ModelSettings.class, new ModelSettings(), modelSettings);
            DefaultNodeSettings.saveSettings(ViewSettings.class, new ViewSettings(), viewSettings);
            settingsValues.entrySet().forEach(e -> {
                final var path = e.getKey().split("\\.");
                var config = nodeSettings;
                for (int i = 0; i < path.length - 1; i++) {
                    try {
                        config = config.getNodeSettings(path[i]);
                    } catch (InvalidSettingsException ex) {
                        throw new RuntimeException(ex);
                    }
                }
                config.addString(path[path.length - 1], e.getValue());
            });
            initModelVariableSettings(nodeSettings);
            initViewVariableSettings(nodeSettings, includeVariableSettingForNonExistentNodeSetting);
            return nodeSettings;
        }

        TestNodeSettingsBuilder withIncludeVariableSettingsForNonExistentNodeSettings() {
            includeVariableSettingForNonExistentNodeSetting = true;
            return this;
        }

        /**
         * @param settingsPath the path to the setting in the saved node settings, e.g.: "model.model setting"
         * @param value the string value of the setting
         */
        TestNodeSettingsBuilder withSettingsValue(final String settingsPath, final String value) {
            settingsValues.put(settingsPath, value);
            return this;
        }

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
