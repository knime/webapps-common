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
package org.knime.core.webui.node.dialog.defaultdialog.widgettree;

import java.lang.annotation.Annotation;
import java.util.Collection;
import java.util.List;
import java.util.function.Function;

import org.knime.core.webui.node.dialog.defaultdialog.layout.Layout;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Effect;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Signal;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Signals;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ArrayWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.LatentWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.internal.InternalArrayWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueReference;

/**
 * An instance of this class corresponds to an array widget, i.e. a widget whose subwidgets are repeated n times.
 *
 * <p>
 * It is a leaf of the containing {@link WidgetTree}, i.e. with it has no further sub-nodes.
 * </p>
 *
 * But it also gives rise to a new tree retrieved via {@link #getElementWidgetTree}, which is to be interpreted as an
 * independent tree corresponding to the type of an elements of this array widget.
 * </p>
 *
 * @author Paul Bärnreuther
 */
public final class ArrayWidgetNode extends WidgetTreeNode {

    private static final Collection<Class<? extends Annotation>> POSSIBLE_ANNOTATIONS =
        List.of(LatentWidget.class, Widget.class, ArrayWidget.class, InternalArrayWidget.class, Signal.class,
            Signals.class, Layout.class, Effect.class, ValueReference.class, ValueProvider.class);

    private final WidgetTree m_elementWidgetTree;

    ArrayWidgetNode(final WidgetTree parent, final WidgetTree elementWidgetTree, final Class<?> type,
        final Function<Class<? extends Annotation>, Annotation> annotations) {
        super(parent, parent.getSettingsType(), type, annotations, POSSIBLE_ANNOTATIONS);
        m_elementWidgetTree = elementWidgetTree;
        m_elementWidgetTree.m_arrayWidgetNodeParent = this;
    }

    /**
     * @return the elementWidgetTree
     */
    public WidgetTree getElementWidgetTree() {
        return m_elementWidgetTree;
    }

}
