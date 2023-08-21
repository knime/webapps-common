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
 *   9 Nov 2021 (Marc Bux, KNIME GmbH, Berlin, Germany): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.dataservice;

import static java.util.stream.Collectors.toSet;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Collection;
import java.util.Collections;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.function.Supplier;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.node.workflow.FlowObjectStack;
import org.knime.core.node.workflow.FlowVariable;
import org.knime.core.node.workflow.NodeID;
import org.knime.core.node.workflow.VariableType;
import org.knime.core.webui.node.dialog.NodeSettingsService;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.dataservice.DefaultNodeDialogDataService.PossibleFlowVariable;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsDataUtil;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.PersistableSettings;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.Persist;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonActionHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonChange;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonUpdateHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.ChoicesUpdateHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.PossibleValue;
import org.knime.core.webui.node.dialog.defaultdialog.widget.handler.WidgetHandlerException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * Tests DefaultNodeSettingsService.
 *
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
@SuppressWarnings("java:S2698") // we accept assertions without messages
class DefaultNodeDialogDataServiceImplTest {

    static class TestDefaultNodeSettings implements DefaultNodeSettings {
        String m_foo = "bar";
    }

    private static DefaultNodeDialogDataServiceImpl
        getDataServiceWithNullContext(final Collection<Class<? extends DefaultNodeSettings>> settingsClasses) {
        return new DefaultNodeDialogDataServiceImpl(settingsClasses, () -> null, null);
    }

    @Nested
    class ChoicesDataServiceTest {
        static class TestChoicesUpdateHandler implements ChoicesUpdateHandler<TestDefaultNodeSettings> {

            public final static PossibleValue[] getResult(final String id) {
                return new PossibleValue[]{PossibleValue.fromId(id)};

            }

            /**
             * {@inheritDoc}
             */
            @Override
            public PossibleValue[] update(final TestDefaultNodeSettings settings,
                final DefaultNodeSettingsContext context) {
                return getResult(settings.m_foo);
            }
        }

        @Test
        void testUpdate() throws ExecutionException, InterruptedException {

            class ButtonSettings implements DefaultNodeSettings {
                @ChoicesWidget(choicesUpdateHandler = TestChoicesUpdateHandler.class)
                String m_button;

                @SuppressWarnings("unused")
                String m_otherSetting;
            }

            final String testDepenenciesFooValue = "custom value";
            final var dataService = getDataServiceWithNullContext(List.of(ButtonSettings.class));
            final var result = dataService.update("widgetId", TestChoicesUpdateHandler.class.getName(),
                Map.of("foo", testDepenenciesFooValue));
            assertThat(result.result()).isEqualTo(TestChoicesUpdateHandler.getResult(testDepenenciesFooValue));
        }
    }

    @Nested
    class ButtonDataServiceTest {

        enum TestButtonStates {
                FIRST, SECOND
        }

        @SuppressWarnings("unused")
        abstract static class IntermediateSuperType<A, B> implements ButtonActionHandler<B, A, TestButtonStates> {

            @Override
            public Class<TestButtonStates> getStateMachine() {
                return TestButtonStates.class;
            }

        }

        abstract static class IntermediateSuperUpdateHandler<A, B>
            implements ButtonUpdateHandler<B, A, TestButtonStates> {

        }

        static class GenericTypesTestHandler extends IntermediateSuperType<TestDefaultNodeSettings, String> {

            @Override
            public ButtonChange<String, TestButtonStates> initialize(final String currentValue,
                final DefaultNodeSettingsContext context) {
                return new ButtonChange<>(currentValue, TestButtonStates.FIRST);

            }

            @Override
            public ButtonChange<String, TestButtonStates> invoke(final TestButtonStates state,
                final TestDefaultNodeSettings settings, final DefaultNodeSettingsContext context) {
                return new ButtonChange<>(settings.m_foo, state);
            }

        }

        static class GenericTypesUpdateHandler extends IntermediateSuperUpdateHandler<TestDefaultNodeSettings, String> {

            @Override
            public ButtonChange<String, TestButtonStates> update(final TestDefaultNodeSettings settings,
                final DefaultNodeSettingsContext context) throws WidgetHandlerException {
                return new ButtonChange<>(settings.m_foo, TestButtonStates.SECOND);
            }

        }

        @Test
        void testInitializeButton() throws ExecutionException, InterruptedException {

            class ButtonSettings implements DefaultNodeSettings {
                @ButtonWidget(actionHandler = GenericTypesTestHandler.class)
                String m_button;
            }

            final var dataService = getDataServiceWithNullContext(List.of(ButtonSettings.class));
            final String currentState = "currentState";
            final var result =
                dataService.initializeButton("widgetId", GenericTypesTestHandler.class.getName(), currentState);
            @SuppressWarnings("unchecked")
            final var buttonChange = (ButtonChange<String, TestButtonStates>)result.result();
            assertThat(buttonChange.settingValue()).isEqualTo(currentState);
        }

