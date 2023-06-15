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
 *   Apr 17, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.UiSchemaDefaultNodeSettingsTraverser.JsonFormsControl;
import org.knime.core.webui.node.dialog.defaultdialog.layout.After;
import org.knime.core.webui.node.dialog.defaultdialog.layout.Before;
import org.knime.core.webui.node.dialog.defaultdialog.layout.Inside;

/**
 * A representation of a layout part class which is used in {@link LayoutTree} to determine the structure between all
 * layout parts.
 *
 * @author Paul Bärnreuther
 */
final class LayoutTreeNode {
    private final Class<?> m_value;

    private final Collection<LayoutTreeNode> m_isAfter = new HashSet<>();

    private final Collection<LayoutTreeNode> m_isBefore = new HashSet<>();

    private PointsToUpdater m_pointsToUpdater = new PointsToUpdater(new HashSet<>());

    /**
     * A wrapper class for a collection of layout tree nodes which the node points to. When any node pointed to by this
     * node points to a new node itself, this new node is also added here.
     *
     * @author Paul Bärnreuther
     */
    private static class PointsToUpdater {

        private Collection<LayoutTreeNode> m_pointers;

        private Collection<PointsToUpdater> m_synced;

        public PointsToUpdater(final Collection<LayoutTreeNode> value) {
            m_pointers = value;
            m_synced = new HashSet<>();
        }

        /**
         * Instead of pointing to the target, this method just makes sure that the two updaters always yield the same
         * values.
         *
         * @param target
         */
        void syncWith(final LayoutTreeNode target) {
            var targetPointTo = target.getPointsToUpdater();

            // sync for the moment
            addNewPointers(targetPointTo.get());
            targetPointTo.addNewPointers(get());

            // make sure that they stay in sync forever
            this.addListener(targetPointTo);
            targetPointTo.addListener(this);
        }

        private void addListener(final PointsToUpdater targetUpdater) {
            m_synced.add(targetUpdater);
        }

        /**
         * Points to a new target with a different parent for this updater and all that are in sync with it.
         *
         * @param target
         */
        void pointTo(final LayoutTreeNode target) {
            addNewPointers(List.of(target));
        }

        private void addNewPointers(final Collection<LayoutTreeNode> newValues) {
            var valuesSize = m_pointers.size();
            m_pointers.addAll(newValues);
            if (valuesSize < m_pointers.size()) {
                m_synced.forEach(listener -> listener.addNewPointers(newValues));
            }
        }

        Collection<LayoutTreeNode> get() {
            return m_pointers;
        }

    }

    private final List<JsonFormsControl> m_controls = new ArrayList<>(0);

    private Collection<LayoutTreeNode> m_children;

    private LayoutTreeNode m_parent;

    private Collection<LayoutTreeNode> m_leaves;

    LayoutTreeNode(final Class<?> value) {
        m_value = value;
        m_children = new HashSet<>();
    }

    public Collection<LayoutTreeNode> getChildren() {
        return m_children;
    }

    /**
     * @return the layout part class that is represented by this tree
     */
    public Class<?> getValue() {
        return m_value;
    }

    /**
     * @return the {@link JsonFormsControl}s that are associated with this layout part
     */
    public List<JsonFormsControl> getControls() {
        return m_controls;
    }

    void addControls(final List<JsonFormsControl> controls) {
        m_controls.addAll(controls);
    }

    /**
     * Add a simple arrow from this node to the given node. The arrow indicates that this node is before the
     * <code>inBack</code> node.
     *
     * @param inBack the node that comes after this node
     */
    void addArrowTo(final LayoutTreeNode inBack) {
        inBack.m_isAfter.add(this);
        this.m_isBefore.add(inBack);
    }

    private LayoutTreeNode getParent() {
        return m_parent;
    }

    /**
     * @return whether the node has a parent.
     */
    boolean isRoot() {
        return getParent() == null;
    }

    /**
     * @return whether the node or any of its descendants contains controls
     */
    boolean hasContent() {
        return !getControls().isEmpty() || getChildren().stream().anyMatch(LayoutTreeNode::hasContent);
    }

    private PointsToUpdater getPointsToUpdater() {
        return m_pointsToUpdater;
    }

    /**
     * A node points to another node if it targets it with an {@link After}, {@link Before} or {@link Inside}
     * annotation. At a later point the parents of these targets replace the parent of this node.
     *
     * @param target
     */
    void pointToAsSibling(final LayoutTreeNode target) {
        var areNestSiblings = m_parent != null && target.getParent() == m_parent;
        if (areNestSiblings) {
            getPointsToUpdater().syncWith(target);
        } else {
            if (m_value.isNestmateOf(target.getValue())) {
                throw new UiSchemaGenerationException(String.format(
                    "Layout part %s targets layout part %s although it is a nest mate. "
                        + "Place the parts next to each other instead.",
                    getValue().getSimpleName(), target.getValue().getSimpleName()));
            }
            getPointsToUpdater().pointTo(target);
        }
    }

