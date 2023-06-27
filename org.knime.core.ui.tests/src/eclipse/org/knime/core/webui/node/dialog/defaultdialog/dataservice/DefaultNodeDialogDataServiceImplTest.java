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
import java.util.function.Supplier;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.SettingsCreationContext;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.SynchronousActionHandler;

/**
 * Tests DefaultNodeSettingsService.
 *
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
@SuppressWarnings("java:S2698") // we accept assertions without messages
class DefaultNodeDialogDataServiceImplTest {

    static class TestDefaultNodeSettings implements DefaultNodeSettings {

    }

    private static DefaultNodeDialogDataServiceImpl
        getDataServiceWithNullContext(final Collection<Class<?>> settingsClasses) {
        return new DefaultNodeDialogDataServiceImpl(settingsClasses, () -> null);
    }

    static class TestHandler implements DialogDataServiceHandler<String, TestDefaultNodeSettings> {

        @Override
        public Future<DialogDataServiceHandlerResult<String>> invoke(final String state,
            final TestDefaultNodeSettings settings, final SettingsCreationContext context) {
            return CompletableFuture.supplyAsync(() -> DialogDataServiceHandlerResult.succeed(getResult(state)));
        }

        static String getResult(final String state) {
            if (state == null) {
                return getNullResult();
            }
            return "dummyResult_" + state;
        }

        static String getNullResult() {
            return "no state";
        }
    }

    @Test
    void testInvokeActionHandlerCallsActionHandlerWithState() throws ExecutionException, InterruptedException {

        class ButtonSettings {
            @ButtonWidget(actionHandler = TestHandler.class)
            String m_button;

            @SuppressWarnings("unused")
            String m_otherSetting;
        }

        final var dataService = getDataServiceWithNullContext(List.of(ButtonSettings.class));
        final var mode = "myMode";
        final var result = dataService.invokeActionHandler(TestHandler.class.getName(), mode);
        assertThat(result.result()).isEqualTo(TestHandler.getResult(mode));
    }

    @Test
    void testInvokeActionHandlerCallsActionHandlerWithoutState() throws ExecutionException, InterruptedException {

        class ButtonSettings {
            @ButtonWidget(actionHandler = TestHandler.class)
            String m_button;
        }

        final var dataService = getDataServiceWithNullContext(List.of(ButtonSettings.class));
        final var result = dataService.invokeActionHandler(TestHandler.class.getName());
        assertThat(result.result()).isEqualTo(TestHandler.getNullResult());
    }

    static class OtherTestHandler implements DialogDataServiceHandler<String, TestDefaultNodeSettings> {

        @Override
        public Future<DialogDataServiceHandlerResult<String>> invoke(final String state,
            final TestDefaultNodeSettings settings, final SettingsCreationContext context) {
            return CompletableFuture.supplyAsync(() -> DialogDataServiceHandlerResult.fail(getErrorMessage(state)));
        }

        static String getErrorMessage(final String state) {
            return "dummyError_" + state;
        }
    }

    @Test
    void testMultipleActionHandlers() throws ExecutionException, InterruptedException {

        class ButtonSettings {
            @ButtonWidget(actionHandler = TestHandler.class)
            String m_button;

            @ButtonWidget(actionHandler = OtherTestHandler.class)
            String m_otherButton;
        }

        final var dataService = getDataServiceWithNullContext(List.of(ButtonSettings.class));
        final var firstResult = dataService.invokeActionHandler(TestHandler.class.getName());
        final var secondResult = dataService.invokeActionHandler(OtherTestHandler.class.getName());
        assertThat(firstResult.result()).isEqualTo(TestHandler.getNullResult());
        assertThat(secondResult.message()).isEqualTo(OtherTestHandler.getErrorMessage(null));
    }

    @Test
    void testThrowsIfNoActionHandlerPresent() throws ExecutionException, InterruptedException {

        class ButtonSettings {
            @ButtonWidget(actionHandler = TestHandler.class)
            String m_button;
        }

        final var dataService = getDataServiceWithNullContext(List.of(ButtonSettings.class));
        final var handlerName = OtherTestHandler.class.getName();
        assertThrows(IllegalArgumentException.class,
            () -> dataService.invokeActionHandler(handlerName));

    }

    @Test
    void testThrowsIfActionHandlerInstantiationFailed() throws ExecutionException, InterruptedException {

        class NonStaticActionHandler extends TestHandler {
        }

        class ButtonSettings {
            @ButtonWidget(actionHandler = NonStaticActionHandler.class)
            String m_button;
        }
        final var handlerName = NonStaticActionHandler.class.getName();
        final var dataService = getDataServiceWithNullContext(List.of(ButtonSettings.class));
        assertThrows(IllegalArgumentException.class,
            () -> dataService.invokeActionHandler(handlerName));

    }

    @Test
    void testMultipleSettingsClasses() throws ExecutionException, InterruptedException {

        class ButtonSettings {
            @ButtonWidget(actionHandler = TestHandler.class)
            String m_button;
        }

        class OtherButtonSettings {
            @ButtonWidget(actionHandler = OtherTestHandler.class)
            String m_button;
        }

        final var dataService = getDataServiceWithNullContext(List.of(ButtonSettings.class, OtherButtonSettings.class));
        final var firstResult = dataService.invokeActionHandler(TestHandler.class.getName());
        final var secondResult = dataService.invokeActionHandler(OtherTestHandler.class.getName());
        assertThat(firstResult.result()).isEqualTo(TestHandler.getNullResult());
        assertThat(secondResult.message()).isEqualTo(OtherTestHandler.getErrorMessage(null));
    }

    static class CanceledResponseActionHandler implements DialogDataServiceHandler<String, TestDefaultNodeSettings> {

        @Override
        public Future<DialogDataServiceHandlerResult<String>> invoke(final String state,
            final TestDefaultNodeSettings settings, final SettingsCreationContext context) {

            CompletableFuture<DialogDataServiceHandlerResult<String>> future = new CompletableFuture<>();
            future.cancel(true);
            future.complete(new DialogDataServiceHandlerResult<String>("success",
                DialogDataServiceHandlerResultState.SUCCESS, null));
            return future;

        }

    }

    @Test
    void testCanceledResponse() throws ExecutionException, InterruptedException {

        class ButtonSettings {
            @ButtonWidget(actionHandler = CanceledResponseActionHandler.class)
            String m_button;
        }

        final var dataService = getDataServiceWithNullContext(List.of(ButtonSettings.class));
        final var result = dataService.invokeActionHandler(CanceledResponseActionHandler.class.getName());
        assertThat(result.state()).isEqualTo(DialogDataServiceHandlerResultState.CANCELED);
    }

    static class WrongResultTypeActionHandler extends SynchronousActionHandler<Integer, TestDefaultNodeSettings> {

        @Override
        public DialogDataServiceHandlerResult<Integer> invokeSync(final String state,
            final TestDefaultNodeSettings settings, final SettingsCreationContext context) {
            return DialogDataServiceHandlerResult.succeed(1);
        }

    }

    @Test
    void testThrowsIfFieldTypeIsNotAssignableFromReturnType() throws ExecutionException, InterruptedException {

        class ButtonSettings {
            @ButtonWidget(actionHandler = WrongResultTypeActionHandler.class)
            String m_button;
        }

        final Collection<Class<?>> settingsClasses = List.of(ButtonSettings.class);
        assertThrows(IllegalArgumentException.class,
            () -> getDataServiceWithNullContext(settingsClasses));
    }

    @SuppressWarnings("unused")
    static class IntermediateSuperType<A extends DefaultNodeSettings, B> implements DialogDataServiceHandler<B, A> {

        @Override
        public Future<DialogDataServiceHandlerResult<B>> invoke(final String state, final A settings, final SettingsCreationContext context) {
            return CompletableFuture.supplyAsync(() -> DialogDataServiceHandlerResult.succeed(null));
        }

    }

    @SuppressWarnings("unused")
    static class IntermediateSuperType2 extends IntermediateSuperType<TestDefaultNodeSettings, String> {
    }

    static class GenericTypesTestHandler1 extends IntermediateSuperType<TestDefaultNodeSettings, String> {
    }

    static class GenericTypesTestHandler2 extends IntermediateSuperType2 {
    }

    @Test
    void testExtractsCorrectGenericReturnType() throws ExecutionException, InterruptedException {

        class ButtonSettings {
            @ButtonWidget(actionHandler = GenericTypesTestHandler1.class)
            String m_button;

            @ButtonWidget(actionHandler = GenericTypesTestHandler2.class)
            String m_button2;
        }

        final var dataService = getDataServiceWithNullContext(List.of(ButtonSettings.class));
        final var result = dataService.invokeActionHandler(GenericTypesTestHandler2.class.getName());
        assertThat(result.result()).isNull();
    }

    static class SimpleDefaultNodeSettings implements DefaultNodeSettings {
        int m_foo = 1;

        String m_bar = "Hello World";
    }

    static class HandlerWithDependentSettings
        implements DialogDataServiceHandler<SimpleDefaultNodeSettings, SimpleDefaultNodeSettings> {

        @Override
        public Future<DialogDataServiceHandlerResult<SimpleDefaultNodeSettings>> invoke(final String state,
            final SimpleDefaultNodeSettings settings, final SettingsCreationContext context) {
            return CompletableFuture.supplyAsync(() -> DialogDataServiceHandlerResult.succeed(settings));
        }

    }

    @Test
    void testCastsObjectInputToSettingsGenericType() throws ExecutionException, InterruptedException {

        class ButtonSettings {
            @ButtonWidget(actionHandler = HandlerWithDependentSettings.class)
            SimpleDefaultNodeSettings m_button;
        }

        final var dataService = getDataServiceWithNullContext(List.of(ButtonSettings.class));

        final Object inputSettings = Map.of("foo", "2");
        final var result = (SimpleDefaultNodeSettings)dataService
            .invokeActionHandler(HandlerWithDependentSettings.class.getName(), null, inputSettings).result();
        assertThat(result.m_foo).isEqualTo(2);
        assertThat(result.m_bar).isEqualTo("Hello World");

    }

    static class SettingsCreationContextHandler implements DialogDataServiceHandler<Boolean, TestDefaultNodeSettings> {

        @Override
        public Future<DialogDataServiceHandlerResult<Boolean>> invoke(final String state,
            final TestDefaultNodeSettings settings, final SettingsCreationContext context) {
            return CompletableFuture.supplyAsync(() -> DialogDataServiceHandlerResult.succeed(context != null));
        }

    }

    @Nested
    class SettingsCreationContextSupplierTest {
        private SettingsCreationContext m_context = null; //NOSONAR

        @Test
        void testSuppliesSettingsCreationContextToHandler() throws ExecutionException, InterruptedException {

            class ButtonSettings {
                @ButtonWidget(actionHandler = SettingsCreationContextHandler.class)
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

            final var firstResult =
                (Boolean)dataService.invokeActionHandler(SettingsCreationContextHandler.class.getName()).result();
            assertThat(firstResult).isFalse();

            m_context = new SettingsCreationContext(new PortObjectSpec[0], null);

            final var secondResult =
                (Boolean)dataService.invokeActionHandler(SettingsCreationContextHandler.class.getName()).result();
            assertThat(secondResult).isTrue();

        }
    }

}
