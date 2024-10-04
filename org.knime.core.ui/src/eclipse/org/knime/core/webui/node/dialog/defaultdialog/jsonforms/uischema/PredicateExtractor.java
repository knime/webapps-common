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
 *   Apr 3, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.tree.Tree;
import org.knime.core.webui.node.dialog.defaultdialog.tree.TreeNode;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Predicate;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.PredicateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.PredicateProvider.PredicateInitializer;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueReference;

/**
 * Extracts references from widget trees to enable creating predicates from predicate providers.
 *
 * @author Paul Bärnreuther
 */
final class PredicateExtractor {

    private final DefaultNodeSettingsContext m_context;

    private final PredicateInitializer m_predicateInitializer;

    /**
     * @param widgetTrees to extract references from
     * @param context the node's context (inputs, flow vars)
     */
    PredicateExtractor(final Collection<Tree<WidgetGroup>> widgetTrees, final DefaultNodeSettingsContext context) {
        m_context = context;
        m_predicateInitializer = getPredicateInitializer(widgetTrees);
    }

    /**
     * @param widgetTree to extract references from
     * @param context the node's context (inputs, flow vars)
     */
    PredicateExtractor(final Tree<WidgetGroup> widgetTree, final DefaultNodeSettingsContext context) {
        this(List.of(widgetTree), context);
    }

    private PredicateInitializer getPredicateInitializer(final Collection<Tree<WidgetGroup>> widgetTrees) {
        return new DefaultPredicateInitializer(getReferences(widgetTrees)::get, m_context);
    }

    private static Map<Class<?>, TreeNode<WidgetGroup>> getReferences(final Collection<Tree<WidgetGroup>> widgetTrees) {
        final Map<Class<?>, TreeNode<WidgetGroup>> references = new HashMap<>();
        widgetTrees.stream().flatMap(Tree<WidgetGroup>::getWidgetAndWidgetTreeNodes)
            .forEach(node -> addReference(references, node));
        return references;
    }

    private static void addReference(final Map<Class<?>, TreeNode<WidgetGroup>> references,
        final TreeNode<WidgetGroup> node) {
        node.getAnnotation(ValueReference.class).map(ValueReference::value)
            .ifPresent(referenceClass -> references.put(referenceClass, node));
    }

    Predicate createPredicate(final Class<? extends PredicateProvider> predicateProviderClass) {
        return m_predicateInitializer.getPredicate(predicateProviderClass);
    }

    Predicate createPredicate(final PredicateProvider predicateProvider) {
        return m_predicateInitializer.getPredicate(predicateProvider);
    }

}
