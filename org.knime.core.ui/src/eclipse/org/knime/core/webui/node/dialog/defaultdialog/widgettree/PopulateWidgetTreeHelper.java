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
 *   Aug 5, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.widgettree;

import java.lang.annotation.Annotation;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Optional;
import java.util.function.Function;

import org.apache.commons.lang3.StringUtils;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.UiSchemaGenerationException;
import org.knime.core.webui.node.dialog.defaultdialog.layout.Layout;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.util.ArrayLayoutUtil;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Effect;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.PredicateProvider;

import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.cfg.MapperConfig;
import com.fasterxml.jackson.databind.introspect.AnnotatedField;
import com.fasterxml.jackson.databind.ser.PropertyWriter;

/**
 * Helper to populate a widget tree from a {@link WidgetGroup}-class.
 *
 * @author Paul Bärnreuther
 */
final class PopulateWidgetTreeHelper {

    private PopulateWidgetTreeHelper() {
        // Utility
    }

    private static ObjectMapper mapper;

    private static SerializerProvider serializerProvider;

    private static ObjectMapper getMapper() {
        if (mapper == null) {
            mapper = createMapper();
        }
        return mapper;
    }

    private static ObjectMapper createMapper() {
        var newMapper = new ObjectMapper();
        newMapper.setSerializationInclusion(Include.NON_NULL);
        newMapper.setVisibility(PropertyAccessor.ALL, Visibility.NON_PRIVATE);
        newMapper.setVisibility(PropertyAccessor.GETTER, Visibility.NONE);
        newMapper.setVisibility(PropertyAccessor.IS_GETTER, Visibility.NONE);
        newMapper.setPropertyNamingStrategy(new PropertyNamingStrategy() {
            private static final long serialVersionUID = 1L;

            @Override
            public String nameForField(final MapperConfig<?> config, final AnnotatedField field,
                final String defaultName) {
                return StringUtils.removeStart(defaultName, "m_");
            }
        });
        return newMapper;
    }

    private static SerializerProvider getSerializerProvider() {
        if (serializerProvider == null) {
            serializerProvider = getMapper().getSerializerProviderInstance();
        }
        return serializerProvider;
    }

    private static Iterator<PropertyWriter> getSerializableProperties(final Class<?> clazz) {
        try {
            final var settingsSerializer = getSerializerProvider().findValueSerializer(clazz);
            return settingsSerializer.properties();
        } catch (JsonMappingException ex) {
            throw new UiSchemaGenerationException(
                String.format("Error while obtaining serializer for class %s.", clazz.getSimpleName()), ex);
        }
    }

    static void populateWidgetTree(final WidgetTree widgetTree, final Class<? extends WidgetGroup> rootClass) {
        getSerializableProperties(rootClass).forEachRemaining(field -> addField(widgetTree, field, rootClass));
    }

    private static void addField(final WidgetTree widgetTree, final PropertyWriter field,
        final Class<? extends WidgetGroup> populatingRootClass) {
        final var childBuilder = getNextChildBuilder(widgetTree)//
            .withName(field.getName()) //
            .withFieldAnnotations(getAnnotationsForField(field, populatingRootClass));
        final var type = field.getType().getRawClass();

        if (WidgetGroup.class.isAssignableFrom(type)) {
            @SuppressWarnings("unchecked") // checked by the if condition above
            final var widgetGroupType = (Class<? extends WidgetGroup>)type;
            childBuilder.buildGroup(widgetGroupType);
        } else if (ArrayLayoutUtil.isArrayLayoutField(field.getType())) {
            @SuppressWarnings("unchecked") // checked by {@link ArrayLayoutUtil.isArrayLayoutField}
            final var elementWidgetGroupType =
                (Class<? extends WidgetGroup>)field.getType().getContentType().getRawClass();
            final var elementWidgetTree =
                new WidgetTree(null, null, elementWidgetGroupType, elementWidgetGroupType::getAnnotation);
            childBuilder.buildArray(type, elementWidgetTree);
        } else {
            Class<?> contentType = null;
            if (field.getType().isArrayType()) {
                contentType = field.getType().getContentType().getRawClass();
            }
            childBuilder.build(type, contentType);
        }
    }

    /**
     * We need to extract annotations also from the declaring class in case it is not the same as the
     * {@link WidgetGroup} that is populated.
     */
    private static Function<Class<? extends Annotation>, Annotation> getAnnotationsForField(final PropertyWriter field,
        final Class<? extends WidgetGroup> populatingRootClass) {
        final var declaringClass = field.getMember().getDeclaringClass();
        if (declaringClass.equals(populatingRootClass)) {
            return annotationClass -> getAnnotationFromField(field, annotationClass);
        }
        return annotationClass -> getAnnotationsFromFieldWithDeclaringClass(field, declaringClass, annotationClass);
    }

