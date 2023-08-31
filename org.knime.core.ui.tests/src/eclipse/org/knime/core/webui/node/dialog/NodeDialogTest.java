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
 *  NodeDialog, and NodeDialog) and that only interoperate with KNIME through
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
 *   Oct 17, 2021 (hornm): created
 */
package org.knime.core.webui.node.dialog;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.knime.core.webui.data.InitialDataServiceTestUtil.parseResult;

import java.awt.Container;
import java.io.IOException;
import java.io.StringReader;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.Set;
import java.util.function.Consumer;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Test;
import org.knime.core.node.ExecutionMonitor;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.NotConfigurableException;
import org.knime.core.node.config.ConfigEditJTree;
import org.knime.core.node.config.ConfigEditTreeModel.ConfigEditTreeNode;
import org.knime.core.node.config.base.JSONConfig;
import org.knime.core.node.config.base.JSONConfig.WriterConfig;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.node.workflow.FlowVariable;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.node.workflow.NodeContainer;
import org.knime.core.node.workflow.NodeContext;
import org.knime.core.webui.data.RpcDataService;
import org.knime.core.webui.data.rpc.json.impl.ObjectMapperUtil;
import org.knime.core.webui.node.NodeWrapper;
import org.knime.core.webui.node.dialog.NodeAndVariableSettingsProxy.NodeSettingsWrapper;
import org.knime.core.webui.node.dialog.NodeDialog.OnApplyNodeModifier;
import org.knime.core.webui.node.dialog.NodeDialogAdapter.LegacyFlowVariableNodeDialog;
import org.knime.core.webui.node.view.NodeViewManager;
import org.knime.core.webui.page.Page;
import org.knime.testing.node.dialog.NodeDialogNodeFactory;
import org.knime.testing.node.dialog.NodeDialogNodeModel;
import org.knime.testing.node.dialog.NodeDialogNodeView;
import org.knime.testing.util.WorkflowManagerUtil;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Tests for {@link NodeDialog}.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
public class NodeDialogTest {

    /**
     * Tests that even for an unconnected node with input ports, where the flow object stack is null, settings are
     * loaded correctly (see UIEXT-394)
     *
     * @throws Exception
     */
    @Test
    public void testInitialSettingsForUnconnectedNode() throws Exception {
        var wfm = WorkflowManagerUtil.createEmptyWorkflow();
        var nnc = WorkflowManagerUtil.createAndAddNode(wfm,
            new NodeDialogNodeFactory(() -> createNodeDialog(Page.builder(() -> "test", "test.html").build(),
                createNodeSettingsService(), null), 1));
        var nncWrapper = NodeWrapper.of(nnc);
        var nodeDialogManager = NodeDialogManager.getInstance();

        // make sure that the default settings are properly provided with the initial settings
        var initalDefaultSettings = nodeDialogManager.callInitialDataService(nncWrapper);
        assertThat(initalDefaultSettings).contains("a default model setting");
        assertThat(initalDefaultSettings).contains("a default view setting");

        // make sure that new settings (i.e. default settings are changed) are properly provided with
        // the initial settings
        var modelSettings = new NodeSettings("model");
        var viewSettings = new NodeSettings("view");
        modelSettings.addString("model_key1", "model_setting_value");
        viewSettings.addString("view_key1", "view_setting_value");
        nodeDialogManager.callApplyDataService(nncWrapper, settingsToString(modelSettings, viewSettings));
        var initialSettings = parseResult(nodeDialogManager.callInitialDataService(nncWrapper), false);
        assertThat(initialSettings).contains("\"view_key1\":{\"type\":\"string\",\"value\":\"view_setting_value\"}");
        assertThat(initialSettings).contains("\"model_key1\":{\"type\":\"string\",\"value\":\"model_setting_value\"}");
    }

