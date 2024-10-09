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
package org.knime.core.webui.node.dialog.defaultdialog.tree;

import java.lang.annotation.Annotation;
import java.lang.reflect.Field;
import java.util.Collection;
import java.util.Iterator;
import java.util.Optional;
import java.util.function.Function;

import org.apache.commons.lang3.StringUtils;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.UiSchemaGenerationException;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.PersistableSettings;

import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.type.ResolvedType;
import com.fasterxml.jackson.databind.JavaType;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.cfg.MapperConfig;
import com.fasterxml.jackson.databind.introspect.AnnotatedField;
import com.fasterxml.jackson.databind.ser.PropertyWriter;

/**
 * Factory for creating persist or widget trees from a {@link DefaultNodeSettings} classes.
 *
 * @author Paul Bärnreuther
 * @param <S> the type of the [S]ettings. Either {@link PersistableSettings} or {@link WidgetGroup}
 */
public abstract class TreeFactory<S> {

    private final Collection<Class<? extends Annotation>> m_possibleTreeAnnotations;

    private final Collection<Class<? extends Annotation>> m_possibleTreeClassAnnotations;

    private final Collection<Class<? extends Annotation>> m_possibleLeafNodeAnnotations;

    private final Collection<Class<? extends Annotation>> m_possibleArrayNodeAnnotations;

    /**
     * @param possibleTreeAnnotations the annotations that are possible for tree nodes, i.e. either on the field or on
     *            the class of type S
     * @param possibleTreeClassAnnotations the sub collection of possibleTreeAnnotations that are only allowed on the
     *            class of type S
     * @param possibleLeafNodeAnnotations the annotations that are possible on fields which are not of type S or arrays
     *            of S
     * @param possibleArrayNodeAnnotations the annotations that are possible on fields which are arrays of S
     */
    protected TreeFactory(final Collection<Class<? extends Annotation>> possibleTreeAnnotations,
        final Collection<Class<? extends Annotation>> possibleTreeClassAnnotations,
        final Collection<Class<? extends Annotation>> possibleLeafNodeAnnotations,
        final Collection<Class<? extends Annotation>> possibleArrayNodeAnnotations) {
        m_possibleTreeAnnotations = possibleTreeAnnotations;
        m_possibleTreeClassAnnotations = possibleTreeClassAnnotations;
        m_possibleLeafNodeAnnotations = possibleLeafNodeAnnotations;
        m_possibleArrayNodeAnnotations = possibleArrayNodeAnnotations;
    }

    /**
     * @return the type of S
     */
    protected abstract Class<? extends S> getTreeSettingsClass();

    /**
     * @param rootClass implementing {@link WidgetGroup}.
     * @return the full tree
     */
    public final Tree<S> createTree(final Class<? extends S> rootClass) {
        return createTree(rootClass, null);
    }

    private Tree<S> createTree(final JavaType rootType) {
        return createTree(rootType, null);
    }

    /**
     * @param rootClass implementing {@link WidgetGroup}.
     * @param settingsType "view" or "model" or null for element trees of array widgets
     * @return the full tree
     */
    public Tree<S> createTree(final Class<? extends S> rootClass, final SettingsType settingsType) {
        return createTree(new ObjectMapper().constructType(rootClass), settingsType);
    }

    private Tree<S> createTree(final JavaType rootType, final SettingsType settingsType) {
        @SuppressWarnings("unchecked")
        final var tree = new Tree<S>(null, settingsType, (Class<? extends S>)rootType.getRawClass(),
            rootType.getRawClass()::getAnnotation, m_possibleTreeAnnotations, null);
        populateTree(tree, rootType);
        return tree;
    }

    /**
     *
     * Make {@link TreeNode#addAnnotation} accessible to subclasses
     *
     * @param node the node to add an annotation to
     * @param key the annotation class
     * @param value the annotation
     */
    protected final void performAddAnnotation(final TreeNode<S> node, final Class<? extends Annotation> key,
        final Annotation value) {
        node.addAnnotation(key, value);
    }

