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
package org.knime.core.webui.node.dialog.impl;

import static org.knime.core.webui.node.dialog.impl.JsonFormsSchemaUtil.TAG_ANYOF;
import static org.knime.core.webui.node.dialog.impl.JsonFormsSchemaUtil.TAG_CONST;
import static org.knime.core.webui.node.dialog.impl.JsonFormsSchemaUtil.TAG_ONEOF;
import static org.knime.core.webui.node.dialog.impl.JsonFormsSchemaUtil.TAG_TITLE;

import org.apache.commons.lang3.StringUtils;
import org.knime.core.node.NodeLogger;
import org.knime.core.webui.node.dialog.impl.DefaultNodeSettings.SettingsCreationContext;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.github.victools.jsonschema.generator.CustomPropertyDefinition;
import com.github.victools.jsonschema.generator.CustomPropertyDefinitionProvider;
import com.github.victools.jsonschema.generator.FieldScope;
import com.github.victools.jsonschema.generator.SchemaGenerationContext;

/**
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
final class ChoicesAndEnumDefinitionProvider implements CustomPropertyDefinitionProvider<FieldScope> {

    private final SettingsCreationContext m_settingsContext;

    @SuppressWarnings("unused")
    private final DefaultNodeSettings m_settings;

    ChoicesAndEnumDefinitionProvider(final SettingsCreationContext settingsContext,
        final DefaultNodeSettings settings) {
        m_settingsContext = settingsContext;
        m_settings = settings;
    }

    private Schema m_lastSchemaWithColumns;

    @Override
    public CustomPropertyDefinition provideCustomSchemaDefinition(final FieldScope field,
        final SchemaGenerationContext schemaContext) {
        ArrayNode arrayNode = null;
        final var type = field.getType();
        final var erasedType = type.getErasedType();
        final var schema = field.getAnnotation(Schema.class);

        if (hasChoices(schema, field)) {
            if (type.canCreateSubtype(ColumnFilter.class)) {
                m_lastSchemaWithColumns = schema;
            } else {
                arrayNode = determineChoiceValues(schemaContext, schema.choices());
            }
        }
        if (usesCachedChoices(schema)) {
            arrayNode = determineChoiceValues(schemaContext, m_lastSchemaWithColumns.choices());
        }
        if (type.isInstanceOf(Enum.class) && erasedType.getEnumConstants() != null) {
            arrayNode = determineEnumValues(schemaContext, erasedType);
        }
        if (arrayNode == null) {
            return null;
        }

        final var outerObjectNode = schemaContext.getGeneratorConfig().createObjectNode();

        outerObjectNode.set(determineEnumTagType(field), arrayNode);
        return new CustomPropertyDefinition(outerObjectNode);
    }

    private static boolean hasChoices(final Schema schema, final FieldScope field) {
        return schema != null && !schema.choices().equals(ChoicesProvider.class) && !field.isFakeContainerItemScope();
    }

    private boolean usesCachedChoices(final Schema schema) {
        return schema != null && schema.takeChoicesFromParent() && m_lastSchemaWithColumns != null;
    }

    private ArrayNode determineChoiceValues(final SchemaGenerationContext schemaContext,
        final Class<? extends ChoicesProvider> choicesProviderClass) {
        return new ChoicesArrayNodeGenerator(schemaContext, m_settingsContext).createChoicesNode(choicesProviderClass);
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
            if (field.isAnnotationPresent(Schema.class)) {
                final var schema = field.getAnnotation(Schema.class);
                if (schema.title().length() > 0) {
                    title = schema.title();
                }
            }
        } catch (NoSuchFieldException | SecurityException e) {
            NodeLogger.getLogger(getClass()).error(String.format("Exception when accessing field %s.", name), e);
        }
        innerObjectNode.put(TAG_TITLE,
            title != null ? title : StringUtils.capitalize(name.toLowerCase().replace("_", " ")));
    }

    private static String determineEnumTagType(final FieldScope field) {
        final var schema = field.getAnnotationConsideringFieldAndGetter(Schema.class);
        if (schema != null && schema.multiple()) {
            return TAG_ANYOF;
        } else {
            return TAG_ONEOF;
        }
    }
}
