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
package org.knime.core.webui.node.dialog.defaultdialog;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import org.junit.jupiter.api.Test;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeDialogDataServiceImpl.NoActionHandlerFoundError;
import org.knime.core.webui.node.dialog.defaultdialog.widget.action.ActionHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.action.ActionHandlerResult;
import org.knime.core.webui.node.dialog.defaultdialog.widget.action.ActionHandlerState;
import org.knime.core.webui.node.dialog.defaultdialog.widget.action.ButtonWidget;

/**
 * Tests DefaultNodeSettingsService.
 *
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
@SuppressWarnings("java:S2698") // we accept assertions without messages
class DefaultNodeDialogDataServiceImplTest {

    static class TestActionHandler implements ActionHandler {

        @Override
        public Future<ActionHandlerResult> invoke(final String mode) {
            return CompletableFuture.supplyAsync(() -> ActionHandlerResult.succeed(getResult(mode)));
        }

        static String getResult(final String mode) {
            if (mode == null) {
                return getNullResult();
            }
            return "dummyResult_" + mode;
        }

        static String getNullResult() {
            return "no mode";
        }
    }

    @Test
    void testInvokeActionHandlerCallsActionHandlerWithMode() throws ExecutionException, InterruptedException {

        class ButtonSettings {
            @ButtonWidget(actionHandler = TestActionHandler.class)
            String m_button;

            @SuppressWarnings("unused")
            String m_otherSetting;
        }

        final var dataService = new DefaultNodeDialogDataServiceImpl(List.of(ButtonSettings.class));
        final var mode = "myMode";
        final var result = dataService.invokeActionHandler(TestActionHandler.class.getName(), mode);
        assertThat(result.result()).isEqualTo(TestActionHandler.getResult(mode));
    }

    @Test
    void testInvokeActionHandlerCallsActionHandlerWithoutMode() throws ExecutionException, InterruptedException {

        class ButtonSettings {
            @ButtonWidget(actionHandler = TestActionHandler.class)
            String m_button;
        }

        final var dataService = new DefaultNodeDialogDataServiceImpl(List.of(ButtonSettings.class));
        final var result = dataService.invokeActionHandler(TestActionHandler.class.getName());
        assertThat(result.result()).isEqualTo(TestActionHandler.getNullResult());
    }

    static class OtherTestActionHandler implements ActionHandler {

        @Override
        public Future<ActionHandlerResult> invoke(final String mode) {
            return CompletableFuture.supplyAsync(() -> ActionHandlerResult.fail(getErrorMessage(mode)));
        }

        static String getErrorMessage(final String mode) {
            return "dummyError_" + mode;
        }
    }

    @Test
    void testMultipleActionHandlers() throws ExecutionException, InterruptedException {

        class ButtonSettings {
            @ButtonWidget(actionHandler = TestActionHandler.class)
            String m_button;

            @ButtonWidget(actionHandler = OtherTestActionHandler.class)
            String m_otherButton;
        }

        final var dataService = new DefaultNodeDialogDataServiceImpl(List.of(ButtonSettings.class));
        final var firstResult = dataService.invokeActionHandler(TestActionHandler.class.getName());
        final var secondResult = dataService.invokeActionHandler(OtherTestActionHandler.class.getName());
        assertThat(firstResult.result()).isEqualTo(TestActionHandler.getNullResult());
        assertThat(secondResult.message()).isEqualTo(OtherTestActionHandler.getErrorMessage(null));
    }

    @Test
    void testThrowsIfNoActionHandlerPresent() throws ExecutionException, InterruptedException {

        class ButtonSettings {
            @ButtonWidget(actionHandler = TestActionHandler.class)
            String m_button;
        }

        final var dataService = new DefaultNodeDialogDataServiceImpl(List.of(ButtonSettings.class));
        assertThrows(NoActionHandlerFoundError.class,
            () -> dataService.invokeActionHandler(OtherTestActionHandler.class.getName()));

    }

    @Test
    void testThrowsIfActionHandlerInstantiationFailed() throws ExecutionException, InterruptedException {

        class NonStaticActionHandler extends TestActionHandler {
        }

        class ButtonSettings {
            @ButtonWidget(actionHandler = NonStaticActionHandler.class)
            String m_button;
        }

        final var dataService = new DefaultNodeDialogDataServiceImpl(List.of(ButtonSettings.class));
        assertThrows(NoActionHandlerFoundError.class,
            () -> dataService.invokeActionHandler(NonStaticActionHandler.class.getName()));

    }

    @Test
    void testMultipleSettingsClasses() throws ExecutionException, InterruptedException {

        class ButtonSettings {
            @ButtonWidget(actionHandler = TestActionHandler.class)
            String m_button;
        }

        class OtherButtonSettings {
            @ButtonWidget(actionHandler = OtherTestActionHandler.class)
            String m_button;
        }

        final var dataService =
            new DefaultNodeDialogDataServiceImpl(List.of(ButtonSettings.class, OtherButtonSettings.class));
        final var firstResult = dataService.invokeActionHandler(TestActionHandler.class.getName());
        final var secondResult = dataService.invokeActionHandler(OtherTestActionHandler.class.getName());
        assertThat(firstResult.result()).isEqualTo(TestActionHandler.getNullResult());
        assertThat(secondResult.message()).isEqualTo(OtherTestActionHandler.getErrorMessage(null));
    }

    static class CanceledResponseActionHandler implements ActionHandler {

        /**
         * {@inheritDoc}
         */
        @Override
        public Future<ActionHandlerResult> invoke(final String mode) {

            CompletableFuture<ActionHandlerResult> future = new CompletableFuture<>();
            future.cancel(true);
            future.complete(new ActionHandlerResult("success", ActionHandlerState.SUCCESS, null));
            return future;

        }

    }

    @Test
    void testCanceledResponse() throws ExecutionException, InterruptedException {

        class ButtonSettings {
            @ButtonWidget(actionHandler = CanceledResponseActionHandler.class)
            String m_button;
        }

        final var dataService = new DefaultNodeDialogDataServiceImpl(List.of(ButtonSettings.class));
        final var result = dataService.invokeActionHandler(CanceledResponseActionHandler.class.getName());
        assertThat(result.state()).isEqualTo(ActionHandlerState.CANCELED);
    }

}