        @Test
        void testInvokeButtonAction() throws ExecutionException, InterruptedException {

            class ButtonSettings implements DefaultNodeSettings {
                @ButtonWidget(actionHandler = GenericTypesTestHandler.class)
                String m_button;
            }

            final var testDepenenciesFooValue = "custom value";
            final var dataService = getDataServiceWithNullContext(List.of(ButtonSettings.class));
            final var result = dataService.invokeButtonAction("widgetId", GenericTypesTestHandler.class.getName(),
                "FIRST", Map.of("foo", testDepenenciesFooValue));
            @SuppressWarnings("unchecked")
            final var buttonChange = (ButtonChange<String, TestButtonStates>)result.result();
            assertThat(buttonChange.buttonState()).isEqualTo(TestButtonStates.FIRST);
            assertThat(buttonChange.settingValue()).isEqualTo(testDepenenciesFooValue);
        }

        @Test
        void testUpdate() throws ExecutionException, InterruptedException {

            class ButtonSettings implements DefaultNodeSettings {
                @ButtonWidget(actionHandler = GenericTypesTestHandler.class,
                    updateHandler = GenericTypesUpdateHandler.class)
                String m_button;
            }

            final var testDepenenciesFooValue = "custom value";
            final var dataService = getDataServiceWithNullContext(List.of(ButtonSettings.class));
            final var result = dataService.update("widgetId", GenericTypesUpdateHandler.class.getName(),
                Map.of("foo", testDepenenciesFooValue));
            @SuppressWarnings("unchecked")
            final var buttonChange = (ButtonChange<String, TestButtonStates>)result.result();
            assertThat(buttonChange.settingValue()).isEqualTo(testDepenenciesFooValue);
        }
    }

    @Nested
    class FindHandlerTest {

        interface SimpleTestHandler extends ChoicesUpdateHandler<TestDefaultNodeSettings> {

            String getResult();

            @Override
            default public PossibleValue[] update(final TestDefaultNodeSettings settings,
                final DefaultNodeSettingsContext context) {
                return new PossibleValue[]{PossibleValue.fromId(getResult())};

            }

        }

        static class FirstTestHandler implements SimpleTestHandler {

            public static final String ID = "FirstTestHandler";

            @Override
            public String getResult() {
                return ID;
            }

        }

        static class SecondTestHandler implements SimpleTestHandler {

            public static final String ID = "SecondTestHandler";

            @Override
            public String getResult() {
                return ID;
            }

        }

        @Test
        void testMultipleHandlers() throws ExecutionException, InterruptedException {

            class TestSettings implements DefaultNodeSettings {
                @ChoicesWidget(choicesUpdateHandler = FirstTestHandler.class)
                String m_button;

                @ChoicesWidget(choicesUpdateHandler = SecondTestHandler.class)
                String m_otherButton;
            }

            final var dataService = getDataServiceWithNullContext(List.of(TestSettings.class));
            final var firstResult = dataService.update("widgetId", FirstTestHandler.class.getName(), null);
            final var secondResult = dataService.update("widgetId", SecondTestHandler.class.getName(), null);
            assertThat(((PossibleValue[])firstResult.result())[0].id()).isEqualTo(FirstTestHandler.ID);
            assertThat(((PossibleValue[])secondResult.result())[0].id()).isEqualTo(SecondTestHandler.ID);
        }

        @Test
        void testThrowsIfNoHandlerPresent() throws ExecutionException, InterruptedException {

            class TestSettings implements DefaultNodeSettings {
                @ChoicesWidget(choicesUpdateHandler = FirstTestHandler.class)
                String m_button;
            }

            final var dataService = getDataServiceWithNullContext(List.of(TestSettings.class));
            final var handlerName = SecondTestHandler.class.getName();
            assertThrows(IllegalArgumentException.class, () -> dataService.update("widgetId", handlerName, null));

        }

        @Test
        void testThrowsIfHandlerInstantiationFailed() throws ExecutionException, InterruptedException {

            class NonStaticHandler extends FirstTestHandler {
            }

            class TestSettings implements DefaultNodeSettings {
                @ChoicesWidget(choicesUpdateHandler = NonStaticHandler.class)
                String m_button;
            }
            final var handlerName = NonStaticHandler.class.getName();
            final var dataService = getDataServiceWithNullContext(List.of(TestSettings.class));
            assertThrows(IllegalArgumentException.class, () -> dataService.update("widgetId", handlerName, null));

        }

