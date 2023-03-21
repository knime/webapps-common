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
 *   Mar 21, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.impl;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Stream;
import org.knime.core.webui.node.dialog.impl.ui.Layout;
import org.knime.core.webui.node.dialog.impl.ui.NotASetting;
import org.knime.core.webui.node.dialog.impl.ui.Section;
import org.knime.core.webui.node.dialog.impl.ui.UiSchemaGenerationException;
import org.knime.core.webui.node.dialog.impl.ui.style.CheckboxStyle;
import org.knime.core.webui.node.dialog.impl.ui.style.Style;
import org.knime.core.webui.node.dialog.impl.ui.style.StyleSupplier;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ser.PropertyWriter;
/**
 * Class for creating ui schema content from a settings POJO class.
 *
 * @author Paul Bärnreuther
 */
final class JsonFormsUISchemaUtil {
    static List<Class<? extends StyleSupplier>> defaultStyles = List.of(CheckboxStyle.class);
    private JsonFormsUISchemaUtil() {
        // utility class
    }
    public static ObjectNode buildUISchema(final LinkedHashMap<String, Class<? extends DefaultNodeSettings>> settings,
        final Class<?> layout) throws JsonMappingException {
        return new JsonFormsUiSchemaGenerator(settings, layout).build();
    }
    /**
     *
     * @author Paul Bärnreuther
     */
    private static class JsonFormsUiSchemaGenerator {
        private final ObjectMapper m_mapper;
        private final SerializerProvider m_serializerProvider;
        private final LinkedHashMap<String, Class<? extends DefaultNodeSettings>> m_settings;
        private final Class<?> m_layout;
        public JsonFormsUiSchemaGenerator(final LinkedHashMap<String, Class<? extends DefaultNodeSettings>> settings,
            final Class<?> layout) {
            m_settings = settings;
            m_layout = layout;
            m_mapper = JsonFormsDataUtil.getMapper();
            m_serializerProvider = m_mapper.getSerializerProviderInstance();
        }
        ObjectNode build() throws JsonMappingException {
            final var root = m_mapper.createObjectNode();
            final var layoutArrayNodes = getLayoutNodes(m_layout, root.putArray("elements"));
            addAllSettingsFieldsAsControls(m_settings, layoutArrayNodes);
            return root;
        }
        @SuppressWarnings("unchecked")
        private static Map<Class<?>, ArrayNode> getLayoutNodes(final Class<?> layout, final ArrayNode parent) {
            final var layoutNodes = new HashMap<Class<?>, ArrayNode>();
            addToLayoutArrayNodes(layoutNodes, layout, parent);
            return layoutNodes;
        }
        private static void addToLayoutArrayNodes(final HashMap<Class<?>, ArrayNode> layoutNodes,
            final Class<?> parentClass, final ArrayNode parentNode) {
            layoutNodes.put(parentClass, parentNode);
            Arrays.asList(parentClass.getDeclaredClasses()).forEach((childClass) -> {
                getLayoutNode(parentNode, childClass).ifPresent((childNode) -> {
                    addToLayoutArrayNodes(layoutNodes, childClass, childNode);
                });
            });
        }
        private static Optional<ArrayNode> getLayoutNode(final ArrayNode parentElement, final Class<?> layoutElement) {
            Optional<ArrayNode> layoutNode = Optional.empty();
            if (layoutElement.isAnnotationPresent(Section.class)) {
                layoutNode = Optional.of(addSection(layoutElement, parentElement));
            }
            return layoutNode;
        }
        private static ArrayNode addSection(final Class<?> layoutElement, final ArrayNode root) {
            final var sectionObjectNode = root.addObject();
            final var sectionAnnotation = layoutElement.getAnnotation(Section.class);
            final var label = sectionAnnotation.title();
            sectionObjectNode.put("label", label);
            sectionObjectNode.put("type", "Section");
            if (sectionAnnotation.advanced()) {
                sectionObjectNode.putObject("options").put("isAdvanced", true);
            }
            return sectionObjectNode.putArray("elements");
        }
        private void addAllSettingsFieldsAsControls(
            final LinkedHashMap<String, Class<? extends DefaultNodeSettings>> settings,
            final Map<Class<?>, ArrayNode> layoutObjectNodes) {
            settings.forEach((settingsKey, setting) -> {
                final var prefix = addPropertyToPrefix("#", settingsKey);
                final var defaultLayout = m_layout;
                addAllFields(setting, layoutObjectNodes, prefix, defaultLayout);
            });
        }
        private void addAllFields(final Class<?> clazz, final Map<Class<?>, ArrayNode> layoutArrayNodes,
            final String parentScope, final Class<?> defaultLayout) {
            final var classLayout = getClassLayout(clazz).orElse(defaultLayout);
            final var properties = getSerializableProperties(clazz);
            properties.forEachRemaining((field) -> {
                final var fieldLayout = getFieldLayout(field).orElse(classLayout);
                addField(layoutArrayNodes, parentScope, fieldLayout, field);
            });
        }
        private void addField(final Map<Class<?>, ArrayNode> layoutArrayNodes, final String parentScope,
            final Class<?> fieldLayout, final PropertyWriter field) {
            final var scope = addPropertyToPrefix(parentScope, field.getName());
            final var fieldType = field.getType().getRawClass();
            if (NotASetting.class.isAssignableFrom(fieldType)) {
                addAllFields(fieldType, layoutArrayNodes, scope, fieldLayout);
            } else {
                final var control = addControl(layoutArrayNodes.get(fieldLayout), scope);
                final var applicableStyles = getApplicableStyles(fieldType, field);
                if (applicableStyles.isEmpty()) {
                    return;
                }
                final var options = control.putObject("options");
                applicableStyles.forEach(style -> style.apply(options));
            }
        }
        private static List<? extends StyleSupplier> getApplicableStyles(final Class<?> fieldType,
            final PropertyWriter field) {
            final var applicableDefaultStyles = defaultStyles.stream().map(JsonFormsDataUtil::createInstance)
                .filter(style -> style.isApplicable(fieldType)).toList();
            final var annotatedStylesClasses =
                Optional.ofNullable(field.getAnnotation(Style.class)).map(Style::styleSuppliers);
            if (annotatedStylesClasses.isEmpty()) {
                return applicableDefaultStyles;
            }
            final var annotatedStyles =
                Arrays.asList(annotatedStylesClasses.get()).stream().map(JsonFormsDataUtil::createInstance).toList();
            final var nonApplicableStyles =
                annotatedStyles.stream().filter(style -> !style.isApplicable(fieldType)).toList();
            if (!nonApplicableStyles.isEmpty()) {
                final var firstNonApplicable = nonApplicableStyles.get(0);
                throw new UiSchemaGenerationException(
                    String.format("The style %s is not applicable for setting field %s with type %s",
                        firstNonApplicable, field.getName(), fieldType));
            }
            final var overwriteDefault = annotatedStyles.stream().anyMatch(style -> style.overwritesDefault());
            if (overwriteDefault) {
                return annotatedStyles;
            }
            return Stream.concat(annotatedStyles.stream(), applicableDefaultStyles.stream()).toList();
        }
        /**
         * @param clazz
         * @return
         */
        private Iterator<PropertyWriter> getSerializableProperties(final Class<?> clazz) {
            JsonSerializer<Object> settingsSerializer;
            try {
                settingsSerializer = m_serializerProvider.findValueSerializer(clazz);
                return settingsSerializer.properties();
            } catch (JsonMappingException ex) {
                throw new RuntimeException(ex);
            }
        }
        private static Optional<Class<?>> getClassLayout(final Class<?> settingsClass) {
            return Optional.ofNullable(settingsClass.getAnnotation(Layout.class)).map(Layout::value);
        }
        private static Optional<Class<?>> getFieldLayout(final PropertyWriter field) {
            return Optional.ofNullable(field.getAnnotation(Layout.class)).map(Layout::value);
        }
        private static String addPropertyToPrefix(final String prefix, final String property) {
            return String.format("%s/properties/%s", prefix, property);
        }
        private static ObjectNode addControl(final ArrayNode array, final String scope) {
            final var control = array.addObject();
            control.put("type", "Control");
            control.put("scope", scope);
            return control;
        }
    }
}