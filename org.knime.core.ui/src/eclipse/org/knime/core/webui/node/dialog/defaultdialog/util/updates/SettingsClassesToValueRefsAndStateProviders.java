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

import java.lang.annotation.Annotation;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Stream;

import org.apache.commons.lang3.ClassUtils;
import org.knime.core.node.util.CheckUtils;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.UiSchemaGenerationException;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.util.WidgetGroupTraverser;
import org.knime.core.webui.node.dialog.defaultdialog.util.WidgetGroupTraverser.Configuration;
import org.knime.core.webui.node.dialog.defaultdialog.util.WidgetGroupTraverser.TraversedField;
import org.knime.core.webui.node.dialog.defaultdialog.util.GenericTypeFinderUtil;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesStateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.FileWriterWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.LocalFileWriterWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.TextInputWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.credentials.CredentialsWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.NoopBooleanProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.NoopStringProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Reference;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.StateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueReference;

final class SettingsClassesToValueRefsAndStateProviders {

    record ValueRefWrapper(Class<? extends Reference> valueRef, PathsWithSettingsKey fieldLocation) {
    }

    record ValueProviderWrapper(Class<? extends StateProvider> stateProviderClass, PathsWithSettingsKey fieldLocation) {
    }

    record ValueRefsAndStateProviders(Collection<ValueRefWrapper> valueRefs,
        Collection<ValueProviderWrapper> valueProviders, Collection<Class<? extends StateProvider>> uiStateProviders) {
    }

    static final Configuration TRAVERSAL_CONFIG = new Configuration.Builder()//
        .includeWidgetGroupFields()//
        .build();

    private final Collection<ValueRefWrapper> m_valueRefs = new ArrayList<>();

    private final Collection<ValueProviderWrapper> m_valueProviders = new ArrayList<>();

    private final Collection<Class<? extends StateProvider>> m_uiStateProviders = new ArrayList<>();

    /**
     * @param settingsClasses a map of settings classes to collect annotated fields from
     * @return the valueRef and updates annotations
     */
    ValueRefsAndStateProviders
        settingsClassesToValueRefsAndStateProviders(final Map<String, Class<? extends WidgetGroup>> settingsClasses) {

        settingsClasses.entrySet().forEach(entry -> {
            final var traverser = new WidgetGroupTraverser(entry.getValue(), TRAVERSAL_CONFIG);
            final var allFields = traverser.getAllFields();
            allFields.forEach(field -> addField(field, List.of(), entry.getKey()));
        });
        return new ValueRefsAndStateProviders(m_valueRefs, m_valueProviders, m_uiStateProviders);

    }

    private void addField(final TraversedField field, final List<TraversedField> parentFields,
        final String settingsKey) {
        addWidgetValueAnnotationValueRefAndValueProviderForField(field, parentFields, settingsKey);
        addUiStateProviderForField(field);
        traverseElementsOfArrayLayouts(field, parentFields, settingsKey);
    }

    private void traverseElementsOfArrayLayouts(final TraversedField field, final List<TraversedField> parentFields,
        final String settingsKey) {
        final var newParents = Stream.concat(parentFields.stream(), Stream.of(field)).toList();
        field.getElementTraverser(TRAVERSAL_CONFIG).ifPresent(traverser -> traverser.getAllFields()
            .forEach(elementField -> addField(elementField, newParents, settingsKey)));

    }

    private record UiStateProviderSpec<T extends Annotation, S extends StateProvider>( //
        Class<T> annotationClass, //
        Function<T, Class<? extends S>> getProviderParameter, //
        Class<? extends S> ignoredDefaultParameter //
    ) {
    }

