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
 *   Jun 4, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.widget.updates;

import org.knime.core.data.DataValue;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnselection.ColumnSelection;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.predicates.And;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.predicates.Not;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.predicates.Or;

/**
 * Use the initializer to create a predicate depending on other fields in the current {@link DefaultNodeSettings} or the
 * {@link DefaultNodeSettingsContext}.
 *
 * <h5>For array layouts:</h5>
 * <ul>
 * <li>If this predicate provider is used within the element settings of an array layout, only fields within these
 * element settings can be referenced.</li>
 * <li>Referencing fields within the element settings of an array layout from outside is only possible via referencing
 * the array widget field via {@link PredicateInitializer#getArray}</li>
 * </ul>
 *
 * @author Paul Bärnreuther
 */
@FunctionalInterface
public interface PredicateProvider {

    /**
     * Use the initializer to create a predicate depending on other fields in the current {@link DefaultNodeSettings},
     * the {@link DefaultNodeSettingsContext} or on another {@link PredicateProvider}.
     *
     * @param i
     * @return the provided predicate
     */
    Predicate init(PredicateInitializer i);

    /**
     *
     * Used wihtin the {@link PredicateProvider#init} method to declare predicates referencing other fields, the
     * {@link DefaultNodeSettingsContext} or another {@link PredicateProvider}
     *
     * <h5>Referencing other fields:</h5>
     * <p>
     * Currently, one can create predicates on other fields of the following types:
     * </p>
     *
     * <ul>
     * <li>{@link #getBoolean Booleans}</li>
     * <li>{@link #getString Strings}</li>
     * <li>{@link #getEnum Enums}</li>
     * <li>{@link #getArray Arrays of widget groups (Array widget)}</li>
     * <li>{@link #getColumnSelection ColumnSelections}</li>
     * </ul>
     *
     * Note on array widgets:
     * <ul>
     * <li>If this predicate provider is used within the element settings of an array layout, only fields within these
     * element settings can be referenced.</li>
     * <li>Referencing fields within the element settings of an array layout from outside is only possible via
     * referencing the array widget field via {@link PredicateInitializer#getArray}</li>
     * </ul>
     *
     * <h5>Using the DefaultNodeSettingsContext:</h5>
     * <p>
     * Using {@link #getConstant}
     * </p>
     *
     * <h5>Combining different Predicates</h5>
     * <p>
     * <ul>
     * <li>Once a predicate is constructed, one can use {@link Predicate#and}, {@link Predicate#or} and
     * {@link Predicate#negate}</li>
     * <li>Different syntax with the same effect {@link PredicateProvider#and}, {@link PredicateProvider#or} and
     * {@link PredicateProvider#not}</li>
     * <li>To make use of the predicate provided by another {@link PredicateProvider}, use {@link #getPredicate} either
     * by class or by instance.
     * </ul>
     * </p>
     *
     * <h5>Ignoring missing references</h5>
     *
     * <p>
     * Use {@link #isMissing} to check for missing references if those are expected (this only occurs in the special
     * case where a {@link PredicateProvider} is used in the context of different {@link DefaultNodeSettings}).
     * </p>
     *
     * @author Paul Bärnreuther
     */
    interface PredicateInitializer {

        /**
         * @param reference bound to exactly one String field via {@link ValueReference}
         * @return an object that can be further transformed to a predicate using one of its methods
         */
        StringReference getString(Class<? extends Reference<String>> reference);

        /**
         * @param reference bound to exactly one boolean field via {@link ValueReference}
         * @return an object that can be further transformed to a predicate using one of its methods
         */
        BooleanReference getBoolean(Class<? extends Reference<Boolean>> reference);

        /**
         * @param reference bound to exactly one array widget field via {@link ValueReference}
         * @return an object that can be further transformed to a predicate using one of its methods
         */
        <T> ArrayReference getArray(Class<? extends Reference<T[]>> reference);

        /**
         * @param reference bound to exactly one {@link ColumnSelection} field via {@link ValueReference}
         * @return an object that can be further transformed to a predicate using one of its methods
         */
        ColumnSelectionReference getColumnSelection(Class<? extends Reference<ColumnSelection>> reference);

        /**
         * @param reference bound to exactly one enum field via {@link ValueReference}
         * @return an object that can be further transformed to a predicate using one of its methods
         */
        <E extends Enum<E>> EnumReference<E> getEnum(Class<? extends Reference<E>> reference);

        /**
         * Returned by {@link PredicateInitializer#getString}
         *
         * @author Paul Bärnreuther
         */
        interface StringReference {
            /**
             * Note that for a null value, the respective field has to be annotated with
             * com.fasterxml.jackson.annotation.JsonInclude(Include.ALWAYS}
             *
             * @param value
             * @return predicate
             */
            Predicate isEqualTo(String value);

            /**
             * @param pattern a regular predicate pattern
             * @return predicate
             */
            Predicate matchesPattern(String pattern);

            /**
             * @return predicate that is fulfilled, when the referenced String field is annotated with a
             *         {@link ChoicesWidget} with {@link ChoicesWidget#showNoneColumn()} and the "None" column is
             *         selected.
             */
            Predicate isNoneString();
        }