    void pointToAsChild(final LayoutTreeNode target) {
        var fakeSibling = new LayoutTreeNode(target.getValue());
        fakeSibling.setParent(target);
        pointToAsSibling(fakeSibling);
    }

    /**
     * Pointers to different nodes coming from {@link After}, {@link Before} or {@link Inside} are resolved to yield
     * exactly one target parent which replaces the current one. If more than one parent is found in that way, an error
     * is thrown.
     */
    void adaptParentFromPointers() {
        var pointsToParents =
            getPointsToLeaves(new HashSet<>()).stream().map(LayoutTreeNode::getParent).collect(Collectors.toSet());
        if (pointsToParents.size() > 1) {
            throwOrderDependenciesException();
        }
        pointsToParents.stream().filter(Objects::nonNull).findAny().ifPresent(this::setParent);
    }

    private Collection<LayoutTreeNode> getPointsToLeaves(final Collection<LayoutTreeNode> alreadyVisitedNodes) {
        if (m_leaves != null) {
            return m_leaves;
        }
        if (alreadyVisitedNodes.contains(this)) {
            throwOrderDependenciesException();
        }
        alreadyVisitedNodes.add(this);
        var directPointsTo = getPointsToUpdater().get();
        Collection<LayoutTreeNode> output;
        if (directPointsTo.isEmpty()) {
            output = Set.of(this);
        } else {
            output = new HashSet<>();
            /**
             * We can't parallelize this, since we would throw an error when visiting already visited nodes whose leaves
             * are not yet computed.
             */
            for (var node : directPointsTo) {
                output.addAll(node.getPointsToLeaves(alreadyVisitedNodes));
            }
        }
        m_leaves = output;
        return output;
    }

    private void throwOrderDependenciesException() {
        throw new UiSchemaGenerationException(
            String.format("Conflicting order annotations for layout part %s", getValue().getSimpleName()));
    }

    void setParent(final LayoutTreeNode target) {
        if (m_parent != null) {
            m_parent.getChildren().remove(this);
        }
        m_parent = target;
        if (target != null) {
            target.getChildren().add(this);
        }
    }

    void orderChildren() {
        m_children = sortByTopologicalOrder(m_children);
    }

    /**
     * Kahn's algorithm for sorting the given nodes with respect their isBefore and isAfter specifications. Whenever two
     * ore more elements have equivalent such specifications, they are sorted alphabetically.
     *
     * @see <a href= "https://www.geeksforgeeks.org/topological-sorting-indegree-based-solution/">
     *      https://www.geeksforgeeks.org/topological-sorting-indegree-based-solution/ </a>
     * @param nodes
     * @return a new object of sorted nodes.
     */
    private static List<LayoutTreeNode> sortByTopologicalOrder(final Collection<LayoutTreeNode> nodes) {
        return new DirectedGraph(nodes).sort();

    }

    private static class DirectedGraph {

        private final Collection<LayoutTreeNode> m_nodes;

        /**
         * @param nodes
         */
        public DirectedGraph(final Collection<LayoutTreeNode> nodes) {
            m_nodes = new HashSet<>(nodes);
        }

        List<LayoutTreeNode> sort() {
            var sorted = new ArrayList<LayoutTreeNode>();
            while (!m_nodes.isEmpty()) {
                var nextChild = getNextChild();
                removeChild(nextChild);
                sorted.add(nextChild);
            }
            return sorted;
        }

        /**
         * @return the next node without any incoming edges or the alphabetically first of such if there are multiple
         */
        private LayoutTreeNode getNextChild() {
            return m_nodes.stream() //
                .filter(node -> node.m_isAfter.isEmpty()) //
                .sorted(Comparator.comparing(node -> node.getValue().getSimpleName())) //
                .findFirst().orElseThrow(
                    () -> new UiSchemaGenerationException(String.format("Circular ordering in the layout parts: %s",
                        m_nodes.stream() //
                            .map(LayoutTreeNode::getValue) //
                            .map(Class::getSimpleName) //
                            .collect(Collectors.joining(", ")) //
                    )));
        }

        private void removeChild(final LayoutTreeNode nextChild) {
            nextChild.m_isBefore.forEach(o -> o.m_isAfter.remove(nextChild));
            m_nodes.remove(nextChild);
        }
    }

    /**
     * Filters the children only keeping children with content but maintaining the order.
     */
    void filterChildren() {
        final var emptyChildren = m_children.stream().filter(child -> !child.hasContent()).toList();
        emptyChildren.forEach(child -> m_children.remove(child));
    }

}
