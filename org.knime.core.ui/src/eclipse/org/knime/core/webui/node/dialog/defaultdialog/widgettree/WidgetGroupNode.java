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
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Effect;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Signal;
import org.knime.core.webui.node.dialog.defaultdialog.widget.LatentWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueReference;

/**
 *
 * A intermediate node which corresponds to a field whose type is a {@link WidgetGroup} and thus has nested fields which
 * are part of this tree structure.
 *
 * @author Paul Bärnreuther
 */
public final class WidgetGroupNode extends WidgetTreeNode {

    WidgetGroupNode(final WidgetTree parent, final Class<?> type, final Class<?> contentType, final String name,
        final Function<Class<? extends Annotation>, Annotation> annotations) {
        super(parent, type, contentType, name, annotations);
    }

    WidgetTree m_widgetTree;

    @Override
    public Collection<Class<? extends Annotation>> getPossibleAnnotations() {
        return List.of(LatentWidget.class, Layout.class, Signal.class, Effect.class, ValueReference.class,
            ValueProvider.class);
    }

    @Override
    public void postProcessAnnotations() {
        List.of(Effect.class, Layout.class).forEach(annotationClass -> {
            if (m_annotations.containsKey(annotationClass)) {
                getWidgetTree().setParentAnnotation(annotationClass, m_annotations.get(annotationClass));
            }
        });
        getWidgetTree().postProcessAnnotations();
    }

    @Override
    protected void validate() {
        if (getAnnotation(Layout.class).isPresent() && getWidgetTree().hasAnnotation(Layout.class)) {
            throw new IllegalStateException(String.format(
                "The an annotation for field %s collides with the an annotation of the field type class %s.", getName(),
                getWidgetTree().getWidgetGroupClass().getSimpleName()));
        }
        getWidgetTree().validate();
    }

    /**
     * @return the widgetTree
     */
    public WidgetTree getWidgetTree() {
        return m_widgetTree;
    }

}
