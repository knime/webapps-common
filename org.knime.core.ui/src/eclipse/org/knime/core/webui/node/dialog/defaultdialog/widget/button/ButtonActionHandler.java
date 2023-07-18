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
import org.knime.core.webui.node.dialog.defaultdialog.dataservice.RequestFailureException;

/**
 * The interface defining that a {@link ButtonWidget#actionHandler} has to extend. It is used for initializing the
 * button, updating it when dependent settings change and invoking actions on click.
 *
 * @author Paul Bärnreuther
 * @param <R> the type of the setting which is annotated by {@link ButtonWidget}
 * @param <S> the type of the class representing all settings, this setting depends on (see {@link DependencyHandler})
 * @param <M> the state machine of the action handler
 */
public interface ButtonActionHandler<R, S, M extends Enum<M>>
    extends ButtonStateMachineHandler<M>, UpdateHandler<ButtonChange<R, M>, S> {

    /**
     * This method is called whenever the dialog is opened in order to determine the initial state of the button.
     *
     * @param currentValue the current set value of the button field
     * @param settings the state of the dependency settings
     * @param context the current {@link SettingsCreationContext}
     *
     * @return the initial state of the button and its value.
     * @throws RequestFailureException if the request should fail providing the error message to the frontend
     */
    ButtonChange<R, M> initialize(R currentValue, SettingsCreationContext context)
        throws RequestFailureException;

    /**
     * This method gets called when the button is clicked.
     *
     * @param state a string specified by the frontend in order to reuse the same invocation for multiple uses. E.g.
     *            this can be used to cancel an invocation (refer to {@link CancelableActionHandler}.
     * @param settings the settings of type {@code S} which the invocation depends on.
     * @param context the current {@link SettingsCreationContext}
     *
     * @return an asynchronous result.
     * @throws RequestFailureException if the request should fail providing the error message to the frontend
     */
    ButtonChange<R, M> invoke(M state, S settings, SettingsCreationContext context)
        throws RequestFailureException;

    @SuppressWarnings({"javadoc"})
    default ButtonChange<R, M> castAndInvoke(final String stateString, final Object settings,
        final SettingsCreationContext context) throws RequestFailureException {
        return invoke(castToState(stateString), castToDependencies(settings), context);
    }

    @SuppressWarnings({"javadoc", "unchecked"})
    default ButtonChange<R, M> castAndInitialize(final Object currentValue,
        final SettingsCreationContext context) throws RequestFailureException {
        return initialize((R)currentValue, context);
    }

    /**
     * Use the setter methods of the override argument to alter the state associated to the given enum field.
     *
     * @param state from the associated state machine enum
     * @param override an override initialized with the {@link ButtonState} associated to the state machine enum field.
     */
    default void overrideState(final M state, final ButtonStateOverride override) {
    }

}
