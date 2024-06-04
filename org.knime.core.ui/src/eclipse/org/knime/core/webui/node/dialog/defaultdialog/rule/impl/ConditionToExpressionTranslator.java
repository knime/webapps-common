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
package org.knime.core.webui.node.dialog.defaultdialog.rule.impl;

import java.util.function.Function;

import org.knime.core.data.DataValue;
import org.knime.core.webui.node.dialog.defaultdialog.rule.PredicateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.rule.PredicateProvider.Predicate;
import org.knime.core.webui.node.dialog.defaultdialog.rule.PredicateProvider.PredicateInitializer.ArrayReference;
import org.knime.core.webui.node.dialog.defaultdialog.rule.PredicateProvider.PredicateInitializer.BooleanReference;
import org.knime.core.webui.node.dialog.defaultdialog.rule.PredicateProvider.PredicateInitializer.ColumnSelectionReference;
import org.knime.core.webui.node.dialog.defaultdialog.rule.PredicateProvider.PredicateInitializer.EnumReference;
import org.knime.core.webui.node.dialog.defaultdialog.rule.PredicateProvider.PredicateInitializer.StringReference;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.ConditionToExpressionTranslator.ArrayFieldReference;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.ConditionToExpressionTranslator.BooleanFieldReference;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.ConditionToExpressionTranslator.ColumnFieldSelectionReference;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.ConditionToExpressionTranslator.EnumFieldReference;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.ConditionToExpressionTranslator.StringFieldReference;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnselection.IsColumnOfTypeCondition;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnselection.IsSpecificColumnCondition;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.SpecialColumns;

/**
 * This class allows for translating the methods provided by the reference interfaces returned by the
 * {@link PredicateProvider} back to individual condition classes to be further processed using the visitor pattern.
 *
 * @author Paul Bärnreuther
 */
@SuppressWarnings({"rawtypes", "javadoc"})
public sealed class ConditionToExpressionTranslator<T extends AtomicExpression<T>> permits StringFieldReference,
    EnumFieldReference, BooleanFieldReference, ArrayFieldReference, ColumnFieldSelectionReference {

    final Function<Condition, Expression<T>> m_conditionToExpression;

    ConditionToExpressionTranslator(final Function<Condition, Expression<T>> conditionToExpression) {
        m_conditionToExpression = conditionToExpression;
    }

    protected Expression<T> createExpression(final Condition condition) {
        return m_conditionToExpression.apply(condition);
    }

    public static final class StringFieldReference<T extends AtomicExpression<T>>
        extends ConditionToExpressionTranslator<T> implements StringReference {

        public StringFieldReference(final Function<Condition, Expression<T>> conditionToExpression) {
            super(conditionToExpression);
        }

        @Override
        public Predicate isEqualTo(final String value) {
            return this.createExpression(new IsSpecificStringCondition() {

                @Override
                public String getValue() {
                    return value;
                }
            });
        }

        @Override
        public Predicate matchesPattern(final String pattern) {
            return createExpression(new PatternCondition() {

                @Override
                public String getPattern() {
                    return pattern;
                }
            });
        }

        @Override
        public Predicate isNoneString() {
            return isEqualTo(SpecialColumns.NONE.getId());
        }

    }

    public static final class EnumFieldReference<T extends AtomicExpression<T>, E extends Enum<E>>
        extends ConditionToExpressionTranslator<T> implements EnumReference<E> {

        public EnumFieldReference(final Function<Condition, Expression<T>> conditionToExpression) {
            super(conditionToExpression);
        }

        @Override
        public Predicate isOneOf(@SuppressWarnings("unchecked") final E... values) {
            return createExpression(new OneOfEnumCondition<E>() {

                @Override
                public E[] oneOf() {
                    return values;
                }

            });
        }

    }

    public static final class BooleanFieldReference<T extends AtomicExpression<T>>
        extends ConditionToExpressionTranslator<T> implements BooleanReference {

        public BooleanFieldReference(final Function<Condition, Expression<T>> conditionToExpression) {
            super(conditionToExpression);
        }

        @Override
        public Predicate isTrue() {
            return createExpression(new TrueCondition());
        }

        @Override
        public Predicate isFalse() {
            return createExpression(new FalseCondition());
        }

    }

    public static final class ArrayFieldReference<T extends AtomicExpression<T>>
        extends ConditionToExpressionTranslator<T> implements ArrayReference {

        public ArrayFieldReference(final Function<Condition, Expression<T>> conditionToExpression) {
            super(conditionToExpression);
        }

        @Override
        public Predicate hasMultipleItems() {
            return createExpression(new HasMultipleItemsCondition());
        }

        @Override
        public Predicate containsElementSatisfying(final PredicateProvider elementPredicate) {
            return createExpression(new ArrayContainsCondition2() {

                @Override
                public PredicateProvider getElementPredicate() {
                    return elementPredicate;
                }

            });
        }

    }

    public static final class ColumnFieldSelectionReference<T extends AtomicExpression<T>>
        extends ConditionToExpressionTranslator<T> implements ColumnSelectionReference {

        public ColumnFieldSelectionReference(final Function<Condition, Expression<T>> conditionToExpression) {
            super(conditionToExpression);
        }

        @Override
        public Predicate isNoneColumn() {
            return hasColumnName(SpecialColumns.NONE.getId());
        }

        @Override
        public Predicate hasColumnName(final String columnName) {
            return createExpression(new IsSpecificColumnCondition() {

                @Override
                public String getColumnName() {
                    return columnName;
                }
            });
        }

        @Override
        public Predicate hasColumnType(final Class<? extends DataValue> type) {
            return createExpression(new IsColumnOfTypeCondition() {

                @Override
                public Class<? extends DataValue> getDataValueClass() {
                    return type;
                }
            });
        }

    }

}
