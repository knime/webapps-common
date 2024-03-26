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

import java.util.ArrayDeque;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Queue;
import java.util.Set;
import java.util.function.Supplier;
import java.util.stream.Stream;

import org.knime.core.node.util.CheckUtils;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.SettingsClassesToValueRefsAndStateProviders.ValueProviderWrapper;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.SettingsClassesToValueRefsAndStateProviders.ValueRefWrapper;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.SettingsClassesToValueRefsAndStateProviders.ValueRefsAndStateProviders;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.Vertex.VertexVisitor;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ButtonReference;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.StateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Reference;

final class ValueRefsAndValueProvidersAndUiStateProvidersToDependencyTree {

    private ValueRefsAndValueProvidersAndUiStateProvidersToDependencyTree() {
        // Utility
    }

    /**
     * Converts collected valueRefs and state providers to a tree structure connecting these
     *
     * @param valueRefsAndStateProviders collected from settings
     * @return the trigger vertices of the resulting tree of vertices
     */
    static Collection<TriggerVertex>
        valueRefsAndStateProvidersToDependencyTree(final ValueRefsAndStateProviders valueRefsAndStateProviders) {
        return new DependencyTreeCreator(valueRefsAndStateProviders).getTriggerVertices();
    }

    private static final class DependencyTreeCreator {

        private final Collection<ValueProviderWrapper> m_valueProviders;

        private final Map<Class<? extends StateProvider>, StateVertex> m_stateVertices = new HashMap<>();

        private final Map<Class<?>, TriggerVertex> m_triggerVertices = new HashMap<>();

        /**
         * Special-role static triggers like "before the dialog is opened"
         */
        private final Map<String, TriggerVertex> m_specialTriggerVertices = new HashMap<>();

        private final Map<Class<? extends Reference>, DependencyVertex> m_dependencyVertices = new HashMap<>();

        private final Set<Vertex> m_visited = new HashSet<>();

        private final Queue<Vertex> m_queue = new ArrayDeque<>();

        private final Collection<ValueRefWrapper> m_valueRefs;

        private final Collection<Class<? extends StateProvider>> m_uiStateProviders;

        DependencyTreeCreator(final ValueRefsAndStateProviders valueRefsAndStateProviders) {
            m_valueRefs = valueRefsAndStateProviders.valueRefs();
            m_valueProviders = valueRefsAndStateProviders.valueProviders();
            m_uiStateProviders = valueRefsAndStateProviders.uiStateProviders();
        }

        Collection<TriggerVertex> getTriggerVertices() {
            collectVertices();
            return Stream.concat(m_triggerVertices.values().stream(), m_specialTriggerVertices.values().stream())
                .toList();
        }

        private void collectVertices() {
            m_valueProviders.forEach(update -> addToQueue(new UpdateVertex(update)));
            m_uiStateProviders.forEach(update -> addToQueue(new UpdateVertex(update)));
            while (!m_queue.isEmpty()) {
                addParentsForVertex(m_queue.poll());
            }
        }

        private void addParentsForVertex(final Vertex vertex) {
            m_visited.add(vertex);
            final var parentVertices = vertex.visit(new GetParentVerticesVisitor());
            parentVertices.forEach(vertex::addParent);
            parentVertices.forEach(this::addToQueue);
        }

        private void addToQueue(final Vertex vertex) {
            if (!m_visited.contains(vertex)) {
                m_queue.add(vertex);
            }
        }

        private final class GetParentVerticesVisitor implements VertexVisitor<Collection<Vertex>> {

            StateVertex getStateVertex(final Class<? extends StateProvider> stateProviderClass) {
                return m_stateVertices.computeIfAbsent(stateProviderClass, StateVertex::new);
            }

            TriggerVertex getValueTriggerVertex(final Class<? extends Reference> valueRef) {
                final var valueRefWrapper = findValueRefWrapper(valueRef);
                return m_triggerVertices.computeIfAbsent(valueRef, v -> new TriggerVertex(valueRefWrapper));
            }

            TriggerVertex getButtonTriggerVertex(final Class<? extends ButtonReference> buttonRef) {
                return m_triggerVertices.computeIfAbsent(buttonRef, v -> new TriggerVertex(buttonRef));
            }

            TriggerVertex getBeforeOpenDialogVertex() {
                return m_specialTriggerVertices.computeIfAbsent(TriggerVertex.BEFORE_OPEN_DIALOG_ID,
                    TriggerVertex::new);
            }

            TriggerVertex getAfterOpenDialogVertex() {
                return m_specialTriggerVertices.computeIfAbsent(TriggerVertex.AFTER_OPEN_DIALOG_ID, TriggerVertex::new);
            }

            DependencyVertex getDependencyVertex(final Class<? extends Reference> valueRef) {
                final var valueRefWrapper = findValueRefWrapper(valueRef);
                return m_dependencyVertices.computeIfAbsent(valueRef, v -> new DependencyVertex(valueRefWrapper));
            }

