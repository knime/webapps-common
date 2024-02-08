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

import java.util.HashSet;
import java.util.Set;

/**
 *
 * @author Paul Bärnreuther
 */
abstract sealed class Vertex permits UpdateVertex, ActionVertex, TriggerVertex, DependencyVertex {

    private final Set<Vertex> m_children = new HashSet<>();

    private final Set<Vertex> m_parents = new HashSet<>();

    Set<Vertex> getChildren() {
        return m_children;
    }

    Set<Vertex> getParents() {
        return m_parents;
    }

    void addChild(final Vertex childVertex) {
        m_children.add(childVertex);
        childVertex.m_parents.add(this);
    }

    void addParent(final Vertex parentVertex) {
        m_parents.add(parentVertex);
        parentVertex.m_children.add(this);
    }

    abstract <T> T visit(VertexVisitor<T> visitor);

    interface VertexVisitor<T> {

        default T accept(final UpdateVertex updateVertex) {
            return acceptDefault(updateVertex);
        }

        default T accept(final ActionVertex actionVertex) {
            return acceptDefault(actionVertex);
        }

        default T accept(final TriggerVertex triggerVertex) {
            return acceptDefault(triggerVertex);
        }

        default T accept(final DependencyVertex dependencyVertex) {
            return acceptDefault(dependencyVertex);
        }

        default T acceptDefault(@SuppressWarnings("unused") final Vertex vertex) {
            return null;
        }
    }

}
