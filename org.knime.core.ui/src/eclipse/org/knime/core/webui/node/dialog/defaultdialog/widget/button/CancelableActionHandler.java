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

import java.lang.annotation.Annotation;

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.SettingsCreationContext;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.CancelableActionHandler.States;
import org.knime.core.webui.node.dialog.defaultdialog.widget.handler.WidgetHandlerException;

/**
 * An {@link ButtonActionHandler} with an asynchronous invocation whose result can be retrieved and canceled.
 *
 * @param <R> the type of the returned result. For widgets which set this as the value of the field, the type of the
 *            field has to be assignable from it.
 * @param <S> the type of the settings the invocation depends on.
 * @author Paul Bärnreuther
 */
public abstract class CancelableActionHandler<R, S> implements ButtonActionHandler<R, S, States> {

    /**
     * An invocation which is triggered if a request which is not a cancel request is sent.
     *
     * @param settings the settings the invocation depends on
     * @param context the current {@link SettingsCreationContext}
     *
     * @return the future result.
     * @throws WidgetHandlerException if the request should fail providing the error message to the frontend
     */
    protected abstract R invoke(S settings, SettingsCreationContext context) throws WidgetHandlerException;

    /**
     * @return whether the button should be in an enabled state when the request was successful (i.e. if the "DONE"
     *         state should be enabled).
     */
    protected boolean isMultiUse() {
        return true;
    }

    /**
     * @param state - a field from the associated state machine enum.
     * @return the text that should be displayed for that state. If {@code null} is returned, the value of
     *         {@link ButtonState#text} from the annotation of the respective state in {@link States} is used instead.
     */
    protected abstract String getButtonText(final States state);

    @Override
    public ButtonChange<R, States> invoke(final States buttonState, final S settings,
        final SettingsCreationContext context) throws WidgetHandlerException {
        if (States.CANCEL == buttonState) {
            return null;
        } else {
            return new ButtonChange<>(invoke(settings, context), States.DONE);
        }
    }

    /**
     * Set the button to the initial "Ready" state
     */
    @Override
    public ButtonChange<R, States> initialize(final R currentValue, final SettingsCreationContext context) {
        return new ButtonChange<>(States.READY);
    }

    @Override
    public Class<States> getStateMachine() {
        return States.class;
    }

    @SuppressWarnings("javadoc")
    public enum States {

            /**
             * The initial state of the button
             */
            @ButtonState(text = "Ready", nextState = "CANCEL")
            READY, //
            /**
             * The state of the button, once the initial state is clicked
             */
            @ButtonState(text = "Cancel", primary = false)
            CANCEL, //
            /**
             * This state is reached on a successful response. If {@link CancelableActionHandler#isMultiUse} is true, it
             * is enabled.
             */
            @ButtonState(text = "Done", nextState = "CANCEL", disabled = true)
            DONE;

    }

    @Override
    public ButtonState overrideButtonState(final States state, final ButtonState buttonStateAnnotation) {
        var text = getButtonText(state);
        return new ButtonState() {

            @Override
            public Class<? extends Annotation> annotationType() {
                return ButtonState.class;
            }

            @Override
            public String text() {
                return (text != null) ? text : buttonStateAnnotation.text();
            }

            @Override
            public boolean primary() {
                return buttonStateAnnotation.primary();
            }

            @Override
            public String nextState() {
                return buttonStateAnnotation.nextState();
            }

            @Override
            public boolean disabled() {
                if (States.DONE == state) {
                    return !isMultiUse();
                }
                return buttonStateAnnotation.disabled();
            }
        };
    }

    /**
     * A simple update handler which will reset the current state of the button to the ready state when a triggering
     * setting changes.
     *
     * @author Paul Bärnreuther
     * @param <R> the field type
     * @param <S> the triggering settings
     */
    public static class UpdateHandler<R, S> implements ButtonUpdateHandler<R, S, States> {

        /**
         * {@inheritDoc}
         */
        @Override
        public ButtonChange<R, States> update(final S settings, final SettingsCreationContext context)
            throws WidgetHandlerException {
            return new ButtonChange<>(null, States.READY);
        }

    }

}