    /**
     * Tests that model- and view-settings a being applied correctly and most importantly that the node is being reset
     * in case of changed model settings but not in case of changed view settings.
     *
     * @throws Exception
     */
    @Test
    public void testApplyChangedSettings() throws Exception {
        var wfm = WorkflowManagerUtil.createEmptyWorkflow();
        var nnc = WorkflowManagerUtil.createAndAddNode(wfm,
            new NodeDialogNodeFactory(() -> createNodeDialog(Page.builder(() -> "test", "test.html").build(),
                createNodeSettingsService(), null)));
        var nncWrapper = NodeWrapper.of(nnc);

        var modelSettings = new NodeSettings("model");
        var viewSettings = new NodeSettings("view");
        modelSettings.addInt("model_key1", 1);
        viewSettings.addInt("view_key1", 1);

        var nodeDialogManager = NodeDialogManager.getInstance();
        nodeDialogManager.callApplyDataService(nncWrapper, settingsToString(modelSettings, viewSettings));
        wfm.executeAllAndWaitUntilDone();
        assertThat(nnc.getNodeContainerState().isExecuted()).isTrue();
        wfm.save(wfm.getContext().getCurrentLocation(), new ExecutionMonitor(), false);
        assertThat(wfm.isDirty()).isFalse();

        // change view settings and apply -> node is not being reset
        viewSettings.addInt("view_key2", 2);
        nodeDialogManager.callApplyDataService(nncWrapper, settingsToString(modelSettings, viewSettings));
        assertThat(nnc.getNodeContainerState().isExecuted()).isTrue();
        var newSettings = new NodeSettings("node_settings");
        wfm.saveNodeSettings(nnc.getID(), newSettings);
        assertThat(newSettings.getNodeSettings(SettingsType.VIEW.getConfigKey())).isEqualTo(viewSettings);
        assertThat(nnc.isDirty()).isTrue();

        // change model settings and apply -> node is expected to be reset
        modelSettings.addInt("model_key2", 2);
        nodeDialogManager.callApplyDataService(nncWrapper, settingsToString(modelSettings, viewSettings));
        assertThat(nnc.getNodeContainerState().isExecuted()).isFalse();
        wfm.saveNodeSettings(nnc.getID(), newSettings);
        assertThat(newSettings.getNodeSettings(SettingsType.MODEL.getConfigKey())).isEqualTo(modelSettings);

        // change view settings and expose as flow variable -> node is expected to reset
        var variablesTree =
            newSettings.addNodeSettings("view_variables").addNodeSettings("tree").addNodeSettings("view_key2");
        variablesTree.addString("used_variable", null);
        variablesTree.addString("exposed_variable", "foo");
        wfm.loadNodeSettings(nnc.getID(), newSettings);
        wfm.executeAllAndWaitUntilDone();
        assertThat(nnc.getNodeContainerState().isExecuted()).isTrue();
        viewSettings.addInt("view_key2", 3);
        nodeDialogManager.callApplyDataService(nncWrapper, settingsToString(modelSettings, viewSettings));
        assertThat(nnc.getNodeContainerState().isExecuted()).isFalse();
        wfm.saveNodeSettings(nnc.getID(), newSettings);
        assertThat(newSettings.getNodeSettings(SettingsType.VIEW.getConfigKey())).isEqualTo(viewSettings);

        WorkflowManagerUtil.disposeWorkflow(wfm);
    }

    private static class TestOnApplyNodeModifer implements OnApplyNodeModifier {

        private boolean m_onApplyCalled;

        private NativeNodeContainer m_ExpectedNnc;

        private NodeSettingsRO m_expectedPreviousModelSettings;

        private NodeSettingsRO m_expectedUpdatedModelSettings;

        private NodeSettingsRO m_expectedPreviousViewSettings;

        private NodeSettingsRO m_expectedUpdatedViewSettings;

        private void setExpected(final NativeNodeContainer nnc, final NodeSettingsRO previousModelSettings,
            final NodeSettingsRO updatedModelSettings, final NodeSettingsRO previousViewSettings,
            final NodeSettingsRO updatedViewSettings) {
            m_onApplyCalled = false;
            m_ExpectedNnc = nnc;
            m_expectedPreviousModelSettings = previousModelSettings;
            m_expectedUpdatedModelSettings = updatedModelSettings;
            m_expectedPreviousViewSettings = previousViewSettings;
            m_expectedUpdatedViewSettings = updatedViewSettings;
        }

