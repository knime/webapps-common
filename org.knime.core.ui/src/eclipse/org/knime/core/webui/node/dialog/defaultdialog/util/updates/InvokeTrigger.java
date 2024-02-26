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

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.Vertex.VertexVisitor;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ButtonRef;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.StateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.StateProvider.StateProviderInitializer;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueRef;

/**
 * This class is used to convert a trigger to a map indexed by its triggered updates.
 *
 * @author Paul Bärnreuther
 */
final class InvokeTrigger {

    private Map<Vertex, Object> m_cache = new HashMap<>();

    private final Function<Class<? extends ValueRef>, Object> m_dependencyProvider;

    private final DefaultNodeSettingsContext m_context;

    /**
     *
     * @param dependencyProvider providing the values of all {@link ValueRef} dependencies that the triggered state
     *            providers will depend on.
     * @param context the context provided to triggered state providers
     */
    InvokeTrigger(final Function<Class<? extends ValueRef>, Object> dependencyProvider,
        final DefaultNodeSettingsContext context) {
        m_dependencyProvider = dependencyProvider;
        m_context = context;
    }

    /**
     * This class is used to convert a trigger to a map indexed by its triggered updates.
     *
     * @param trigger
     * @return a mapping from updated vertex to its associated state
     */
    public Map<UpdateVertex, Object> invokeTrigger(final TriggerVertex trigger) {
        final var updateVertices = trigger.visit(new GetTriggeredUpdatesVisitor());
        final Map<UpdateVertex, Object> updateVertexToValue = new HashMap<>();
        for (var updateVertex : updateVertices) {
            updateVertexToValue.put(updateVertex, updateVertex.visit(new ComputeVisitor()));
        }
        return updateVertexToValue;
    }

    private static final class GetTriggeredUpdatesVisitor implements VertexVisitor<Collection<UpdateVertex>> {

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

    private static StateVertex getParentStateVertex(final Vertex vertex,
        final Class<? extends StateProvider> stateProviderClass) {
        final var getParentStateVertexVisitor = new VertexVisitor<StateVertex>() {
            @Override
            public StateVertex accept(final StateVertex stateVertex) {
                if (stateVertex.getStateProviderClass().equals(stateProviderClass)) {
                    return stateVertex;
                }
                return null;
            }
        };
        return vertex.getParents().stream().map(parent -> parent.visit(getParentStateVertexVisitor))
            .filter(Objects::nonNull).findAny().orElseThrow();
    }

    private static DependencyVertex getParentDependencyVertex(final Vertex vertex,
        final Class<? extends ValueRef<?>> valueRef) {
        final var getParentDependencyVertexVisitor = new VertexVisitor<DependencyVertex>() {
            @Override
            public DependencyVertex accept(final DependencyVertex dependencyVertex) {
                if (dependencyVertex.getValueRef().equals(valueRef)) {
                    return dependencyVertex;
                }
                return null;
            }
        };
        return vertex.getParents().stream().map(parent -> parent.visit(getParentDependencyVertexVisitor))
            .filter(Objects::nonNull).findAny().orElseThrow();
    }

    private final class ComputeVisitor implements VertexVisitor<Object> {

        /**
         * The initializer handed into a state provider for invocation
         *
         * @author Paul Bärnreuther
         */
        private final class StateProviderInvocationInitializer implements StateProviderInitializer {

            private final StateVertex m_stateVertex;

            /**
             * @param stateVertex the vertex whose state provider is to be initialized
             */
            private StateProviderInvocationInitializer(final StateVertex stateVertex) {
                m_stateVertex = stateVertex;
            }

            @Override
            public <T> void computeOnValueChange(final Class<? extends ValueRef<T>> id) {
                // Nothing to do here during invocation
            }

            @Override
            public void computeOnButtonClick(final Class<? extends ButtonRef> trigger) {
                // Nothing to do here during invocation
            }

            @Override
            public void computeBeforeOpenDiaog() {
                // Nothing to do here during invocation

            }

            @Override
            public void computeAfterOpenDialog() {
                // Nothing to do here during invocation

            }

            @Override
            public <T> Supplier<T> getValueSupplier(final Class<? extends ValueRef<T>> id) {
                return vertexToSupplier(getParentDependencyVertex(m_stateVertex, id));
            }

            @Override
            public <T> Supplier<T> computeFromValueSupplier(final Class<? extends ValueRef<T>> id) {
                return vertexToSupplier(getParentDependencyVertex(m_stateVertex, id));
            }

            @Override
            public <T> Supplier<T>
                computeFromProvidedState(final Class<? extends StateProvider<T>> stateProviderClass) {
                return vertexToSupplier(getParentStateVertex(m_stateVertex, stateProviderClass));
            }

            @SuppressWarnings("unchecked")
            private <T> Supplier<T> vertexToSupplier(final Vertex vertex) {
                return () -> (T)vertex.visit(new ComputeVisitor());
            }
        }

        @Override
        public Object accept(final StateVertex stateVertex) {
            if (!m_cache.containsKey(stateVertex)) {
                m_cache.put(stateVertex, this.computeState(stateVertex));
            }
            return m_cache.get(stateVertex);

        }

        private Object computeState(final StateVertex stateVertex) {
            final var initializer = new StateProviderInvocationInitializer(stateVertex);
            final var stateProvider = stateVertex.getStateProvider();
            stateProvider.init(initializer);
            return stateProvider.computeState(m_context);
        }

        @Override
        public Object accept(final DependencyVertex dependencyVertex) {
            return m_cache.computeIfAbsent(dependencyVertex,
                v -> m_dependencyProvider.apply(dependencyVertex.getValueRef()));
        }

        @Override
        public Object accept(final UpdateVertex updateVertex) {
            return getParentStateVertex(updateVertex, updateVertex.getStateProviderClass()).visit(this);
        }

    }
}
