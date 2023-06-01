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
 *   Apr 6, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema;

import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.Schema.TAG_CONST;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.Schema.TAG_ITEMS_MIN;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.Schema.TAG_ONEOF;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.Schema.TAG_PROPERTIES;

import org.knime.core.webui.node.dialog.defaultdialog.rule.ConditionVisitor;
import org.knime.core.webui.node.dialog.defaultdialog.rule.FalseCondition;
import org.knime.core.webui.node.dialog.defaultdialog.rule.HasMultipleItemsCondition;
import org.knime.core.webui.node.dialog.defaultdialog.rule.IsSpecificStringCondition;
import org.knime.core.webui.node.dialog.defaultdialog.rule.OneOfEnumCondition;
import org.knime.core.webui.node.dialog.defaultdialog.rule.TrueCondition;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnselection.IsSpecificColumnCondition;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 *
 * @author Paul Bärnreuther
 */
class JsonFormsConditionResolver implements ConditionVisitor<ObjectNode> {

    private final ObjectMapper m_mapper;

    /**
     * @param mapper
     */
    public JsonFormsConditionResolver(final ObjectMapper mapper) {
        m_mapper = mapper;
    }

    @Override
    public <E extends Enum<E>> ObjectNode visit(final OneOfEnumCondition<E> oneOfEnumCondition) {
        final var node = m_mapper.createObjectNode();
        final var oneOf = node.putArray(TAG_ONEOF);
        for (var option : oneOfEnumCondition.oneOf()) {
            oneOf.addObject().put(TAG_CONST, option.toString());
        }
        return node;
    }

    @Override
    public ObjectNode visit(final TrueCondition trueCondition) {
        return m_mapper.createObjectNode().put(TAG_CONST, true);
    }

    @Override
    public ObjectNode visit(final FalseCondition falseCondition) {
        return m_mapper.createObjectNode().put(TAG_CONST, false);
    }

    @Override
    public ObjectNode visit(final HasMultipleItemsCondition hasMultipleItemsCondition) {
        return m_mapper.createObjectNode().put(TAG_ITEMS_MIN, 2);
    }

    @Override
    public ObjectNode visit(final IsSpecificColumnCondition isSpecificColumnCondition) {
        final var condition = m_mapper.createObjectNode();
        condition //
            .putObject(TAG_PROPERTIES).putObject(IsSpecificColumnCondition.PROPERTY_NAME) //
            .put(TAG_CONST, isSpecificColumnCondition.getColumnName());
        return condition;
    }

    @Override
    public ObjectNode visit(final IsSpecificStringCondition isSpecificStringCondition) {
        return m_mapper.createObjectNode() //
            .put(TAG_CONST, isSpecificStringCondition.getValue());
    }

}
