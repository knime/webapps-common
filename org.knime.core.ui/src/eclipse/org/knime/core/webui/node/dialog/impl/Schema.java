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
 *   4 Nov 2021 (Marc Bux, KNIME GmbH, Berlin, Germany): created
 */
package org.knime.core.webui.node.dialog.impl;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.knime.core.webui.node.dialog.impl.DefaultNodeSettings.SettingsCreationContext;

/**
 * An annotation for indicating controlling the schema of a given field.
 *
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface Schema {

    /**
     * @return the provider for the list of possible values (for multiple choice fields only)
     */
    Class<? extends ChoicesProvider> choices() default ChoicesProvider.class;

    /**
     * @return true if the choices have a type by which they can be filtered in the dialog
     */
    boolean withTypes() default true;

    /**
     * @return true if a parent contains the annotation for the choices of this field
     */
    boolean takeChoicesFromParent() default false;

    /**
     * @return the title / label of the field
     */
    String title() default "";

    /**
     * @return the description of the field (for tooltips or node descriptions)
     */
    String description() default "";

    /**
     * @return true for a multiple choice selection/enum, false for a single choice selection/enum
     */
    boolean multiple() default false;

    /**
     * Use {@link #minProvider()} if the minimum value depends on the context of the node.
     *
     * @return an optional minimum value for a numeric field
     */
    double min() default Double.NaN;

    /**
     * Takes precedence over {@link #min()} if provided.
     * No minimum is set if the DoubleProvider returns {@code Double.NaN}.
     *
     * @return an optional DoubleProvider that provides the min value given the current context of the node
     */
    Class<? extends DoubleProvider> minProvider() default DoubleProvider.class;

    /**
     * Use {@link #maxProvider()} if the maximum value depends on the context of the node.
     *
     * @return an optional maximum value for a numeric field
     */
    double max() default Double.NaN;

    /**
     * Takes precedence over {@link #max()} if provided.
     * No maximum is set if the DoubleProvider returns {@code Double.NaN}.
     *
     * @return an optional DoubleProvider that provides the max value given the current context of the node
     */
    Class<? extends DoubleProvider> maxProvider() default DoubleProvider.class;

    /**
     * @return an optional minimum length for a nominal field
     */
    int minLength() default -1;

    /**
     * @return an optional maximum length for a nominal field
     */
    int maxLength() default -1;

    /**
     * @return an optional regular expression pattern for a nominal field
     */
    String pattern() default "";

    /**
     * Provides a double value given the context of the node.
     *
     * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
     */
    interface DoubleProvider {

        /**
         * @param context of the node
         * @return the double value
         */
        double getValue(final SettingsCreationContext context);
    }

}