    private static <T extends Annotation> T getAnnotationsFromFieldWithDeclaringClass(final PropertyWriter field,
        final Class<?> declaringClass, final Class<T> annotationClass) {
        return Optional.ofNullable(getAnnotationFromField(field, annotationClass))
            .orElse(declaringClass.getAnnotation(annotationClass));
    }

    @SuppressWarnings("unchecked") // checked by Effect.class.equals(annotationClass)
    private static <T extends Annotation> T getAnnotationFromField(final PropertyWriter field,
        final Class<T> annotationClass) {
        if (Effect.class.equals(annotationClass)) {
            final var widgetAnnotation = field.getAnnotation(Widget.class);
            if (widgetAnnotation != null && !PredicateProvider.class.equals(widgetAnnotation.effect().predicate())) {
                if (field.getAnnotation(Effect.class) != null) {
                    throw new IllegalStateException(String.format(
                        "Conflicting Effect annotations on field and inside Widget annotation for field %s",
                        field.getName()));
                }
                return (T)widgetAnnotation.effect();
            }
        }
        return field.getAnnotation(annotationClass);
    }

    private static WidgetTreeNodeBuilder getNextChildBuilder(final WidgetTree tree) {
        return new WidgetTreeNodeBuilder(tree);
    }

    private static final class WidgetTreeNodeBuilder {

        final WidgetTree m_parent;

        String m_name;

        Function<Class<? extends Annotation>, Annotation> m_fieldAnnotations;

        WidgetTreeNodeBuilder(final WidgetTree parent) {
            m_parent = parent;
        }

        WidgetTreeNodeBuilder withName(final String name) {
            m_name = name;
            return this;
        }

        WidgetTreeNodeBuilder
            withFieldAnnotations(final Function<Class<? extends Annotation>, Annotation> annotations) {
            m_fieldAnnotations = annotations;
            return this;
        }

        WidgetNode build(final Class<?> type, final Class<?> contentType) {
            return addedToParent(m_name, new WidgetNode(m_parent, type, contentType, m_fieldAnnotations));
        }

        WidgetTree buildGroup(final Class<? extends WidgetGroup> type) {
            return addedToParent(m_name, createIntermediateWidgetTree(m_parent, type,
                annotationClass -> getAnnotationFromFieldOrClass(type, annotationClass)));
        }

        private static WidgetTree createIntermediateWidgetTree(final WidgetTree parent,
            final Class<? extends WidgetGroup> widgetGroupClass,
            final Function<Class<? extends Annotation>, Annotation> annotations) {
            return new WidgetTree(parent, parent.getSettingsType(), widgetGroupClass, annotations);
        }

        static final Collection<Class<? extends Annotation>> POSSIBLE_CLASS_ANNOTATIONS =
            List.of(Layout.class, Effect.class);

        private Annotation getAnnotationFromFieldOrClass(final Class<? extends WidgetGroup> type,
            final Class<? extends Annotation> annotationClass) {
            final var fieldAnnotation = m_fieldAnnotations.apply(annotationClass);
            if (POSSIBLE_CLASS_ANNOTATIONS.contains(annotationClass)) {
                final var typeAnnotation = type.getAnnotation(annotationClass);
                validateAnnotations(type, annotationClass, fieldAnnotation, typeAnnotation);
                if (typeAnnotation != null) {
                    return typeAnnotation;
                }
            }
            return fieldAnnotation;
        }

        private void validateAnnotations(final Class<? extends WidgetGroup> type,
            final Class<? extends Annotation> annotationClass, final Annotation fieldAnnotation,
            final Annotation typeAnnotation) {
            if (typeAnnotation != null && fieldAnnotation != null) {
                throw new IllegalStateException(String.format(
                    "The annotation %s for field %s collides with the an annotation of the field type class %s.",
                    annotationClass.getSimpleName(), m_name, type.getSimpleName()));

            }
        }

        ArrayWidgetNode buildArray(final Class<?> type, final WidgetTree elementWidgetTree) {
            return addedToParent(m_name, new ArrayWidgetNode(m_parent, elementWidgetTree, type, m_fieldAnnotations));
        }

        private <T extends WidgetTreeNode> T addedToParent(final String name, final T node) {
            m_parent.addChild(name, node);
            return node;
        }

    }

}
