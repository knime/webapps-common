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
 *   Oct 25, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.dataservice;

import static java.util.stream.Collectors.toSet;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.io.IOException;
import java.util.Collection;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Supplier;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.node.workflow.FlowObjectStack;
import org.knime.core.node.workflow.FlowVariable;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.node.workflow.NodeContext;
import org.knime.core.node.workflow.NodeID;
import org.knime.core.node.workflow.VariableType;
import org.knime.core.node.workflow.VariableType.BooleanType;
import org.knime.core.node.workflow.WorkflowManager;
import org.knime.core.webui.data.DataServiceContextTest;
import org.knime.core.webui.node.dialog.NodeDialog;
import org.knime.core.webui.node.dialog.NodeDialogManagerTest;
import org.knime.core.webui.node.dialog.NodeDialogTest;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultDialogDataConverterImpl;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.dataservice.FlowVariableDataService.PossibleFlowVariable;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.PersistableSettings;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.Persist;
import org.knime.core.webui.page.Page;
import org.knime.testing.util.WorkflowManagerUtil;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;

/**
 *
 * @author Paul Bärnreuther
 */
public class FlowVariableDataServiceTest {

    final static PortObjectSpec[] PORT_OBJECT_SPECS = new PortObjectSpec[0];

    @BeforeAll
    static void initDataServiceContext() {
        DataServiceContextTest.initDataServiceContext(null, () -> PORT_OBJECT_SPECS);
    }

    @AfterAll
    static void removeDataServiceContext() {
        DataServiceContextTest.removeDataServiceContext();
    }

    private static FlowVariableDataService
        getDataServiceWithConverter(final Map<SettingsType, Class<? extends DefaultNodeSettings>> settingsClasses) {
        return new FlowVariableDataServiceImpl(new DefaultDialogDataConverterImpl(settingsClasses));
    }

    private static FlowVariable stringVar1 = new FlowVariable("stringVar1", "stringVar1_value");

    private static FlowVariable stringVar2 = new FlowVariable("stringVar2", "stringVar2_value");

    private static FlowVariable doubleVar = new FlowVariable("doubleVar", 1.0);

    private static FlowVariable intVar = new FlowVariable("intVar", 1);

    private static FlowVariable booleanVar = new FlowVariable("booleanVar", BooleanType.INSTANCE, true);

    private static WorkflowManager m_wfm;

    @BeforeEach
    void initNodeContextWithFlowStack() throws IOException {
        m_wfm = WorkflowManagerUtil.createEmptyWorkflow();
        Supplier<NodeDialog> nodeDialogCreator =
            () -> NodeDialogTest.createNodeDialog(Page.builder(() -> "page content", "page.html").build());
        NativeNodeContainer nnc = NodeDialogManagerTest.createNodeWithNodeDialog(m_wfm, nodeDialogCreator);
        nnc.getNode().setFlowObjectStack(getContextWithFlowVariables(), null);
        NodeContext.pushContext(nnc);
    }

    private static FlowObjectStack getContextWithFlowVariables() {
        final var flowVariables = List.of(stringVar1, stringVar2, doubleVar, intVar, booleanVar);
        return FlowObjectStack.createFromFlowVariableList(flowVariables, new NodeID(0));
    }

    @AfterEach
    void disposeWorkflow() {
        WorkflowManagerUtil.disposeWorkflow(m_wfm);
        NodeContext.removeLastContext();
    }

    static class TestViewSettings implements DefaultNodeSettings {
        String m_myViewSetting;
    }

    static class NestedSetting implements PersistableSettings {
        @Persist(configKey = "myModelSettingConfigKey")
        boolean m_myModelSetting;
    }

    static class TestModelSettings implements DefaultNodeSettings {
        NestedSetting m_nestedSetting;
    }

    static Map<SettingsType, Class<? extends DefaultNodeSettings>> settingsClasses =
        Map.of(SettingsType.MODEL, TestModelSettings.class, SettingsType.VIEW, TestViewSettings.class);

