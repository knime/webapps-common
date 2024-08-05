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
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Stream;

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.layout.Layout;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Effect;

/**
 * A widget tree has widget tree nodes as children who can either be a {@link WidgetTreeLeafNode} or are parent of
 * another {@link WidgetTree}.
 *
 * In terms of the construction from {@link DefaultNodeSettings}, this object is associated to the class of a
 * {@link WidgetGroup} while {@link WidgetTreeNode WidgetTreeNodes} are associated to their fields.
 *
 * Use the {@link WidgetTreeUtil} to construct a widget tree from a {@link WidgetGroup}.
 *
 * @author Paul Bärnreuther
 */
public final class WidgetTree {

    static final Collection<Class<? extends Annotation>> POSSIBLE_ANNOTATIONS = List.of(Layout.class, Effect.class);

    /**
     * Either the defining parent node in the present tree or null if this is the root of the tree.
     */
    private WidgetTreeNode m_parent;

    private final Collection<WidgetTreeNode> m_children = new ArrayList<>();

    private final Class<? extends WidgetGroup> m_widgetGroupClass;

    private final Map<Class<? extends Annotation>, Annotation> m_annotations;

    /**
     * An additional id, if there are multiple widgetTrees that needs to be differentiated (e.g. view and model
     * settings). This can be null and e.g. in {@link WidgetTreeUtil#parseToWidgetTree} is only non-null for the root
     * node.
     */
    private final String m_settingsKey;

    /**
     *
     * @param getAnnotation a function by which to retrieve annotations regarding this tree
     * @param widgetGroupClass the class of the underlying {@link WidgetGroup}
     * @param settingsKey an id to differentiate between widget trees (each node can access this key via
     *            {@link WidgetTreeNode#getSettingsKey()}.
     */
    WidgetTree(final Function<Class<? extends Annotation>, Annotation> getAnnotation,
        final Class<? extends WidgetGroup> widgetGroupClass, final String settingsKey) {
        m_annotations = AnnotationsUtil.toMap(getAnnotation, POSSIBLE_ANNOTATIONS);
        m_widgetGroupClass = widgetGroupClass;
        m_settingsKey = settingsKey;
    }

    WidgetTreeNode.Builder getNextChildBuilder() {
        return new WidgetTreeNode.Builder(this);
    }

    /**
     * @return the children
     */
    public Collection<WidgetTreeNode> getChildren() {
        return m_children;
    }

    /**
     * @return the id
     */
    public String getSettingsKey() {
        return m_settingsKey;
    }

    /**
     * Adjustments to the annotations within this tree depending on the annotations of parent nodes. E.g.
     * {@link Layout @Layout} should set the layout of fields when set on the containing class.
     */
    void postProcessAnnotations() {
        List.of(Effect.class, Layout.class).forEach(annotationClass -> {
            if (m_annotations.containsKey(annotationClass)) {
                m_children
                    .forEach(node -> node.setParentAnnotation(annotationClass, m_annotations.get(annotationClass)));
            }
        });
        m_children.forEach(WidgetTreeNode::postProcessAnnotations);
    }

    void setParentAnnotation(final Class<? extends Annotation> key, final Annotation value) {
        m_annotations.putIfAbsent(key, value);
    }

    void validate() {
        m_children.forEach(WidgetTreeNode::validate);
    }

    /**
     * @return the parent
     */
    public WidgetTreeNode getParent() {
        return m_parent;
    }

    /**
     * @param parent the parent to set
     */
    public void setParent(final WidgetTreeNode parent) {
        m_parent = parent;
    }

    /**
     * @return the widgetGroupClass
     */
    public Class<? extends WidgetGroup> getWidgetGroupClass() {
        return m_widgetGroupClass;
    }

    boolean hasAnnotation(final Class<? extends Annotation> annotationClass) {
        return m_annotations.containsKey(annotationClass);
    }

    /**
     * Flatten the tree without traversing into element trees of {@link ArrayWidgetNode ArrayWidgetNodes}.
     *
     * @return the union of all {@link WidgetTreeLeafNode WidgetTreeLeafNodes} and {@link ArrayWidgetNode
     *         ArrayWidgetNodes} that are reached by traversing the tree from the root without traversing into the
     *         element trees of {@link ArrayWidgetNode ArrayWidgetNodes}
     */
    public Stream<WidgetTreeNode> getWidgetNodes() {
        return getChildren().stream().flatMap(WidgetTree::getWidgetNodes);
    }

    private static Stream<WidgetTreeNode> getWidgetNodes(final WidgetTreeNode node) {
        if (node instanceof WidgetGroupNode widgetGroupNode) {
            return widgetGroupNode.getWidgetTree().getWidgetNodes();
        }
        return Stream.of(node);
    }

}
