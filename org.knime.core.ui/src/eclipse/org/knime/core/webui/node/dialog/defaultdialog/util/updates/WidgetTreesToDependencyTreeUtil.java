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
 *   Feb 12, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.util.updates;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.knime.core.util.Pair;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.tree.Tree;
import org.knime.core.webui.node.dialog.defaultdialog.widgettree.WidgetTreeFactory;

/**
 * A utility class for parsing all update interactions between different widgets from given settings classes.
 *
 * @author Paul Bärnreuther
 */
public final class WidgetTreesToDependencyTreeUtil {

    private WidgetTreesToDependencyTreeUtil() {
        // Utility
    }

    static Collection<TriggerVertex> widgetTreesToDependencyTree(final Collection<Tree<WidgetGroup>> widgetTrees) {
        final var valueRefsAndStateProviders =
            new WidgetTreesToValueRefsAndStateProviders().widgetTreesToValueRefsAndStateProviders(widgetTrees);
        return ValueRefsAndValueProvidersAndUiStateProvidersToDependencyTree
            .valueRefsAndStateProvidersToDependencyTree(valueRefsAndStateProviders);
    }

    /**
     * Only for tests (since WidgetTree is not exposed to testing)
     *
     * @param settingsClasses
     * @return the triggers building the dependency tree and the invocation handler for these triggers
     */
    public static Pair<List<TriggerAndDependencies>, TriggerInvocationHandler<Integer>>
        settingsToTriggersAndInvocationHandler(final Map<SettingsType, Class<? extends WidgetGroup>> settingsClasses) {
        final var widgetTreeFactory = new WidgetTreeFactory();
        final var widgetTrees = settingsClasses.entrySet().stream()
            .map(entry -> widgetTreeFactory.createTree(entry.getValue(), entry.getKey())).toList();
        return widgetTreesToTriggersAndInvocationHandler(widgetTrees);
    }

    /**
     * @param <T>
     * @param widgetTrees
     * @return a list of all triggers and their associated dependencies and an associated invocation handler.
     */
    public static <T> Pair<List<TriggerAndDependencies>, TriggerInvocationHandler<T>>
        widgetTreesToTriggersAndInvocationHandler(final Collection<Tree<WidgetGroup>> widgetTrees) {
        final var dependencyTree = widgetTreesToDependencyTree(widgetTrees);
        final var listOfTriggers = getTriggersWithDependencies(dependencyTree);
        return new Pair<>(listOfTriggers, new TriggerInvocationHandler<>(dependencyTree));
    }

    /**
     *
     * @param dependencyTree
     * @return a list of all triggers and their associated dependencies to be used for an initial declaration for the
     *         frontend
     */
    static List<TriggerAndDependencies> getTriggersWithDependencies(final Collection<TriggerVertex> dependencyTree) {
        final var triggerToDependencies = new TriggerToDependencies();
        return dependencyTree.stream()
            .map(trigger -> new TriggerAndDependencies(trigger, triggerToDependencies.triggerToDependencies(trigger)))
            .toList();
    }

}
