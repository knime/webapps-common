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

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnselection.ColumnSelection;
import org.knime.core.webui.node.dialog.defaultdialog.tree.TreeNode;
import org.knime.core.webui.node.dialog.defaultdialog.util.InstantiationUtil;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Predicate;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.PredicateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.PredicateProvider.PredicateInitializer;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Reference;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.predicates.Condition;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.predicates.ConditionToPredicateTranslator;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.predicates.ConstantPredicate;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.predicates.FrameworkPredicate;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.predicates.FrameworkPredicateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.predicates.ScopedPredicate;

class DefaultPredicateInitializer implements PredicateInitializer {

    private ScopeFromReference m_scopeFromReference;

    private DefaultNodeSettingsContext m_context;

    interface ScopeFromReference {

        /**
         * @param reference
         * @return the node with the reference. Return null if no such node exists.
         */
        TreeNode<WidgetGroup> getScope(Class<?> reference);

    }

    DefaultPredicateInitializer(final ScopeFromReference scopes, final DefaultNodeSettingsContext context) {
        m_scopeFromReference = scopes;
        m_context = context;
    }

    private Predicate createPredicate(final Class<?> reference, final Condition condition)
        throws InvalidReferenceException {
        final var scope = m_scopeFromReference.getScope(reference);
        if (scope == null) {
            throw new InvalidReferenceException(reference);
        }
        return new ScopedPredicate(scope, condition);
    }

    @Override
    @SuppressWarnings("unchecked") // checked by isAssignableFrom
    public Predicate getPredicate(final Class<? extends PredicateProvider> otherConditionClass) {
        if (FrameworkPredicateProvider.class.isAssignableFrom(otherConditionClass)) {
            return new FrameworkPredicate((Class<? extends FrameworkPredicateProvider>)otherConditionClass);
        }
        return getPredicate(InstantiationUtil.createInstance(otherConditionClass));
    }

    @Override
    public Predicate getPredicate(final PredicateProvider predicateProvider) {
        return predicateProvider.init(this);
    }

    @Override
    public Predicate getConstant(final java.util.function.Predicate<DefaultNodeSettingsContext> predicate) {
        return new ConstantPredicate(predicate.test(m_context));
    }

    @Override
    public StringReference getString(final Class<? extends Reference<String>> reference) {
        return new ConditionToPredicateTranslator.StringFieldReference(
            condition -> createPredicate(reference, condition));
    }

    @Override
    public BooleanReference getBoolean(final Class<? extends Reference<Boolean>> reference) {
        return new ConditionToPredicateTranslator.BooleanFieldReference(
            condition -> createPredicate(reference, condition));

    }

    @Override
    public <E extends Enum<E>> EnumReference<E> getEnum(final Class<? extends Reference<E>> reference) {
        return new ConditionToPredicateTranslator.EnumFieldReference<>(
            condition -> createPredicate(reference, condition));
    }

    @Override
    public <T> ArrayReference getArray(final Class<? extends Reference<T[]>> reference) {
        return new ConditionToPredicateTranslator.ArrayFieldReference(
            condition -> createPredicate(reference, condition));
    }

    @Override
    public ColumnSelectionReference getColumnSelection(final Class<? extends Reference<ColumnSelection>> reference) {
        return new ConditionToPredicateTranslator.ColumnFieldSelectionReference(
            condition -> createPredicate(reference, condition));
    }

    @Override
    public boolean isMissing(final Class<? extends Reference<?>> reference) {
        return m_scopeFromReference.getScope(reference) == null;
    }

}
