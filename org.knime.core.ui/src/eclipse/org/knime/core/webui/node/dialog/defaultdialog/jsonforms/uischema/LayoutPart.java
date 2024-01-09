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


import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.OPTIONS_IS_ADVANCED;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_ELEMENTS;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_LABEL;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_OPTIONS;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_TYPE;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TYPE_HORIZONTAL_LAYOUT;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TYPE_SECTION;

import java.util.Map;
import java.util.function.Function;

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.layout.HorizontalLayout;
import org.knime.core.webui.node.dialog.defaultdialog.layout.Section;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Effect;
import org.knime.core.webui.node.dialog.defaultdialog.rule.ScopedExpression;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 *
 * @author Paul Bärnreuther
 */
enum LayoutPart {
        SECTION(LayoutPart::getSection), //
        HORIZONTAL_LAYOUT(LayoutPart::getHorizontalLayout), //
        VIRTUAL_SECTION(LayoutNodeCreationContext::parent);

    private Function<LayoutNodeCreationContext, ArrayNode> m_create;

    LayoutPart(final Function<LayoutNodeCreationContext, ArrayNode> create) {
        m_create = create;
    }

    static LayoutPart determineFromClassAnnotation(final Class<?> clazz) {
        if (clazz == null) {
            return VIRTUAL_SECTION;
        }
        if (clazz.isAnnotationPresent(Section.class)) {
            return SECTION;
        }
        if (clazz.isAnnotationPresent(HorizontalLayout.class)) {
            return HORIZONTAL_LAYOUT;
        }
        return VIRTUAL_SECTION;
    }

    ArrayNode create(final DefaultNodeSettingsContext context, final ArrayNode parent,
        final Class<?> layoutClass, final ObjectMapper mapper, final Map<Class<?>, ScopedExpression> signals) {
        return m_create.apply(new LayoutNodeCreationContext(parent, layoutClass, mapper, signals, context));
    }

    private static ArrayNode getSection(final LayoutNodeCreationContext creationContext) {
        final var layoutClass = creationContext.layoutClass();
        final var sectionAnnotation = layoutClass.getAnnotation(Section.class);
        final var parent = creationContext.parent();
        final var node = parent.addObject();
        final var label = sectionAnnotation.title();
        node.put(TAG_LABEL, label);
        node.put(TAG_TYPE, TYPE_SECTION);
        if (sectionAnnotation.advanced()) {
            node.putObject(TAG_OPTIONS).put(OPTIONS_IS_ADVANCED, true);
        }
        applyRules(node, creationContext);
        return node.putArray(TAG_ELEMENTS);
    }

    private static ArrayNode getHorizontalLayout(final LayoutNodeCreationContext creationContext) {
        final var parent = creationContext.parent();
        final var node = parent.addObject();
        node.put(TAG_TYPE, TYPE_HORIZONTAL_LAYOUT);
        applyRules(node, creationContext);
        return node.putArray(TAG_ELEMENTS);
    }

    private static void applyRules(final ObjectNode node, final LayoutNodeCreationContext creationContext) {
        new UiSchemaRulesGenerator(creationContext.mapper(), creationContext.layoutClass.getAnnotation(Effect.class),
            creationContext.signals(), creationContext.context()).applyRulesTo(node);
    }

    private record LayoutNodeCreationContext(ArrayNode parent, Class<?> layoutClass, ObjectMapper mapper,
        Map<Class<?>, ScopedExpression> signals, DefaultNodeSettingsContext context) {
    }
}