        @Override
        public void onApply(final NativeNodeContainer nnc, final NodeSettingsRO initialModelSettings,
            final NodeSettingsRO updatedModelSettings, final NodeSettingsRO initialViewSettings,
            final NodeSettingsRO updatedViewSettings) {
            m_onApplyCalled = true;
            assertThat(nnc).isEqualTo(m_ExpectedNnc);
            assertThat(initialModelSettings).isEqualTo(m_expectedPreviousModelSettings);
            assertThat(updatedModelSettings).isEqualTo(m_expectedUpdatedModelSettings);
            assertThat(initialViewSettings).isEqualTo(m_expectedPreviousViewSettings);
            assertThat(updatedViewSettings).isEqualTo(m_expectedUpdatedViewSettings);
        }
    }

    /**
     * Tests that a given TestOnApplyNodeModifer is correctly called (i.e., called with the correct parameters) when
     * data services are cleaned up.
     *
     * @throws Exception
     */
    @Test
    void testOnApplyNodeModifier() throws Exception {

        var onApplyModifier = new TestOnApplyNodeModifer();
        var wfm = WorkflowManagerUtil.createEmptyWorkflow();
        var nnc = WorkflowManagerUtil.createAndAddNode(wfm,
            new NodeDialogNodeFactory(() -> createNodeDialog(Page.builder(() -> "test", "test.html").build(),
                createNodeSettingsService(), null, onApplyModifier)));
        var nncWrapper = NodeWrapper.of(nnc);

        var initialModelSettings = new NodeSettings("model");
        var initialViewSettings = new NodeSettings("view");
        var nodeDialogManager = NodeDialogManager.getInstance();
        nodeDialogManager.callApplyDataService(nncWrapper, settingsToString(initialModelSettings, initialViewSettings));
        onApplyModifier.setExpected(nnc, initialModelSettings, initialModelSettings, initialViewSettings,
            initialViewSettings);
        nodeDialogManager.deactivateDataServices(nncWrapper); // clean up data services (simulate closing of the dialog)
        assertThat(onApplyModifier.m_onApplyCalled).isTrue();

        // Test that when settings are updated multiple times, the previous settings passed to the on apply modifier are
        // equal to the initial settings and the updated settings reflect the final update.
        var updatedModelSettings = new NodeSettings("model");
        updatedModelSettings.addString("key", "updatedOnce");
        var updatedViewSettings = new NodeSettings("view");
        updatedViewSettings.addString("key", "updatedOnce");
        nodeDialogManager.callApplyDataService(nncWrapper, settingsToString(updatedModelSettings, updatedViewSettings));
        updatedModelSettings.addString("key", "updatedTwice");
        updatedViewSettings.addString("key", "updatedTwice");
        nodeDialogManager.callApplyDataService(nncWrapper, settingsToString(updatedModelSettings, updatedViewSettings));
        onApplyModifier.setExpected(nnc, initialModelSettings, updatedModelSettings, initialViewSettings,
            updatedViewSettings);
        nodeDialogManager.deactivateDataServices(nncWrapper); // clean up data services (simulate closing of the dialog)
        assertThat(onApplyModifier.m_onApplyCalled).isTrue();

        // Test that when settings are overridden by flow variables, these settings are always passed unchanged to the
        // on apply modifier, i.e., their value is changed neither to the value of the overriding flow variable nor to
        // any updated value provided via callTextApplyDataService.
        var nodeSettings = new NodeSettings("node_settings");
        wfm.saveNodeSettings(nnc.getID(), nodeSettings);
        var viewVariables = nodeSettings.addNodeSettings("view_variables");
        viewVariables.addString("version", "V_2019_09_13");
        var viewVariable = viewVariables.addNodeSettings("tree").addNodeSettings("key");
        viewVariable.addString("used_variable", "view_variable");
        viewVariable.addString("exposed_variable", null);
        var modelVariables = nodeSettings.addNodeSettings("variables");
        modelVariables.addString("version", "V_2019_09_13");
        var modelVariable = modelVariables.addNodeSettings("tree").addNodeSettings("key");
        modelVariable.addString("used_variable", "model_variable");
        modelVariable.addString("exposed_variable", null);
        wfm.loadNodeSettings(nnc.getID(), nodeSettings);
        nnc.getFlowObjectStack().push(new FlowVariable("view_variable", "view_variable_value"));
        nnc.getFlowObjectStack().push(new FlowVariable("model_variable", "model_variable_value"));
        nodeDialogManager.callApplyDataService(nncWrapper, settingsToString(initialModelSettings, initialViewSettings));
        onApplyModifier.setExpected(nnc, updatedModelSettings, updatedModelSettings, updatedViewSettings,
            updatedViewSettings);
        nodeDialogManager.deactivateDataServices(nncWrapper); // clean up data services (simulate closing of the dialog)
        assertThat(onApplyModifier.m_onApplyCalled).isTrue();
    }

