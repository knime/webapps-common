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

import java.util.Collection;
import java.util.LinkedList;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeDialog;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.UpdateHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonActionHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonWidget;
import org.knime.core.webui.node.dialog.internal.VariableSettings;

import com.fasterxml.jackson.core.JsonProcessingException;

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
     * @param widgetId identifying which pending requests came from the same widget and thus have to be canceled
     * @param className the class name of the {@link ChoicesProvider} that is to be used.
     * @return the choices of the choices provider as they would be supplied with the initial data in the synchronous
     *         case.
     * @throws InterruptedException if an error is thrown during the invocation
     * @throws ExecutionException if the used thread is interrupted
     */
    Result<?> getChoices(String widgetId, String className) throws InterruptedException, ExecutionException;

    /**
     * @param name the name of the flow variable
     * @param value an abbreviated string representation of the variables value
     * @param abbreviated whether the value is the actual value or was abbreviated
     */
    record PossibleFlowVariable(String name, String value, boolean abbreviated) {
    }

    /**
     * @param textSettings the state of the settings in JSON format for which the available flow variables are to be
     *            fetched
     * @param persistPath the path leading to the setting as it is stored in the node settings, i.e. including its
     *            settings type ("view" or "model") and its (possibly custom) config key
     * @return a map from the possible types of the specified setting to the present flow variables.
     * @throws InvalidSettingsException if the path does not start with "model" or "view"
     */
    Map<String, Collection<PossibleFlowVariable>> getAvailableFlowVariables(final String textSettings,
        final LinkedList<String> persistPath) throws InvalidSettingsException;

    /**
     *
     * This method first transforms the given text settings to {@link NodeSettings} and {@link VariableSettings} only to
     * then overwrite the node settings with the variables and transform them back to JSON. Hereby only those setting
     * (model or view) are transformed which are necessary as defined by the first entry of the dataPath.
     *
     * @param textSettings the front-end representation of the current settings in JSON format containing data and flow
     *            variable settings.
     * @param dataPath the path of the setting as it is stored in the data within the front-end JSON representation. In
     *            particular this has to start with its settings type ("view" or "model").
     * @return The string representation of the value of the resulting JSON at the given data path.
     * @throws InvalidSettingsException
     * @throws JsonProcessingException
     */
    String getFlowVariableOverrideValue(final String textSettings, final LinkedList<String> dataPath)
        throws InvalidSettingsException, JsonProcessingException;

}
