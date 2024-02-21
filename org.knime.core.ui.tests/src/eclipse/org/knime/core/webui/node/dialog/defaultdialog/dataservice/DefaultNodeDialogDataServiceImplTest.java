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

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.groups.Tuple.tuple;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.function.Supplier;

import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.knime.core.data.DataColumnSpec;
import org.knime.core.data.DataColumnSpecCreator;
import org.knime.core.data.def.StringCell;
import org.knime.core.node.Node;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.node.workflow.CredentialsProvider;
import org.knime.core.node.workflow.ICredentials;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.node.workflow.NodeContext;
import org.knime.core.webui.data.DataServiceContextTest;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.UpdateResultsUtil.UpdateResult;
import org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.Credentials;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ColumnChoicesProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.FileExtensionProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.LocalFileWriterWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonActionHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonChange;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonUpdateHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.ChoicesUpdateHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.IdAndText;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.impl.AsyncChoicesHolder;
import org.knime.core.webui.node.dialog.defaultdialog.widget.handler.WidgetHandlerException;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.StateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueRef;

/**
 * Tests DefaultNodeSettingsService.
 *
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
@SuppressWarnings("java:S2698") // we accept assertions without messages
class DefaultNodeDialogDataServiceImplTest {

    static class TestDefaultNodeSettings implements DefaultNodeSettings {
        @Widget
        String m_foo = "bar";
    }

    final static PortObjectSpec[] PORT_OBJECT_SPECS = new PortObjectSpec[0];

    @BeforeAll
    static void initDataServiceContext() {
        DataServiceContextTest.initDataServiceContext(null, () -> PORT_OBJECT_SPECS);
    }

    @AfterAll
    static void removeDataServiceContext() {
        DataServiceContextTest.removeDataServiceContext();
    }

    private static DefaultNodeDialogDataServiceImpl
        getDataService(final Class<? extends DefaultNodeSettings> modelSettingsClass) {
        return getDataServiceWithAsyncChoices(modelSettingsClass, new AsyncChoicesHolder());
    }

    private static DefaultNodeDialogDataServiceImpl getDataServiceWithAsyncChoices(
        final Class<? extends DefaultNodeSettings> modelSettingsClass, final AsyncChoicesHolder asyncChoicesHolder) {
        return new DefaultNodeDialogDataServiceImpl(Map.of(SettingsType.MODEL, modelSettingsClass), asyncChoicesHolder);
    }

    private static DefaultNodeDialogDataServiceImpl getDataService(
        final Class<? extends DefaultNodeSettings> modelSettingsClass,
        final Class<? extends DefaultNodeSettings> viewSettingsClass) {
        return new DefaultNodeDialogDataServiceImpl(
            Map.of(SettingsType.MODEL, modelSettingsClass, SettingsType.VIEW, viewSettingsClass),
            new AsyncChoicesHolder());
    }

    @Nested
    class UpdatesDataServiceTest {

        static final class MyValueRef implements ValueRef<String> {
        }

        private static final class TestStateProvider implements StateProvider<String> {

            private Supplier<String> m_dependencySupplier;

            @Override
            public void init(final StateProviderInitializer initializer) {
                m_dependencySupplier = initializer.computeFromValueSupplier(MyValueRef.class);
            }

            /**
             * {@inheritDoc}
             */
            @Override
            public String computeState() {
                return m_dependencySupplier.get();
            }

        }

        @Test
        void testSingleUpdate() throws ExecutionException, InterruptedException {

            class UpdateSettings implements DefaultNodeSettings {

                @Widget(valueRef = MyValueRef.class)
                String m_dependency;

                @Widget(valueProvider = TestStateProvider.class)
                String m_updatedWidget;

            }

            final String testDepenenciesFooValue = "custom value";
            final var dataService = getDataService(UpdateSettings.class);
            final var resultWrapper = dataService.update2("widgetId", MyValueRef.class.getName(),
                Map.of(MyValueRef.class.getName(), testDepenenciesFooValue));
            final var result = (List<UpdateResult>)(resultWrapper.result());
            assertThat(result).hasSize(1);
            assertThat(result.get(0).value()).isEqualTo(testDepenenciesFooValue);
            assertThat(result.get(0).path()).isEqualTo("#/properties/model/properties/updatedWidget");
        }

        @Test
        void testUiStateProvider() throws ExecutionException, InterruptedException {

            class UpdateSettings implements DefaultNodeSettings {

                @Widget(valueRef = MyValueRef.class)
                String m_dependency;

                static final class MyFileExtensionProvider implements FileExtensionProvider {

                    private Supplier<String> m_valueSupplier;

                    @Override
                    public void init(final StateProviderInitializer initializer) {
                        m_valueSupplier = initializer.computeFromValueSupplier(MyValueRef.class);

                    }

                    @Override
                    public String computeState() {
                        return m_valueSupplier.get();
                    }

                }

                @LocalFileWriterWidget(fileExtensionProvider = MyFileExtensionProvider.class)
                String m_updatedWidget;

            }

            final String testDepenencyValue = "custom value";
            final var dataService = getDataService(UpdateSettings.class);
            final var resultWrapper = dataService.update2("widgetId", MyValueRef.class.getName(),
                Map.of(MyValueRef.class.getName(), testDepenencyValue));
            final var result = (List<UpdateResult>)(resultWrapper.result());
            assertThat(result).hasSize(1);
            assertThat(result.get(0).value()).isEqualTo(testDepenencyValue);
            assertThat(result.get(0).path()).isNull();
            assertThat(result.get(0).id()).isEqualTo(UpdateSettings.MyFileExtensionProvider.class.getName());
        }

        static final class MyFirstValueRef implements ValueRef<String> {
        }

        static final class MySecondValueRef implements ValueRef<String> {
        }

        record CommonFirstState(String first, String second) {
        }

        private static final class CommonFirstStateProvider implements StateProvider<CommonFirstState> {

            private Supplier<String> m_secondDependencyProvider;

            private Supplier<String> m_firstDependencyProvider;

            /**
             * {@inheritDoc}
             */
            @Override
            public void init(final StateProviderInitializer initializer) {
                m_firstDependencyProvider = initializer.computeFromValueSupplier(MyFirstValueRef.class);
                m_secondDependencyProvider = initializer.getValueSupplier(MySecondValueRef.class);
            }

            /**
             * {@inheritDoc}
             */
            @Override
            public CommonFirstState computeState() {
                return new CommonFirstState(m_firstDependencyProvider.get() + "_first",
                    m_secondDependencyProvider.get() + "_second");
            }

        }

        static final class FirstResolver implements StateProvider<String> {

            private Supplier<CommonFirstState> m_pairProvider;

            @Override
            public void init(final StateProviderInitializer initializer) {
                m_pairProvider = initializer.computeFromProvidedState(CommonFirstStateProvider.class);
            }

            @Override
            public String computeState() {
                return m_pairProvider.get().first();
            }

        }

        static final class SecondResolver implements StateProvider<String> {
            private Supplier<CommonFirstState> m_pairProvider;

            @Override
            public void init(final StateProviderInitializer initializer) {
                m_pairProvider = initializer.computeFromProvidedState(CommonFirstStateProvider.class);
            }

            @Override
            public String computeState() {
                return m_pairProvider.get().second();
            }
        }

        @Test
        void testMultipleUpdatesWithOneHandler() throws ExecutionException, InterruptedException {

            class UpdateSettings implements DefaultNodeSettings {

                @Widget(valueRef = MyFirstValueRef.class)
                String m_foo;

                @Widget(valueRef = MySecondValueRef.class)
                String m_bar;

                @Widget(valueProvider = FirstResolver.class)
                String m_firstUpdatedWidget;

                @Widget(valueProvider = SecondResolver.class)
                String m_secondUpdatedWidget;

            }

            final String testDepenenciesFooValue = "custom value 1";

            final String testDepenenciesBarValue = "custom value 2";
            final var dataService = getDataService(UpdateSettings.class);
            final var resultWrapper =
                dataService.update2("widgetId", MyFirstValueRef.class.getName(), Map.of(MyFirstValueRef.class.getName(),
                    testDepenenciesFooValue, MySecondValueRef.class.getName(), testDepenenciesBarValue));
            final var result = (List<UpdateResult>)(resultWrapper.result());
            assertThat(result).hasSize(2);
            assertThat(result).extracting("value", "path").contains(
                tuple(testDepenenciesFooValue + "_first", "#/properties/model/properties/firstUpdatedWidget"),
                tuple(testDepenenciesBarValue + "_second", "#/properties/model/properties/secondUpdatedWidget"));
        }
    }

    @Nested
    class ChoicesDataServiceTest {
        static class TestChoicesUpdateHandler implements ChoicesUpdateHandler<TestDefaultNodeSettings> {

            public final static IdAndText[] getResult(final String id) {
                return new IdAndText[]{IdAndText.fromId(id)};

            }

            /**
             * {@inheritDoc}
             */
            @Override
            public IdAndText[] update(final TestDefaultNodeSettings settings,
                final DefaultNodeSettingsContext context) {
                return getResult(settings.m_foo);
            }
        }

        @Test
        void testUpdate() throws ExecutionException, InterruptedException {

            class ChoicesSettings implements DefaultNodeSettings {
                @Widget
                @ChoicesWidget(choicesUpdateHandler = TestChoicesUpdateHandler.class)
                String m_choicesWidgetElement;

                @Widget
                @SuppressWarnings("unused")
                String m_otherSetting;
            }

            final String testDepenenciesFooValue = "custom value";
            final var dataService = getDataService(ChoicesSettings.class);
            final var result = dataService.update("widgetId", TestChoicesUpdateHandler.class.getName(),
                Map.of("foo", testDepenenciesFooValue));
            assertThat(result.result()).isEqualTo(TestChoicesUpdateHandler.getResult(testDepenenciesFooValue));
        }

        @Test
        void testUpdateInsideArrayLayout() throws ExecutionException, InterruptedException {

            class ChoicesSettings implements DefaultNodeSettings {
                static class ArrayElem implements DefaultNodeSettings {
                    @Widget
                    @ChoicesWidget(choicesUpdateHandler = TestChoicesUpdateHandler.class)
                    String m_choicesWidgetElement;
                }

                @Widget
                @SuppressWarnings("unused")
                ArrayElem[] m_array;
            }

            final String testDepenenciesFooValue = "custom value";
            final var dataService = getDataService(ChoicesSettings.class);
            final var result = dataService.update("widgetId", TestChoicesUpdateHandler.class.getName(),
                Map.of("foo", testDepenenciesFooValue));
            assertThat(result.result()).isEqualTo(TestChoicesUpdateHandler.getResult(testDepenenciesFooValue));
        }

        static class TestChoicesProvider implements ChoicesProvider {

            @Override
            public String[] choices(final DefaultNodeSettingsContext context) {
                return new String[]{"A", "B", "C"};
            }

        }

        static class TestColumnChoicesProvider implements ColumnChoicesProvider {

            @Override
            public DataColumnSpec[] columnChoices(final DefaultNodeSettingsContext context) {
                final var colSpec = new DataColumnSpecCreator("myCol", StringCell.TYPE).createSpec();
                return new DataColumnSpec[]{colSpec};
            }

        }

        static class TestChoicesProviderWithError implements ChoicesProvider {

            public static final String MY_ERROR = "MyError";

            @Override
            public String[] choices(final DefaultNodeSettingsContext context) {
                throw new WidgetHandlerException(MY_ERROR);
            }

        }

        @Test
        void testGetChoicesWithError() throws ExecutionException, InterruptedException {

            class ChoicesSettings implements DefaultNodeSettings {
                @Widget
                @ChoicesWidget(choices = TestChoicesProviderWithError.class)
                String m_foo;
            }

            final var asyncChoicesHolder = new AsyncChoicesHolder();
            final var choices = new IdAndText[]{new IdAndText("id", "text")};
            asyncChoicesHolder.addChoices(TestChoicesProvider.class.getName(), () -> choices);
            final var errorMessage = "Failed to load choices";
            asyncChoicesHolder.addChoices(TestColumnChoicesProvider.class.getName(), () -> {
                throw new WidgetHandlerException(errorMessage);
            });
            final var dataService = getDataServiceWithAsyncChoices(ChoicesSettings.class, asyncChoicesHolder);
            final var result1 = dataService.getChoices(TestChoicesProvider.class.getName());
            assertThat(result1.result()).isEqualTo(choices);
            final var result2 = dataService.getChoices(TestColumnChoicesProvider.class.getName());
            assertThat(result2.message()).isEqualTo(errorMessage);
        }
    }

    @Nested
    class ButtonDataServiceTest {

        enum TestButtonStates {
                FIRST, SECOND
        }

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
                @Widget
                @ButtonWidget(actionHandler = GenericTypesTestHandler.class)
                String m_button;
            }

            final var dataService = getDataService(ButtonSettings.class);
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
                @Widget
                @ButtonWidget(actionHandler = GenericTypesTestHandler.class)
                String m_button;
            }

            final var testDepenenciesFooValue = "custom value";
            final var dataService = getDataService(ButtonSettings.class);
            final var result = dataService.invokeButtonAction("widgetId", GenericTypesTestHandler.class.getName(),
                "FIRST", Map.of("foo", testDepenenciesFooValue));
            @SuppressWarnings("unchecked")
            final var buttonChange = (ButtonChange<String, TestButtonStates>)result.result();
            assertThat(buttonChange.buttonState()).isEqualTo(TestButtonStates.FIRST);
            assertThat(buttonChange.settingValue()).isEqualTo(testDepenenciesFooValue);
        }

        static class ButtonAndCredentialsSettings implements DefaultNodeSettings {

            Credentials m_credentials;

            @Widget
            @ButtonWidget(actionHandler = CredentialsButtonTestHandler.class)
            String m_button;
        }

        static class CredentialsButtonTestHandler
            implements ButtonActionHandler<String, ButtonAndCredentialsSettings, TestButtonStates> {

            static String EXPECTED_PASSWORD = "myFlowVarPassword";

            @Override
            public ButtonChange<String, TestButtonStates> initialize(final String currentValue,
                final DefaultNodeSettingsContext context) throws WidgetHandlerException {
                return null;
            }

            @Override
            public ButtonChange<String, TestButtonStates> invoke(final TestButtonStates state,
                final ButtonAndCredentialsSettings settings, final DefaultNodeSettingsContext context)
                throws WidgetHandlerException {
                assertThat(settings.m_credentials.getPassword()).isEqualTo(EXPECTED_PASSWORD);
                return new ButtonChange<>(TestButtonStates.FIRST);
            }

            @Override
            public Class<TestButtonStates> getStateMachine() {
                return TestButtonStates.class;
            }

        }

        @Test
        void testInvokeButtonActionWithCredentialsDependencies() throws ExecutionException, InterruptedException {

            String flowVarName = "myFlowVariable";

            final var nodeContainer = mock(NativeNodeContainer.class);
            final var credentialsProvider = mockCredentialsProvider(nodeContainer);
            mockPasswordResult(CredentialsButtonTestHandler.EXPECTED_PASSWORD, credentialsProvider);
            final var dataService = getDataService(ButtonAndCredentialsSettings.class);

            NodeContext.pushContext(nodeContainer);
            try {
                dataService.invokeButtonAction("widgetId", CredentialsButtonTestHandler.class.getName(), "FIRST",
                    Map.of("credentials", Map.of("flowVariableName", flowVarName), //
                        "button", "buttonValue"));

            } finally {
                NodeContext.removeLastContext();
            }

            verify(credentialsProvider).get(flowVarName);
        }

        private void mockPasswordResult(final String credentialsFlowVariablePassword,
            final CredentialsProvider credentialsProvider) {
            final var iCredentials = createICredentials(credentialsFlowVariablePassword);
            when(credentialsProvider.get(anyString())).thenReturn(iCredentials);
        }

        private CredentialsProvider mockCredentialsProvider(final NativeNodeContainer nodeContainer) {
            final var node = mock(Node.class);
            when(nodeContainer.getNode()).thenReturn(node);
            final var credentialsProvider = mock(CredentialsProvider.class);
            when(node.getCredentialsProvider()).thenReturn(credentialsProvider);
            return credentialsProvider;
        }

        private static ICredentials createICredentials(final String password) {
            final var iCredentials = new ICredentials() {

                @Override
                public String getPassword() {
                    return password;
                }

                @Override
                public String getName() {
                    return null;
                }

                @Override
                public String getLogin() {
                    return null;
                }
            };
            return iCredentials;
        }

        @Test
        void testUpdate() throws ExecutionException, InterruptedException {

            class ButtonSettings implements DefaultNodeSettings {
                @Widget
                @ButtonWidget(actionHandler = GenericTypesTestHandler.class,
                    updateHandler = GenericTypesUpdateHandler.class)
                String m_button;
            }

            final var testDepenenciesFooValue = "custom value";
            final var dataService = getDataService(ButtonSettings.class);
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
            default public IdAndText[] update(final TestDefaultNodeSettings settings,
                final DefaultNodeSettingsContext context) {
                return new IdAndText[]{IdAndText.fromId(getResult())};

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
                @Widget
                @ChoicesWidget(choicesUpdateHandler = FirstTestHandler.class)
                String m_button;

                @Widget
                @ChoicesWidget(choicesUpdateHandler = SecondTestHandler.class)
                String m_otherButton;
            }

            final var dataService = getDataService(TestSettings.class);
            final var firstResult = dataService.update("widgetId", FirstTestHandler.class.getName(), null);
            final var secondResult = dataService.update("widgetId", SecondTestHandler.class.getName(), null);
            assertThat(((IdAndText[])firstResult.result())[0].id()).isEqualTo(FirstTestHandler.ID);
            assertThat(((IdAndText[])secondResult.result())[0].id()).isEqualTo(SecondTestHandler.ID);
        }

        @Test
        void testThrowsIfNoHandlerPresent() throws ExecutionException, InterruptedException {

            class TestSettings implements DefaultNodeSettings {
                @Widget
                @ChoicesWidget(choicesUpdateHandler = FirstTestHandler.class)
                String m_button;
            }

            final var dataService = getDataService(TestSettings.class);
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
            final var dataService = getDataService(TestSettings.class);
            assertThrows(IllegalArgumentException.class, () -> dataService.update("widgetId", handlerName, null));

        }

        @Test
        void testMultipleSettingsClasses() throws ExecutionException, InterruptedException {

            class TestSettings implements DefaultNodeSettings {
                @Widget
                @ChoicesWidget(choicesUpdateHandler = FirstTestHandler.class)
                String m_button;
            }

            class OtherTestSettings implements DefaultNodeSettings {
                @Widget
                @ChoicesWidget(choicesUpdateHandler = SecondTestHandler.class)
                String m_button;
            }

            final var dataService = getDataService(TestSettings.class, OtherTestSettings.class);
            final var firstResult = dataService.update("widgetId", FirstTestHandler.class.getName(), null);
            final var secondResult = dataService.update("widgetId", SecondTestHandler.class.getName(), null);
            assertThat(((IdAndText[])firstResult.result())[0].id()).isEqualTo(FirstTestHandler.ID);
            assertThat(((IdAndText[])secondResult.result())[0].id()).isEqualTo(SecondTestHandler.ID);
        }
    }

    static class DefaultNodeSettingsContextHandler implements ChoicesUpdateHandler<TestDefaultNodeSettings> {

        @Override
        public IdAndText[] update(final TestDefaultNodeSettings settings, final DefaultNodeSettingsContext context) {
            assertThat(context.getPortObjectSpecs()).isEqualTo(PORT_OBJECT_SPECS);
            return null;
        }

    }

    @Nested
    class DefaultNodeSettingsContextSupplierTest {

        @Test
        void testSuppliesDefaultNodeSettingsContextToHandler() throws ExecutionException, InterruptedException {

            class ButtonSettings implements DefaultNodeSettings {
                @Widget
                @ChoicesWidget(choicesUpdateHandler = DefaultNodeSettingsContextHandler.class)
                Boolean m_button;
            }

            final var dataService = getDataService(ButtonSettings.class);
            dataService.update("widgetId", DefaultNodeSettingsContextHandler.class.getName(), null).result();
            /** Assertion happens inside {@link DefaultNodeSettingsContextHandler#update} */
        }
    }

}