        /**
         * Returned by {@link PredicateInitializer#getBoolean}
         *
         * @author Paul Bärnreuther
         */
        interface BooleanReference {
            Predicate isTrue();

            Predicate isFalse();
        }

        /**
         * Returned by {@link PredicateInitializer#getEnum}
         *
         * @author Paul Bärnreuther
         * @param <E>
         */
        interface EnumReference<E extends Enum<E>> {
            /**
             * @param values
             * @return predicate that is fulfilled, when any of the given values is selected.
             */
            @SuppressWarnings("unchecked")
            Predicate isOneOf(E... values);
        }

        /**
         * Returned by {@link PredicateInitializer#getArray}
         *
         * @author Paul Bärnreuther
         */
        interface ArrayReference {

            /**
             * @return predicate that is fulfilled, when the referenced array has at least two elements.
             */
            Predicate hasMultipleItems();

            /**
             *
             * Note that {@link PredicateProvider} is a functional interface, so an implementation could look like this:
             *
             * {@code  i.getArray(ArrayFieldReference.class).containsElementSatisfying(
             *      el -> el.getBoolean(ElementBooleanFieldReference.class).isTrue()
             * );}
             *
             * @param elementPredicate as it could also be used for a field within the element settings (i.e. it
             *            references only fields within the element settings).
             * @return a predicate that is fulfilled if the elementPredicate is fulfilled for one of the elements of the
             *         referenced array.
             */
            Predicate containsElementSatisfying(PredicateProvider elementPredicate);
        }

        /**
         * Returned by {@link PredicateInitializer#getColumnSelection}
         *
         * @author Paul Bärnreuther
         */
        interface ColumnSelectionReference {
            /**
             * @return predicate that is fulfilled, when the referenced field is annotated with a {@link ChoicesWidget}
             *         with {@link ChoicesWidget#showNoneColumn()} and the "None" column is selected.
             */
            Predicate isNoneColumn();

            /**
             * @param columnName
             * @return predicate that is fulfilled, when a column with the given name is selected.
             */
            Predicate hasColumnName(String columnName);

            /**
             * @param type
             * @return predicate that is fulfilled, when a column with the given type is selected.
             */
            Predicate hasColumnType(Class<? extends DataValue> type);
        }

        /**
         * Use this method in case a {@link PredicateProvider} is used in the context of two different
         * {@link DefaultNodeSettings} (e.g. by reusing the same {@link WidgetGroup} within both of them. This way, one
         * can avoid an error that a {@link ValueReference} annotations is missing in one of the cases and instead one
         * can use {@link #never} or {@link #always} to create a constant effect not depending on the reference.
         *
         * @param reference
         * @return whether the reference can be accessed using one of the other methods {@link #getString},
         *         {@link #getBoolean}, ...
         */
        boolean isMissing(Class<? extends Reference<?>> reference);

        /**
         * This method can be used to create an effect that is constant as long as the
         * {@link DefaultNodeSettingsContext} does not change. I.e., e.g., the one can depend on the presence of certain
         * columns (or column types) or if dynamic ports are enabled/shown or not.
         *
         * @param predicate on the {@link DefaultNodeSettingsContext} when the dialog is opened
         * @return a {@link Predicate} that can be returned in {@link #init} or combined with other {@link Predicate}s
         */
        Predicate getConstant(java.util.function.Predicate<DefaultNodeSettingsContext> predicate);

        /**
         * This method should be used only in combination with {@link #isMissing}.
         *
         * @return a predicate that is never met.
         */
        default Predicate never() {
            return getConstant(context -> false);
        }

        /**
         * This method should be used only in combination with {@link #isMissing}.
         *
         * @return a predicate that is always met.
         */
        default Predicate always() {
            return getConstant(context -> true);
        }

        /**
         * Extract the provided predicate of another provider class. This is especially useful when this other predicate
         * is to be used in multiple places in different combinations with other conditions.
         *
         * @param predicateProviderClass
         * @return the provided predicate.
         */
        Predicate getPredicate(Class<? extends PredicateProvider> predicateProviderClass);

        /**
         * Extract the provided predicate of another provider. This is especially useful when this other predicate is to
         * be used in multiple places in different combinations with other conditions.
         *
         * @param predicateProvider
         * @return the provided predicate.
         */
        Predicate getPredicate(PredicateProvider predicateProvider);

    }

    /**
     * Use this method with {@link #init} to combine multiple predicates. Alternatively, use {@link Predicate#and}.
     *
     * @param predicates
     * @return A predicate that is fulfilled if and only if all of the given predicates are fulfilled.
     */
    default Predicate and(final Predicate... predicates) {
        return new And(predicates);
    }

    /**
     * Use this method with {@link #init} to negate a predicate. Alternatively, use {@link Predicate#negate}.
     *
     * @param predicate
     * @return A predicate that is fulfilled if and only if the given predicate is not fulfilled.
     */
    default Predicate not(final Predicate predicate) {
        return new Not(predicate);
    }

    /**
     * Use this method with {@link #init} to combine multiple predicates. Alternatively, use {@link Predicate#or}.
     *
     * @param predicates
     * @return A predicate that is fulfilled if and only if any of the given predicates are fulfilled.
     */
    default Predicate or(final Predicate... predicates) {
        return new Or(predicates);
    }

}
