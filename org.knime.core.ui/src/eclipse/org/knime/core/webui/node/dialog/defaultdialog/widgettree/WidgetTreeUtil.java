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
 *   Aug 5, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.widgettree;

import java.util.Iterator;

import org.apache.commons.lang3.StringUtils;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.UiSchemaGenerationException;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.util.ArrayLayoutUtil;

import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.cfg.MapperConfig;
import com.fasterxml.jackson.databind.introspect.AnnotatedField;
import com.fasterxml.jackson.databind.ser.PropertyWriter;

/**
 * Use {@link #parseToWidgetTree} to construct a {@link WidgetTree} from a class implementing {@link WidgetGroup}.
 *
 * @author Paul Bärnreuther
 */
public class WidgetTreeUtil {

    private WidgetTreeUtil() {
        // Utility
    }

    private static ObjectMapper mapper;

    private static SerializerProvider serializerProvider;

    private static ObjectMapper getMapper() {
        if (mapper == null) {
            mapper = createMapper();
        }
        return mapper;
    }

    private static ObjectMapper createMapper() {
        var newMapper = new ObjectMapper();
        newMapper.setSerializationInclusion(Include.NON_NULL);
        newMapper.setVisibility(PropertyAccessor.ALL, Visibility.NON_PRIVATE);
        newMapper.setVisibility(PropertyAccessor.GETTER, Visibility.NONE);
        newMapper.setVisibility(PropertyAccessor.IS_GETTER, Visibility.NONE);
        newMapper.setPropertyNamingStrategy(new PropertyNamingStrategy() {
            private static final long serialVersionUID = 1L;

            @Override
            public String nameForField(final MapperConfig<?> config, final AnnotatedField field,
                final String defaultName) {
                return StringUtils.removeStart(defaultName, "m_");
            }
        });
        return newMapper;
    }

    private static SerializerProvider getSerializerProvider() {
        if (serializerProvider == null) {
            serializerProvider = getMapper().getSerializerProviderInstance();
        }
        return serializerProvider;
    }

    private static Iterator<PropertyWriter> getSerializableProperties(final Class<?> clazz) {
        try {
            final var settingsSerializer = getSerializerProvider().findValueSerializer(clazz);
            return settingsSerializer.properties();
        } catch (JsonMappingException ex) {
            throw new UiSchemaGenerationException(
                String.format("Error while obtaining serializer for class %s.", clazz.getSimpleName()), ex);
        }
    }

    /**
     * @param rootClass
     * @param settingsKey a unique identifier given to this tree (can be null). E.g. "view" or "model".
     * @return the processed tree
     */
    public static WidgetTree parseToWidgetTree(final Class<? extends WidgetGroup> rootClass, final String settingsKey) {
        final var widgetTree = new WidgetTree(rootClass::getAnnotation, rootClass, settingsKey);
        getSerializableProperties(rootClass).forEachRemaining(field -> addField(widgetTree, field));
        widgetTree.validate();
        widgetTree.postProcessAnnotations();
        return widgetTree;
    }

    private static void addField(final WidgetTree widgetTree, final PropertyWriter field) {
        final var childBuilder = widgetTree.getNextChildBuilder()//
            .withName(field.getName()) //
            .withType(field.getType().getRawClass()) //
            .withAnnotations(field::getAnnotation);
        if (field.getType().isArrayType()) {
            childBuilder.withContentType(field.getType().getContentType().getRawClass());
        }
        if (WidgetGroup.class.isAssignableFrom(field.getType().getRawClass())) {
            final var widgetGroupChild = childBuilder.buildGroup();
            @SuppressWarnings("unchecked") // checked by the if condition above
            final var widgetGroupTree =
                parseToWidgetTree((Class<? extends WidgetGroup>)field.getType().getRawClass(), null);
            widgetGroupChild.m_widgetTree = widgetGroupTree;
            widgetGroupTree.setParent(widgetGroupChild);
        } else if (ArrayLayoutUtil.isArrayLayoutField(field.getType())) {
            final var arrayChild = childBuilder.buildArray();
            @SuppressWarnings("unchecked") // checked by {@link ArrayLayoutUtil.isArrayLayoutField}
            final var elementWidgetTree =
                parseToWidgetTree((Class<? extends WidgetGroup>)field.getType().getContentType().getRawClass(), null);
            arrayChild.m_elementWidgetTree = elementWidgetTree;
            elementWidgetTree.setParent(arrayChild);
        } else {
            childBuilder.build();
        }
    }

}
