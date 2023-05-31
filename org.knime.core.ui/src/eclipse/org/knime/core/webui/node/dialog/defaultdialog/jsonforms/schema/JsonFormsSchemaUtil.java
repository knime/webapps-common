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
 *   19 Oct 2021 (Marc Bux, KNIME GmbH, Berlin, Germany): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.schema;

import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.VERSION;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.Schema.TAG_PROPERTIES;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.Schema.TAG_TYPE;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.Schema.TYPE_OBJECT;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.MonthDay;
import java.time.Period;
import java.time.Year;
import java.time.YearMonth;
import java.time.ZoneOffset;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.SettingsCreationContext;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsDataUtil;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.ConfigKeyUtil;
import org.knime.core.webui.node.dialog.defaultdialog.util.InstantiationUtil;
import org.knime.core.webui.node.dialog.defaultdialog.widget.NumberInputWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.NumberInputWidget.DoubleProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.TextInputWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;

import com.fasterxml.classmate.ResolvedType;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.github.victools.jsonschema.generator.FieldScope;
import com.github.victools.jsonschema.generator.Option;
import com.github.victools.jsonschema.generator.OptionPreset;
import com.github.victools.jsonschema.generator.SchemaGenerationContext;
import com.github.victools.jsonschema.generator.SchemaGenerator;
import com.github.victools.jsonschema.generator.SchemaGeneratorConfigBuilder;

