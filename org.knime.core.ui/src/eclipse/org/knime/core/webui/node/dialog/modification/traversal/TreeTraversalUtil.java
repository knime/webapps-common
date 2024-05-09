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
 *   May 29, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.modification.traversal;

import java.util.function.BiConsumer;

/**
 * Utility class used to traverse multiple trees simultaneously to apply modifications when saving settings from the
 * dialog.
 *
 * @author Paul Bärnreuther
 */
public class TreeTraversalUtil {

    /**
     * @param <L>
     * @param <T>
     * @param tree with leaves <L>
     * @param treeStructure of type <T> - this has to satisfy the same structure as the tree
     * @param applyOnLeaf a consumer that is applied for each leaf in a depth first approach. It consumes a leaf and the
     *            corresponding tree structure obtained by following the same keys in the tree structure.
     */
    public static <L, T> void traverse(final Tree<L> tree, final Traversable<T> treeStructure,
        final BiConsumer<L, T> applyOnLeaf) {
        final var leaf = tree.getLeaf();
        if (leaf.isPresent()) {
            applyOnLeaf.accept(leaf.get(), treeStructure.get());
        } else {
            final var next = tree.getChildren();
            next.forEach(child -> traverse(child, applyKeyIfPresent(treeStructure, child), applyOnLeaf));
        }
    }

    private static <T, L> Traversable<T> applyKeyIfPresent(final Traversable<T> treeStructure, final Tree<L> child) {
        return child.getKey().map(key -> treeStructure.getChild(key)).orElse(treeStructure);
    }

    /**
     * An object is traversable if it can be traversed alongside a {@link Tree}. An implementation of this interface
     * serves as a wrapper around data structures which allow this.
     *
     * @param <T> the type data on which this structure is defined
     * @author Paul Bärnreuther
     */
    public interface Traversable<T> {

        /**
         * @return the underlying data
         */
        T get();

        /**
         * @param key
         * @return the child at the key
         */
        Traversable<T> getChild(String key);
    }

}
