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
 *   Apr 4, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.impl;

import static org.knime.core.webui.node.dialog.impl.DefaultNodeSettingsService.FIELD_NAME_SCHEMA;
import static org.knime.core.webui.node.dialog.impl.JsonFormsUiSchemaGenerator.CONDITIONS_TAG;
import static org.knime.core.webui.node.dialog.impl.JsonFormsUiSchemaGenerator.SCOPE_TAG;
import static org.knime.core.webui.node.dialog.impl.JsonFormsUiSchemaGenerator.TYPE_TAG;

import java.util.List;

import org.knime.core.webui.node.dialog.ui.rule.Condition;
import org.knime.core.webui.node.dialog.ui.rule.JsonFormsCondition;
import org.knime.core.webui.node.dialog.ui.rule.Operation;
import org.knime.core.webui.node.dialog.ui.rule.OperationVisitor;
import org.knime.core.webui.node.dialog.ui.rule.Operation.And;
import org.knime.core.webui.node.dialog.ui.rule.Operation.Not;
import org.knime.core.webui.node.dialog.ui.rule.Operation.Or;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * A visitor used to resolve the logical operations implementing {@link Operation} and parse them to JsonForms syntax.
 *
 * @author Paul Bärnreuther
 */
public class JsonFormsOperationVisitor implements OperationVisitor<ObjectNode> {

    private final ObjectMapper m_mapper;

    private final JsonFormsNegatorVisitor m_negator;

    /**
     * @param mapper
     */
    public JsonFormsOperationVisitor(final ObjectMapper mapper) {
        m_mapper = mapper;
        m_negator = new JsonFormsNegatorVisitor(this, m_mapper);
    }

    /**
     * @example { "type": "AND", "conditions": { ... } }
     */
    @Override
    public ObjectNode visit(final And and) {
        final var conditionNode = m_mapper.createObjectNode();
        conditionNode.put(TYPE_TAG, "AND");
        addAllConditions(conditionNode, and.getChildren());
        return conditionNode;
    }

    /**
     * @example { "type": "OR", "conditions": { ... } }
     */
    @Override
    public ObjectNode visit(final Or or) {
        final var conditionNode = m_mapper.createObjectNode();
        conditionNode.put(TYPE_TAG, "OR");
        addAllConditions(conditionNode, or.getChildren());
        return conditionNode;
    }

    private void addAllConditions(final ObjectNode conditionNode, final List<Operation> operations) {
        final var conditions = conditionNode.putArray(CONDITIONS_TAG);
        operations.stream().map(op -> op.accept(this)).forEach(conditions::add);
    }

    /**
     * The "not" operation is not resolved directly but instead applies another visitor to its child component.
     */
    @Override
    public ObjectNode visit(final Not not) {
        return not.getChildOperation().accept(m_negator);
    }

    /**
     * @example { "scope": "path/to/rule/source/setting", "schema": { "const": true} }
     */
    @Override
    public ObjectNode visit(final Condition condition) {
        if (!(condition instanceof JsonFormsCondition)) {
            throw new UiSchemaGenerationException(String.format(
                "Trying to resolve a condition of type %s which is not possible. "
                    + "This should not happen and is probably an implementation mistake",
                condition.getClass().getSimpleName()));
        }
        return visit((JsonFormsCondition)condition);
    }

    private ObjectNode visit(final JsonFormsCondition condition) {
        final var conditionNode = m_mapper.createObjectNode();
        conditionNode.put(SCOPE_TAG, condition.scope());
        conditionNode.set(FIELD_NAME_SCHEMA, m_mapper.valueToTree(condition.schema()));
        return conditionNode;
    }
}