    /**
     * Tests that settings that are controlled by flow variables are properly returned in the node dialog's initial data
     * (i.e. with the flow variable value) and properly applied (i.e. ignored when being written into the node
     * settings).
     *
     * @throws IOException
     * @throws InvalidSettingsException
     */
    @Test
    public void testGetAndApplySettingsControlledByFlowVariables() throws IOException, InvalidSettingsException {
        var wfm = WorkflowManagerUtil.createEmptyWorkflow();
        var nnc = WorkflowManagerUtil.createAndAddNode(wfm,
            new NodeDialogNodeFactory(() -> createNodeDialog(Page.builder(() -> "test", "test.html").build(),
                createNodeSettingsService(), null)));
        var nncWrapper = NodeWrapper.of(nnc);

        var modelSettings = new NodeSettings("model");
        var viewSettings = new NodeSettings("view");
        modelSettings.addString("model_key1", "model_setting_value");
        viewSettings.addString("view_key1", "view_setting_value");

        var nodeDialogManager = NodeDialogManager.getInstance();
        nodeDialogManager.callApplyDataService(nncWrapper, settingsToString(modelSettings, viewSettings));
        var nodeSettings = new NodeSettings("node_settings");
        wfm.saveNodeSettings(nnc.getID(), nodeSettings);

        // apply node settings that are controlled by a flow variable -> the flow variable must not end up in the settings
        wfm.loadNodeSettings(nnc.getID(), nodeSettings);
        var initialSettings = parseResult(nodeDialogManager.callInitialDataService(nncWrapper), false);
        assertThat(initialSettings).contains("\"view_key1\":{\"type\":\"string\",\"value\":\"view_setting_value\"}");
        assertThat(initialSettings).contains("\"model_key1\":{\"type\":\"string\",\"value\":\"model_setting_value\"}");

        var viewVariables = nodeSettings.addNodeSettings("view_variables");
        viewVariables.addString("version", "V_2019_09_13");
        var viewVariable = viewVariables.addNodeSettings("tree").addNodeSettings("view_key1");
        viewVariable.addString("used_variable", "view_variable");
        viewVariable.addString("exposed_variable", null);
        var modelVariables = nodeSettings.addNodeSettings("variables");
        modelVariables.addString("version", "V_2019_09_13");
        var modelVariable = modelVariables.addNodeSettings("tree").addNodeSettings("model_key1");
        modelVariable.addString("used_variable", "model_variable");
        modelVariable.addString("exposed_variable", null);
        wfm.loadNodeSettings(nnc.getID(), nodeSettings);
        nnc.getFlowObjectStack().push(new FlowVariable("view_variable", "view_variable_value"));
        nnc.getFlowObjectStack().push(new FlowVariable("model_variable", "model_variable_value"));

        // make sure that the flow variable value is part of the initial data
        initialSettings = parseResult(nodeDialogManager.callInitialDataService(nncWrapper), false);
        assertThat(initialSettings).contains("\"view_key1\":{\"type\":\"string\",\"value\":\"view_variable_value\"}");
        assertThat(initialSettings).contains("\"model_key1\":{\"type\":\"string\",\"value\":\"model_variable_value\"}");

        // make sure that any applied settings that are controlled by a flow variable, are ignored
        // (i.e. aren't 'persisted' with the node settings)
        viewSettings.addString("view_key1", "new_value_to_be_ignored_on_apply");
        modelSettings.addString("model_key1", "new_value_to_be_ignored_on_apply");
        nodeDialogManager.callApplyDataService(nncWrapper, settingsToString(modelSettings, viewSettings));
        wfm.saveNodeSettings(nnc.getID(), nodeSettings);
        assertThat(nodeSettings.getNodeSettings("view").getString("view_key1")).isEqualTo("view_setting_value");
        assertThat(nodeSettings.getNodeSettings("model").getString("model_key1")).isEqualTo("model_setting_value");

        WorkflowManagerUtil.disposeWorkflow(wfm);
    }

