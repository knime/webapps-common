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
 *   Jun 19, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.widget.button;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.concurrent.CancellationException;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.concurrent.TimeUnit;

import org.junit.jupiter.api.Test;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.SettingsCreationContext;
import org.knime.core.webui.node.dialog.defaultdialog.dataservice.Result;
import org.knime.core.webui.node.dialog.defaultdialog.dataservice.ResultState;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.CancelableActionHandler.States;

/**
 *
 * @author Paul Bärnreuther
 */
@SuppressWarnings("java:S2698") // we accept assertions without messages
class CancelableActionHandlerTest {

    static class TestHandler extends CancelableActionHandler<String, Void> {

        static final String RESULT = "myResult";

        @Override
        protected CompletableFuture<Result<String>> invoke(final Void noSettings,
            final SettingsCreationContext context) {
            return CompletableFuture.supplyAsync(() -> Result.succeed(RESULT));
        }

        @Override
        public String overrideText(final States state) {
            return null;
        }
    }

    @Test
    void testInvokeSuccess() throws InterruptedException, ExecutionException {
        final var handler = new TestHandler();
        final var result = handler.invoke(States.READY, null, null).get();
        assertThat(result.state()).isEqualTo(ResultState.SUCCESS);
        assertThat(result.result().buttonState()).isEqualTo(States.READY);
        assertThat(result.result().settingResult()).isEqualTo(TestHandler.RESULT);
        assertThat(result.result().saveResult()).isTrue();
    }

    static class TestHandlerFail extends TestHandler {
        static final String MESSAGE = "myMessage";

        @Override
        protected CompletableFuture<Result<String>> invoke(final Void noSettings,
            final SettingsCreationContext context) {
            return CompletableFuture.supplyAsync(() -> Result.fail(MESSAGE));
        }
    }

    @Test
    void testInvokeFail() throws InterruptedException, ExecutionException {
        final var handler = new TestHandlerFail();
        final var result = handler.invoke(States.READY, null, null).get();
        assertThat(result.state()).isEqualTo(ResultState.FAIL);
        assertThat(result.result().buttonState()).isEqualTo(States.READY);
        assertThat(result.message()).isEqualTo(TestHandlerFail.MESSAGE);
        assertThat(result.result().saveResult()).isFalse();
    }

    static class SingleUseHandler extends TestHandler {

        @Override
        protected boolean isMultiUse() {
            return false;
        }
    }

    @Test
    void testInvokeWithoutMultiUseAndSuccess() throws InterruptedException, ExecutionException {
        final var handler = new SingleUseHandler();
        final var result = handler.invoke(States.READY, null, null).get();
        assertThat(result.state()).isEqualTo(ResultState.SUCCESS);
        assertThat(result.result().buttonState()).isEqualTo(States.DONE);
        assertThat(result.result().settingResult()).isEqualTo(TestHandler.RESULT);
        assertThat(result.result().saveResult()).isTrue();
    }

    static class SingleUseHandlerFail extends TestHandlerFail {

        @Override
        protected boolean isMultiUse() {
            return false;
        }
    }

    @Test
    void testInvokeWithoutMultiUseAndFail() throws InterruptedException, ExecutionException {
        final var handler = new SingleUseHandlerFail();
        final var result = handler.invoke(States.READY, null, null).get();
        assertThat(result.state()).isEqualTo(ResultState.FAIL);
        assertThat(result.result().buttonState()).isEqualTo(States.READY);
        assertThat(result.message()).isEqualTo(TestHandlerFail.MESSAGE);
        assertThat(result.result().saveResult()).isFalse();
    }

    static class TestCancelHandler extends CancelableActionHandler<String, Void> {

        @Override
        protected CompletableFuture<Result<String>> invoke(final Void noSettings,
            final SettingsCreationContext context) {
            return new CompletableFuture<>();
        }

        @Override
        public String overrideText(final States state) {
            return null;
        }
    }

    @Test
    void testCancel() {
        final var handler = new TestCancelHandler();
        final var result = handler.invoke(States.READY, null, null);
        handler.invoke(States.CANCEL, null, null);
        expectCancelled(result);
        ExecutionException exception = assertThrows(ExecutionException.class, () -> result.get(1, TimeUnit.SECONDS));
        assertThat(exception.getCause().getClass()).isEqualTo(CancellationException.class);

    }

    @Test
    void testUpdate() throws InterruptedException, ExecutionException {
        final var handler = new TestCancelHandler();
        final var previousInvocationResult = handler.invoke(States.READY, null, null);
        final var result = handler.update(null, null).get();
        expectCancelled(previousInvocationResult);
        assertThat(result.state()).isEqualTo(ResultState.SUCCESS);
        assertThat(result.result().buttonState()).isEqualTo(States.READY);
        assertThat(result.result().settingResult()).isNull();
        assertThat(result.result().saveResult()).isTrue();
    }

    private static void expectCancelled(final Future<Result<ButtonChange<String, States>>> result) {
        ExecutionException exception = assertThrows(ExecutionException.class, () -> result.get(1, TimeUnit.SECONDS));
        assertThat(exception.getCause().getClass()).isEqualTo(CancellationException.class);
    }

    @Test
    void testInitialize() throws InterruptedException, ExecutionException {
        final var handler = new TestHandler();
        final var result = handler.initialize(null, null).get();
        assertThat(result.state()).isEqualTo(ResultState.SUCCESS);
        assertThat(result.result().buttonState()).isEqualTo(States.READY);
        assertThat(result.result().settingResult()).isNull();
        assertThat(result.result().saveResult()).isFalse();
    }

}
