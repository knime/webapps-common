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
 *   Jan 23, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema;

import java.util.Collection;
import java.util.List;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsScopeUtil;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.tree.ArrayParentNode;
import org.knime.core.webui.node.dialog.defaultdialog.tree.Tree;
import org.knime.core.webui.node.dialog.defaultdialog.tree.TreeNode;
import org.knime.core.webui.node.dialog.defaultdialog.util.GenericTypeFinderUtil;
import org.knime.core.webui.node.dialog.defaultdialog.util.WidgetGroupTraverser;
import org.knime.core.webui.node.dialog.defaultdialog.util.WidgetGroupTraverser.TraversedField;
import org.knime.core.webui.node.dialog.defaultdialog.widget.handler.DeclaringDefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.widget.handler.DependencyHandler;

/**
 *
 * @author Paul Bärnreuther
 */
final class DependencyResolver {

    private final Collection<WidgetTreeNodeWithRootClass> m_fields;

    private final String m_scope;

    DependencyResolver(final TreeNode<WidgetGroup> node, final Collection<Tree<WidgetGroup>> rootWidgetTrees,
        final String scope) {

        m_fields = Stream
            .concat(rootWidgetTrees.stream(),
                node.getContainingArrayWidgetNodes().stream().map(ArrayParentNode<WidgetGroup>::getElementTree))
            .flatMap(widgetTree -> widgetTree.getWidgetNodes()
                .map(n -> new WidgetTreeNodeWithRootClass(n, widgetTree.getType())))
            .collect(Collectors.toSet());

        m_scope = scope;
    }

    record WidgetTreeNodeWithRootClass(TreeNode<WidgetGroup> node, Class<? extends WidgetGroup> rootClass) {

        private String getScope() {
            return JsonFormsScopeUtil.toScope(node);
        }
    }

    void addDependencyScopes(final Class<? extends DependencyHandler<?>> dependencyHandlerClass,
        final Consumer<String> addDependency) {
        final var dependencyClass =
            (Class<?>)GenericTypeFinderUtil.getFirstGenericType(dependencyHandlerClass, DependencyHandler.class);
        final var traverser = new WidgetGroupTraverser(dependencyClass);
        final Consumer<TraversedField> addNewDependency = getAddNewDependencyCallback(addDependency);
        traverser.traverse(addNewDependency, List.of(DeclaringDefaultNodeSettings.class));
    }

    private Consumer<TraversedField> getAddNewDependencyCallback(final Consumer<String> addDependency) {
        return field -> {
            final var searchScope = JsonFormsScopeUtil.toScope(field.path());
            final var declaringDefaultNodeSettings = field.trackedAnnotations()
                .getInstance(DeclaringDefaultNodeSettings.class).map(DeclaringDefaultNodeSettings::value).orElse(null);
            final var clazz = field.propertyWriter().getType().getRawClass();
            final var targetScope = findTargetScope(searchScope, declaringDefaultNodeSettings, clazz);
            /**
             * exclude the field itself to enable using the current DefaultNodeSettings as the dependencies class to get
             * a dependency from every other setting.
             */
            if (!targetScope.equals(m_scope)) {
                addDependency.accept(targetScope);
            }
        };
    }

    private String findTargetScope(final String searchScope,
        final Class<? extends DefaultNodeSettings> declaringDefaultNodeSettings, final Class<?> clazz) {
        final var candidates = m_fields.stream().filter(control -> {
            if (declaringDefaultNodeSettings != null && !control.rootClass().equals(declaringDefaultNodeSettings)) {
                return false;
            }
            boolean classEquals = control.node().getType().equals(clazz);
            boolean matchesSearchPath = control.getScope().endsWith(searchScope);
            return classEquals && matchesSearchPath;
        }).map(WidgetTreeNodeWithRootClass::getScope).toList();
        if (candidates.size() > 1) {
            throw new UiSchemaGenerationException(
                String.format("Multiple settings found for path %s. Consider using @DeclaringDefaultNodeSettings to "
                    + "disambiguate the reference.", searchScope));
        }
        return candidates.stream().findFirst().orElseThrow(
            () -> new UiSchemaGenerationException(String.format("No setting found for path %s.", searchScope)));
    }
}
