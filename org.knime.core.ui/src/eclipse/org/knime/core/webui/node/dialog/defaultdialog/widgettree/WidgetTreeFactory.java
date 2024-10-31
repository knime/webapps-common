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
 *   Oct 7, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.widgettree;

import java.lang.annotation.Annotation;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.layout.Layout;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup.Modification;
import org.knime.core.webui.node.dialog.defaultdialog.tree.ArrayParentNode;
import org.knime.core.webui.node.dialog.defaultdialog.tree.Tree;
import org.knime.core.webui.node.dialog.defaultdialog.tree.TreeFactory;
import org.knime.core.webui.node.dialog.defaultdialog.tree.TreeNode;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ArrayWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ComboBoxWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.DateTimeWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.DateWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.FileReaderWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.FileWriterWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.IntervalWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.LatentWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.LocalFileReaderWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.LocalFileWriterWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.NumberInputWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.RadioButtonsWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.RichTextInputWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.SortListWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.TextInputWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.TextMessage;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ValueSwitchWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.SimpleButtonWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.credentials.CredentialsWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.credentials.PasswordWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.credentials.UsernameWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.internal.InternalArrayWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Effect;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.PredicateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueReference;

import com.fasterxml.jackson.databind.ser.PropertyWriter;

/**
 * A factory for creating {@link Tree}s from {@link WidgetGroup}s.
 *
 * @author Paul Bärnreuther
 */
public class WidgetTreeFactory extends TreeFactory<WidgetGroup> {

    private static final Collection<Class<? extends Annotation>> POSSIBLE_TREE_ANNOTATIONS =
        List.of(LatentWidget.class, Layout.class, Effect.class, ValueReference.class, ValueProvider.class,
            Modification.class, Modification.WidgetReference.class);

    private static final Collection<Class<? extends Annotation>> POSSIBLE_TREE_CLASS_ANNOTATIONS =
        List.of(Layout.class, Effect.class, Modification.class);

    private static final Collection<Class<? extends Annotation>> POSSIBLE_LEAF_ANNOTATIONS =
        List.of(LatentWidget.class, Layout.class, Widget.class, NumberInputWidget.class, RadioButtonsWidget.class,
            ValueSwitchWidget.class, ChoicesWidget.class, ComboBoxWidget.class, SortListWidget.class,
            ButtonWidget.class, SimpleButtonWidget.class, DateTimeWidget.class, DateWidget.class, IntervalWidget.class,
            RichTextInputWidget.class, CredentialsWidget.class, PasswordWidget.class, UsernameWidget.class,
            FileReaderWidget.class, FileWriterWidget.class, LocalFileReaderWidget.class, LocalFileWriterWidget.class,
            TextInputWidget.class, Effect.class, ValueReference.class, ValueProvider.class,
            InternalArrayWidget.ElementCheckboxWidget.class, Modification.WidgetReference.class, TextMessage.class);

    private static final Collection<Class<? extends Annotation>> POSSIBLE_ARRAY_ANNOTATIONS = List.of(
        LatentWidget.class, Widget.class, ArrayWidget.class, InternalArrayWidget.class, Layout.class, Effect.class,
        ValueReference.class, ValueProvider.class, Modification.class, Modification.WidgetReference.class);

    /**
     * Create a new factory. This factory is non-static since it implements an abstract factory, but it does not hold
     * any state.
     */
    public WidgetTreeFactory() {
        super(POSSIBLE_TREE_ANNOTATIONS, POSSIBLE_TREE_CLASS_ANNOTATIONS, POSSIBLE_LEAF_ANNOTATIONS,
            POSSIBLE_ARRAY_ANNOTATIONS);
    }

    @Override
    protected Class<? extends WidgetGroup> getTreeSettingsClass() {
        return WidgetGroup.class;
    }

    @Override
    public Tree<WidgetGroup> createTree(final Class<? extends WidgetGroup> rootClass, final SettingsType settingsType) {
        final var tree = super.createTree(rootClass, settingsType);
        propagateLayoutAndEffectAnnotationsToChildren(tree);
        resolveWidgetModifications(tree);
        return tree;
    }

    private void propagateLayoutAndEffectAnnotationsToChildren(final Tree<WidgetGroup> tree) {
        tree.getChildren().forEach(child -> {
            for (var annotationClass : List.of(Effect.class, Layout.class)) {
                final var existingAnnotation = tree.getAnnotation(annotationClass);
                if (existingAnnotation.isPresent()) {
                    super.performAddAnnotation(child, annotationClass, existingAnnotation.get());
                }
            }
            getWidgetTreeFrom(child).ifPresent(this::propagateLayoutAndEffectAnnotationsToChildren);
        });
    }

    private static Optional<Tree<WidgetGroup>> getWidgetTreeFrom(final TreeNode<WidgetGroup> node) {
        Tree<WidgetGroup> widgetTree = null;
        if (node instanceof ArrayParentNode<WidgetGroup> apn) {
            widgetTree = apn.getElementTree();
        } else if (node instanceof Tree<WidgetGroup> wt) {
            widgetTree = wt;
        }
        return Optional.ofNullable(widgetTree);
    }

    private void resolveWidgetModifications(final Tree<WidgetGroup> tree) {
        tree.getAnnotation(Modification.class)
            .ifPresent(widgetModification -> resolveWidgetModification(tree, widgetModification));
        tree.getChildren().forEach(child -> {
            if (child instanceof Tree<WidgetGroup> t) {
                resolveWidgetModifications(t);
            }
            if (child instanceof ArrayParentNode<WidgetGroup> apn) {
                resolveWidgetModifications(apn);
            }
        });
    }

    private void resolveWidgetModifications(final ArrayParentNode<WidgetGroup> arrayParentNode) {
        arrayParentNode.getAnnotation(Modification.class).ifPresent(
            widgetModification -> resolveWidgetModification(arrayParentNode.getElementTree(), widgetModification));
        resolveWidgetModifications(arrayParentNode.getElementTree());
    }

    private void resolveWidgetModification(final Tree<WidgetGroup> tree, final Modification widgetModification) {
        WidgetModificationUtil.resolveWidgetModification(tree, widgetModification,
            super::performAddOrReplaceAnnotation);
    }

    @Override
    @SuppressWarnings("unchecked") // checked by Effect.class.equals(annotationClass)
    protected <T extends Annotation> T getAnnotationFromField(final PropertyWriter field,
        final Class<T> annotationClass) {
        if (Effect.class.equals(annotationClass)) {
            final var widgetAnnotation = field.getAnnotation(Widget.class);
            if (widgetAnnotation != null && !PredicateProvider.class.equals(widgetAnnotation.effect().predicate())) {
                if (field.getAnnotation(Effect.class) != null) {
                    throw new IllegalStateException(String.format(
                        "Conflicting Effect annotations on field and inside Widget annotation for field %s",
                        field.getName()));
                }
                return (T)widgetAnnotation.effect();
            }
        }
        return super.getAnnotationFromField(field, annotationClass);
    }

}
