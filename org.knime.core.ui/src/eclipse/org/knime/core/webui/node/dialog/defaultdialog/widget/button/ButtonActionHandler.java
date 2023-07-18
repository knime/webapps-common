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
 *   Jun 27, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.widget.button;

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.SettingsCreationContext;
import org.knime.core.webui.node.dialog.defaultdialog.widget.handler.DependencyHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.handler.WidgetHandlerException;

/**
 * The interface defining that a {@link ButtonWidget#actionHandler} has to extend. It is used for initializing the
 * button, updating it when dependent settings change and invoking actions on click.
 *
 * @param <R> the type of the setting which is annotated by {@link ButtonWidget}
 * @param <S> the type of the class representing all settings, this setting depends on (see {@link DependencyHandler})
 * @param <M> the state machine of the action handler. It is an enum where each field has to have a {@link ButtonState}
 *            annotation.
 *
 * @author Paul Bärnreuther
 */
public interface ButtonActionHandler<R, S, M extends Enum<M>> extends DependencyHandler<S> {

    /**
     * This method is called whenever the dialog is opened in order to determine the initial state of the button.
     *
     * @param currentValue the current set value of the button field
     * @param settings the state of the dependency settings
     * @param context the current {@link SettingsCreationContext}
     *
     * @return the initial state of the button and its value.
     * @throws WidgetHandlerException if the request should fail providing the error message to the frontend
     */
    ButtonChange<R, M> initialize(R currentValue, SettingsCreationContext context) throws WidgetHandlerException;

    /**
     * This method gets called when the button is clicked.
     *
     * @param state a string specified by the frontend in order to reuse the same invocation for multiple uses. E.g.
     *            this can be used to cancel an invocation (refer to {@link CancelableActionHandler}.
     * @param settings the settings of type {@code S} which the invocation depends on.
     * @param context the current {@link SettingsCreationContext}
     *
     * @return a representation of how the button is going to change or {@code null} if no change should happen due to
     *         this call.
     * @throws WidgetHandlerException if the request should fail providing the error message to the frontend
     */
    ButtonChange<R, M> invoke(M state, S settings, SettingsCreationContext context) throws WidgetHandlerException;

    @SuppressWarnings({"javadoc"})
    default ButtonChange<R, M> castAndInvoke(final String stateString, final Object settings,
        final SettingsCreationContext context) throws WidgetHandlerException {
        return invoke(castToState(stateString), castToDependencies(settings), context);
    }

    @SuppressWarnings({"javadoc", "unchecked"})
    default ButtonChange<R, M> castAndInitialize(final Object currentValue, final SettingsCreationContext context)
        throws WidgetHandlerException {
        return initialize((R)currentValue, context);
    }

    /**
     * Override this method in order to adjust the states of the state machine. This might be useful if the same state
     * machine should be used in different contexts (e.g. with different texts).
     *
     * @param stateField enum field from the associated state machine
     * @param buttonState the {@link ButtonState} annotation present at the enum field
     * @return the {@link ButtonState} that should be used instead of the annotated one.
     */
    default ButtonState overrideButtonState(final M stateField, final ButtonState buttonState) {
        return buttonState;
    }

    @SuppressWarnings("javadoc")
    default M castToState(final String stateString) {
        return Enum.valueOf(getStateMachine(), stateString);
    }

    /**
     * The button has an associated state machine defined by the generic type. It is an enum where every enum field
     * needs to have a {@link ButtonState} annotations We need the class of this generic type returned by this method
     * in. order to
     * <ol>
     * <li>serialize the state machine (i.e. the enum value and their {@link ButtonState}) with the initial data sent to
     * the front-end</li>
     * <li>map the string parameter sent by the front-end to their respective enum values</li>
     * </ol>
     *
     * We need this method to make the class of the state
     *
     * @return the class of the state machine.
     */
    Class<M> getStateMachine();

}
