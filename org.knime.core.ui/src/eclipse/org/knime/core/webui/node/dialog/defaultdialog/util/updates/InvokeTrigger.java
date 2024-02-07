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
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.function.Supplier;
import java.util.stream.Collectors;

import org.knime.core.webui.node.dialog.defaultdialog.util.updates.Vertex.VertexVisitor;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Action;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Action.ActionInitializer;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueId;

public final class InvokeTrigger {

    private Map<Vertex, Object> m_cache = new HashMap<>();

    private final Function<Class<? extends ValueId>, Object> m_dependencyProvider;

    public InvokeTrigger(final Function<Class<? extends ValueId>, Object> dependencyProvider) {
        m_dependencyProvider = dependencyProvider;
    }

    public Map<UpdateVertex, Object> invokeTrigger(final TriggerVertex trigger) {
        final var updateVertices = trigger.visit(new GetTriggeredUpdatesVisitor());
        return updateVertices.stream().collect(Collectors.toUnmodifiableMap(Function.identity(),
            updateVertex -> updateVertex.visit(new GetValueVisitor())));
    }

    private final class GetTriggeredUpdatesVisitor implements VertexVisitor<Collection<UpdateVertex>> {

        @Override
        public Collection<UpdateVertex> accept(final UpdateVertex updateVertex) {
            return Set.of(updateVertex);
        }

        @Override
        public Collection<UpdateVertex> acceptDefault(final Vertex vertex) {
            return vertex.getChildren().stream().flatMap(c -> c.visit(this).stream())
                .collect(Collectors.toUnmodifiableSet());
        }

    }

    private static ActionVertex getParentActionVertex(final Vertex vertex, final Class<? extends Action> actionClass) {
        final var getParentActionVertexVisitor = new VertexVisitor<ActionVertex>() {
            @Override
            public ActionVertex accept(final ActionVertex actionVertex) {
                if (actionVertex.getActionClass().equals(actionClass)) {
                    return actionVertex;
                }
                return null;
            }
        };
        return vertex.getParents().stream().map(parent -> parent.visit(getParentActionVertexVisitor))
            .filter(Objects::nonNull).findAny().orElseThrow();
    }

    private static DependencyVertex getParentDependencyVertex(final Vertex vertex,
        final Class<? extends ValueId<?>> valueId) {
        final var getParentDependencyVertexVisitor = new VertexVisitor<DependencyVertex>() {
            @Override
            public DependencyVertex accept(final DependencyVertex dependencyVertex) {
                if (dependencyVertex.getValueId().equals(valueId)) {
                    return dependencyVertex;
                }
                return null;
            }
        };
        return vertex.getParents().stream().map(parent -> parent.visit(getParentDependencyVertexVisitor))
            .filter(Objects::nonNull).findAny().orElseThrow();
    }

    private final class GetValueVisitor implements VertexVisitor<Object> {

        @Override
        public Object accept(final ActionVertex actionVertex) {
            if (!m_cache.containsKey(actionVertex)) {
                m_cache.put(actionVertex, this.invokeAction(actionVertex));
            }
            return m_cache.get(actionVertex);

        }

        private Object invokeAction(final ActionVertex actionVertex) {
            final var actionInitializer = new ActionInitializer() {

                @Override
                public <T> void setOnChangeTrigger(final Class<? extends ValueId<T>> id) {
                    // Nothing to do here
                }

                @Override
                public <T> Supplier<T> dependOnValueWhichIsNotATrigger(final Class<? extends ValueId<T>> id) {
                    return vertexToSupplier(getParentDependencyVertex(actionVertex, id));
                }

                @Override
                public <T> Supplier<T> dependOnChangedValue(final Class<? extends ValueId<T>> id) {
                    return vertexToSupplier(getParentDependencyVertex(actionVertex, id));
                }

                @Override
                public <T> Supplier<T> continueOtherAction(final Class<? extends Action<T>> actionClass) {
                    return vertexToSupplier(getParentActionVertex(actionVertex, actionClass));
                }

                @SuppressWarnings("unchecked")
                private <T> Supplier<T> vertexToSupplier(final Vertex vertex) {
                    return () -> (T)vertex.visit(new GetValueVisitor());
                }
            };
            final var action = actionVertex.getAction();
            action.init(actionInitializer);
            return action.compute();
        }

        @Override
        public Object accept(final DependencyVertex dependencyVertex) {
            return m_cache.computeIfAbsent(dependencyVertex,
                _v -> m_dependencyProvider.apply(dependencyVertex.getValueId()));
        }

        @Override
        public Object accept(final UpdateVertex updateVertex) {
            return getParentActionVertex(updateVertex, updateVertex.getActionClass()).visit(this);
        }

    }
}