    /**
     * Test overwriting and exposing settings with flow variables via the {@link VariableSettingsService}.
     *
     * @throws IOException
     * @throws InvalidSettingsException
     */
    @Test
    public void testSettingWithFlowVariables() throws IOException, InvalidSettingsException {
        Consumer<Map<SettingsType, VariableSettingsWO>> varSettingsWriter = (settings) -> { // NOSONAR: The lambda is easy to understand
            try {
                // First level settings
                settings.get(SettingsType.MODEL).addUsedVariable("model_key1", "model_variable");
                settings.get(SettingsType.MODEL).addExposedVariable("model_key2", "exp_model_variable");
                settings.get(SettingsType.VIEW).addUsedVariable("view_key1", "view_variable");
                settings.get(SettingsType.VIEW).addExposedVariable("view_key2", "exp_view_variable");

                // Nested settings
                settings.get(SettingsType.MODEL) //
                    .getOrCreateVariableSettings("settings_group") //
                    .addUsedVariable("child_key1", "child1_variable");
                settings.get(SettingsType.MODEL) //
                    .getOrCreateVariableSettings("settings_group") //
                    .addExposedVariable("child_key2", "exp_child2_variable");
                settings.get(SettingsType.VIEW) //
                    .getOrCreateVariableSettings("deep_settings_group") //
                    .getOrCreateVariableSettings("inner_settings_group") //
                    .addUsedVariable("child_key3", "child3_variable");
                settings.get(SettingsType.VIEW) //
                    .getOrCreateVariableSettings("deep_settings_group") //
                    .getOrCreateVariableSettings("inner_settings_group") //
                    .addExposedVariable("child_key4", "exp_child4_variable");
            } catch (final InvalidSettingsException ex) {
                throw new IllegalStateException(ex);
            }
        };

        var nodeDialogManager = NodeDialogManager.getInstance();
        var wfm = WorkflowManagerUtil.createEmptyWorkflow();
        var nnc = WorkflowManagerUtil.createAndAddNode(wfm,
            new NodeDialogNodeFactory(() -> createNodeDialog(Page.builder(() -> "test", "test.html").build(),
                createNodeSettingsService(varSettingsWriter), null)));
        var nncWrapper = NodeWrapper.of(nnc);

        var modelSettings = new NodeSettings("model");
        var viewSettings = new NodeSettings("view");
        modelSettings.addString("model_key1", "model_setting_value1");
        modelSettings.addString("model_key2", "model_setting_value2");
        viewSettings.addString("view_key1", "view_setting_value1");
        viewSettings.addString("view_key2", "view_setting_value2");

        // Nested settings
        // 1 level deep
        var settingsGroup = modelSettings.addNodeSettings("settings_group");
        settingsGroup.addString("child_key1", "child_setting_value1");
        settingsGroup.addString("child_key2", "child_setting_value2");

        // 2 levels deep
        var deepsettingsGroup = viewSettings.addNodeSettings("deep_settings_group");
        var innerSettingsGroup = deepsettingsGroup.addNodeSettings("inner_settings_group");
        innerSettingsGroup.addString("child_key3", "child_setting_value3");
        innerSettingsGroup.addString("child_key4", "child_setting_value4");

        // Set the flow variable
        wfm.addWorkflowVariables(true, //
            new FlowVariable("model_variable", "model_variable_value"), //
            new FlowVariable("view_variable", "view_variable_value"), //
            new FlowVariable("child1_variable", "child1_variable_value"), //
            new FlowVariable("child3_variable", "child3_variable_value") //
        );

        // Apply the settings using the TextApplyDataService
        nodeDialogManager.callApplyDataService(nncWrapper, settingsToString(modelSettings, viewSettings));

        // Assert that the model settings get overwritten
        var loadedModelSettings = getNodeModelSettings(nnc);
        assertEquals("model_variable_value", loadedModelSettings.getString("model_key1"));
        assertEquals("child1_variable_value",
            loadedModelSettings.getNodeSettings("settings_group").getString("child_key1"));

        // Assert that the view settings get overwritten
        NodeViewManager.getInstance().updateNodeViewSettings(nnc);
        var loadedViewSettings = getNodeViewSettings(nnc);
        assertEquals("view_variable_value", loadedViewSettings.getString("view_key1"));
        assertEquals("child3_variable_value", loadedViewSettings.getNodeSettings("deep_settings_group")
            .getNodeSettings("inner_settings_group").getString("child_key3"));

        // Assert that the variables get exposed
        var outgoingFlowVars = nnc.getOutgoingFlowObjectStack().getAllAvailableFlowVariables();
        assertEquals("model_setting_value2", outgoingFlowVars.get("exp_model_variable").getStringValue());
        assertEquals("view_setting_value2", outgoingFlowVars.get("exp_view_variable").getStringValue());
        assertEquals("child_setting_value2", outgoingFlowVars.get("exp_child2_variable").getStringValue());
        assertEquals("child_setting_value4", outgoingFlowVars.get("exp_child4_variable").getStringValue());
    }

