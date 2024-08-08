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

import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.ConvertValueUtil.convertDependencies;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.ConvertValueUtil.convertValue;

import java.util.EnumMap;
import java.util.Map;
import java.util.concurrent.ExecutionException;

import org.knime.core.webui.data.DataServiceContext;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.util.GenericTypeFinderUtil;
import org.knime.core.webui.node.dialog.defaultdialog.widget.UpdateHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonActionHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.impl.AsyncChoicesGetter;
import org.knime.core.webui.node.dialog.defaultdialog.widget.handler.ErrorHandlingSingleton;

/**
 * Implementation of the {@link DefaultNodeDialogDataService}.
 *
 * @author Paul Bärnreuther
 */
@SuppressWarnings({"java:S1452"}) //Allow wildcard return values
public final class DefaultNodeDialogDataServiceImpl implements DefaultNodeDialogDataService {

    private final ButtonWidgetUpdateHandlerHolder m_buttonUpdateHandlers;

    private final ButtonWidgetActionHandlerHolder m_buttonActionHandlers;

    private final ChoicesWidgetUpdateHandlerHolder m_choicesUpdateHandlers;

    private final DataServiceRequestHandler m_requestHandler;

    private final AsyncChoicesGetter m_asyncChoicesGetter;

    private final DataServiceTriggerInvocationHandler m_triggerInvocationHandler;

    /**
     * @param settingsClasses the classes of the {@link DefaultNodeSettings} associated to the dialog.
     * @param asyncChoicesGetter for retrieving those choices whose computation was triggered during the determination
     *            of the initial data.
     */
    public DefaultNodeDialogDataServiceImpl(
        final Map<SettingsType, Class<? extends DefaultNodeSettings>> settingsClasses,
        final AsyncChoicesGetter asyncChoicesGetter) {
        final Map<SettingsType, Class<? extends WidgetGroup>> keyToSettingsClassMap = new EnumMap<>(SettingsType.class);
        settingsClasses.forEach(keyToSettingsClassMap::put);
        m_buttonActionHandlers = new ButtonWidgetActionHandlerHolder(keyToSettingsClassMap.values());
        m_buttonUpdateHandlers = new ButtonWidgetUpdateHandlerHolder(keyToSettingsClassMap.values());
        m_choicesUpdateHandlers = new ChoicesWidgetUpdateHandlerHolder(keyToSettingsClassMap.values());
        m_requestHandler = new DataServiceRequestHandler();
        m_triggerInvocationHandler = new DataServiceTriggerInvocationHandler(keyToSettingsClassMap);
        m_asyncChoicesGetter = asyncChoicesGetter;
    }

    static DefaultNodeSettingsContext createContext() {
        return DefaultNodeSettings.createDefaultNodeSettingsContext(DataServiceContext.get().getInputSpecs());
    }

    @Override
    public Result<?> invokeButtonAction(final String widgetId, final String handlerClass, final String buttonState,
        final Object objectSettings) throws ExecutionException, InterruptedException {
        final var handler = getButtonActionHandler(handlerClass);
        final var context = createContext();
        final var convertedSettings = convertDependencies(objectSettings, handler, context);
        return m_requestHandler.handleRequest(widgetId,
            () -> handler.castAndInvoke(buttonState, convertedSettings, context));
    }

    @Override
    public Result<?> initializeButton(final String widgetId, final String handlerClass, final Object currentValue)
        throws InterruptedException, ExecutionException {
        final var handler = getButtonActionHandler(handlerClass);
        final var resultType = GenericTypeFinderUtil.getFirstGenericType(handler.getClass(), ButtonActionHandler.class);
        final var context = createContext();
        final var convertedCurrentValue = convertValue(currentValue, resultType, context);
        return m_requestHandler.handleRequest(widgetId,
            () -> handler.castAndInitialize(convertedCurrentValue, context));

    }

    private ButtonActionHandler<?, ?, ?> getButtonActionHandler(final String widgetId) {
        final var buttonHandler = m_buttonActionHandlers.getHandler(widgetId);
        if (buttonHandler != null) {
            return buttonHandler;
        }
        throw new NoHandlerFoundException(widgetId);
    }

    @Override
    public Result<?> update(final String widgetId, final String handlerClass, final Object objectSettings)
        throws InterruptedException, ExecutionException {
        final var handler = getUpdateHandler(handlerClass);
        final var context = createContext();
        final var convertedSettings = convertDependencies(objectSettings, handler, context);
        return m_requestHandler.handleRequest(widgetId, () -> handler.castAndUpdate(convertedSettings, context));
    }

    private UpdateHandler<?, ?> getUpdateHandler(final String handlerClassName) {
        final var buttonHandler = m_buttonUpdateHandlers.getHandler(handlerClassName);
        if (buttonHandler != null) {
            return buttonHandler;
        }
        final var choicesHandler = m_choicesUpdateHandlers.getHandler(handlerClassName);
        if (choicesHandler != null) {
            return choicesHandler;
        }
        throw new NoHandlerFoundException(handlerClassName);
    }

    @Override
    public Result<?> update2(final String widgetId, final String triggerClass,
        final Map<String, Object> rawDependencies) throws InterruptedException, ExecutionException {

        ErrorHandlingSingleton.reset();

        final var context = createContext();
        return m_requestHandler.handleRequest(widgetId,
            () -> m_triggerInvocationHandler.trigger(triggerClass, rawDependencies, context));
    }

    @Override
    public Result<?> getChoices(final String className) throws InterruptedException, ExecutionException {
        return m_requestHandler.handleRequestFuture(m_asyncChoicesGetter.getChoices(className));
    }

    static final class NoHandlerFoundException extends IllegalArgumentException {
        private static final long serialVersionUID = 1L;

        NoHandlerFoundException(final String widgetId) {
            super(String.format("No handler found for component %s. Most likely an implementation error.", widgetId));
        }
    }

}
