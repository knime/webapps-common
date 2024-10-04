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
 *   Okt 4, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.tree;

import java.lang.annotation.Annotation;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Stream;

import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.PersistableSettings;

import com.google.common.collect.BiMap;
import com.google.common.collect.HashBiMap;

/**
 * An instance of this class is either a root (i.e. a global root of all settings of one {@link SettingsType} or a root
 * of an element settings tree of an array widget) or an intermediate node with another tree as parent.
 *
 * It is the only type of node in this tree structure with children (apart from the element tree <-> array widget
 * relationship of the {@link ArrayParentNode})
 *
 *
 * @param <S> the type of the [S]ettings. Either {@link PersistableSettings} or {@link WidgetGroup}
 * @author Paul Bärnreuther
 */
public final class Tree<S> extends TreeNode<S> {

    ArrayParentNode<S> m_arrayWidgetNodeParent;

    private final Collection<TreeNode<S>> m_children = new ArrayList<>();

    private final BiMap<TreeNode<S>, String> m_childNames = HashBiMap.create();

    private final Class<? extends S> m_treeClass;

    Tree(final Tree<S> parent, final SettingsType settingsType, final Class<? extends S> treeClass,
        final Function<Class<? extends Annotation>, Annotation> annotations,
        final Collection<Class<? extends Annotation>> possibleAnnotations) {
        super(parent, settingsType, treeClass, annotations, possibleAnnotations);
        m_treeClass = treeClass;
    }

    @Override
    protected Optional<ArrayParentNode<S>> getContainingArrayWidgetNodeUsingParents() {
        final var parentTree = getParent();
        if (parentTree != null) {
            return parentTree.getContainingArrayWidgetNode();
        }
        if (m_arrayWidgetNodeParent != null) {
            return Optional.of(m_arrayWidgetNodeParent);
        }
        return Optional.empty();
    }

    /**
     * @return the children
     */
    public Collection<TreeNode<S>> getChildren() {
        return m_children;
    }

    /**
     * @return the mapping from children to their names
     */
    public BiMap<String, TreeNode<S>> getChildrenByName() {
        return m_childNames.inverse();
    }

    void addChild(final String name, final TreeNode<S> child) {
        m_children.add(child);
        m_childNames.put(child, name);
    }

    String getChildName(final TreeNode<S> child) {
        return m_childNames.get(child);
    }

    /**
     * @param name of the child
     * @return the child with the given name or null if no such child exists
     */
    public TreeNode<S> getChildByName(final String name) {
        return m_childNames.inverse().get(name);
    }

    @Override
    public Class<? extends S> getType() {
        return m_treeClass;
    }

    /**
     * Flatten the tree without traversing into element trees of {@link ArrayParentNode ArrayWidgetNodes}. Hereby intermediate
     * {@link Tree} nodes are not included in the output.
     *
     * @return the union of all {@link LeafNode WidgetNodes} and {@link ArrayParentNode ArrayWidgetNodes} that are reached by
     *         traversing the tree from the root without traversing into the element trees of {@link ArrayParentNode
     *         ArrayWidgetNodes}
     */
    public Stream<TreeNode<S>> getWidgetNodes() {
        return getChildren().stream().flatMap(Tree::getWidgetNodes);
    }

    private static <S> Stream<TreeNode<S>> getWidgetNodes(final TreeNode<S> node) {
        if (node instanceof Tree<S> treeNode) {
            return treeNode.getWidgetNodes();
        }
        return Stream.of(node);
    }

    /**
     * Flatten the tree without traversing into element trees of {@link ArrayParentNode ArrayWidgetNodes}. Also intermediate
     * {@link Tree} nodes are included in the output.
     *
     * @return the union of all {@link TreeNode WidgetTreeNodes} that are reached by traversing the tree from the root
     *         without traversing into the element trees of {@link ArrayParentNode ArrayWidgetNodes}
     */
    public Stream<TreeNode<S>> getWidgetAndWidgetTreeNodes() {
        return getChildren().stream().flatMap(Tree::getWidgetAndWidgetTreeNodes);
    }

    private static <S> Stream<TreeNode<S>> getWidgetAndWidgetTreeNodes(final TreeNode<S> node) {
        if (node instanceof Tree<S> treeNode) {
            return Stream.concat(Stream.of(node), treeNode.getWidgetAndWidgetTreeNodes());
        }
        return Stream.of(node);
    }

}
