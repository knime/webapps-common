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
 *   Mar 22, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.impl;

import java.util.HashSet;
import java.util.Objects;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import org.knime.core.util.Pair;
import org.knime.core.webui.node.dialog.ui.Layout;

/**
 * This utility class offers a method to find the root node of a set of layout parts as described {@link Layout here}.
 *
 * @author Paul Bärnreuther
 */
final class LayoutRootFinderUtil {

    private LayoutRootFinderUtil() {
        // Utility class
    }

    /**
     * This method finds the common root of all layout nodes (see also {@link Layout}).
     * @param layoutNodes the set of layout nodes which should have a common root
     * @return a non-null optional which is empty only if the set of layoutNodes contains at most {@link null}
     */
    static Optional<Class<?>> findRootNode(final Set<Class<?>> layoutNodes) {
        return findRootNode(layoutNodes, new HashSet<>());
    }

    private static Optional<Class<?>> findRootNode(final Set<Class<?>> layoutNodes, final Set<Class<?>> rootNodes) {
        if (layoutNodes.isEmpty()) {
            return mergeRoots(rootNodes);
        }
        final var rootsAndOthers = separateRootNodes(layoutNodes);
        rootNodes.addAll(rootsAndOthers.getFirst());

        final Set<Class<?>> next = new HashSet<>();
        for (var layoutPart : rootsAndOthers.getSecond()) {
            final var enclosingClass = layoutPart.getEnclosingClass();
            if (enclosingClass == null) {
                throw new UiSchemaGenerationException(
                    String.format("No enclosing class found for layout part %s", layoutPart.getSimpleName()));
            }
            next.add(enclosingClass);
        }
        return findRootNode(next, rootNodes);
    }

    private static Optional<Class<?>> mergeRoots(final Set<Class<?>> rootNodes) {
        if (rootNodes.size() >= 2) {
            throw new UiSchemaGenerationException("Multiple root layout nodes detected");
        }
        return rootNodes.stream().findFirst();
    }

    private static Pair<Set<Class<?>>, Set<Class<?>>> separateRootNodes(final Set<Class<?>> layoutNodes) {
        final var partition = layoutNodes.stream().filter(Objects::nonNull).collect(
            Collectors.partitioningBy(clazz -> LayoutPart.determineFromClassAnnotation(clazz) == LayoutPart.ROOT));
        return new Pair<>(new HashSet<>(partition.get(true)), new HashSet<>(partition.get(false)));
    }
}
