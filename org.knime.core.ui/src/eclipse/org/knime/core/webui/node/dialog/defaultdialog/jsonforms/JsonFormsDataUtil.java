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
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.Comparator;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.lang3.StringUtils;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.Credentials;
import org.knime.core.webui.node.dialog.defaultdialog.setting.filechooser.FSLocationJsonSerializationUtil;

import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.cfg.MapperConfig;
import com.fasterxml.jackson.databind.introspect.AnnotatedField;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

/**
 * Utility class mainly for creating json-forms data content from a {@link DefaultNodeSettings} POJO and vice-versa.
 *
 * The following fields in a POJO are ignored:
 * <ul>
 * <li>Private fields without a getter method</li>
 * <li>Fields annotated with @JsonIgnore</li>
 * <li>Fields whose getters are annotated with. @JsonIgnore</li>
 * <li>Fields with {@code null} value</li>
 * </ul>
 * The translation furthermore follows these rules (from POJO to JSON; the inverse rules in the other direction):
 * <ul>
 * <li>"m_"-prefixes are removed.</li>
 * <li>Enums and BigDecimals are serialized as their string value.</li>
 * <li>Nested fields are translated to a nested JSON structure.</li>
 * </ul>
 *
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
public final class JsonFormsDataUtil {

    private static ObjectMapper MAPPER; // NOSONAR

    private JsonFormsDataUtil() {
        //utility class
    }

    private static ObjectMapper createMapper() {
        final var mapper = new ObjectMapper();

        mapper.registerModule(new Jdk8Module());

        mapper.registerModule(new JavaTimeModule());
        // If this serialization feature would be _enabled_, and we would not write timestamps as int,
        // this would lead to the date being written as an array in LocalDateSerializer.java
        // which is displayed by the text input as `2023,3,3`.
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        // By default periods/durations are always serialized as (numeric) timestamps, see
        // {@link SerializationFeature#WRITE_DURATIONS_AS_TIMESTAMPS}

        mapper.registerModule(createDialogModule());
        mapper.setSerializationInclusion(Include.NON_NULL);
        mapper.enable(SerializationFeature.WRITE_ENUMS_USING_TO_STRING);
        mapper.enable(DeserializationFeature.READ_ENUMS_USING_TO_STRING);
        mapper.disable(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES);
        mapper.setVisibility(PropertyAccessor.ALL, Visibility.NON_PRIVATE);
        mapper.setVisibility(PropertyAccessor.GETTER, Visibility.NONE);
        mapper.setVisibility(PropertyAccessor.IS_GETTER, Visibility.NONE);
        mapper.setPropertyNamingStrategy(new PropertyNamingStrategy() {
            private static final long serialVersionUID = 1L;

            @Override
            public String nameForField(final MapperConfig<?> config, final AnnotatedField field,
                final String defaultName) {
                return StringUtils.removeStart(defaultName, "m_");
            }
        });

        return mapper;
    }

    private static SimpleModule createDialogModule() {
        final var module = new SimpleModule();
        module.addSerializer(BigDecimal.class, new BigDecimalSerializer());
        Credentials.addSerializerAndDeserializer(module);
        FSLocationJsonSerializationUtil.addSerializerAndDeserializer(module);
        return module;
    }

    /**
     * @return the configured mapper
     */
    public static ObjectMapper getMapper() {
        if (MAPPER == null) {
            MAPPER = createMapper();
        }
        return MAPPER;
    }

    /**
     * @param settings to convert to JSON
     * @return the JSON node representing settings
     */
    public static JsonNode toJsonData(final DefaultNodeSettings settings) {
        return getMapper().valueToTree(settings);
    }

    static JsonNode toCombinedJsonData(final Map<String, DefaultNodeSettings> settings) {
        final var root = getMapper().createObjectNode();
        settings.entrySet().stream() //
            .sorted(Comparator.comparing(Entry::getKey)) //
            .forEachOrdered(e -> root.set(e.getKey(), toJsonData(e.getValue())));
        return root;
    }

    /**
     * @param <T> the type of the default node settings
     * @param jsonFormsData a json representation of the default node settings
     * @param clazz the specific class of the default node settings
     * @return an instance of type <T> deserialized from the json representation.
     * @throws JsonProcessingException
     */
    public static <T extends DefaultNodeSettings> T toDefaultNodeSettings(final JsonNode jsonFormsData,
        final Class<T> clazz) throws JsonProcessingException {
        return getMapper().treeToValue(jsonFormsData, clazz);
    }

    private static class BigDecimalSerializer extends JsonSerializer<BigDecimal> {

        /**
         * {@inheritDoc}
         */
        @Override
        public void serialize(final BigDecimal value, final JsonGenerator gen, final SerializerProvider serializers)
            throws IOException {
            gen.writeNumber(value.toPlainString());
        }

    }

}
