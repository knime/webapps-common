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
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.Callable;
import java.util.concurrent.CancellationException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;
import java.util.function.Supplier;

import org.knime.core.node.KNIMEConstants;
import org.knime.core.node.NodeLogger;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.SettingsCreationContext;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsDataUtil;
import org.knime.core.webui.node.dialog.defaultdialog.util.GenericTypeFinderUtil;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonActionHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.DependencyHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.UpdateHandler;

/**
 *
 * @author Paul Bärnreuther
 */
@SuppressWarnings("java:S1452") //Allow wildcard return values
public class DefaultNodeDialogDataServiceImpl implements DefaultNodeDialogDataService {

    private static final NodeLogger LOGGER = NodeLogger.getLogger(DefaultNodeDialogDataServiceImpl.class);

    private final ButtonWidgetHandlerHolder m_buttonService;

    private final ChoicesWidgetHandlerHolder m_choicesService;

    private final Map<String, Future<?>> m_pendingRequests = new HashMap<>();

    private final Supplier<SettingsCreationContext> m_contextProvider;

    /**
     * @param settingsClasses the collection of {@link DefaultNodeSettings} to extract the handler classes from.
     * @param contextProvider providing the current {@link SettingsCreationContext}
     */
    public DefaultNodeDialogDataServiceImpl(final Collection<Class<?>> settingsClasses,
        final Supplier<SettingsCreationContext> contextProvider) {
        m_contextProvider = contextProvider;
        m_buttonService = new ButtonWidgetHandlerHolder(settingsClasses);
        m_choicesService = new ChoicesWidgetHandlerHolder(settingsClasses);
    }

    @Override
    public Result<?> invokeButtonAction(final String widgetId, final String buttonState, final Object objectSettings)
        throws ExecutionException, InterruptedException {
        final var handler = getButtonHandler(widgetId);
        final var convertedSettings = convertDependencies(objectSettings, handler);
        return handleRequest(widgetId,
            () -> handler.castAndInvoke(buttonState, convertedSettings, m_contextProvider.get()));

    }

    @Override
    public Result<?> initializeButton(final String widgetId, final Object currentValue)
        throws InterruptedException, ExecutionException {
        final var handler = getButtonHandler(widgetId);
        final var resultType = GenericTypeFinderUtil.getFirstGenericType(handler.getClass(), ButtonActionHandler.class);
        final var convertedCurrentValue = convertValue(currentValue, resultType);

        return handleRequest(widgetId, () -> handler.castAndInitialize(convertedCurrentValue, m_contextProvider.get()));

    }

    private ButtonActionHandler<?, ?, ?> getButtonHandler(final String widgetId) {
        final var buttonHandler = m_buttonService.getHandler(widgetId);
        if (buttonHandler != null) {
            return buttonHandler;
        }
        throw new NoHandlerFoundException(widgetId);
    }

    @Override
    public Result<?> update(final String widgetId, final Object objectSettings)
        throws InterruptedException, ExecutionException {
        final var handler = getUpdateHandler(widgetId);
        final var convertedSettings = convertDependencies(objectSettings, handler);
        return handleRequest(widgetId, () -> handler.castAndUpdate(convertedSettings, m_contextProvider.get()));
    }

    private UpdateHandler<?, ?> getUpdateHandler(final String widgetId) {
        final var buttonHandler = m_buttonService.getHandler(widgetId);
        if (buttonHandler != null) {
            return buttonHandler;
        }
        final var choicesHandler = m_choicesService.getHandler(widgetId);
        if (choicesHandler != null) {
            return choicesHandler;
        }
        throw new NoHandlerFoundException(widgetId);
    }

    private static Object convertDependencies(final Object objectSettings, final DependencyHandler<?> handler) {
        final var settingsType = GenericTypeFinderUtil.getFirstGenericType(handler.getClass(), DependencyHandler.class);
        return convertValue(objectSettings, settingsType);
    }

    private static Object convertValue(final Object objectSettings, final Class<?> settingsType) {
        return JsonFormsDataUtil.getMapper().convertValue(objectSettings, settingsType);

    }

    private <T> Result<T> handleRequest(final String widgetId, final Callable<Result<T>> callback)
        throws InterruptedException, ExecutionException {
        final var future = KNIMEConstants.GLOBAL_THREAD_POOL.enqueue(callback);
        Optional.ofNullable(m_pendingRequests.get(widgetId)).ifPresent(pendingFuture -> pendingFuture.cancel(true));
        m_pendingRequests.put(widgetId, future);
        try {
            final var result = future.get();
            m_pendingRequests.remove(widgetId);
            return result;
        } catch (CancellationException ex) {
            LOGGER.info(ex);
            return Result.cancel();
        } catch (ExecutionException ex) {
            if (ex.getCause() instanceof CancellationException) {
                LOGGER.info(ex);
                return Result.cancel();
            }
            throw ex;
        }
    }

    static final class NoHandlerFoundException extends IllegalArgumentException {
        private static final long serialVersionUID = 1L;

        NoHandlerFoundException(final String widgetId) {
            super(String.format("No handler found for component %s. Most likely an implementation error.", widgetId));
        }
    }

}
