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
 *   Aug 13, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema;

import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.Schema.TAG_ALLOF;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.Schema.TAG_ANYOF;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.TAG_NOT;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.JsonFormsUiSchemaUtil.getMapper;

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.And;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.ExpressionVisitor;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.JsonFormsExpression;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.JsonFormsExpressionVisitor;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.Not;
import org.knime.core.webui.node.dialog.defaultdialog.rule.impl.Or;

import com.fasterxml.jackson.databind.node.ObjectNode;

final class SchemaInternalExpressionVisitor implements ExpressionVisitor<ObjectNode, JsonFormsExpression> {

    private JsonFormsExpressionVisitor m_atomicExpressionVisitor;

    SchemaInternalExpressionVisitor(final DefaultNodeSettingsContext context) {
        m_atomicExpressionVisitor = new SchemaInternalJsonFormsExpressionVisitor(context);
    }

    @Override
    public ObjectNode visit(final And<JsonFormsExpression> and) {
        final var conditionNode = getMapper().createObjectNode();
        final var arrayNode = conditionNode.putArray(TAG_ALLOF);
        for (var expression : and.getChildren()) {
            arrayNode.add(expression.accept(this));
        }
        return conditionNode;
    }

    @Override
    public ObjectNode visit(final Or<JsonFormsExpression> or) {
        final var conditionNode = getMapper().createObjectNode();
        final var arrayNode = conditionNode.putArray(TAG_ANYOF);
        for (var expression : or.getChildren()) {
            arrayNode.add(expression.accept(this));
        }
        return conditionNode;
    }

    @Override
    public ObjectNode visit(final Not<JsonFormsExpression> not) {
        final var conditionNode = getMapper().createObjectNode();
        conditionNode.set(TAG_NOT, not.getChildOperation().accept(this));
        return conditionNode;
    }

    @Override
    public ObjectNode visit(final JsonFormsExpression expression) {
        return expression.accept(m_atomicExpressionVisitor);
    }

}
