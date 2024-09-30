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
 *   Mar 21, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema;

import java.lang.annotation.Annotation;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.layout.After;
import org.knime.core.webui.node.dialog.defaultdialog.layout.Layout;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.widget.LatentWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.TextMessage;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.impl.AsyncChoicesAdder;
import org.knime.core.webui.node.dialog.defaultdialog.widgettree.WidgetTree;
import org.knime.core.webui.node.dialog.defaultdialog.widgettree.WidgetTreeNode;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;

/**
 * Class for creating ui schema content from a settings POJO class.
 *
 *
 * The UiSchema generation follows these steps:
 * <ol type="1">
 * <li>Create a tree representation of the provided {@link WidgetGroup} classes.</li>
 * <li>Use order annotations (see e.g. {@link After}) and class hierarchies to determine a tree structure (see
 * {@link LayoutTree})</li>
 * <li>Generate the layout parts starting from the root and add the mapped controls (see
 * {@link LayoutNodesGenerator})</li>
 * </ol>
 *
 * @author Paul Bärnreuther
 */
public final class JsonFormsUiSchemaUtil {

    private JsonFormsUiSchemaUtil() {
        // utility class
    }

    private static ObjectMapper MAPPER; // NOSONAR

    /**
     * @return the configured mapper for ui-schema generation
     */
    static ObjectMapper getMapper() {
        if (MAPPER == null) {
            MAPPER = createMapper();
        }
        return MAPPER;
    }

    private static ObjectMapper createMapper() {
        final var mapper = new ObjectMapper();
        /**
         * Added for resolving jdk8 dependent state providers
         */
        mapper.registerModule(new Jdk8Module());
        return mapper;
    }

    /**
     * Call this method to build the uischema of sub layouts which are independent from the parent layout apart from
     * having access to the parentFields
     *
     * @param context
     * @param asyncChoicesAdder
     * @param widgetTrees to derive the uischema from
     * @return the uischema
     */
    public static ObjectNode buildUISchema(final Collection<WidgetTree> widgetTrees,
        final DefaultNodeSettingsContext context, final AsyncChoicesAdder asyncChoicesAdder) {
        return buildUISchema(widgetTrees, List.of(), context, asyncChoicesAdder);
    }

    /**
     * @param parentWidgetTrees of the fields of the "outside" layout. With UIEXT-1673 This can be removed again
     */
    static ObjectNode buildUISchema(final Collection<WidgetTree> widgetTrees,
        final Collection<WidgetTree> parentWidgetTrees, final DefaultNodeSettingsContext context,
        final AsyncChoicesAdder asyncChoicesAdder) {
        final var layoutSkeleton = resolveLayout(widgetTrees, parentWidgetTrees);
        return new LayoutNodesGenerator(layoutSkeleton, context, asyncChoicesAdder).build();
    }

    private static List<WidgetTree>
        constructWidgetTrees(final Map<SettingsType, Class<? extends WidgetGroup>> settingsClasses) {
        return settingsClasses.entrySet().stream().map(e -> new WidgetTree(e.getValue(), e.getKey())).toList();
    }

    /**
     * Resolves a map of default node settings classes to a tree structure representing the layout of the node dialog
     *
     * @param settingsClasses
     * @return the resolved tree structure
     */
    public static LayoutSkeleton resolveLayout(final Map<SettingsType, Class<? extends WidgetGroup>> settingsClasses) {
        final var widgetTrees = constructWidgetTrees(settingsClasses);
        return resolveLayout(widgetTrees, List.of());
    }

    static LayoutSkeleton resolveLayout(final Collection<WidgetTree> widgetTrees,
        final Collection<WidgetTree> parentWidgetTrees) {
        final var layoutTreeRoot = widgetTreesToLayoutTreeRoot(widgetTrees);
        return new LayoutSkeleton(layoutTreeRoot, widgetTrees, parentWidgetTrees);
    }

    private static LayoutTreeNode widgetTreesToLayoutTreeRoot(final Collection<WidgetTree> widgetTrees) {
        final Map<Boolean, List<WidgetTreeNode>> hasLayoutToWidgets =
            widgetTrees.stream().flatMap(WidgetTree::getWidgetNodes).filter(node -> !isHiddenOrLatent(node))
                .collect(Collectors.partitioningBy(node -> node.getAnnotation(Layout.class).isPresent()));

        final Map<Class<?>, List<WidgetTreeNode>> layoutPartsToWidgets = hasLayoutToWidgets.get(true).stream()
            .collect(Collectors.groupingBy(node -> node.getAnnotation(Layout.class).orElseThrow().value()));

        final var widgetsWithoutLayout = hasLayoutToWidgets.get(false);
        return new LayoutTree(layoutPartsToWidgets, widgetsWithoutLayout).getRootNode();
    }

    private static final List<Class<? extends Annotation>> VISIBLE_WITHOUT_WIDGET_ANNOTATION =
        List.of(TextMessage.class);

    private static boolean isHiddenOrLatent(final WidgetTreeNode node) {
        final var isHidden = node.getAnnotation(Widget.class).isEmpty() && VISIBLE_WITHOUT_WIDGET_ANNOTATION.stream()
            .filter(node.getPossibleAnnotations()::contains).map(node::getAnnotation).allMatch(Optional::isEmpty);
        final var isLatent = node.getAnnotation(LatentWidget.class).isPresent();
        return isHidden || isLatent;
    }

    /**
     * @param layoutTreeRoot a tree structure representation of the node dialogs layout. Its leafs represent controls
     *            and other nodes can be visible layout elements or just structural placeholders.
     * @param widgetTrees one ore multiple widget trees given by the annotated {@link WidgetGroup WidgetGroups}
     * @param parentWidgetTrees of the fields of the "outside" layout. With UIEXT-1673 This can be removed again
     */
    public static record LayoutSkeleton(LayoutTreeNode layoutTreeRoot, Collection<WidgetTree> widgetTrees,
        Collection<WidgetTree> parentWidgetTrees) {
    }
}
