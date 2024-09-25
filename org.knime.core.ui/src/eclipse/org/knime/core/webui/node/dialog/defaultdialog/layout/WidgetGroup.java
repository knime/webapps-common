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
 *   Mar 21, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.layout;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.ElementType.TYPE;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Annotation;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;

/**
 * If a (possibly nested) field within a {@link DefaultNodeSettings} class is an instance of a class extending this
 * interface, it will not be treated as a setting during the creation of the user interface and instead its nested
 * fields (annotated with {@link Widget}) are respected. This is useful for clustering several settings into one java
 * object.
 *
 * When using the same {@link WidgetGroup} in two different contexts with slightly different configurations, use the
 * {@link Modification} annotation from outside to modify parts of it (e.g. changing a description, changing the choices
 * of a dropdown or adapting value updates).
 *
 * @author Paul Bärnreuther
 */
public interface WidgetGroup {
    /**
     * Put this annotation on a widget group (either field or class) or an array layout field in order to modify one of
     * its contained widgets. This is only useful if the widget group is used in more than one context with slightly
     * different configurations.
     *
     * As a best practice, when writing such a widget group, explain in JavaDocs what modifications are intended or
     * define an abstract implementation of {@link Modifier} that boils down to the necessary information to be
     * implemented by the different cases.
     */
    @Retention(RUNTIME)
    @Target({FIELD, TYPE})
    public @interface Modification {

        /**
         * @return one or multiple modifiers defining instructions on how to modify, add or remove annotations on child
         *         annotations.
         */
        Class<? extends Modifier>[] value();

        /**
         * Marker interface for identifiers to be used within {@link WidgetReference} and
         * {@link WidgetGroupModifier#find}.
         *
         * @author Paul Bärnreuther
         */
        interface Reference {
        }

        /**
         * The counterpart annotation that is to be set on the fields which should be modified by a
         * {@link Modification}.
         *
         * @author Paul Bärnreuther
         */
        @Retention(RUNTIME)
        @Target(FIELD)
        @interface WidgetReference {

            /**
             * @return an identifier class/interface that is to be used in {@link WidgetGroupModifier#find}
             */
            Class<? extends Reference> value();
        }
    }

    /**
     * <p>
     * Widgets are targeted using {@link Modification.WidgetReference}. An error is thrown if the reference is not found
     * for any child field of this one. It is possible to reference fields within array layout settings.
     * </p>
     * <p>
     * One can then either modify, add or remove annotations on the widget. Errors are thrown if one of the operations
     * is not valid (e.g., when ...
     * <ul style="list-style-type: '... ' ">
     * <li>adding an annotation that is already present</li>
     * <li>removing an annotation that is not present</li>
     * <li>setting a property which is not present</li>
     * <li>adding an annotation without setting values for all non-default properties</li>
     * </ul>
     * )
     * </p>
     */
    interface Modifier {

        /**
         * @param group the modifier by which widget modifiers can be accessed
         */
        void modify(WidgetGroupModifier group);

    }

    /**
     * Associated to one {@link WidgetGroup}.
     */
    interface WidgetGroupModifier {

        /**
         * @param reference the identifier of the widget to modify (it has to be annotated by
         *            {@link Modification.WidgetReference})
         * @return a modifier for the widget
         */
        WidgetModifier find(Class<? extends Modification.Reference> reference);

    }

    /**
     * Associated to one (possibly nested) field within a {@link WidgetGroup}.
     */
    interface WidgetModifier {

        /**
         * @param <T> the type of the annotation
         * @param annotationClass
         * @throws IllegalStateException if the annotation is not present
         * @return a builder for modifying the annotation
         */
        <T extends Annotation> AnnotationModifier modifyAnnotation(Class<T> annotationClass);

        /**
         * @param <T> the type of the annotation
         * @param annotationClass
         * @throws IllegalStateException if the annotation is already present
         * @return a builder for modifying the default annotation
         */
        <T extends Annotation> AnnotationModifier addAnnotation(Class<T> annotationClass);

        /**
         * @param <T> the type of the annotation
         * @param annotationClass
         * @throws IllegalStateException if the annotation is not present
         */
        <T extends Annotation> void removeAnnotation(Class<T> annotationClass);

    }

    /**
     * This annotation builder is used to add or modify a specific annotation. Use {@link #withProperty} or
     * {@link #withValue} to set the method return value for this annotation. Note that when adding an annotation, all
     * required properties must be set.
     *
     * When all properties are set, call {@link #modify()} to commit the changes.
     */
    interface AnnotationModifier {

        /**
         * Set the return value of a method of the annotation.
         *
         * @param <T> the return type of the annotation method
         * @param key the name of the method
         * @param value the return value
         * @throws IllegalArgumentException if the key is not a method of the annotation or if the value is not of the
         *             correct type
         * @return this modifier for continuation (and finally {@link #modify()})
         */
        <T> AnnotationModifier withProperty(String key, T value);

        /**
         * Set the value property of the annotation.
         *
         * @param <T> the type of the value property
         * @param value the value property of the annotation
         * @return this modifier for continuation (and finally {@link #modify()})
         */
        default <T> AnnotationModifier withValue(final T value) {
            return withProperty("value", value);
        }

        /**
         * Commit the changes.
         */
        void modify();

    }
}
