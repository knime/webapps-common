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
 *   Feb 6, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.util.updates;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.knime.core.webui.node.dialog.defaultdialog.util.updates.Vertex.VertexVisitor;

/**
 * A utility class (not static because of caches) to receive the depenencies that will be needed when resolving the
 * updates triggered by a specific trigger. We need this information during construction time, since we need to give
 * that information to the frontend.
 *
 * @author Paul Bärnreuther
 */
public class TriggerToDependencies {

    /**
     * @param trigger
     * @return the all ancestor dependencies of all descendant updates of this trigger.
     */
    public Collection<DependencyVertex> triggerToDependencies(final TriggerVertex trigger) {
        return getDescendantDependenciesFor(trigger);
    }

    private final Map<Vertex, Collection<DependencyVertex>> m_descendantsCache = new HashMap<>();

    Collection<DependencyVertex> getDescendantDependenciesFor(final Vertex vertex) {
        if (!m_descendantsCache.containsKey(vertex)) {
            m_descendantsCache.put(vertex, vertex.visit(new DescendantDependenciesVisitor()));
        }
        return m_descendantsCache.get(vertex);
    }

    class DescendantDependenciesVisitor implements VertexVisitor<Collection<DependencyVertex>> {

        /**
         * Get the ancestor dependencies of the update
         */
        @Override
        public Collection<DependencyVertex> accept(final UpdateVertex updateVertex) {
            return getAncestorDependenciesFor(updateVertex);

        }

        @Override
        public Collection<DependencyVertex> acceptDefault(final Vertex vertex) {
            return vertex.getChildren().stream().flatMap(p -> getDescendantDependenciesFor(p).stream())
                .collect(Collectors.toSet());
        }

    }

    private final Map<Vertex, Collection<DependencyVertex>> m_ancestorsCache = new HashMap<>();

    Collection<DependencyVertex> getAncestorDependenciesFor(final Vertex vertex) {
        if (!m_ancestorsCache.containsKey(vertex)) {
            m_ancestorsCache.put(vertex, vertex.visit(new AncestorDependenciesVisitor()));
        }
        return m_ancestorsCache.get(vertex);
    }

    class AncestorDependenciesVisitor implements VertexVisitor<Collection<DependencyVertex>> {

        Set<DependencyVertex> getParentDependencies(final Vertex vertex) {
            return vertex.getParents().stream().flatMap(p -> getAncestorDependenciesFor(p).stream())
                .collect(Collectors.toSet());
        }

        /**
         * Return the dependency itself
         */
        @Override
        public Collection<DependencyVertex> accept(final DependencyVertex dependencyVertex) {
            return Set.of(dependencyVertex);
        }

        @Override
        public Collection<DependencyVertex> acceptDefault(final Vertex vertex) {
            return getParentDependencies(vertex);
        }

    }

}
