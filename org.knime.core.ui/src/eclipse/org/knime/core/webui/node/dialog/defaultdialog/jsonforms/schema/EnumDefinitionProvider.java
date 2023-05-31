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
 *   5 Nov 2021 (Marc Bux, KNIME GmbH, Berlin, Germany): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.schema;

import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.Schema.TAG_CONST;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.Schema.TAG_ONEOF;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.Schema.TAG_TITLE;

import java.util.Locale;

import org.apache.commons.lang3.StringUtils;
import org.knime.core.node.NodeLogger;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Label;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.github.victools.jsonschema.generator.CustomPropertyDefinition;
import com.github.victools.jsonschema.generator.CustomPropertyDefinitionProvider;
import com.github.victools.jsonschema.generator.FieldScope;
import com.github.victools.jsonschema.generator.SchemaGenerationContext;

/**
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
final class EnumDefinitionProvider implements CustomPropertyDefinitionProvider<FieldScope> {


    @Override
    public CustomPropertyDefinition provideCustomSchemaDefinition(final FieldScope field,
        final SchemaGenerationContext schemaContext) {
        final var type = field.getType();
        final var erasedType = type.getErasedType();

        if (type.isInstanceOf(Enum.class) && erasedType.getEnumConstants() != null) {
            final var arrayNode = determineEnumValues(schemaContext, erasedType);
            final var outerObjectNode = schemaContext.getGeneratorConfig().createObjectNode();

            outerObjectNode.set(TAG_ONEOF, arrayNode);
            return new CustomPropertyDefinition(outerObjectNode);
        }
        return null;

    }

    private ArrayNode determineEnumValues(final SchemaGenerationContext schemaContext, final Class<?> erasedType) {
        var config = schemaContext.getGeneratorConfig();
        final var arrayNode = config.createArrayNode();

        for (var enumConstant : erasedType.getEnumConstants()) {
            addEnumFieldsToArrayNode(erasedType, arrayNode, ((Enum<?>)enumConstant).name());
        }
        return arrayNode;
    }

    private void addEnumFieldsToArrayNode(final Class<?> erasedType, final ArrayNode arrayNode, final String name) {
        final var innerObjectNode = arrayNode.addObject();
        innerObjectNode.put(TAG_CONST, name);

        String title = null;
        try {
            final var field = erasedType.getField(name);
            if (field.isAnnotationPresent(Label.class)) {
                final var label = field.getAnnotation(Label.class);
                title = label.value();
            }
            if (field.isAnnotationPresent(Widget.class)) {
                throw new IllegalStateException(String.format(
                    "There is a @Widget annotation present at the enum field %s. Use the @Label annotation instead.",
                    name));
            }
        } catch (NoSuchFieldException | SecurityException e) {
            NodeLogger.getLogger(getClass()).error(String.format("Exception when accessing field %s.", name), e);
        }
        innerObjectNode.put(TAG_TITLE,
            title != null ? title : StringUtils.capitalize(name.toLowerCase(Locale.getDefault()).replace("_", " ")));
    }
}
