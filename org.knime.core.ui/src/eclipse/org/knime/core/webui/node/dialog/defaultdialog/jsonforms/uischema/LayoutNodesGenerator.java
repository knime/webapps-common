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

import java.util.Map;

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.SettingsCreationContext;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.UiSchemaDefaultNodeSettingsTraverser.JsonFormsControl;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Effect;
import org.knime.core.webui.node.dialog.defaultdialog.rule.JsonFormsExpression;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 *
 * @author Paul Bärnreuther
 */
final class LayoutNodesGenerator {

    private final ObjectMapper m_mapper;

    private final LayoutTreeNode m_rootLayoutTree;

    private Map<Class<?>, JsonFormsExpression> m_signals;

    private final SettingsCreationContext m_settingsCreationContext;

    static record LayoutSkeleton(LayoutTreeNode layoutTreeRoot, Map<Class<?>, JsonFormsExpression> signals) {
    }

    /**
     * @param layout a record containing controls (as a mapping between layout parts and their contained settings
     *            controls) and a ruleSourcesMap (the mapping between ids of rule sources to their conditions)
     * @param mapper the object mapper used for the ui schema generation
     * @param context the settings creation context with access to the input ports
     */
    LayoutNodesGenerator(final LayoutSkeleton layout, final ObjectMapper mapper,
        final SettingsCreationContext context) {
        m_mapper = mapper;
        m_signals = layout.signals();
        m_rootLayoutTree = layout.layoutTreeRoot();
        m_settingsCreationContext = context;
    }

    ObjectNode build() {
        final var rootNode = m_mapper.createObjectNode();
        buildLayout(m_rootLayoutTree, rootNode.putArray(TAG_ELEMENTS));
        return rootNode;
    }

    private void buildLayout(final LayoutTreeNode rootNode, final ArrayNode parentNode) {
        final var layoutPart = LayoutPart.determineFromClassAnnotation(rootNode.getValue());
        final var layoutNode = layoutPart.create(parentNode, rootNode.getValue(), m_mapper, m_signals);
        rootNode.getControls().forEach(control -> addControlElement(layoutNode, control));
        rootNode.getChildren().forEach(childLayoutNode -> buildLayout(childLayoutNode, layoutNode));
    }

    private void addControlElement(final ArrayNode root, final JsonFormsControl controlElement) {
        final var control = root.addObject().put(TAG_TYPE, TYPE_CONTROL).put(TAG_SCOPE, controlElement.scope());
        final var field = controlElement.field();
        new UiSchemaOptionsGenerator(m_mapper, field, m_settingsCreationContext).addOptionsTo(control);
        new UiSchemaRulesGenerator(m_mapper, field.getAnnotation(Effect.class), m_signals).applyRulesTo(control);
    }
}