        @Test
        void testMultipleSettingsClasses() throws ExecutionException, InterruptedException {

            class TestSettings implements DefaultNodeSettings {
                @ChoicesWidget(choicesUpdateHandler = FirstTestHandler.class)
                String m_button;
            }

            class OtherTestSettings implements DefaultNodeSettings {
                @ChoicesWidget(choicesUpdateHandler = SecondTestHandler.class)
                String m_button;
            }

            final var dataService = getDataServiceWithNullContext(List.of(TestSettings.class, OtherTestSettings.class));
            final var firstResult = dataService.update("widgetId", FirstTestHandler.class.getName(), null);
            final var secondResult = dataService.update("widgetId", SecondTestHandler.class.getName(), null);
            assertThat(((PossibleValue[])firstResult.result())[0].id()).isEqualTo(FirstTestHandler.ID);
            assertThat(((PossibleValue[])secondResult.result())[0].id()).isEqualTo(SecondTestHandler.ID);
        }
    }

    static class DefaultNodeSettingsContextHandler implements ChoicesUpdateHandler<TestDefaultNodeSettings> {

        /**
         * We only use this method to find out if the settings creation context is null. {@inheritDoc}
         */
        @Override
        public PossibleValue[] update(final TestDefaultNodeSettings settings,
            final DefaultNodeSettingsContext context) {
            return context == null ? null : new PossibleValue[0];
        }

    }

    @Nested
    class DefaultNodeSettingsContextSupplierTest {
        private DefaultNodeSettingsContext m_context = null; //NOSONAR

        @Test
        void testSuppliesDefaultNodeSettingsContextToHandler() throws ExecutionException, InterruptedException {

            class ButtonSettings implements DefaultNodeSettings {
                @ChoicesWidget(choicesUpdateHandler = DefaultNodeSettingsContextHandler.class)
                Boolean m_button;
            }

            final Supplier<DefaultNodeSettingsContext> contextProvider =
                new Supplier<DefaultNodeSettings.DefaultNodeSettingsContext>() {

                    @Override
                    public DefaultNodeSettingsContext get() {
                        return m_context;
                    }
                };

            m_context = null;
            final var dataService =
                new DefaultNodeDialogDataServiceImpl(List.of(ButtonSettings.class), contextProvider, null);

            final var firstResult =
                dataService.update("widgetId", DefaultNodeSettingsContextHandler.class.getName(), null).result();
            assertThat(firstResult).isNull();

            m_context = new DefaultNodeSettingsContext(new PortObjectSpec[0], null, null);

            final var secondResult =
                dataService.update("widgetId", DefaultNodeSettingsContextHandler.class.getName(), null).result();
            assertThat(secondResult).isNotNull();

        }
    }

    @Nested
    class FlowVariablesTest {

        private static FlowVariable stringVar1 = new FlowVariable("stringVar1", "stringVar1_value");

        private static FlowVariable stringVar2 = new FlowVariable("stringVar2", "stringVar2_value");

        private static FlowVariable doubleVar = new FlowVariable("doubleVar", 1.0);

        private static FlowVariable intVar = new FlowVariable("intVar", 1);

        private static DefaultNodeSettingsContext getContextWithFlowVariables() {
            final var flowVariables = List.of(stringVar1, stringVar2, doubleVar, intVar);
            final FlowObjectStack variableStack =
                FlowObjectStack.createFromFlowVariableList(flowVariables, new NodeID(0));
            return new DefaultNodeSettingsContext(new PortObjectSpec[0], variableStack, null);

        }

        private static DefaultNodeDialogDataService
            getDataServiceWithSettingsService(final NodeSettingsService settingsService) {
            return new DefaultNodeDialogDataServiceImpl(Collections.emptyList(),
                FlowVariablesTest::getContextWithFlowVariables, settingsService);
        }

        static class FromTextSettingsService implements NodeSettingsService {

            private final Map<SettingsType, Class<? extends DefaultNodeSettings>> m_settingsClasses;

            FromTextSettingsService(final Map<SettingsType, Class<? extends DefaultNodeSettings>> settingsClasses) {
                this.m_settingsClasses = settingsClasses;
            }

            @Override
            public String fromNodeSettings(final Map<SettingsType, NodeSettingsRO> settings,
                final PortObjectSpec[] specs) {
                throw new IllegalStateException("This code should be unreachable");
            }

            @Override
            public void toNodeSettings(final String textSettings, final Map<SettingsType, NodeSettingsWO> settings) {
                try {
                    final var root = (ObjectNode)JsonFormsDataUtil.getMapper().readTree(textSettings);
                    textSettingsToNodeSettings(root, SettingsType.MODEL, settings);
                    textSettingsToNodeSettings(root, SettingsType.VIEW, settings);
                } catch (JsonProcessingException e) {
                    throw new IllegalStateException(
                        String.format("Exception when writing data to node settings: %s", e.getMessage()), e);
                }
            }

