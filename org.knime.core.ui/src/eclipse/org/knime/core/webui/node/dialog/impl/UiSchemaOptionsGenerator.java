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
package org.knime.core.webui.node.dialog.impl;

import static org.knime.core.webui.node.dialog.impl.JsonFormsUiSchemaGenerator.OPTIONS_TAG;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import org.knime.core.webui.node.dialog.ui.style.CheckboxStyle;
import org.knime.core.webui.node.dialog.ui.style.ColumnFilterStyle;
import org.knime.core.webui.node.dialog.ui.style.Style;
import org.knime.core.webui.node.dialog.ui.style.StyleProvider;
import org.knime.core.webui.node.dialog.ui.style.ValueSwitchStyle;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.ObjectReader;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ser.PropertyWriter;

/**
 *
 * @author Paul Bärnreuther
 */
final class UiSchemaOptionsGenerator {

    private static List<Class<? extends StyleProvider>> defaultStyles =
        List.of(CheckboxStyle.class, ValueSwitchStyle.class, ColumnFilterStyle.class);

    private final ObjectMapper m_mapper;

    private final PropertyWriter m_field;

    private final Class<?> m_fieldType;

    private final String m_fieldName;

    /**
     *
     * @param mapper the object mapper used for the ui schema generation
     * @param field the field for which options are to be added from  {@link Style} annotations
     */
    UiSchemaOptionsGenerator(final ObjectMapper mapper, final PropertyWriter field) {
        m_mapper = mapper;
        m_field = field;
        m_fieldType = field.getType().getRawClass();
        m_fieldName = field.getName();
    }

    /**
     * This method applies the styles of the given field to the given control as described in {@link Style}.
     * @param control
     */
    void applyStylesTo(final ObjectNode control) {
        final var applicableStyles = getApplicableStyles();
        if (applicableStyles.isEmpty()) {
            return;
        }

        ObjectReader reader;
        Object options = new Object();
        for (var style : applicableStyles) {
            reader = m_mapper.readerForUpdating(options);
            final var styleObject = style.getStyleObject();
            try {
                options = reader.readValue(m_mapper.valueToTree(styleObject).toString());
            } catch (JsonProcessingException | IllegalArgumentException ex) {
                throw new UiSchemaGenerationException("A problem occurred while applying styles", ex);
            }
        }
        control.set(OPTIONS_TAG, m_mapper.valueToTree(options));
    }

    private List<? extends StyleProvider> getApplicableStyles() {
        final var annotatedStyles = getAnnotatedStyles();
        final var applicableDefaultStyles = getApplicableDefaultStyles();
        return Stream.concat(applicableDefaultStyles.stream(), annotatedStyles.stream()).toList();
    }

    private List<? extends StyleProvider> getApplicableDefaultStyles() {
        return defaultStyles.stream().map(JsonFormsDataUtil::createInstance)
            .filter(style -> style.isApplicable(m_fieldType)).toList();
    }

    private List<? extends StyleProvider> getAnnotatedStyles() {
        var annotatedStyles = Stream.ofNullable(m_field.getAnnotation(Style.class)).map(Style::value)
            .flatMap(Arrays::stream).map(JsonFormsDataUtil::createInstance)
            .collect(Collectors.partitioningBy(style -> style.isApplicable(m_fieldType)));
        annotatedStyles.get(false).stream().findAny().ifPresent(nonApplicableStyle -> {
            throw new UiSchemaGenerationException(
                String.format("The style %s is not applicable for setting field %s with type %s", nonApplicableStyle,
                    m_fieldName, m_fieldType));
        });
        return annotatedStyles.get(true);
    }
}
