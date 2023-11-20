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
 *   Jul 10, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.dataservice;

import static org.knime.core.webui.node.dialog.defaultdialog.util.InstantiationUtil.createInstance;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Consumer;

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsDataUtil;
import org.knime.core.webui.node.dialog.defaultdialog.util.ArrayLayoutUtil;
import org.knime.core.webui.node.dialog.defaultdialog.util.DefaultNodeSettingsFieldTraverser;
import org.knime.core.webui.node.dialog.defaultdialog.util.DefaultNodeSettingsFieldTraverser.TraversedField;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * This class is used to supply handlers associated to specific widgets to the data service.
 *
 * @param <H> The type of the handler class
 * @author Paul Bärnreuther
 */
abstract class WidgetHandlerHolder<H> {

    private Map<String, H> m_handlers = new HashMap<>();

    WidgetHandlerHolder(final Collection<Class<? extends DefaultNodeSettings>> settingsClasses) {
        addHandlers(settingsClasses, JsonFormsDataUtil.getMapper());
    }

    private void addHandlers(final Collection<Class<? extends DefaultNodeSettings>> settings,
        final ObjectMapper mapper) {
        final Consumer<TraversedField> addActionHandlerClass = getAddActionHandlerClassCallback(mapper);
        settings.forEach(settingsClass -> {
            final var generator = new DefaultNodeSettingsFieldTraverser(mapper, settingsClass);
            generator.traverse(addActionHandlerClass);
        });
    }

    private Consumer<TraversedField> getAddActionHandlerClassCallback(final ObjectMapper mapper) {
        return field -> {
            addHandlersForNestedFields(mapper, field);
            final var optionalHandlerClass = getHandlerClass(field);
            optionalHandlerClass
                .ifPresent(handlerClass -> m_handlers.put(handlerClass.getName(), createInstance(handlerClass)));
        };

    }

    private void addHandlersForNestedFields(final ObjectMapper mapper, final TraversedField field) {
        final var javaType = field.propertyWriter().getType();
        if (ArrayLayoutUtil.isArrayLayoutField(javaType)) {
            final var elementClass = javaType.getContentType().getRawClass();
            if (DefaultNodeSettings.class.isAssignableFrom(elementClass)) {
                addHandlers(List.of((Class<? extends DefaultNodeSettings>)elementClass), mapper);
            }
        }
    }

    /**
     *
     * @param field any traversed field in the supplied settings
     * @return an optional of the persent handler or an empty optional
     */
    abstract Optional<Class<? extends H>> getHandlerClass(final TraversedField field);

    /**
     * @param handlerClassName the name of the handler class
     * @return the present hander with that class name held by this class of null.
     */
    H getHandler(final String widgetId) {
        return m_handlers.get(widgetId);
    }
}
