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

import static org.knime.core.webui.node.dialog.defaultdialog.util.FieldAnnotationsHolder.getAnnotationFromClass;

import java.lang.annotation.Annotation;
import java.util.Collection;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.knime.core.util.Pair;

import com.fasterxml.jackson.databind.ser.PropertyWriter;

/**
 * A holder for annotations of a class during the traversal of nested settings of DefaultNodeSettings. It is further
 * converted to annotation holders for its fields.
 *
 * @author Paul Bärnreuther
 */
class ClassAnnotationsHolder {

    final Collection<Class<? extends Annotation>> m_trackedAnnotations;

    final Map<Class<? extends Annotation>, Object> m_classAnnotations;

    ClassAnnotationsHolder(final Collection<Class<? extends Annotation>> trackedAnnotations,
        final Map<Class<? extends Annotation>, Object> defaultAnnotations) {
        m_trackedAnnotations = trackedAnnotations;
        m_classAnnotations = defaultAnnotations;
    }

    /**
     * Specializes the given class annotations further to the annotations of a specific field. An annotation on a field
     * overwrites the class annotation. If there is no such annotations, an annotation on the declaring class of the
     * field (possibly of a superclass of the traversed class) can overwrite the field annotation instead.
     *
     * @param field a field within the class.
     * @return The field annotations holder.
     */
    FieldAnnotationsHolder toFieldAnnotationsHolder(final PropertyWriter field) {
        return new FieldAnnotationsHolder(m_trackedAnnotations, getNewAnnotations(field),
            getNewEnclosingFieldSetsAnnotation(field));
    }

    private Set<Class<?>> getNewEnclosingFieldSetsAnnotation(final PropertyWriter field) {
        return m_trackedAnnotations.stream()
            .filter(annotationClass -> getAnnotationFromField(annotationClass, field).isPresent())
            .collect(Collectors.toSet());
    }

    private Map<Class<? extends Annotation>, Object> getNewAnnotations(final PropertyWriter field) {
        return m_trackedAnnotations.stream()
            .map(annotationClass -> new Pair<>(annotationClass, mergeAnnotationsForField(annotationClass, field)))
            .filter(pair -> pair.getSecond() != null).collect(Collectors.toMap(Pair::getFirst, Pair::getSecond));
    }

    private Object mergeAnnotationsForField(final Class<? extends Annotation> annotationClass,
        final PropertyWriter field) {
        final var annotationByFieldAnnotation = getAnnotationFromField(annotationClass, field);
        final var declaringClassLayout =
            getDeclaringClassAnnotation(annotationClass, field).orElse(m_classAnnotations.get(annotationClass));
        return annotationByFieldAnnotation.orElse(declaringClassLayout);
    }

    private static Optional<Object> getAnnotationFromField(final Class<? extends Annotation> annotationClass,
        final PropertyWriter field) {
        return Optional.ofNullable(field.getAnnotation(annotationClass));
    }

    private static Optional<Object> getDeclaringClassAnnotation(final Class<? extends Annotation> annotationClass,
        final PropertyWriter field) {
        return getAnnotationFromClass(annotationClass, field.getMember().getDeclaringClass());
    }

}