    private static NodeSettingsRO getNodeModelSettings(final NativeNodeContainer nnc) {
        return ((NodeDialogNodeModel)nnc.getNode().getNodeModel()).getLoadNodeSettings();
    }

    private static NodeSettingsRO getNodeViewSettings(final NodeContainer nc) {
        return ((NodeDialogNodeView)NodeViewManager.getInstance().getNodeView(nc)).getLoadNodeSettings();
    }

    /**
     * Test that overwriting or exposing variables for settings that do not exist fails.
     *
     * @throws IOException
     */
    @Test
    public void testFailingSettingWithFlowVariables() throws IOException {
        Consumer<Map<SettingsType, VariableSettingsWO>> varSettingsWriter = (settings) -> { // NOSONAR: The lambda is easy to understand
            try {
                settings.get(SettingsType.MODEL).addUsedVariable("key1", "var1");
            } catch (final InvalidSettingsException ex) { // NOSONAR
                throw new Key1Exception();
            }
            VariableSettingsWO childSettings;
            try {
                childSettings = settings.get(SettingsType.MODEL).getOrCreateVariableSettings("child_settings");
            } catch (final InvalidSettingsException ex) { // NOSONAR
                throw new ChildKeyException();
            }
            try {
                childSettings.addExposedVariable("key2", "exp_var2");
            } catch (final InvalidSettingsException ex) { // NOSONAR
                throw new Key2Exception();
            }
        };

        var nodeDialogManager = NodeDialogManager.getInstance();
        var wfm = WorkflowManagerUtil.createEmptyWorkflow();
        var nnc = WorkflowManagerUtil.createAndAddNode(wfm,
            new NodeDialogNodeFactory(() -> createNodeDialog(Page.builder(() -> "test", "test.html").build(),
                createNodeSettingsService(varSettingsWriter), null)));
        var nncWrapper = NodeWrapper.of(nnc);

        var modelSettings = new NodeSettings("model");
        var viewSettings = new NodeSettings("view");

        // Setting with key "key1" not available
        assertThrows(Key1Exception.class, //
            () -> nodeDialogManager.callApplyDataService(nncWrapper, settingsToString(modelSettings, viewSettings)));

        modelSettings.addString("key1", "val1");
        wfm.addWorkflowVariables(true, new FlowVariable("var1", "var_value1"));

        // Child settings not available
        assertThrows(ChildKeyException.class, //
            () -> nodeDialogManager.callApplyDataService(nncWrapper, settingsToString(modelSettings, viewSettings)));

        modelSettings.addNodeSettings("child_settings");

        // Settings with key "key2" not available
        assertThrows(Key2Exception.class, //
            () -> nodeDialogManager.callApplyDataService(nncWrapper, settingsToString(modelSettings, viewSettings)));
    }

    @SuppressWarnings("serial")
    private static final class Key1Exception extends RuntimeException {
    }

    @SuppressWarnings("serial")
    private static final class ChildKeyException extends RuntimeException {
    }

    @SuppressWarnings("serial")
    private static final class Key2Exception extends RuntimeException {
    }

    /**
     * Tests to create the legacy flow variable node dialog ({@link NodeDialog#createLegacyFlowVariableNodeDialog()})
     * and makes sure the default view settings and applied view settings are available in the flow variable tree
     * (jtree).
     *
     * @throws IOException
     * @throws NotConfigurableException
     */
    @Test
    public void testCreateLegacyFlowVariableNodeDialog() throws IOException, NotConfigurableException {
        var wfm = WorkflowManagerUtil.createEmptyWorkflow();
        var nnc = WorkflowManagerUtil.createAndAddNode(wfm,
            new NodeDialogNodeFactory(() -> createNodeDialog(Page.builder(() -> "test", "test.html").build(),
                createNodeSettingsService(), null)));

        openLegacyFlowVariableDialogAndCheckViewSettings(nnc, "a default view setting value");

        var newViewSettings = new NodeSettings("new_view_settings");
        newViewSettings.addString("new view setting", "new view setting value");
        NodeDialogManager.getInstance().callApplyDataService(NodeWrapper.of(nnc),
            settingsToString(newViewSettings, newViewSettings));
        openLegacyFlowVariableDialogAndCheckViewSettings(nnc, "new view setting value");
    }

