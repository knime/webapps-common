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
 *   Jun 19, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.util;

import java.lang.annotation.Annotation;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.knime.core.util.Pair;

/**
 * A holder for annotations of a field during the traversal of nested settings of DefaultNodeSettings. It is a payload
 * for the traversal callback for leaves and it is converted to a class annotations holder for nested settings.
 *
 * @author Paul Bärnreuther
 */
public class FieldAnnotationsHolder {
    final Map<Class<? extends Annotation>, Object> m_fieldAnnotations;

    final Collection<Class<? extends Annotation>> m_trackedAnnotations;

    final Collection<Class<?>> m_enclosingFieldSetsAnnotation;

    FieldAnnotationsHolder(final Collection<Class<? extends Annotation>> trackedAnnotations) {
        this(trackedAnnotations, new HashMap<>(), new HashSet<>());
    }

    FieldAnnotationsHolder(final Collection<Class<? extends Annotation>> trackedAnnotations,
        final Map<Class<? extends Annotation>, Object> defaultAnnotations,
        final Collection<Class<?>> enclosingFieldSetsAnnotation) {
        m_trackedAnnotations = trackedAnnotations;
        m_fieldAnnotations = defaultAnnotations;
        m_enclosingFieldSetsAnnotation = enclosingFieldSetsAnnotation;
    }

    /**
     * This exception is thrown when for a nested field both the enclosing field and the enclosing class have the same
     * kind of annotation which is one of the tracked ones.
     *
     * @author Paul Bärnreuther
     */
    public static class FieldAnnotationException extends RuntimeException {

        private static final long serialVersionUID = 1L;

        FieldAnnotationException(final String className) {
            super(String.format(
                "The an annotation for class %s collides with the an annotation of the enclosing field.", className));
        }

    }

    /**
     * specializes the given annotations further with annotations of its class (in order to traverse nested settings).
     * Whenever the field as well as its class both have one of the tracked annotations, an error is thrown. (Even if
     * they are not conflicting. In this case one of them simply has to be removed).
     *
     * @param clazz the class of the field
     * @return The class annotations holder.
     */
    ClassAnnotationsHolder toClassAnnotationsHolder(final Class<?> clazz) {
        final Map<Class<? extends Annotation>, Object> newAnnotations = m_trackedAnnotations.stream()
            .map(annotationClass -> new Pair<>(annotationClass, mergeAnnotationsForClass(annotationClass, clazz)))
            .filter(pair -> pair.getSecond() != null).collect(Collectors.toMap(Pair::getFirst, Pair::getSecond));
        return new ClassAnnotationsHolder(m_trackedAnnotations, newAnnotations);
    }

    private Object mergeAnnotationsForClass(final Class<? extends Annotation> annotationClass, final Class<?> clazz) {
        final var classLayout = getAnnotationFromClass(annotationClass, clazz);
        if (classLayout.isPresent() && m_enclosingFieldSetsAnnotation.contains(annotationClass)) {
            throw new FieldAnnotationException(clazz.getSimpleName());

        }
        return classLayout.orElse(m_fieldAnnotations.get(annotationClass));
    }

    static Optional<Object> getAnnotationFromClass(final Class<? extends Annotation> annotationClass,
        final Class<?> clazz) {
        return Optional.ofNullable(clazz.getAnnotation(annotationClass));
    }

    /**
     * @param <T> the type of annotation.
     * @param annotationsClass the class of the annotation. Only annotations which are initially given to the
     *            constructor are tracked and present.
     * @return an instance of the annotationsClass on the field, or of the last annotation of a parent/enclosing
     *         field/class. Null if no such annotation is present.
     */
    public <T extends Annotation> Optional<T> getInstance(final Class<T> annotationsClass) {
        final var instance = m_fieldAnnotations.get(annotationsClass);
        if (instance != null && annotationsClass.isInstance(instance)) {
            return Optional.of(annotationsClass.cast(instance));
        }
        return Optional.empty();
    }
}
