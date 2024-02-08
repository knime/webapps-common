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

import org.knime.core.webui.node.dialog.defaultdialog.util.updates.SettingsClassesToValueIdsAndUpdates.UpdateWrapper;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.SettingsClassesToValueIdsAndUpdates.ValueIdWrapper;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.SettingsClassesToValueIdsAndUpdates.ValueIdsAndUpdates;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.Vertex.VertexVisitor;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Action;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ButtonTrigger;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueId;

/**
 *
 * @author Paul Bärnreuther
 */
public class ValueIdsAndUpdatesToDependencyTree {

    private ValueIdsAndUpdatesToDependencyTree() {
        // Utility
    }

    /**
     * Converts collected valueIds and updates to a tree structure connecting these
     *
     * @param valueIdsAndUpdates collected from settings
     * @return the trigger vertices of the resulting tree of vertices
     */
    public static Collection<TriggerVertex>
        valueIdsAndUpdatesToDependencyTree(final ValueIdsAndUpdates valueIdsAndUpdates) {
        return new DependencyTreeCreator(valueIdsAndUpdates).getTriggerVertices();
    }

    static final class DependencyTreeCreator {

        private final Collection<UpdateWrapper> m_updates;

        private final Map<Class<? extends Action>, ActionVertex> m_actionVertices = new HashMap<>();

        private final Map<Class<?>, TriggerVertex> m_triggerVertices = new HashMap<>();

        private final Map<Class<? extends ValueId>, DependencyVertex> m_dependencyVertices = new HashMap<>();

        private final Set<Vertex> m_visited = new HashSet<>();

        private final Queue<Vertex> m_queue = new ArrayDeque<>();

        private final Collection<ValueIdWrapper> m_valueIds;

        DependencyTreeCreator(final ValueIdsAndUpdates valueIdsAndUpdates) {
            m_valueIds = valueIdsAndUpdates.valueIds();
            m_updates = valueIdsAndUpdates.updates();
        }

        Collection<TriggerVertex> getTriggerVertices() {
            m_updates.forEach(update -> {
                addToQueue(new UpdateVertex(update));
            });
            while (!m_queue.isEmpty()) {
                addParentsForVertex(m_queue.poll());
            }
            return m_triggerVertices.values();
        }

        private void addParentsForVertex(final Vertex vertex) {
            m_visited.add(vertex);
            final var parentVertices = vertex.visit(new ParentVerticesVisitor());
            parentVertices.forEach(vertex::addParent);
            parentVertices.forEach(this::addToQueue);
        }

        void addToQueue(final Vertex vertex) {
            if (!m_visited.contains(vertex)) {
                m_queue.add(vertex);
            }
        }

        final class ParentVerticesVisitor implements VertexVisitor<Collection<Vertex>> {

            ActionVertex getActionVertex(final Class<? extends Action> actionClass) {
                return m_actionVertices.computeIfAbsent(actionClass, ActionVertex::new);
            }

            TriggerVertex getValueTriggerVertex(final Class<? extends ValueId> valueId) {
                final var valueIdWrapper = findValueIdWrapper(valueId);
                return m_triggerVertices.computeIfAbsent(valueId, v -> new TriggerVertex(valueIdWrapper));
            }

            TriggerVertex getButtonTriggerVertex(final Class<? extends ButtonTrigger> trigger) {
                return m_triggerVertices.computeIfAbsent(trigger, v -> new TriggerVertex(trigger));
            }

            DependencyVertex getDependencyVertex(final Class<? extends ValueId> valueId) {
                final var valueIdWrapper = findValueIdWrapper(valueId);
                return m_dependencyVertices.computeIfAbsent(valueId, v -> new DependencyVertex(valueIdWrapper));
            }

            private ValueIdWrapper findValueIdWrapper(final Class<? extends ValueId> valueId) {
                return m_valueIds.stream().filter(wrapper -> wrapper.valueId().equals(valueId)).findAny().orElseThrow();
            }

            /**
             * Receives or creates the {@link ActionVertex} for the associated action and sets it as parent.
             */
            @Override
            public Collection<Vertex> accept(final UpdateVertex updateVertex) {
                final var actionClass = updateVertex.getActionClass();
                return Set.of(getActionVertex(actionClass));
            }

            /**
             * Receives or creates vertices for the dependencies of the action and sets them as parent.
             */
            @Override
            public Collection<Vertex> accept(final ActionVertex actionVertex) {
                final var action = actionVertex.getAction();
                final var actionDependencyReceiver = new ActionDependencyReceiver();
                action.init(actionDependencyReceiver);

                final Collection<Vertex> parentVertices = new HashSet<>();

                parentVertices
                    .addAll(actionDependencyReceiver.getActions().stream().map(this::getActionVertex).toList());
                parentVertices
                    .addAll(actionDependencyReceiver.getTriggers().stream().map(this::getValueTriggerVertex).toList());
                parentVertices.addAll(
                    actionDependencyReceiver.getButtonTriggers().stream().map(this::getButtonTriggerVertex).toList());
                parentVertices.addAll(
                    actionDependencyReceiver.getDependencies().stream().map(this::getDependencyVertex).toList());
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
     * The action initializer used during constructions to document the dependencies of the action
     *
     * @author Paul Bärnreuther
     */
    static final class ActionDependencyReceiver implements Action.ActionInitializer {

        private final Collection<Class<? extends ValueId>> m_triggers = new HashSet<>();

        private final Collection<Class<? extends ButtonTrigger>> m_buttonTriggers = new HashSet<>();

        private final Collection<Class<? extends ValueId>> m_dependencies = new HashSet<>();

        private final Collection<Class<? extends Action>> m_actions = new HashSet<>();

        @Override
        public <T> Supplier<T> dependOnChangedValue(final Class<? extends ValueId<T>> id) {
            getTriggers().add(id);
            getDependencies().add(id);
            return null;
        }

        @Override
        public <T> Supplier<T> dependOnValueWhichIsNotATrigger(final Class<? extends ValueId<T>> id) {
            getDependencies().add(id);
            return null;
        }

        @Override
        public <T> void setOnChangeTrigger(final Class<? extends ValueId<T>> id) {
            getTriggers().add(id);
        }

        @Override
        public void setButtonTrigger(final Class<? extends ButtonTrigger> trigger) {
            getButtonTriggers().add(trigger);

        }

        @Override
        public <T> Supplier<T> continueOtherAction(final Class<? extends Action<T>> actionClass) {
            getActions().add(actionClass);
            return null;
        }

        Collection<Class<? extends ValueId>> getTriggers() {
            return m_triggers;
        }

        Collection<Class<? extends ButtonTrigger>> getButtonTriggers() {
            return m_buttonTriggers;
        }

        Collection<Class<? extends ValueId>> getDependencies() {
            return m_dependencies;
        }

        Collection<Class<? extends Action>> getActions() {
            return m_actions;
        }

    }

}