    @Test
    void testGetPossibleFlowVariables() throws InvalidSettingsException {

        final var dataService = getDataServiceWithConverter(settingsClasses);
        final var viewSettingsFlowVariables = dataService.getAvailableFlowVariables("{\"data\":{\"view\": {}}}",
            new LinkedList<String>(List.of("view", "myViewSetting")));
        final var modelSettingsFlowVariables =
            dataService.getAvailableFlowVariables("{\"data\":{\"model\": {\"nestedSetting\": {}}}}",
                new LinkedList<String>(List.of("model", "nestedSetting", "myModelSettingConfigKey")));
        assertPossibleFlowVariables( //
            Set.of(stringVar1, stringVar2), //
            viewSettingsFlowVariables.get(VariableType.StringType.INSTANCE.getIdentifier()) //
        );
        assertPossibleFlowVariables( //
            Set.of(doubleVar), //
            viewSettingsFlowVariables.get(VariableType.DoubleType.INSTANCE.getIdentifier()) //
        );
        assertPossibleFlowVariables( //
            Set.of(intVar), //
            viewSettingsFlowVariables.get(VariableType.IntType.INSTANCE.getIdentifier()) //
        );
        assertThat(viewSettingsFlowVariables.get(VariableType.StringArrayType.INSTANCE.getIdentifier()))
            .isNullOrEmpty();

        assertPossibleFlowVariables( //
            Set.of(stringVar1, stringVar2), //
            modelSettingsFlowVariables.get(VariableType.StringType.INSTANCE.getIdentifier()) //
        );
        assertPossibleFlowVariables( //
            Collections.emptySet(), //
            modelSettingsFlowVariables.get(VariableType.BooleanType.INSTANCE.getIdentifier()) //
        );
        assertThat(modelSettingsFlowVariables.get(VariableType.StringArrayType.INSTANCE.getIdentifier()))
            .isNullOrEmpty();
    }

    private static void assertPossibleFlowVariables(final Collection<FlowVariable> expected,
        final Collection<PossibleFlowVariable> actual) {
        assertThat(actual)
            .containsAll(expected.stream().map(FlowVariableDataServiceImpl::toPossibleFlowVariable).collect(toSet()));
    }

    @Nested
    class ToPossibleFlowVariableTest {

        @Test
        void testShortStringFlowVariable() {
            final var name = "shortString";
            final var value = "short";
            final var possibleFlowVariable =
                FlowVariableDataServiceImpl.toPossibleFlowVariable(new FlowVariable(name, value));
            assertThat(possibleFlowVariable.name()).isEqualTo(name);
            assertThat(possibleFlowVariable.value()).isEqualTo(value);
            assertThat(possibleFlowVariable.abbreviated()).isFalse();
        }

        @Test
        void testLongStringFlowVariable() {
            final var name = "longString";
            final var value =
                "longVariableNamelongVariableNamelongVariableNamelongVariableNamelongVariableNamelongVariableNamelongVariableNamelongVariableName ( > 50 characters)";
            final var possibleFlowVariable =
                FlowVariableDataServiceImpl.toPossibleFlowVariable(new FlowVariable(name, value));
            assertThat(possibleFlowVariable.name()).isEqualTo(name);
            assertThat(possibleFlowVariable.value()).isEqualTo("longVariableNamelongVariableNamelongVariableNam...");
            assertThat(possibleFlowVariable.abbreviated()).isTrue();
        }

        @Test
        void testIntFlowVariable() {
            final var name = "int";
            final var value = 1;
            final var possibleFlowVariable =
                FlowVariableDataServiceImpl.toPossibleFlowVariable(new FlowVariable(name, value));
            assertThat(possibleFlowVariable.name()).isEqualTo(name);
            assertThat(possibleFlowVariable.value()).isEqualTo("1");
            assertThat(possibleFlowVariable.abbreviated()).isFalse();
        }

        @Test
        void testDoubleFlowVariable() {
            final var name = "double";
            final var value = 1.0;
            final var possibleFlowVariable =
                FlowVariableDataServiceImpl.toPossibleFlowVariable(new FlowVariable(name, value));
            assertThat(possibleFlowVariable.name()).isEqualTo(name);
            assertThat(possibleFlowVariable.value()).isEqualTo("1.0");
            assertThat(possibleFlowVariable.abbreviated()).isFalse();
        }

    }

    @Nested
    class GetFlowVartiableOverrideValueTest {