    /**
     *
     * Make {@link TreeNode#addOrReplaceAnnotation} accessible to subclasses
     *
     * @param node the node to add an annotation to
     * @param key the annotation class
     * @param value the annotation
     */
    protected final void performAddOrReplaceAnnotation(final TreeNode<S> node, final Class<? extends Annotation> key,
        final Annotation value) {
        node.addOrReplaceAnnotation(key, value);
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

    private static Iterator<PropertyWriter> getSerializableProperties(final JavaType type) {
        try {
            final var settingsSerializer = getSerializerProvider().findValueSerializer(type);
            return settingsSerializer.properties();
        } catch (JsonMappingException ex) {
            throw new UiSchemaGenerationException(
                String.format("Error while obtaining serializer for type %s.", type.toCanonical()), ex);
        }
    }

    void populateTree(final Tree<S> tree, final JavaType treeType) {
        getSerializableProperties(treeType).forEachRemaining(field -> addField(tree, field, treeType.getRawClass()));
    }

    private void addField(final Tree<S> widgetTree, final PropertyWriter field, final Class<?> populatingRootClass) {
        final var childBuilder = getNextChildBuilder(widgetTree)//
            .withName(field.getName()) //
            .withAccessors(field) //
            .withFieldAnnotations(getAnnotationsForField(field, populatingRootClass));
        final var type = field.getType();
        if (getTreeSettingsClass().isAssignableFrom(type.getRawClass())) {
            childBuilder.buildTree(type);
        } else if (isArrayField(field.getType())) {
            final var elementTreeType = field.getType().getContentType();
            childBuilder.buildArray(type, createTree(elementTreeType));
        } else {
            Class<?> contentType = null;
            if (field.getType().isArrayType()) {
                contentType = field.getType().getContentType().getRawClass();
            }
            childBuilder.buildLeaf(type, contentType);
        }
    }

    /**
     * @param javaType the type of the field
     * @return whether the uischema generation should interpret this field as an array layout
     */
    public boolean isArrayField(final ResolvedType javaType) {
        return (javaType.isArrayType() || javaType.isCollectionLikeType())
            && isTreeSettingsType(javaType.getContentType());
    }

    private boolean isTreeSettingsType(final ResolvedType contentType) {
        return !contentType.isEnumType() && getTreeSettingsClass().isAssignableFrom(contentType.getRawClass());
    }

    /**
     * We need to extract annotations also from the declaring class in case it is not the same as the one that is
     * populated.
     */
    private Function<Class<? extends Annotation>, Annotation> getAnnotationsForField(final PropertyWriter field,
        final Class<?> populatingRootClass) {
        final var declaringClass = field.getMember().getDeclaringClass();
        if (declaringClass.equals(populatingRootClass)) {
            return annotationClass -> getAnnotationFromField(field, annotationClass);
        }
        return annotationClass -> getAnnotationsFromFieldWithDeclaringClass(field, declaringClass, annotationClass);
    }

    private <T extends Annotation> T getAnnotationsFromFieldWithDeclaringClass(final PropertyWriter field,
        final Class<?> declaringClass, final Class<T> annotationClass) {
        return Optional.ofNullable(getAnnotationFromField(field, annotationClass))
            .orElse(declaringClass.getAnnotation(annotationClass));
    }

    /**
     * Overwrite this method to extract annotations from the field in a non-standard way (e.g. from parameters of other
     * annotations)
     *
     * @param <T> the type of the annotation
     * @param field the field to extract the annotation from
     * @param annotationClass the class of the annotation
     * @return the annotation of the given class that is present on the field
     */
    protected <T extends Annotation> T getAnnotationFromField(final PropertyWriter field,
        final Class<T> annotationClass) {
        return field.getAnnotation(annotationClass);
    }

    private TreeNodeBuilder getNextChildBuilder(final Tree<S> tree) {
        return new TreeNodeBuilder(tree);
    }

    private final class TreeNodeBuilder {

        final Tree<S> m_parent;

        String m_name;

        Field m_underlyingField;

        Function<Class<? extends Annotation>, Annotation> m_fieldAnnotations;

        TreeNodeBuilder(final Tree<S> parent) {
            m_parent = parent;
        }

        TreeNodeBuilder withName(final String name) {
            m_name = name;
            return this;
        }

        TreeNodeBuilder withAccessors(final PropertyWriter field) {
            final var underlyingField = (Field)field.getMember().getAnnotated();
            underlyingField.setAccessible(true); // NOSONAR
            m_underlyingField = underlyingField;
            return this;
        }

        TreeNodeBuilder withFieldAnnotations(final Function<Class<? extends Annotation>, Annotation> annotations) {
            m_fieldAnnotations = annotations;
            return this;
        }

        LeafNode<S> buildLeaf(final JavaType type, final Class<?> contentType) {
            return addedToParent(m_name, new LeafNode<>(m_parent, type.getRawClass(), contentType, m_fieldAnnotations,
                m_possibleLeafNodeAnnotations, m_underlyingField));
        }

        Tree<S> buildTree(final JavaType type) {
            return addedToParent(m_name, createIntermediateTree(m_parent, type,
                annotationClass -> getAnnotationFromFieldOrClass(type.getRawClass(), annotationClass)));
        }

        private Tree<S> createIntermediateTree(final Tree<S> parent, final JavaType treeType,
            final Function<Class<? extends Annotation>, Annotation> annotations) {
            @SuppressWarnings("unchecked")
            final var tree = new Tree<>(parent, parent.getSettingsType(), (Class<? extends S>)treeType.getRawClass(),
                annotations, m_possibleTreeAnnotations, m_underlyingField);
            populateTree(tree, treeType);
            return tree;
        }

        private Annotation getAnnotationFromFieldOrClass(final Class<?> type,
            final Class<? extends Annotation> annotationClass) {
            final var fieldAnnotation = m_fieldAnnotations.apply(annotationClass);
            if (m_possibleTreeClassAnnotations.contains(annotationClass)) {
                final var typeAnnotation = type.getAnnotation(annotationClass);
                validateAnnotations(type, annotationClass, fieldAnnotation, typeAnnotation);
                if (typeAnnotation != null) {
                    return typeAnnotation;
                }
            }
            return fieldAnnotation;
        }

        private void validateAnnotations(final Class<?> type, final Class<? extends Annotation> annotationClass,
            final Annotation fieldAnnotation, final Annotation typeAnnotation) {
            if (typeAnnotation != null && fieldAnnotation != null) {
                throw new IllegalStateException(String.format(
                    "The annotation %s for field %s collides with the an annotation of the field type class %s.",
                    annotationClass.getSimpleName(), m_name, type.getSimpleName()));

            }
        }

        ArrayParentNode<S> buildArray(final JavaType type, final Tree<S> elementWidgetTree) {
            return addedToParent(m_name, new ArrayParentNode<>(m_parent, elementWidgetTree, type.getRawClass(),
                m_fieldAnnotations, m_possibleArrayNodeAnnotations, m_underlyingField));
        }

        private <T extends TreeNode<S>> T addedToParent(final String name, final T node) {
            m_parent.addChild(name, node);
            return node;
        }

    }

}