    private static void openLegacyFlowVariableDialogAndCheckViewSettings(final NativeNodeContainer nc,
        final String viewSettingValue) throws NotConfigurableException {
        LegacyFlowVariableNodeDialog legacyNodeDialog = initLegacyFlowVariableDialog(nc);

        var tabbedPane = getChild(legacyNodeDialog.getPanel(), 1);
        var flowVariablesTab = getChild(getChild(getChild(tabbedPane, 0), 0), 0);

        var modelSettingsJTree = (ConfigEditJTree)getChild(getChild(getChild(getChild(flowVariablesTab, 0), 0), 0), 0);
        var modelRootNode = modelSettingsJTree.getModel().getRoot();
        var firstModelConfigNode = (ConfigEditTreeNode)modelRootNode.getChildAt(0);
        assertThat(firstModelConfigNode.getConfigEntry().toStringValue()).isEqualTo("default model setting value");

        var viewSettingsJTree = (ConfigEditJTree)getChild(getChild(getChild(getChild(flowVariablesTab, 0), 0), 0), 1);
        var viewRootNode = viewSettingsJTree.getModel().getRoot();
        var firstViewConfigNode = (ConfigEditTreeNode)viewRootNode.getChildAt(0);
        assertThat(firstViewConfigNode.getConfigEntry().toStringValue()).isEqualTo(viewSettingValue);
    }

    private static LegacyFlowVariableNodeDialog initLegacyFlowVariableDialog(final NativeNodeContainer nc)
        throws NotConfigurableException {
        NodeContext.pushContext(nc);
        LegacyFlowVariableNodeDialog legacyNodeDialog;
        try {
            legacyNodeDialog = (LegacyFlowVariableNodeDialog)NodeDialogManager.getInstance().getNodeDialog(nc)
                .createLegacyFlowVariableNodeDialog();
            var nodeSettings = new NodeSettings("node_settings");
            var modelSettings = nodeSettings.addNodeSettings("model");
            modelSettings.addString("default model setting", "default model setting value");
            nodeSettings.addNodeSettings("internal_node_subsettings");
            legacyNodeDialog.initDialogForTesting(nodeSettings, new PortObjectSpec[]{});
        } finally {
            NodeContext.removeLastContext();
        }
        return legacyNodeDialog;
    }

    /**
     * Makes sure that model settings are properly saved again after the legacy node dialog has been closed. The model
     * settings are essentially just 'taken over' - i.e. not modified from within the legacy node dialog.
     *
     * @throws IOException
     * @throws InvalidSettingsException
     * @throws NotConfigurableException
     */
    @Test
    public void testLegacyFlowVariableDialogModelSettingsOnClose()
        throws IOException, InvalidSettingsException, NotConfigurableException {
        var wfm = WorkflowManagerUtil.createEmptyWorkflow();
        var nc = WorkflowManagerUtil.createAndAddNode(wfm,
            new NodeDialogNodeFactory(() -> createNodeDialog(Page.builder(() -> "test", "test.html").build(),
                createNodeSettingsService(), null)));

        LegacyFlowVariableNodeDialog legacyNodeDialog = initLegacyFlowVariableDialog(nc);

        var settings = new NodeSettings("test");
        legacyNodeDialog.finishEditingAndSaveSettingsTo(settings);
        assertThat(settings.getNodeSettings("model").getString("default model setting"))
            .isEqualTo("default model setting value");

        WorkflowManagerUtil.disposeWorkflow(wfm);
    }

    private static Container getChild(final Container cont, final int index) {
        return (Container)cont.getComponent(index);
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
                return settingsToString(settings.get(SettingsType.MODEL), settings.get(SettingsType.VIEW));
            }

