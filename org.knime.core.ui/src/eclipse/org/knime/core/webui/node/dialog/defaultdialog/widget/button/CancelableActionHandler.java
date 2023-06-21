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

import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Future;

/**
 * An {@link ActionHandler} with an asynchronous invocation whose result can be retrieved and canceled.
 *
 * @param <R> the type of the returned result. For widgets which set this as the value of the field, the type of the
 *            field has to be assignable from it.
 * @author Paul Bärnreuther
 */
public abstract class CancelableActionHandler<R> implements ActionHandler<R> {

    /**
     * State of the cancel button.
     */
    public static final String CANCEL_BUTTON_STATE = "cancel";

    private Future<ActionHandlerResult<R>> m_lastInvokationResult;

    /**
     * @return the result of the last invocation or null if no invocation has taken place.
     */
    protected Future<ActionHandlerResult<R>> getLastInvokationResult() {
        return m_lastInvokationResult;
    }

    @Override
    public Future<ActionHandlerResult<R>> invoke(final String buttonState) {
        if (CANCEL_BUTTON_STATE.equals(buttonState)) {
            cancel();
            return CompletableFuture.supplyAsync(() -> null);
        } else {
            m_lastInvokationResult = invoke();
            return m_lastInvokationResult;
        }
    }

    /**
     * Overwrite this method to implement more complex cancellations.
     */
    protected void cancel() {
        m_lastInvokationResult.cancel(true);
    }

    /**
     * An invocation which is triggered if a request which is not a cancel request is sent.
     *
     * @return the future result.
     */
    protected abstract Future<ActionHandlerResult<R>> invoke();

}
