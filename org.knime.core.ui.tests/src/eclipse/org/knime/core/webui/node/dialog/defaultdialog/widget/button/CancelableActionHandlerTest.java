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

import java.util.concurrent.ExecutionException;

import org.junit.jupiter.api.Test;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.CancelableActionHandler.States;
import org.knime.core.webui.node.dialog.defaultdialog.widget.handler.WidgetHandlerException;

/**
 *
 * @author Paul Bärnreuther
 */
@SuppressWarnings("java:S2698") // we accept assertions without messages
class CancelableActionHandlerTest {

    static class TestHandler extends CancelableActionHandler<String, Void> {

        static final String RESULT = "myResult";

        @Override
        protected String invoke(final Void noSettings, final DefaultNodeSettingsContext context)
            throws WidgetHandlerException {
            return RESULT;
        }

        @Override
        public String getButtonText(final States state) {
            return null;
        }
    }

    @Test
    void testInvokeSuccess() throws WidgetHandlerException {
        final var handler = new TestHandler();
        final var result = handler.invoke(States.READY, null, null);
        assertThat(result.buttonState()).isEqualTo(States.DONE);
        assertThat(result.settingsValue()).isEqualTo(TestHandler.RESULT);
        assertThat(result.setSettingsValue()).isTrue();
    }

    static class TestHandlerFail extends TestHandler {
        static final String MESSAGE = "myMessage";

        @Override
        protected String invoke(final Void noSettings, final DefaultNodeSettingsContext context)
            throws WidgetHandlerException {
            throw new WidgetHandlerException(MESSAGE);
        }
    }

    @Test
    void testInvokeFail() throws InterruptedException, ExecutionException {
        final var handler = new TestHandlerFail();
        final var exception =
            assertThrows(WidgetHandlerException.class, () -> handler.invoke(States.READY, null, null));
        assertThat(exception.getMessage()).isEqualTo(TestHandlerFail.MESSAGE);

    }

    static class SingleUseHandler extends TestHandler {

        @Override
        protected boolean isMultiUse() {
            return false;
        }
    }

    @Test
    void testInvokeWithoutMultiUse() throws WidgetHandlerException {
        final var handler = new SingleUseHandler();
        final var result = handler.invoke(States.READY, null, null);
        assertThat(result.buttonState()).isEqualTo(States.DONE);
        assertThat(result.settingsValue()).isEqualTo(TestHandler.RESULT);
        assertThat(result.setSettingsValue()).isTrue();
    }

    @Test
    void testCancel() throws WidgetHandlerException {
        final var handler = new TestHandler();
        final var result = handler.invoke(States.CANCEL, null, null);
        assertThat(result).isNull();

    }

    @Test
    void testUpdate() throws WidgetHandlerException {
        final var handler = new CancelableActionHandler.UpdateHandler<String, Void>();
        final var result = handler.update(null, null);
        assertThat(result.buttonState()).isEqualTo(States.READY);
        assertThat(result.settingsValue()).isNull();
        assertThat(result.setSettingsValue()).isTrue();
    }

    @Test
    void testInitialize() throws InterruptedException, ExecutionException {
        final var handler = new TestHandler();
        final var result = handler.initialize(null, null);
        assertThat(result.buttonState()).isEqualTo(States.READY);
        assertThat(result.settingsValue()).isNull();
        assertThat(result.setSettingsValue()).isFalse();
    }

}
