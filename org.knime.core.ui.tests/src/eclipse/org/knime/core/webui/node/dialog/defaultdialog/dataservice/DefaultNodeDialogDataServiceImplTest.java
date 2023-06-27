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
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.function.Function;
import java.util.function.Supplier;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.SettingsCreationContext;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonActionHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonChange;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.ChoicesUpdateHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.ChoicesWidgetChoice;

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
        getDataServiceWithNullContext(final Collection<Class<?>> settingsClasses) {
        return new DefaultNodeDialogDataServiceImpl(settingsClasses, () -> null);
    }

    @Nested
    class ChoicesDataServiceTest {
        static class TestChoicesUpdateHandler implements ChoicesUpdateHandler<TestDefaultNodeSettings> {

            public final static ChoicesWidgetChoice[] getResult(final String id) {
                return new ChoicesWidgetChoice[]{ChoicesWidgetChoice.fromId(id)};

            }

            /**
             * {@inheritDoc}
             */
            @Override
            public Future<Result<ChoicesWidgetChoice[]>> update(final TestDefaultNodeSettings settings,
                final SettingsCreationContext context) {
                return CompletableFuture.supplyAsync(() -> Result.succeed(getResult(settings.m_foo)));
            }
        }

        @Test
        void testUpdate() throws ExecutionException, InterruptedException {

            class ButtonSettings {
                @ChoicesWidget(choicesUpdateHandler = TestChoicesUpdateHandler.class)
                String m_button;

                @SuppressWarnings("unused")
                String m_otherSetting;
            }

            final String testDepenenciesFooValue = "custom value";
            final var dataService = getDataServiceWithNullContext(List.of(ButtonSettings.class));
            final var result =
                dataService.update(TestChoicesUpdateHandler.class.getName(), Map.of("foo", testDepenenciesFooValue));
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

            @Override
            public String overrideText(final TestButtonStates state) {
                return null;
            }

        }

        static class GenericTypesTestHandler extends IntermediateSuperType<TestDefaultNodeSettings, String> {

            private static <T> Future<Result<T>> wrap(final T t) {
                return CompletableFuture.supplyAsync(() -> Result.succeed(t));
            }

            @Override
            public Future<Result<ButtonChange<String, TestButtonStates>>> initialize(final String currentValue,
                final SettingsCreationContext context) {
                final var buttonChange = new ButtonChange<>(currentValue, false, TestButtonStates.FIRST);
                return wrap(buttonChange);

            }

            @Override
            public Future<Result<ButtonChange<String, TestButtonStates>>> invoke(final TestButtonStates state,
                final TestDefaultNodeSettings settings, final SettingsCreationContext context) {
                final var buttonChange = new ButtonChange<>(settings.m_foo, false, state);
                return wrap(buttonChange);
            }

            @Override
            public Future<Result<ButtonChange<String, TestButtonStates>>> update(final TestDefaultNodeSettings settings,
                final SettingsCreationContext context) {
                final var buttonChange = new ButtonChange<>(settings.m_foo, false, TestButtonStates.FIRST);
                return wrap(buttonChange);
            }

        }

        @Test
        void testInitializeButton() throws ExecutionException, InterruptedException {

            class ButtonSettings {
                @ButtonWidget(actionHandler = GenericTypesTestHandler.class)
                String m_button;
            }

            final var dataService = getDataServiceWithNullContext(List.of(ButtonSettings.class));
            final String currentState = "currentState";
            final var result = dataService.initializeButton(GenericTypesTestHandler.class.getName(), currentState);
            @SuppressWarnings("unchecked")
            final var buttonChange = (ButtonChange<String, TestButtonStates>)result.result();
            assertThat(buttonChange.settingResult()).isEqualTo(currentState);
        }

        @Test
        void testInvokeButtonAction() throws ExecutionException, InterruptedException {

            class ButtonSettings {
                @ButtonWidget(actionHandler = GenericTypesTestHandler.class)
                String m_button;
            }

            final var testDepenenciesFooValue = "custom value";
            final var dataService = getDataServiceWithNullContext(List.of(ButtonSettings.class));
            final var result = dataService.invokeButtonAction(GenericTypesTestHandler.class.getName(), "FIRST",
                Map.of("foo", testDepenenciesFooValue));
            @SuppressWarnings("unchecked")
            final var buttonChange = (ButtonChange<String, TestButtonStates>)result.result();
            assertThat(buttonChange.buttonState()).isEqualTo(TestButtonStates.FIRST);
            assertThat(buttonChange.settingResult()).isEqualTo(testDepenenciesFooValue);
        }

        @Test
        void testUpdate() throws ExecutionException, InterruptedException {

            class ButtonSettings {
                @ButtonWidget(actionHandler = GenericTypesTestHandler.class)
                String m_button;
            }

            final var testDepenenciesFooValue = "custom value";
            final var dataService = getDataServiceWithNullContext(List.of(ButtonSettings.class));
            final var result =
                dataService.update(GenericTypesTestHandler.class.getName(), Map.of("foo", testDepenenciesFooValue));
            @SuppressWarnings("unchecked")
            final var buttonChange = (ButtonChange<String, TestButtonStates>)result.result();
            assertThat(buttonChange.settingResult()).isEqualTo(testDepenenciesFooValue);
        }
    }

    @Nested
    class FindHandlerTest {

        interface SimpleTestHandler extends ChoicesUpdateHandler<TestDefaultNodeSettings> {

            String getResult();

            @Override
            default public Future<Result<ChoicesWidgetChoice[]>> update(final TestDefaultNodeSettings settings,
                final SettingsCreationContext context) {
                return CompletableFuture.supplyAsync(
                    () -> Result.succeed(new ChoicesWidgetChoice[]{ChoicesWidgetChoice.fromId(getResult())}));

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

            class TestSettings {
                @ChoicesWidget(choicesUpdateHandler = FirstTestHandler.class)
                String m_button;

                @ChoicesWidget(choicesUpdateHandler = SecondTestHandler.class)
                String m_otherButton;
            }

            final var dataService = getDataServiceWithNullContext(List.of(TestSettings.class));
            final var firstResult = dataService.update(FirstTestHandler.class.getName(), null);
            final var secondResult = dataService.update(SecondTestHandler.class.getName(), null);
            assertThat(((ChoicesWidgetChoice[])firstResult.result())[0].id()).isEqualTo(FirstTestHandler.ID);
            assertThat(((ChoicesWidgetChoice[])secondResult.result())[0].id()).isEqualTo(SecondTestHandler.ID);
        }

        @Test
        void testThrowsIfNoHandlerPresent() throws ExecutionException, InterruptedException {

            class TestSettings {
                @ChoicesWidget(choicesUpdateHandler = FirstTestHandler.class)
                String m_button;
            }

            final var dataService = getDataServiceWithNullContext(List.of(TestSettings.class));
            final var handlerName = SecondTestHandler.class.getName();
            assertThrows(IllegalArgumentException.class, () -> dataService.update(handlerName, null));

        }

        @Test
        void testThrowsIfHandlerInstantiationFailed() throws ExecutionException, InterruptedException {

            class NonStaticHandler extends FirstTestHandler {
            }

            class TestSettings {
                @ChoicesWidget(choicesUpdateHandler = NonStaticHandler.class)
                String m_button;
            }
            final var handlerName = NonStaticHandler.class.getName();
            final var dataService = getDataServiceWithNullContext(List.of(TestSettings.class));
            assertThrows(IllegalArgumentException.class, () -> dataService.update(handlerName, null));

        }

        @Test
        void testMultipleSettingsClasses() throws ExecutionException, InterruptedException {

            class TestSettings {
                @ChoicesWidget(choicesUpdateHandler = FirstTestHandler.class)
                String m_button;
            }

            class OtherTestSettings {
                @ChoicesWidget(choicesUpdateHandler = SecondTestHandler.class)
                String m_button;
            }

            final var dataService = getDataServiceWithNullContext(List.of(TestSettings.class, OtherTestSettings.class));
            final var firstResult = dataService.update(FirstTestHandler.class.getName(), null);
            final var secondResult = dataService.update(SecondTestHandler.class.getName(), null);
            assertThat(((ChoicesWidgetChoice[])firstResult.result())[0].id()).isEqualTo(FirstTestHandler.ID);
            assertThat(((ChoicesWidgetChoice[])secondResult.result())[0].id()).isEqualTo(SecondTestHandler.ID);
        }
    }

    @Nested
    class CancelRequestTest {
        static class CanceledResponseHandler implements ChoicesUpdateHandler<TestDefaultNodeSettings> {

            @Override
            public Future<Result<ChoicesWidgetChoice[]>> update(final TestDefaultNodeSettings settings,
                final SettingsCreationContext context) {

                CompletableFuture<Result<ChoicesWidgetChoice[]>> future = new CompletableFuture<>();
                future.cancel(true);
                future.complete(
                    new Result<ChoicesWidgetChoice[]>(null, ResultState.SUCCESS, null));
                return future;
            }

        }

        @Test
        void testCanceledResponse() throws ExecutionException, InterruptedException {

            class TestSettings {
                @ChoicesWidget(choicesUpdateHandler = CanceledResponseHandler.class)
                String m_button;
            }

            final var dataService = getDataServiceWithNullContext(List.of(TestSettings.class));
            final var result = dataService.update(CanceledResponseHandler.class.getName(), null);
            assertThat(result.state()).isEqualTo(ResultState.CANCELED);
        }

        static class FailedResponseWithNestedCanceledCauseHandler
            implements ChoicesUpdateHandler<TestDefaultNodeSettings> {

            @Override
            public Future<Result<ChoicesWidgetChoice[]>> update(final TestDefaultNodeSettings settings,
                final SettingsCreationContext context) {

                CompletableFuture<Result<ChoicesWidgetChoice[]>> future = new CompletableFuture<>();
                future.cancel(true);
                future.complete(
                    new Result<ChoicesWidgetChoice[]>(null, ResultState.SUCCESS, null));
                return future.thenApplyAsync(Function.identity()).thenApplyAsync(Function.identity());
            }

        }

        @Test
        void testFailedResponseWithNestedCanceledCause() throws ExecutionException, InterruptedException {

            class TestSettings {
                @ChoicesWidget(choicesUpdateHandler = FailedResponseWithNestedCanceledCauseHandler.class)
                String m_button;
            }

            final var dataService = getDataServiceWithNullContext(List.of(TestSettings.class));
            final var result = dataService.update(FailedResponseWithNestedCanceledCauseHandler.class.getName(), null);
            assertThat(result.state()).isEqualTo(ResultState.CANCELED);
        }
    }

    static class SettingsCreationContextHandler implements ChoicesUpdateHandler<TestDefaultNodeSettings> {

        /**
         * We only use this method to find out if the settings creation context is null. {@inheritDoc}
         */
        @Override
        public Future<Result<ChoicesWidgetChoice[]>> update(final TestDefaultNodeSettings settings,
            final SettingsCreationContext context) {
            final var choices = context == null ? null : new ChoicesWidgetChoice[0];
            return CompletableFuture.supplyAsync(() -> Result.succeed(choices));
        }

    }

    @Nested
    class SettingsCreationContextSupplierTest {
        private SettingsCreationContext m_context = null; //NOSONAR

        @Test
        void testSuppliesSettingsCreationContextToHandler() throws ExecutionException, InterruptedException {

            class ButtonSettings {
                @ChoicesWidget(choicesUpdateHandler = SettingsCreationContextHandler.class)
                Boolean m_button;
            }

            final Supplier<SettingsCreationContext> contextProvider =
                new Supplier<DefaultNodeSettings.SettingsCreationContext>() {

                    @Override
                    public SettingsCreationContext get() {
                        return m_context;
                    }
                };

            m_context = null;
            final var dataService =
                new DefaultNodeDialogDataServiceImpl(List.of(ButtonSettings.class), contextProvider);

            final var firstResult = dataService.update(SettingsCreationContextHandler.class.getName(), null).result();
            assertThat(firstResult).isNull();

            m_context = new SettingsCreationContext(new PortObjectSpec[0], null, null);

            final var secondResult = dataService.update(SettingsCreationContextHandler.class.getName(), null).result();
            assertThat(secondResult).isNotNull();

        }
    }

}