            private void textSettingsToNodeSettings(final ObjectNode rootNode, final SettingsType settingsType,
                final Map<SettingsType, NodeSettingsWO> settings) {
                if (settings.containsKey(settingsType)) {
                    final var node = rootNode.get(settingsType.getConfigKey());
                    var settingsClass = m_settingsClasses.get(settingsType);
                    var settingsObj = JsonFormsDataUtil.toDefaultNodeSettings(node, settingsClass);
                    DefaultNodeSettings.saveSettings(settingsClass, settingsObj, settings.get(settingsType));
                }
            }

            @Override
            public void getDefaultNodeSettings(final Map<SettingsType, NodeSettingsWO> settings,
                final PortObjectSpec[] specs) {
                throw new IllegalStateException("This code should be unreachable");
            }

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

        @Test
        void testGetPossibleFlowVariables() throws InvalidSettingsException {

            final var settingsClasses =
                Map.of(SettingsType.MODEL, TestModelSettings.class, SettingsType.VIEW, TestViewSettings.class);
            final var nodeDialogSettingsService = new FromTextSettingsService(settingsClasses);
            final var dataService = getDataServiceWithSettingsService(nodeDialogSettingsService);
            final var viewSettingsFlowVariables = dataService.getAvailableFlowVariables("{\"view\": {}}",
                new LinkedList<String>(List.of("view")), "myViewSetting");
            final var modelSettingsFlowVariables =
                dataService.getAvailableFlowVariables("{\"model\": {\"nestedSetting\": {}}}",
                    new LinkedList<String>(List.of("model", "nestedSetting")), "myModelSettingConfigKey");
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

        private void assertPossibleFlowVariables(final Collection<FlowVariable> expected,
            final Collection<PossibleFlowVariable> actual) {
            assertThat(actual).containsAll(
                expected.stream().map(DefaultNodeDialogDataServiceImpl::toPossibleFlowVariable).collect(toSet()));
        }

        @Test
        void testGetFlowVariableValue() {
            final var dataService = new DefaultNodeDialogDataServiceImpl(Collections.emptyList(),
                FlowVariablesTest::getContextWithFlowVariables, null);
            assertThat(dataService.getFlowVariableValue(stringVar1.getName())).isEqualTo(stringVar1.getStringValue());
            assertThat(dataService.getFlowVariableValue(stringVar2.getName())).isEqualTo(stringVar2.getStringValue());
            assertThat(dataService.getFlowVariableValue(intVar.getName())).isEqualTo("1");
            assertThat(dataService.getFlowVariableValue(doubleVar.getName())).isEqualTo("1.0");
        }

        @Nested
        class ToPossibleFlowVariableTest {

            @Test
            void testShortStringFlowVariable() {
                final var name = "shortString";
                final var value = "short";
                final var possibleFlowVariable =
                    DefaultNodeDialogDataServiceImpl.toPossibleFlowVariable(new FlowVariable(name, value));
                assertThat(possibleFlowVariable.name()).isEqualTo(name);
                assertThat(possibleFlowVariable.value()).isEqualTo(value);
                assertThat(possibleFlowVariable.abbreviated()).isFalse();
            }

            @Test
            void testLongStringFlowVariable() {
                final var name = "longString";
                final var value = "longVariableNamelongVariableNamelongVariableNamelongVariableNamelongVariableNamelongVariableNamelongVariableNamelongVariableName ( > 50 characters)";
                final var possibleFlowVariable =
                    DefaultNodeDialogDataServiceImpl.toPossibleFlowVariable(new FlowVariable(name, value));
                assertThat(possibleFlowVariable.name()).isEqualTo(name);
                assertThat(possibleFlowVariable.value()).isEqualTo("longVariableNamelongVariableNamelongVariableNam...");
                assertThat(possibleFlowVariable.abbreviated()).isTrue();
            }

            @Test
            void testIntFlowVariable() {
                final var name = "int";
                final var value = 1;
                final var possibleFlowVariable =
                    DefaultNodeDialogDataServiceImpl.toPossibleFlowVariable(new FlowVariable(name, value));
                assertThat(possibleFlowVariable.name()).isEqualTo(name);
                assertThat(possibleFlowVariable.value()).isEqualTo("1");
                assertThat(possibleFlowVariable.abbreviated()).isFalse();
            }

            @Test
            void testDoubleFlowVariable() {
                final var name = "double";
                final var value = 1.0;
                final var possibleFlowVariable =
                    DefaultNodeDialogDataServiceImpl.toPossibleFlowVariable(new FlowVariable(name, value));
                assertThat(possibleFlowVariable.name()).isEqualTo(name);
                assertThat(possibleFlowVariable.value()).isEqualTo("1.0");
                assertThat(possibleFlowVariable.abbreviated()).isFalse();
            }

        }

    }

}