/**
 *
 * Utility class for creating schema content from a settings POJO class.
 *
 * The JSON Forms schema mimics the structure of the Json Forms data while providing the following information for the
 * respective data entries:
 * <ul>
 * <li>type</li>
 * <li>title</li>
 * <li>description</li>
 * <li>validity</li>
 * </ul>
 * The type is recognized automatically using the same mapper between POJO and json as in {@link JsonFormsDataUtil}.
 *
 * The other information can be controlled by using the {@link Widget @Widget} annotation and other field specific
 * widget annotations (e.g. {@link NumberInputWidget}) on the fields in the POJO class.
 *
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
public final class JsonFormsSchemaUtil {

    private static final Set<Class<?>> PROHIBITED_TYPES =
        Stream.of(Boolean.class, Integer.class, Long.class, short.class, Short.class, Double.class, Float.class)
            .collect(Collectors.toCollection(HashSet::new));

    private JsonFormsSchemaUtil() {
        // utility class
    }

    /**
     * @param settingsClasses the classes
     * @param settings the instances
     * @param context the creation context with access to the input ports
     * @param mapper the object mapper to be used
     * @return a schema representation
     */
    public static JsonNode buildCombinedSchema(final Map<String, Class<? extends DefaultNodeSettings>> settingsClasses,
        final SettingsCreationContext context, final ObjectMapper mapper) {
        final var root = mapper.createObjectNode();
        root.put(TAG_TYPE, TYPE_OBJECT);
        final var properties = root.putObject(TAG_PROPERTIES);
        settingsClasses.entrySet().stream()
            .forEach(e -> properties.set(e.getKey(), buildSchema(e.getValue(), context, mapper)));
        return root;
    }

    /**
     * Build an incomplete schema from a provided POJO class. The settings are incomplete, since they might be missing
     * some default values and oneOf / anyOf choices, which can only be derived from port object specs.
     *
     * @param settingsClass
     * @param mapper to be used to map to json
     * @return a schema representation of settingsClass
     */
    public static ObjectNode buildIncompleteSchema(final Class<?> settingsClass, final ObjectMapper mapper) {
        return buildSchema(settingsClass, null, mapper);
    }

    @SuppressWarnings("javadoc")
    public static ObjectNode buildSchema(final Class<?> settingsClass, final SettingsCreationContext context,
        final ObjectMapper mapper) {
        final var builder = new SchemaGeneratorConfigBuilder(mapper, VERSION, new OptionPreset(//
            Option.ADDITIONAL_FIXED_TYPES, //
            Option.EXTRA_OPEN_API_FORMAT_VALUES, //
            Option.FLATTENED_ENUMS, //
            Option.EXTRA_OPEN_API_FORMAT_VALUES, //
            Option.PUBLIC_NONSTATIC_FIELDS, //
            Option.NONPUBLIC_NONSTATIC_FIELDS_WITHOUT_GETTERS, //
            Option.NONPUBLIC_NONSTATIC_FIELDS_WITH_GETTERS, //
            Option.INLINE_ALL_SCHEMAS, //
            Option.ALLOF_CLEANUP_AT_THE_END));

        builder.forFields()
            .withIgnoreCheck(f -> f.isPrivate() || PROHIBITED_TYPES.contains(f.getType().getErasedType()));

        builder.forFields().withCustomDefinitionProvider(new EnumDefinitionProvider());

        builder.forFields().withDefaultResolver(new DefaultResolver(context));

        builder.forFields()
            .withTitleResolver(field -> Optional.ofNullable(field.getAnnotationConsideringFieldAndGetter(Widget.class))
                .map(Widget::title).filter(l -> !field.isFakeContainerItemScope() && !l.isEmpty()).orElse(null));

        builder.forFields()
            .withDescriptionResolver(field -> Optional
                .ofNullable(field.getAnnotationConsideringFieldAndGetter(Widget.class)).map(Widget::description)
                .filter(d -> !field.isFakeContainerItemScope() && !d.isEmpty()).orElse(null));

        builder.forFields().withNumberInclusiveMinimumResolver(
            field -> Optional.ofNullable(field.getAnnotationConsideringFieldAndGetter(NumberInputWidget.class))//
                .filter(numberInput -> !field.isFakeContainerItemScope())//
                .map(numberInput -> resolveDouble(context, numberInput.minProvider(), numberInput.min()))//
                .orElse(null));

        builder.forFields().withNumberInclusiveMaximumResolver(
            field -> Optional.ofNullable(field.getAnnotationConsideringFieldAndGetter(NumberInputWidget.class))//
                .filter(numberInput -> !field.isFakeContainerItemScope())//
                .map(numberInput -> resolveDouble(context, numberInput.maxProvider(), numberInput.max()))//
                .orElse(null));

        builder.forFields().withStringMinLengthResolver(
            field -> Optional.ofNullable(field.getAnnotationConsideringFieldAndGetter(TextInputWidget.class))//
                .filter(textInput -> !field.isFakeContainerItemScope())//
                .map(textInput -> textInput.minLength())//
                .filter(length -> length >= 0)//
                .orElse(null));

        builder.forFields().withStringMaxLengthResolver(
            field -> Optional.ofNullable(field.getAnnotationConsideringFieldAndGetter(TextInputWidget.class))//
                .filter(textInput -> !field.isFakeContainerItemScope())//
                .map(textInput -> textInput.maxLength())//
                .filter(length -> length >= 0)//
                .orElse(null));

        builder.forFields().withStringPatternResolver(
            field -> Optional.ofNullable(field.getAnnotationConsideringFieldAndGetter(TextInputWidget.class))//
                .filter(textInput -> !field.isFakeContainerItemScope())//
                .map(textInput -> textInput.pattern())//
                .filter(pattern -> !pattern.isEmpty())//
                .orElse(null));

        builder.forFields().withPropertyNameOverrideResolver(
            field -> field.getName().startsWith("m_") ? field.getName().substring(2) : field.getName());

        builder.forFields().withInstanceAttributeOverride(JsonFormsSchemaUtil::addConfigKeys);

        builder.forFields().withTargetTypeOverridesResolver(JsonFormsSchemaUtil::overrideClass);

        return new SchemaGenerator(builder.build()).generateSchema(settingsClass);
    }

    private static BigDecimal resolveDouble(final SettingsCreationContext context,
        final Class<? extends DoubleProvider> providerClass, final double value) {
        if (!DoubleProvider.class.equals(providerClass)) {
            var provider = InstantiationUtil.createInstance(providerClass);
            return BigDecimal.valueOf(provider.getValue(context));
        }
        if (!Double.isNaN(value)) {
            return BigDecimal.valueOf(value);
        }
        return null;
    }

    /** Add a "configKeys" array to the field if a custom persistor is used */
    private static void addConfigKeys(final ObjectNode node, final FieldScope field,
        final SchemaGenerationContext context) {
        var configKeys = ConfigKeyUtil.getConfigKeysUsedByField(field.getRawMember());
        if (configKeys.length > 0) {
            var configKeysNode = context.getGeneratorConfig().createArrayNode();
            Arrays.stream(configKeys).forEach(configKeysNode::add);
            node.set("configKeys", configKeysNode);
        }
    }

    private static List<ResolvedType> overrideClass(final FieldScope field) {
        // override class regardless of @Widget annotation
        if (field.isFakeContainerItemScope()) {
            return Collections.emptyList();
        }
        return javaTimeToNumeric(field);
    }

    private static List<ResolvedType> javaTimeToNumeric(final FieldScope field) {
        final var ctx = field.getContext();
        final var fieldClass = field.getDeclaredType().getErasedType();
        // Make java.time types that are not supported out-of-the-box by JSONForms map to supported fallback types
        // explicitly, otherwise they get mapped to "object" and result in "No applicable renderer found".
        if (Duration.class.equals(fieldClass) || Year.class.equals(fieldClass)) {
            // Make `{... "type":"object"}` become `{... "format":"int32","type":"integer"}`,
            // otherwise we get "No applicable renderer found", even if we overwrite the config for e.g. Duration
            // on the mapper in the *DataUtil:
            //  mapper.configOverride(Duration.class)
            //    .setFormat(JsonFormat.Value.forShape(JsonFormat.Shape.NUMBER)); // NOSONAR
            return List.of(ctx.resolve(int.class));
        }
        if (MonthDay.class.equals(fieldClass) || YearMonth.class.equals(fieldClass)
            || ZoneOffset.class.equals(fieldClass) || Period.class.equals(fieldClass)) {
            // make `{... "type":"object"}` become `{... "type":"string"}`
            return List.of(ctx.resolve(String.class));
        }
        return Collections.emptyList();
    }
}
