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
 *   Jun 15, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.dataservice;

import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeDialog;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.IndexedValue;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.UpdateHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonActionHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Reference;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.StateProvider;

/**
 * This is the interface for the rpc data service of the {@link DefaultNodeDialog}. Its use enables e.g. lazyloaded data
 * for individual dialog components, cases where one setting should influence the value of another one and other backend
 * calls triggered by frontend components (e.g. button clicks).
 *
 * @author Paul Bärnreuther
 */
@SuppressWarnings("java:S1452") //Allow wildcard return values
interface DefaultNodeDialogDataService {

    /**
     * This method is triggered whenever a {@link ButtonWidget} is clicked.
     *
     * @param widgetId identifying which pending requests came from the same widget and thus have to be canceled
     * @param handlerClass the class name of the {@link ButtonActionHandler} that is to be used.
     * @param buttonState the id of the current state of the button
     * @param objectSettings the settings the button depends on
     * @return the result of the called invocation handler together with additional information about the status of the
     *         request.
     * @throws ExecutionException if an error is thrown during the invocation
     * @throws InterruptedException if the used thread is interrupted
     */
    Result<?> invokeButtonAction(String widgetId, String handlerClass, String buttonState, Object objectSettings)
        throws ExecutionException, InterruptedException;

    /**
     * @param widgetId identifying which pending requests came from the same widget and thus have to be canceled
     * @param handlerClass the class name of the {@link ButtonActionHandler} that is to be used.
     * @param currentValue the current value of the saved settings underlying the button.
     * @return the result of the called invocation handler together with additional information about the status of the
     *         request.
     * @throws InterruptedException if an error is thrown during the invocation
     * @throws ExecutionException if the used thread is interrupted
     */
    Result<?> initializeButton(String widgetId, String handlerClass, Object currentValue)
        throws InterruptedException, ExecutionException;

    /**
     * This method is to be triggered whenever settings that a widget with an associated {@link UpdateHandler} depends
     * on change.
     *
     * @param widgetId identifying which pending requests came from the same widget and thus have to be canceled
     * @param handlerClass the class name of the {@link UpdateHandler} that is to be used.
     * @param objectSettings the settings the widget depends on.
     * @return the result of the called update handler together with additional information about the status of the
     *         request.
     * @throws ExecutionException if an error is thrown during the invocation
     * @throws InterruptedException if the used thread is interrupted
     */
    Result<?> update(String widgetId, String handlerClass, Object objectSettings)
        throws InterruptedException, ExecutionException;

    /**
     * Update method for the new updating mechanism using {@link Reference} and {@link StateProvider}. This will
     * eventually replace the {@link #update} method.
     *
     * @param widgetId identifying which pending requests came from the same widget and thus have to be canceled
     * @param triggerClass
     * @param rawDependencies a map from a {@link Reference} class names to a list of values. This list of values is
     *            usually a one-element list with an indexed value without indices. Only if the dependency is nested
     *            within an array layout element while the trigger is not, a list of dependency values indexed by unique
     *            ids for each element in an array is supplied. Note that these are "raw" dependencies, since the
     *            objects within the indexed values need to be converted to the correct type defined by the generic of
     *            the {@link Reference} using a mapper
     * @return A list of instructions on what is to be updated. In case of indexed dependencies, the updates are also
     *         indexed by the same indices.
     * @throws InterruptedException
     * @throws ExecutionException
     */
    Result<?> update2(String widgetId, String triggerClass, Map<String, List<IndexedValue<String>>> rawDependencies)
        throws InterruptedException, ExecutionException;

    /**
     * @param className the class name of the {@link ChoicesProvider} that is to be used.
     * @return the choices of the choices provider as they would be supplied with the initial data in the synchronous
     *         case.
     * @throws InterruptedException if an error is thrown during the invocation
     * @throws ExecutionException if the used thread is interrupted
     */
    Result<?> getChoices(String className) throws InterruptedException, ExecutionException;

}