            private ValueRefWrapper findValueRefWrapper(final Class<? extends Reference> valueRef) {
                return m_valueRefs.stream().filter(wrapper -> wrapper.valueRef().equals(valueRef)).findAny()
                    .orElseThrow(() -> new RuntimeException(
                        String.format("The value reference %s is used in a state provider but could not be found. "
                            + "It should used as valueRef for a widget.", valueRef.getSimpleName())));
            }

            /**
             * Receives or creates the {@link StateVertex} for the associated state provider and sets it as parent.
             */
            @Override
            public Collection<Vertex> accept(final UpdateVertex updateVertex) {
                final var stateProviderClass = updateVertex.getStateProviderClass();
                return Set.of(getStateVertex(stateProviderClass));
            }

            /**
             * Receives or creates vertices for the dependencies of the state provider and sets them as parent.
             */
            @Override
            public Collection<Vertex> accept(final StateVertex stateVertex) {
                final var stateProvider = stateVertex.getStateProvider();
                CheckUtils.checkNotNull(stateProvider, "Failed to instantiate state provider class %s.",
                    stateVertex.getStateProviderClass());
                final var stateProviderDependencyReceiver = new StateProviderDependencyReceiver();
                stateProvider.init(stateProviderDependencyReceiver);

                final Collection<Vertex> parentVertices = new HashSet<>();

                parentVertices.addAll(
                    stateProviderDependencyReceiver.getStateProviders().stream().map(this::getStateVertex).toList());
                parentVertices.addAll(stateProviderDependencyReceiver.getValueRefTriggers().stream()
                    .map(this::getValueTriggerVertex).toList());
                parentVertices.addAll(stateProviderDependencyReceiver.getButtonRefTriggers().stream()
                    .map(this::getButtonTriggerVertex).toList());
                parentVertices.addAll(
                    stateProviderDependencyReceiver.getDependencies().stream().map(this::getDependencyVertex).toList());
                if (stateProviderDependencyReceiver.m_computeBeforeOpenDialog) {
                    parentVertices.add(getBeforeOpenDialogVertex());
                }
                if (stateProviderDependencyReceiver.m_computeAfterOpenDialog) {
                    parentVertices.add(getAfterOpenDialogVertex());
                }
                return parentVertices;
            }

            @Override
            public Collection<Vertex> acceptDefault(final Vertex vertex) {
                // No parents. A trigger or a dependency can't have a parent itself.
                return new HashSet<>();
            }

        }
    }

    /**
     * The state provider initializer used during constructions to document dependencies and triggers
     *
     * @author Paul Bärnreuther
     */
    private static final class StateProviderDependencyReceiver implements StateProvider.StateProviderInitializer {

        private final Collection<Class<? extends Reference>> m_valueRefTriggers = new HashSet<>();

        private final Collection<Class<? extends ButtonReference>> m_buttonRefTriggers = new HashSet<>();

        private final Collection<Class<? extends Reference>> m_dependencies = new HashSet<>();

        private final Collection<Class<? extends StateProvider>> m_stateProviders = new HashSet<>();

        boolean m_computeBeforeOpenDialog;

        boolean m_computeAfterOpenDialog;

        @Override
        public <T> Supplier<T> computeFromValueSupplier(final Class<? extends Reference<T>> id) {
            getValueRefTriggers().add(id);
            getDependencies().add(id);
            return null;
        }

        @Override
        public <T> Supplier<T> getValueSupplier(final Class<? extends Reference<T>> id) {
            getDependencies().add(id);
            return null;
        }

        @Override
        public <T> void computeOnValueChange(final Class<? extends Reference<T>> id) {
            getValueRefTriggers().add(id);
        }

        @Override
        public void computeOnButtonClick(final Class<? extends ButtonReference> trigger) {
            getButtonRefTriggers().add(trigger);

        }

        @Override
        public <T> Supplier<T> computeFromProvidedState(final Class<? extends StateProvider<T>> stateProviderClass) {
            getStateProviders().add(stateProviderClass);
            return null;
        }

        @Override
        public void computeBeforeOpenDialog() {
            m_computeBeforeOpenDialog = true;
        }

        @Override
        public void computeAfterOpenDialog() {
            m_computeAfterOpenDialog = true;
        }

        Collection<Class<? extends Reference>> getValueRefTriggers() {
            return m_valueRefTriggers;
        }

        Collection<Class<? extends ButtonReference>> getButtonRefTriggers() {
            return m_buttonRefTriggers;
        }

        Collection<Class<? extends Reference>> getDependencies() {
            return m_dependencies;
        }

        Collection<Class<? extends StateProvider>> getStateProviders() {
            return m_stateProviders;
        }

    }

}
