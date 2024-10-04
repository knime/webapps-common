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
 *   Aug 5, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.tree;

import java.lang.annotation.Annotation;
import java.util.Collection;
import java.util.function.Function;

import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.PersistableSettings;

/**
 * An instance of this class corresponds to an array widget, i.e. a widget whose subwidgets are repeated n times.
 *
 * <p>
 * It is a leaf of the containing {@link Tree}, i.e. with it has no further sub-nodes.
 * </p>
 *
 * But it also gives rise to a new tree retrieved via {@link #getElementTree}, which is to be interpreted as an
 * independent tree corresponding to the type of an elements of this array widget.
 * </p>
 *
 * @param <S> the type of the [S]ettings. Either {@link PersistableSettings} or {@link WidgetGroup}
 *
 * @author Paul Bärnreuther
 */
public final class ArrayParentNode<S> extends TreeNode<S> {

    private final Tree<S> m_elementTree;

    ArrayParentNode(final Tree<S> parent, final Tree<S> elementWidgetTree, final Class<?> type,
        final Function<Class<? extends Annotation>, Annotation> annotations,
        final Collection<Class<? extends Annotation>> possibleAnnotations) {
        super(parent, parent.getSettingsType(), type, annotations, possibleAnnotations);
        m_elementTree = elementWidgetTree;
        m_elementTree.m_arrayWidgetNodeParent = this; // NOSONAR doesn't need to be thread-safe
    }

    /**
     * @return the elementWidgetTree
     */
    public Tree<S> getElementTree() {
        return m_elementTree;
    }

}
