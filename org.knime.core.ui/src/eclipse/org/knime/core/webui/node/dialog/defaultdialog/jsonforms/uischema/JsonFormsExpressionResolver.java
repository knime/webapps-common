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
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema;

import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.FIELD_NAME_SCHEMA;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.Schema.TAG_CONST;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_CONDITIONS;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_SCOPE;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_TYPE;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.JsonFormsUiSchemaUtil.getMapper;

import org.knime.core.webui.node.dialog.defaultdialog.rule.And;
import org.knime.core.webui.node.dialog.defaultdialog.rule.ConstantExpression;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Expression;
import org.knime.core.webui.node.dialog.defaultdialog.rule.ExpressionVisitor;
import org.knime.core.webui.node.dialog.defaultdialog.rule.JsonFormsExpression;
import org.knime.core.webui.node.dialog.defaultdialog.rule.JsonFormsExpressionVisitor;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Not;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Or;
import org.knime.core.webui.node.dialog.defaultdialog.rule.ScopedExpression;

import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * A visitor used to resolve the logical operations implementing {@link Expression} and parse them to JsonForms syntax.
 *
 * @author Paul Bärnreuther
 */
class JsonFormsExpressionResolver implements ExpressionVisitor<ObjectNode, JsonFormsExpression> {

    private final JsonFormsConditionResolver m_conditionVisitor;

    private final JsonFormsExpressionNegator m_negator;

    /**
     * @param mapper
     */
    public JsonFormsExpressionResolver() {
        m_conditionVisitor = new JsonFormsConditionResolver();
        m_negator = new JsonFormsExpressionNegator(this);
    }

    /**
     * @example { "type": "AND", "conditions": { ... } }
     */
    @Override
    public ObjectNode visit(final And<JsonFormsExpression> and) {
        final var conditionNode = getMapper().createObjectNode();
        conditionNode.put(TAG_TYPE, "AND");
        addAllConditions(conditionNode, and.getChildren());
        return conditionNode;
    }

    /**
     * @example { "type": "OR", "conditions": { ... } }
     */
    @Override
    public ObjectNode visit(final Or<JsonFormsExpression> or) {
        final var conditionNode = getMapper().createObjectNode();
        conditionNode.put(TAG_TYPE, "OR");
        addAllConditions(conditionNode, or.getChildren());
        return conditionNode;
    }

    private void addAllConditions(final ObjectNode expressionNode,
        final Expression<JsonFormsExpression>[] expressions) {
        final var node = expressionNode.putArray(TAG_CONDITIONS);
        for (var expression : expressions) {
            node.add(expression.accept(this));
        }
    }

    /**
     * The "not" operation is not resolved directly but instead applies another visitor to its child component.
     */
    @Override
    public ObjectNode visit(final Not<JsonFormsExpression> not) {
        return not.getChildOperation().accept(m_negator);
    }

    /**
     * @example { "scope": "path/to/rule/source/setting", "schema": { "const": true} }
     */
    @Override
    public ObjectNode visit(final JsonFormsExpression expression) {
        return expression.accept(new JsonFormsExpressionVisitor() {

            @Override
            public ObjectNode visit(final ConstantExpression constantExpression) {
                final var conditionNode = getMapper().createObjectNode();
                if (!constantExpression.value()) {
                    conditionNode.putObject(FIELD_NAME_SCHEMA).put(TAG_CONST, true);
                }
                return conditionNode;
            }

            @Override
            public ObjectNode visit(final ScopedExpression scopedExpression) {
                final var conditionNode = getMapper().createObjectNode();
                conditionNode.put(TAG_SCOPE, scopedExpression.scope());
                conditionNode.set(FIELD_NAME_SCHEMA, scopedExpression.condition().accept(m_conditionVisitor));
                return conditionNode;
            }
        });
    }
}
