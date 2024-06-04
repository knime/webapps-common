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
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema;

import java.util.function.Predicate;

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.rule.PredicateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.rule.PredicateProvider.PredicateInitializer;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.Condition;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.ConstantExpression;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.Expression;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.ConditionToExpressionTranslator;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.FrameworkExpression;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.FrameworkPredicateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.JsonFormsExpression;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.ScopedExpression;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnselection.ColumnSelection;
import org.knime.core.webui.node.dialog.defaultdialog.util.InstantiationUtil;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Reference;
import org.knime.core.webui.node.dialog.defaultdialog.widgettree.WidgetTreeNode;


class DefaultPredicateInitializer implements PredicateInitializer {

    private ScopeFromReference m_scopeFromReference;

    private DefaultNodeSettingsContext m_context;

    interface ScopeFromReference {

        WidgetTreeNode getScope(Class<?> reference) throws InvalidReferenceException;

    }

    DefaultPredicateInitializer(final ScopeFromReference scopes, final DefaultNodeSettingsContext context) {
        m_scopeFromReference = scopes;
        m_context = context;
    }

    private Expression<JsonFormsExpression> createExpression(final Class<?> reference, final Condition condition) {
        return new ScopedExpression(m_scopeFromReference.getScope(reference), condition);
    }

    @Override
    @SuppressWarnings("unchecked") // checked by isAssignableFrom
    public PredicateProvider.Predicate getPredicate(final Class<? extends PredicateProvider> otherConditionClass) {
        if (FrameworkPredicateProvider.class.isAssignableFrom(otherConditionClass)) {
            return new FrameworkExpression((Class<? extends FrameworkPredicateProvider>)otherConditionClass);
        }
        return getPredicate(InstantiationUtil.createInstance(otherConditionClass));
    }

    @Override
    public PredicateProvider.Predicate getPredicate(final PredicateProvider predicateProvider) {
        return predicateProvider.init(this);
    }

    @Override
    public PredicateProvider.Predicate getConstant(final Predicate<DefaultNodeSettingsContext> predicate) {
        return new ConstantExpression(predicate.test(m_context));
    }

    @Override
    public StringReference getString(final Class<? extends Reference<String>> reference) {
        return new ConditionToExpressionTranslator.StringFieldReference<>(condition -> createExpression(reference, condition));
    }

    @Override
    public BooleanReference getBoolean(final Class<? extends Reference<Boolean>> reference) {
        return new ConditionToExpressionTranslator.BooleanFieldReference<>(condition -> createExpression(reference, condition));

    }

    @Override
    public <E extends Enum<E>> EnumReference<E> getEnum(final Class<? extends Reference<E>> reference) {
        return new ConditionToExpressionTranslator.EnumFieldReference<>(condition -> createExpression(reference, condition));
    }

    @Override
    public <T> ArrayReference getArray(final Class<? extends Reference<T[]>> reference) {
        return new ConditionToExpressionTranslator.ArrayFieldReference<>(condition -> createExpression(reference, condition));
    }

    @Override
    public ColumnSelectionReference getColumnSelection(final Class<? extends Reference<ColumnSelection>> reference) {
        return new ConditionToExpressionTranslator.ColumnFieldSelectionReference<>(
            condition -> createExpression(reference, condition));
    }

    @Override
    public boolean isMissing(final Class<? extends Reference<?>> reference) {
        try {
            m_scopeFromReference.getScope(reference);
            return false;
        } catch (InvalidReferenceException ex) { // NOSONAR
            return true;
        }
    }

}