    private static List<UiStateProviderSpec<? extends Annotation, ? extends StateProvider>> uiStateProviderSpecs =
        List.of( //
            new UiStateProviderSpec<>(//
                FileWriterWidget.class, //
                FileWriterWidget::fileExtensionProvider, //
                NoopStringProvider.class //
            ), //
            new UiStateProviderSpec<>( //
                LocalFileWriterWidget.class, //
                LocalFileWriterWidget::fileExtensionProvider, //
                NoopStringProvider.class //
            ), //
            new UiStateProviderSpec<>( //
                CredentialsWidget.class, //
                CredentialsWidget::hasPasswordProvider, //
                NoopBooleanProvider.class //
            ), //
            new UiStateProviderSpec<>( //
                CredentialsWidget.class, //
                CredentialsWidget::hasUsernameProvider, //
                NoopBooleanProvider.class //
            ), //
            new UiStateProviderSpec<>( //
                ChoicesWidget.class, //
                ChoicesWidget::choicesProvider, //
                ChoicesStateProvider.class //
            ), //
            new UiStateProviderSpec<>( //
                TextInputWidget.class, //
                TextInputWidget::placeholderProvider, //
                NoopStringProvider.class //
            ));

    private void addUiStateProviderForField(final TraversedField field) {
        uiStateProviderSpecs.stream().forEach(
            spec -> getUiStateProviderForFieldAndSpecificAnnotation(field, spec).ifPresent(m_uiStateProviders::add));
    }

    private static <T extends Annotation, S extends StateProvider> Optional<Class<? extends S>>
        getUiStateProviderForFieldAndSpecificAnnotation(final TraversedField field,
            final UiStateProviderSpec<T, S> spec) {
        final var annotation = field.propertyWriter().getAnnotation(spec.annotationClass());
        if (annotation == null) {
            return Optional.empty();
        }
        final var stateProvider = spec.getProviderParameter().apply(annotation);
        if (stateProvider.equals(spec.ignoredDefaultParameter())) {
            return Optional.empty();
        }
        return Optional.of(stateProvider);

    }

    private void addWidgetValueAnnotationValueRefAndValueProviderForField(final TraversedField field,
        final List<TraversedField> parentFields, final String settingsKey) {
        final var listOfPaths =
            Stream.concat(parentFields.stream(), Stream.of(field)).map(TraversedField::path).toList();
        final var pathWithSettingsKey = new PathsWithSettingsKey(listOfPaths, settingsKey);
        final var fieldType = field.propertyWriter().getType().getRawClass();
        final var valueReferenceAnnotation = field.propertyWriter().getAnnotation(ValueReference.class);
        if (valueReferenceAnnotation != null) {
            addValueRef(valueReferenceAnnotation.value(), fieldType, pathWithSettingsKey);
        }
        final var valueProviderAnnotation = field.propertyWriter().getAnnotation(ValueProvider.class);
        if (valueProviderAnnotation != null) {
            addValueProvider(valueProviderAnnotation.value(), fieldType, pathWithSettingsKey);
        }
    }

    private void addValueRef(final Class<? extends Reference> valueRef, final Class<?> fieldType,
        final PathsWithSettingsKey pathWithSettingsKey) {
        if (!valueRef.equals(Reference.class)) {
            validateAgainstFieldType(fieldType, valueRef, Reference.class);
            m_valueRefs.add(new ValueRefWrapper(valueRef, pathWithSettingsKey));
        }
    }

    private void addValueProvider(final Class<? extends StateProvider> valueProviderClass, final Class<?> fieldType,
        final PathsWithSettingsKey pathWithSettingsKey) {
        if (!valueProviderClass.equals(StateProvider.class)) {
            validateAgainstFieldType(fieldType, valueProviderClass, StateProvider.class);
            m_valueProviders.add(new ValueProviderWrapper(valueProviderClass, pathWithSettingsKey));
        }
    }

    private static <T> void validateAgainstFieldType(final Class<?> fieldType,
        final Class<? extends T> implementingClass, final Class<T> genericInterface) {
        final var genericType = GenericTypeFinderUtil.getFirstGenericType(implementingClass, genericInterface);
        CheckUtils.check(ClassUtils.primitiveToWrapper(fieldType).isAssignableFrom(genericType),
            UiSchemaGenerationException::new,
            () -> String.format(
                "The generic type \"%s\" of the %s \"%s\" does not match the type \"%s\" of the annotated field",
                genericType.getSimpleName(), genericInterface.getSimpleName(), implementingClass.getSimpleName(),
                fieldType.getSimpleName()));
    }

}
