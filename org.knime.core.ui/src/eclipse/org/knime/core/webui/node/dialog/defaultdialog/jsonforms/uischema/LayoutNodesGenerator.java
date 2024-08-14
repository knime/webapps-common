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
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema;

import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_ELEMENTS;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_SCOPE;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_TYPE;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TYPE_CONTROL;

import java.util.Collection;
import java.util.stream.Stream;

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsScopeUtil;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.JsonFormsUiSchemaUtil.LayoutSkeleton;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.impl.AsyncChoicesAdder;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Effect;
import org.knime.core.webui.node.dialog.defaultdialog.widgettree.WidgetTree;
import org.knime.core.webui.node.dialog.defaultdialog.widgettree.WidgetTreeNode;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 *
 * @author Paul Bärnreuther
 */
final class LayoutNodesGenerator {

    private final LayoutTreeNode m_rootLayoutTree;

    private final DefaultNodeSettingsContext m_defaultNodeSettingsContext;

    private final AsyncChoicesAdder m_asyncChoicesAdder;

    private final Collection<WidgetTree> m_allWidgetTrees;

    private final UiSchemaRulesGenerator m_rulesGenerator;

    /**
     * @param layout a record containing controls (as a mapping between layout parts and their contained settings
     *            controls) and a ruleSourcesMap (the mapping between ids of rule sources to their conditions)
     * @param context the settings creation context with access to the input ports
     * @param asyncChoicesAdder used to start asynchronous computations of choices during the ui-schema generation.
     */
    LayoutNodesGenerator(final LayoutSkeleton layout, final DefaultNodeSettingsContext context,
        final AsyncChoicesAdder asyncChoicesAdder) {
        m_rulesGenerator = new UiSchemaRulesGenerator(layout.widgetTrees(), context);
        m_allWidgetTrees = Stream.concat(layout.widgetTrees().stream(), layout.parentWidgetTrees().stream()).toList();
        m_rootLayoutTree = layout.layoutTreeRoot();
        m_defaultNodeSettingsContext = context;
        m_asyncChoicesAdder = asyncChoicesAdder;
    }

    private static String getScope(final WidgetTreeNode node) {
        return JsonFormsScopeUtil.toScope(node);
    }

    ObjectNode build() {
        final var rootNode = JsonFormsUiSchemaUtil.getMapper().createObjectNode();
        buildLayout(m_rootLayoutTree, rootNode.putArray(TAG_ELEMENTS));
        return rootNode;
    }

    private void buildLayout(final LayoutTreeNode rootNode, final ArrayNode parentNode) {
        final var layoutPart = LayoutPart.determineFromClassAnnotation(rootNode.getValue());
        final var layoutNode = layoutPart.create(parentNode, rootNode.getValue(), m_rulesGenerator);
        rootNode.getControls().forEach(control -> addControlElement(layoutNode, control));
        rootNode.getChildren().forEach(childLayoutNode -> buildLayout(childLayoutNode, layoutNode));
    }

    private void addControlElement(final ArrayNode root, final WidgetTreeNode node) {
        /**
         * Rendering the element checkbox widget of array layout elements is handled via the framework.
         */
        if (UiSchemaOptionsGenerator.hasElementCheckboxWidgetAnnotation(node)) {
            return;
        }
        final var scope = getScope(node);
        final var control = root.addObject().put(TAG_TYPE, TYPE_CONTROL).put(TAG_SCOPE, scope);
        addOptions(node, control);
        addRule(node, control);
    }

    private void addOptions(final WidgetTreeNode node, final ObjectNode control) {
        final var scope = getScope(node);
        try {
            new UiSchemaOptionsGenerator(node, m_defaultNodeSettingsContext, scope, m_asyncChoicesAdder,
                m_allWidgetTrees).addOptionsTo(control);
        } catch (UiSchemaGenerationException ex) {
            throw new UiSchemaGenerationException(
                String.format("Error when generating the options of %s.: %s", scope, ex.getMessage()), ex);
        }
    }

    private void addRule(final WidgetTreeNode node, final ObjectNode control) {
        try {
            final var effectAnnotation = node.getAnnotation(Effect.class);
            if (effectAnnotation.isPresent()) {
                m_rulesGenerator.applyEffectTo(effectAnnotation.get(), control);
            }
        } catch (UiSchemaGenerationException ex) {
            throw new UiSchemaGenerationException(
                String.format("Error when resolving @Effect annotation for %s.: %s", getScope(node), ex.getMessage()),
                ex);
        }
    }
}