        static final String DATA = "{" //
            + "\"data\": {" + "\"model\": {" //
            + "\"nestedSetting\": {}" //
            + "}," //
            + "\"view\": {" //
            + "}" //
            + "}," //
            + "\"flowVariableSettings\": {" //
            + "\"model.nestedSetting.myModelSettingConfigKey\": {" //
            + String.format("\"controllingFlowVariableName\": \"%s\"", booleanVar.getName()) //
            + "}," //
            + "\"view.myViewSetting\": {" //
            + String.format("\"controllingFlowVariableName\": \"%s\"", stringVar1.getName()) //
            + "}" //
            + "}" //
            + "}";

        @Test
        void testGetFlowVariableOverrideValue() throws JsonProcessingException, InvalidSettingsException {
            final var dataPath = new LinkedList<String>(List.of("view", "myViewSetting"));
            final var dataService = getDataServiceWithConverter(settingsClasses);
            assertThat(((JsonNode)dataService.getFlowVariableOverrideValue(DATA, dataPath)).textValue())
                .isEqualTo(stringVar1.getValueAsString());
        }

        @Test
        void testGetFlowVariableOverrideValueWithConfigKey() throws JsonProcessingException, InvalidSettingsException {
            final var dataPath = new LinkedList<String>(List.of("model", "nestedSetting", "myModelSetting"));
            final var dataService = getDataServiceWithConverter(settingsClasses);
            assertThat(((JsonNode)dataService.getFlowVariableOverrideValue(DATA, dataPath)).asBoolean())
                .isEqualTo(booleanVar.getValue(VariableType.BooleanType.INSTANCE));
        }

        static final String STRING_OVERRIDES_BOOLEAN_DATA = "{" //
            + "\"data\": {" + "\"model\": {" //
            + "\"nestedSetting\": {}" //
            + "}" //
            + "}," //
            + "\"flowVariableSettings\": {" //
            + "\"model.nestedSetting.myModelSettingConfigKey\": {" //
            + String.format("\"controllingFlowVariableName\": \"%s\"", stringVar1.getName()) //
            + "}" //
            + "}" //
            + "}";

        @Test
        void testThrowsOnOverrideError() throws JsonProcessingException, InvalidSettingsException {
            final var dataPath = new LinkedList<String>(List.of("model", "nestedSetting", "myModelSetting"));
            final var dataService = getDataServiceWithConverter(settingsClasses);
            final var invalidSettingsException = assertThrows(InvalidSettingsException.class,
                () -> dataService.getFlowVariableOverrideValue(STRING_OVERRIDES_BOOLEAN_DATA, dataPath));
            assertThat(invalidSettingsException.getMessage()).isEqualTo(
                "Unable to parse \"stringvar1_value\" (variable \"stringVar1\") as boolean expression (settings parameter \"myModelSettingConfigKey\")");
        }

        static final String WRONG_ENUM_VALUE_OVERRIDE = "{" //
            + "\"data\": {" + "\"model\": {" //
            + "\"enumField\": \"A\"" + "}" //
            + "}," //
            + "\"flowVariableSettings\": {" //
            + "\"model.enumField\": {" //
            + String.format("\"controllingFlowVariableName\": \"%s\"", stringVar1.getName()) //
            + "}" //
            + "}" //
            + "}";

        static class TestSettingsWithEnum implements DefaultNodeSettings {
            enum MyEnum {
                    A, B, C
            }

            MyEnum m_enumField = MyEnum.A;
        }

        @Test
        void testThrowsOnLoadError() throws JsonProcessingException, InvalidSettingsException {
            final var dataPath = new LinkedList<String>(List.of("model", "enumField"));
            final var dataService = getDataServiceWithConverter(Map.of(SettingsType.MODEL, TestSettingsWithEnum.class));
            final var invalidSettingsException = assertThrows(InvalidSettingsException.class,
                () -> dataService.getFlowVariableOverrideValue(WRONG_ENUM_VALUE_OVERRIDE, dataPath));
            assertThat(invalidSettingsException.getMessage())
                .isEqualTo(String.format("Invalid value 'stringVar1_value'. Possible values: A, B, C",
                    TestSettingsWithEnum.MyEnum.class.getName()));
        }

    }

}