            @Override
            public void toNodeSettings(final String textSettings,
                final Map<SettingsType, NodeAndVariableSettingsWO> settings) {
                stringToSettings(textSettings, settings.get(SettingsType.MODEL), settings.get(SettingsType.VIEW));
                if(variableSettingsWriter != null) {
                    variableSettingsWriter.accept(
                        settings.entrySet().stream().map(e -> Map.entry(e.getKey(), (VariableSettingsWO)e.getValue()))
                            .collect(Collectors.toMap(Entry::getKey, Entry::getValue)));
                }
            }

            @Override
            public void getDefaultNodeSettings(final Map<SettingsType, NodeSettingsWO> settings,
                final PortObjectSpec[] specs) {
                if (settings.containsKey(SettingsType.VIEW)) {
                    settings.get(SettingsType.VIEW).addString("a default view setting", "a default view setting value");
                }
                if (settings.containsKey(SettingsType.MODEL)) {
                    settings.get(SettingsType.MODEL).addString("a default model setting",
                        "a default model setting value");
                }
            }
        };
    }

    private static final ObjectMapper MAPPER = ObjectMapperUtil.getInstance().getObjectMapper();

    private static String settingsToString(final NodeSettingsRO modelSettings, final NodeSettingsRO viewSettings) {
        var root = MAPPER.createObjectNode();
        try {
            root.set("model",
                MAPPER.readTree(JSONConfig.toJSONString(extractNodeSettings(modelSettings), WriterConfig.DEFAULT)));
            root.set("view",
                MAPPER.readTree(JSONConfig.toJSONString(extractNodeSettings(viewSettings), WriterConfig.DEFAULT)));
        } catch (JsonProcessingException ex) {
            throw new RuntimeException(ex);
        }
        return root.toString();
    }

    private static void stringToSettings(final String s, final NodeSettingsWO modelSettings,
        final NodeSettingsWO viewSettings) {
        try {
            var jsonNode = MAPPER.readTree(s);
            JSONConfig.readJSON(extractNodeSettings(modelSettings), new StringReader(jsonNode.get("model").toString()));
            JSONConfig.readJSON(extractNodeSettings(viewSettings), new StringReader(jsonNode.get("view").toString()));
        } catch (IOException ex) {
            throw new RuntimeException(ex);
        }
    }

    private static <C> C extractNodeSettings(final C settings) {
        if (settings instanceof NodeSettingsWrapper wrapper) {
            return (C)wrapper.getNodeSettings();
        } else {
            return settings;
        }
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
                final Map<SettingsType, NodeAndVariableSettingsWO> settings) {
                //
            }

            @Override
            public String fromNodeSettings(final Map<SettingsType, NodeAndVariableSettingsRO> settings,
                final PortObjectSpec[] specs) {
                return "test settings";
            }

            @Override
            public void getDefaultNodeSettings(final Map<SettingsType, NodeSettingsWO> settings,
                final PortObjectSpec[] specs) {
                //
            }

        };
        return createNodeDialog(page, settingsMapper, null);
    }

    /**
     * Helper to create {@link NodeDialog}.
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

    static NodeDialog createNodeDialog(final Page page, final NodeSettingsService settingsDataService,
        final RpcDataService dataService, final OnApplyNodeModifier onApplyModifier) {
        return new NodeDialog() {

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
     * Creates an instance of {@link NodeAndVariableSettingsRO} by proxing all the calls to the given
     * {@link NodeSettings}- and created {@link VariableSettings}-instance.
     *
     * @param nodeSettings
     * @return a new instance
     */
    public static NodeAndVariableSettingsRO createNodeAndVariableSettingsRO(final NodeSettings nodeSettings) {
        return NodeAndVariableSettingsProxy.createROProxy(nodeSettings,
            new VariableSettings(new NodeSettings("ignored"), nodeSettings));
    }

    /**
     * Creates an instance of {@link NodeAndVariableSettingsWO} by proxing all the calls to the given
     * {@link NodeSettings}- and created {@link VariableSettings}-instance.
     *
     * @param nodeSettings
     * @return a new instance
     */
    public static NodeAndVariableSettingsWO createNodeAndVariableSettingsWO(final NodeSettings nodeSettings) {
        return NodeAndVariableSettingsProxy.createWOProxy(nodeSettings,
            new VariableSettings(new NodeSettings("ignored"), nodeSettings));
    }

}
