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

import java.io.IOException;
import java.util.Map;
import java.util.function.Supplier;

import org.junit.jupiter.api.Test;
import org.knime.core.data.DataTableSpec;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.workflow.FlowVariable;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.webui.node.NodeWrapper;
import org.knime.core.webui.node.dialog.NodeDialog;
import org.knime.core.webui.node.dialog.NodeDialogManager;
import org.knime.core.webui.node.dialog.NodeDialogManagerTest;
import org.knime.core.webui.node.dialog.NodeDialogTest;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.Persist;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
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
public class DefaultNodeDialogTest {

    static class ModelSettings implements DefaultNodeSettings {
        @Widget
        @Persist(configKey = "model setting")
        String m_modelSetting = "1";
    }

    static class ViewSettings implements DefaultNodeSettings {
        @Widget
        @Persist(configKey = "view setting")
        String m_viewSetting = "2";

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

    @Test
    void testInitialDataWithFlowVariableSettings() throws InvalidSettingsException, IOException {
        var wfm = WorkflowManagerUtil.createEmptyWorkflow();

        var defaultNodeSettingsService = new DefaultNodeSettingsService(
            Map.of(SettingsType.MODEL, ModelSettings.class, SettingsType.VIEW, ViewSettings.class));
        Supplier<NodeDialog> nodeDialogCreator =
            () -> NodeDialogTest.createNodeDialog(Page.builder(() -> "page content", "page.html").build(),
                defaultNodeSettingsService, null);
        var nnc = NodeDialogManagerTest.createNodeWithNodeDialog(wfm, nodeDialogCreator);

        var defModelSettings = new NodeSettings("model");
        var defViewSettings = new NodeSettings("view");
        defaultNodeSettingsService.getDefaultNodeSettings(
            Map.of(SettingsType.MODEL, defModelSettings, SettingsType.VIEW, defViewSettings),
            new DataTableSpec[]{new DataTableSpec()});
        initNodeSettings(nnc, defModelSettings, defViewSettings);
        nnc.getFlowObjectStack().push(new FlowVariable("flow variable 2", "test"));

        var initialData = NodeDialogManager.getInstance().callInitialDataService(NodeWrapper.of(nnc));

        var mapper = new ObjectMapper();
        var initialDataJson = mapper.readTree(initialData);
        assertFlowVariableSettings(initialDataJson, mapper);


        WorkflowManagerUtil.disposeWorkflow(wfm);
    }

    private static void assertFlowVariableSettings(final JsonNode initialData, final ObjectMapper mapper)
        throws JsonMappingException, JsonProcessingException {
        var expectedFlowVariableSettings = """
                {
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
                """;
        var expectedJson = mapper.readTree(expectedFlowVariableSettings);
        assertThatJson(initialData.get("result").get("flowVariableSettings")).isEqualTo(expectedJson);

    }

    private static void initNodeSettings(final NativeNodeContainer nnc, final NodeSettings defaultModelSettings,
        final NodeSettings defaultViewSettings) throws InvalidSettingsException {
        var parent = nnc.getParent();
        var nodeSettings = new NodeSettings("node_settings");
        parent.saveNodeSettings(nnc.getID(), nodeSettings);

        nodeSettings.addNodeSettings(defaultModelSettings);
        initModelVariableSettings(nodeSettings);
        nodeSettings.addNodeSettings(defaultViewSettings);
        initViewVariableSettings(nodeSettings);

        parent.loadNodeSettings(nnc.getID(), nodeSettings);
        parent.executeAllAndWaitUntilDone();
    }

    private static void initModelVariableSettings(final NodeSettings ns) {
        var modelVariables = ns.addNodeSettings("variables");
        modelVariables.addString("version", "V_2019_09_13");
        var variableTree = modelVariables.addNodeSettings("tree");
        var variableTreeNode = variableTree.addNodeSettings("model setting");
        variableTreeNode.addString("used_variable", "flow variable 1");
        variableTreeNode.addString("exposed_variable", null);
    }

    private static void initViewVariableSettings(final NodeSettings ns) {
        var viewVariables = ns.addNodeSettings("view_variables");
        viewVariables.addString("version", "V_2019_09_13");
        var variableTree = viewVariables.addNodeSettings("tree");
        var variableTreeNode1 = variableTree.addNodeSettings("view setting");
        variableTreeNode1.addString("used_variable", "flow variable 2");
        variableTreeNode1.addString("exposed_variable", null);

        var nested = variableTree.addNodeSettings("nested");
        var variableTreeNode2 = nested.addNodeSettings("nested view setting");
        variableTreeNode2.addString("used_variable", "flow variable 3");
        variableTreeNode2.addString("exposed_variable", "exposed var name");

        var variableTreeNode3 = nested.addNodeSettings("nested view setting 2");
        variableTreeNode3.addString("used_variable", null);
        variableTreeNode3.addString("exposed_variable", "exposed var name");

        var variableTreeNode4 = nested.addNodeSettings("nested view setting 3");
        variableTreeNode4.addString("used_variable", null);
        variableTreeNode4.addString("exposed_variable", "exposed var name");
    }

}
