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
import java.util.Optional;
import java.util.function.Function;
import java.util.stream.Stream;

import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.layout.Layout;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup.Modification;
import org.knime.core.webui.node.dialog.defaultdialog.widget.LatentWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Effect;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueReference;

import com.google.common.collect.BiMap;
import com.google.common.collect.HashBiMap;

/**
 * An instance of this class is either a root (i.e. a global root of all settings of one {@link SettingsType} or a root
 * of an element settings tree of an array widget) or an intermediate node with another tree as parent.
 *
 * It is the only type of node in this tree structure with children (apart from the element tree <-> array widget
 * relationship of the {@link ArrayWidgetNode})
 *
 * Use {@link WidgetTree#WidgetTree(Class, SettingsType)} to create a root widget tree.
 *
 * @author Paul Bärnreuther
 */
public final class WidgetTree extends WidgetTreeNode {

    private static final Collection<Class<? extends Annotation>> POSSIBLE_ANNOTATIONS =
        List.of(LatentWidget.class, Layout.class, Effect.class, ValueReference.class, ValueProvider.class,
            Modification.class, Modification.WidgetReference.class);

    ArrayWidgetNode m_arrayWidgetNodeParent;

    private final Collection<WidgetTreeNode> m_children = new ArrayList<>();

    private final BiMap<WidgetTreeNode, String> m_childNames = HashBiMap.create();

    private final Class<? extends WidgetGroup> m_widgetGroupClass;

    /**
     * @param rootClass implementing {@link WidgetGroup}.
     * @param settingsType "view" or "model" or null for element widget trees of array widgets
     */
    public WidgetTree(final Class<? extends WidgetGroup> rootClass, final SettingsType settingsType) {
        this(null, settingsType, rootClass, rootClass::getAnnotation);
        propagateAnnotationsToChildren();
        resolveWidgetModifications();
    }

    WidgetTree(final WidgetTree parent, final SettingsType settingsType,
        final Class<? extends WidgetGroup> widgetGroupClass,
        final Function<Class<? extends Annotation>, Annotation> annotations) {
        super(parent, settingsType, widgetGroupClass, annotations, POSSIBLE_ANNOTATIONS);
        m_widgetGroupClass = widgetGroupClass;
        PopulateWidgetTreeHelper.populateWidgetTree(this, widgetGroupClass); // NOSONAR doesn't need to be thread-safe
    }

    void propagateAnnotationsToChildren() {
        getChildren().forEach(child -> {
            for (var annotationClass : List.of(Effect.class, Layout.class)) {
                if (m_annotations.containsKey(annotationClass)) {
                    child.addAnnotation(annotationClass, m_annotations.get(annotationClass));
                }
            }
            getWidgetTreeFrom(child).ifPresent(WidgetTree::propagateAnnotationsToChildren);
        });
    }

    void resolveWidgetModifications() {
        getAnnotation(Modification.class).ifPresent(
            widgetModification -> WidgetModificationUtil.resolveWidgetModification(this, widgetModification));
        getChildren().forEach(child -> {
            if (child instanceof WidgetTree wt) {
                wt.resolveWidgetModifications();
            }
            if (child instanceof ArrayWidgetNode awn) {
                awn.resolveWidgetModifications();
            }
        });
    }

    private static Optional<WidgetTree> getWidgetTreeFrom(final WidgetTreeNode node) {
        WidgetTree widgetTree = null;
        if (node instanceof ArrayWidgetNode awn) {
            widgetTree = awn.getElementWidgetTree();
        } else if (node instanceof WidgetTree wt) {
            widgetTree = wt;
        }
        return Optional.ofNullable(widgetTree);
    }

    @Override
    protected Optional<ArrayWidgetNode> getContainingArrayWidgetNodeUsingParents() {
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
    public Collection<WidgetTreeNode> getChildren() {
        return m_children;
    }

    void addChild(final String name, final WidgetTreeNode child) {
        m_children.add(child);
        m_childNames.put(child, name);
    }

    String getChildName(final WidgetTreeNode child) {
        return m_childNames.get(child);
    }

    /**
     * @param name of the child
     * @return the child with the given name or null if no such child exists
     */
    public WidgetTreeNode getChildByName(final String name) {
        return m_childNames.inverse().get(name);
    }

    @Override
    public Class<? extends WidgetGroup> getType() {
        return m_widgetGroupClass;
    }

    /**
     * Flatten the tree without traversing into element trees of {@link ArrayWidgetNode ArrayWidgetNodes}. Hereby
     * intermediate {@link WidgetTree} nodes are not included in the output.
     *
     * @return the union of all {@link WidgetNode WidgetNodes} and {@link ArrayWidgetNode ArrayWidgetNodes} that are
     *         reached by traversing the tree from the root without traversing into the element trees of
     *         {@link ArrayWidgetNode ArrayWidgetNodes}
     */
    public Stream<WidgetTreeNode> getWidgetNodes() {
        return getChildren().stream().flatMap(WidgetTree::getWidgetNodes);
    }

    private static Stream<WidgetTreeNode> getWidgetNodes(final WidgetTreeNode node) {
        if (node instanceof WidgetTree widgetGroupNode) {
            return widgetGroupNode.getWidgetNodes();
        }
        return Stream.of(node);
    }

    /**
     * Flatten the tree without traversing into element trees of {@link ArrayWidgetNode ArrayWidgetNodes}. Also
     * intermediate {@link WidgetTree} nodes are included in the output.
     *
     * @return the union of all {@link WidgetTreeNode WidgetTreeNodes} that are reached by traversing the tree from the
     *         root without traversing into the element trees of {@link ArrayWidgetNode ArrayWidgetNodes}
     */
    public Stream<WidgetTreeNode> getWidgetAndWidgetTreeNodes() {
        return getChildren().stream().flatMap(WidgetTree::getWidgetAndWidgetTreeNodes);
    }

    private static Stream<WidgetTreeNode> getWidgetAndWidgetTreeNodes(final WidgetTreeNode node) {
        if (node instanceof WidgetTree widgetGroupNode) {
            return Stream.concat(Stream.of(node), widgetGroupNode.getWidgetAndWidgetTreeNodes());
        }
        return Stream.of(node);
    }

}
