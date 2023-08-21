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

import static java.util.stream.Collectors.toMap;

import java.util.Arrays;
import java.util.Collection;
import java.util.LinkedList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ExecutionException;
import java.util.function.Supplier;

import org.apache.commons.lang3.StringUtils;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.workflow.FlowVariable;
import org.knime.core.node.workflow.VariableType;
import org.knime.core.webui.node.dialog.NodeSettingsService;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsDataUtil;
import org.knime.core.webui.node.dialog.defaultdialog.util.GenericTypeFinderUtil;
import org.knime.core.webui.node.dialog.defaultdialog.widget.UpdateHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonActionHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.handler.DependencyHandler;

/**
 *
 * @author Paul Bärnreuther
 */
@SuppressWarnings("java:S1452") //Allow wildcard return values
public class DefaultNodeDialogDataServiceImpl implements DefaultNodeDialogDataService {

    private final ButtonWidgetUpdateHandlerHolder m_buttonUpdateHandlers;

    private final ButtonWidgetActionHandlerHolder m_buttonActionHandlers;

    private final ChoicesWidgetHandlerHolder m_choicesService;

    private final Supplier<DefaultNodeSettingsContext> m_contextProvider;

    private final DataServiceRequestHandler m_requestHandler;

    private final NodeSettingsService m_nodeSettingsService;

    /**
     * @param settingsClasses the collection of {@link DefaultNodeSettings} to extract the handler classes from.
     * @param contextProvider providing the current {@link DefaultNodeSettingsContext}
     * @param nodeSettingsService used to transform data to {@link NodeSettings} in order to determine the compatible
     *            flow variables.
     */
    public DefaultNodeDialogDataServiceImpl(final Collection<Class<? extends DefaultNodeSettings>> settingsClasses,
        final Supplier<DefaultNodeSettingsContext> contextProvider, final NodeSettingsService nodeSettingsService) {
        m_contextProvider = contextProvider;
        m_nodeSettingsService = nodeSettingsService;
        m_buttonActionHandlers = new ButtonWidgetActionHandlerHolder(settingsClasses);
        m_buttonUpdateHandlers = new ButtonWidgetUpdateHandlerHolder(settingsClasses);
        m_choicesService = new ChoicesWidgetHandlerHolder(settingsClasses);
        m_requestHandler = new DataServiceRequestHandler();
    }

    @Override
    public Result<?> invokeButtonAction(final String widgetId, final String handlerClass, final String buttonState,
        final Object objectSettings) throws ExecutionException, InterruptedException {
        final var handler = getButtonActionHandler(handlerClass);
        final var convertedSettings = convertDependencies(objectSettings, handler);
        return m_requestHandler.handleRequest(widgetId,
            () -> handler.castAndInvoke(buttonState, convertedSettings, m_contextProvider.get()));

    }

    @Override
    public Result<?> initializeButton(final String widgetId, final String handlerClass, final Object currentValue)
        throws InterruptedException, ExecutionException {
        final var handler = getButtonActionHandler(handlerClass);
        final var resultType = GenericTypeFinderUtil.getFirstGenericType(handler.getClass(), ButtonActionHandler.class);
        final var convertedCurrentValue = convertValue(currentValue, resultType);

        return m_requestHandler.handleRequest(widgetId,
            () -> handler.castAndInitialize(convertedCurrentValue, m_contextProvider.get()));

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
        final var convertedSettings = convertDependencies(objectSettings, handler);
        return m_requestHandler.handleRequest(widgetId,
            () -> handler.castAndUpdate(convertedSettings, m_contextProvider.get()));
    }

    private UpdateHandler<?, ?> getUpdateHandler(final String widgetId) {
        final var buttonHandler = m_buttonUpdateHandlers.getHandler(widgetId);
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

    static final class NoHandlerFoundException extends IllegalArgumentException {
        private static final long serialVersionUID = 1L;

        NoHandlerFoundException(final String widgetId) {
            super(String.format("No handler found for component %s. Most likely an implementation error.", widgetId));
        }
    }

    @Override
    public Map<String, Collection<PossibleFlowVariable>> getAvailableFlowVariables(final String textSettings,
        final LinkedList<String> path, final String configKey) throws InvalidSettingsException {
        final var typesService = new FlowVariableTypesExtractor(m_nodeSettingsService);
        final var firstPathElement = path.pollFirst();
        final SettingsType settingsType;
        if (SettingsType.MODEL.getConfigKey().equals(firstPathElement)) {
            settingsType = SettingsType.MODEL;
        } else if (SettingsType.VIEW.getConfigKey().equals(firstPathElement)) {
            settingsType = SettingsType.VIEW;
        } else {
            throw new IllegalArgumentException(String
                .format("First element of the path must be either 'view' or 'model' but was %s", firstPathElement));
        }
        final var variableTypes = typesService.getTypes(settingsType, path, configKey, textSettings);
        final var context = m_contextProvider.get();
        return Arrays.asList(variableTypes).stream()
            .collect(toMap(VariableType::getIdentifier, type -> getPossibleFlowVariables(context, type)));
    }

    private static List<PossibleFlowVariable> getPossibleFlowVariables(final DefaultNodeSettingsContext context,
        final VariableType<?> type) {
        return context.getAvailableInputFlowVariables(type).values().stream()
            .map(DefaultNodeDialogDataServiceImpl::toPossibleFlowVariable).toList();
    }

    private static final int  ABBREVUATION_THRESHOLD = 50;

    static PossibleFlowVariable toPossibleFlowVariable(final FlowVariable flowVariable) {
        var value = flowVariable.getValueAsString();
        boolean abbreviated = false;
        if (value != null && value.length() > ABBREVUATION_THRESHOLD) {
            value = StringUtils.abbreviate(value, ABBREVUATION_THRESHOLD);
            abbreviated = true;
        }
        return new PossibleFlowVariable(flowVariable.getName(), value, abbreviated);
    }

    @Override
    public String getFlowVariableValue(final String name) {
        //TODO: More elaborate approach using m_nodeSettingsService#fromNodeSettings
        final var flowVariable = m_contextProvider.get().getFlowVariableByName(name).get();
        return flowVariable.getValueAsString();
    }

}
