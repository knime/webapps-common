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
package org.knime.core.webui.node.dialog.defaultdialog;

import static org.knime.core.webui.node.dialog.defaultdialog.util.InstantiationUtil.createInstance;

import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.concurrent.CancellationException;
import java.util.concurrent.ExecutionException;
import java.util.function.Consumer;

import org.knime.core.node.NodeLogger;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsDataUtil;
import org.knime.core.webui.node.dialog.defaultdialog.util.DefaultNodeSettingsFieldTraverser;
import org.knime.core.webui.node.dialog.defaultdialog.util.DefaultNodeSettingsFieldTraverser.Field;
import org.knime.core.webui.node.dialog.defaultdialog.util.GenericTypeFinderUtil;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ActionHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ActionHandlerResult;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonWidget;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ser.PropertyWriter;

/**
 *
 * @author Paul Bärnreuther
 */
public class DefaultNodeDialogDataServiceImpl implements DefaultNodeDialogDataService {

    private static final NodeLogger LOGGER = NodeLogger.getLogger(DefaultNodeDialogDataServiceImpl.class);

    private Map<String, ActionHandler<?>> m_handlers = new HashMap<>();

    DefaultNodeDialogDataServiceImpl(final Collection<Class<?>> settingsClasses) {
        final var handlerClasses = getActionHandlers(settingsClasses, JsonFormsDataUtil.getMapper());
        handlerClasses.forEach(handler -> m_handlers.put(handler.getName(), createInstance(handler)));
    }

    private static Collection<Class<? extends ActionHandler<?>>> getActionHandlers(final Collection<Class<?>> settings,
        final ObjectMapper mapper) {
        final Collection<Class<? extends ActionHandler<?>>> actionHandlerClasses = new HashSet<>();
        final Consumer<Field> addActionHandlerClass = getAddActionHandlerClassCallback(actionHandlerClasses);
        settings.forEach(settingsClass -> {
            final var generator = new DefaultNodeSettingsFieldTraverser(mapper, settingsClass);
            generator.traverse(addActionHandlerClass);
        });
        return actionHandlerClasses;
    }

    private static Consumer<Field>
        getAddActionHandlerClassCallback(final Collection<Class<? extends ActionHandler<?>>> actionHandlerClasses) {
        return field -> {
            final var buttonWidget = field.propertyWriter().getAnnotation(ButtonWidget.class);
            if (buttonWidget == null) {
                return;
            }
            final var actionHandlerClass = buttonWidget.actionHandler();
            if (!isValidReturnType(field.propertyWriter(), actionHandlerClass)) {
                throw new IllegalArgumentException(
                    String.format("Return type of action handler %s is not assignable to the type of the field %s.",
                        actionHandlerClass.getSimpleName(), field.propertyWriter().getFullName()));
            }
            actionHandlerClasses.add(actionHandlerClass);
        };
    }

    private static boolean isValidReturnType(final PropertyWriter field,
        final Class<? extends ActionHandler<?>> actionHandlerClass) {
        final var returnType = GenericTypeFinderUtil.getNthGenericType(actionHandlerClass, ActionHandler.class, 0);
        final var fieldType = field.getType().getRawClass();
        return fieldType.isAssignableFrom(returnType);

    }

    @Override
    public ActionHandlerResult<?> invokeActionHandler(final String handlerClass, final String buttonState)
        throws ExecutionException, InterruptedException {
        final ActionHandler<?> handler = m_handlers.get(handlerClass);
        if (handler == null) {
            throw new IllegalArgumentException(String
                .format("No action handler found for class %s. Most likely an implementation error.", handlerClass));
        }
        try {
            return handler.invoke(buttonState).get();
        } catch (CancellationException ex) {
            LOGGER.info(ex);
            return ActionHandlerResult.cancel();
        }
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public ActionHandlerResult<?> invokeActionHandler(final String handlerClass)
        throws ExecutionException, InterruptedException {
        return invokeActionHandler(handlerClass, null);
    }

}
