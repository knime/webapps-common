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
 *   Feb 6, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.util.updates;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;
import java.util.Map.Entry;

import org.knime.core.node.util.CheckUtils;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.UiSchemaGenerationException;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.util.DefaultNodeSettingsFieldTraverser;
import org.knime.core.webui.node.dialog.defaultdialog.util.DefaultNodeSettingsFieldTraverser.TraversedField;
import org.knime.core.webui.node.dialog.defaultdialog.util.GenericTypeFinderUtil;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.StateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueRef;

final class SettingsClassesToValueRefsAndValueProviders {

    record ValueRefWrapper(Class<? extends ValueRef> valueRef, PathWithSettingsKey scope) {
    }

    record ValueProviderWrapper(Class<? extends StateProvider> stateProviderClass, PathWithSettingsKey scope) {
    }

    record ValueRefsAndValueProviders(Collection<ValueRefWrapper> valueRefs,
        Collection<ValueProviderWrapper> valueProviders) {
    }

    /**
     *
     * @param settingsClasses a map of settings classes to collect annotated fields from
     * @return the valueRef and updates annotations
     */
    static ValueRefsAndValueProviders
        settingsClassesToValueRefsAndValueProviders(final Map<String, Class<? extends WidgetGroup>> settingsClasses) {

        final Collection<ValueRefWrapper> valueRefs = new ArrayList<>();
        final Collection<ValueProviderWrapper> valueProviders = new ArrayList<>();

        settingsClasses.entrySet().forEach(entry -> {
            final var traverser = new DefaultNodeSettingsFieldTraverser(entry.getValue());
            final var fields = traverser.getAllFields();

            fields.stream().forEach(field -> {
                addValueRefAndValueProviderForField(field, entry, valueRefs, valueProviders);
            });

        });

        return new ValueRefsAndValueProviders(valueRefs, valueProviders);

    }

    private static void addValueRefAndValueProviderForField(final TraversedField field,
        final Entry<String, Class<? extends WidgetGroup>> entry, final Collection<ValueRefWrapper> valueRefs,
        final Collection<ValueProviderWrapper> valueProviders) {
        final var widgetAnnotation = field.propertyWriter().getAnnotation(Widget.class);
        if (widgetAnnotation != null) {
            final var pathWithSettingsKey = new PathWithSettingsKey(field.path(), entry.getKey());
            final var fieldType = field.propertyWriter().getType().getRawClass();
            addValueRef(valueRefs, widgetAnnotation, fieldType, pathWithSettingsKey);
            addValueProvider(valueProviders, widgetAnnotation, fieldType, pathWithSettingsKey);
        }
    }

    private static void addValueRef(final Collection<ValueRefWrapper> valueRefs, final Widget widgetAnnotation,
        final Class<?> fieldType, final PathWithSettingsKey pathWithSettingsKey) {
        final var valueRef = widgetAnnotation.valueRef();
        if (!valueRef.equals(ValueRef.class)) {
            validateAgainstFieldType(fieldType, valueRef, ValueRef.class);
            valueRefs.add(new ValueRefWrapper(widgetAnnotation.valueRef(), pathWithSettingsKey));
        }
    }

    private static void addValueProvider(final Collection<ValueProviderWrapper> valueProviders,
        final Widget widgetAnnotation, final Class<?> fieldType, final PathWithSettingsKey pathWithSettingsKey) {
        final var valueProviderClass = widgetAnnotation.valueProvider();
        if (!valueProviderClass.equals(StateProvider.class)) {
            validateAgainstFieldType(fieldType, valueProviderClass, StateProvider.class);
            valueProviders.add(new ValueProviderWrapper(valueProviderClass, pathWithSettingsKey));
        }
    }

    private static <T> void validateAgainstFieldType(final Class<?> fieldType,
        final Class<? extends T> implementingClass, final Class<T> genericInterface) {
        final var genericType = GenericTypeFinderUtil.getFirstGenericType(implementingClass, genericInterface);
        CheckUtils.check(fieldType.isAssignableFrom(genericType), UiSchemaGenerationException::new,
            () -> String.format(
                "The generic type \"%s\" of the %s \"%s\" does not match the type \"%s\" of the annotated field",
                genericType.getSimpleName(), genericInterface.getSimpleName(), implementingClass.getSimpleName(),
                fieldType.getSimpleName()));
    }

}
