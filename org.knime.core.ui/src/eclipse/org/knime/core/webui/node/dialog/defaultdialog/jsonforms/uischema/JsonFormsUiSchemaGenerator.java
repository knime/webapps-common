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
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema;

import static org.knime.core.webui.node.dialog.defaultdialog.util.InstantiationUtil.createInstance;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.knime.core.util.Pair;
import org.knime.core.webui.node.dialog.defaultdialog.layout.After;
import org.knime.core.webui.node.dialog.defaultdialog.layout.Layout;
import org.knime.core.webui.node.dialog.defaultdialog.layout.LayoutGroup;
import org.knime.core.webui.node.dialog.defaultdialog.rule.JsonFormsExpression;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Signal;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Hidden;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.ser.PropertyWriter;

/**
 *
 * The UiSchema generation follows these steps:
 * <ol type="1">
 * <li>Collect all {@link Layout} and {@link Signal} annotations</li>
 * <li>Use order annotations (see e.g. {@link After}) and class hierarchies to determine a tree structure (see
 * {@link LayoutTree})</li>
 * <li>Generate the layout parts starting from the root and add the mapped controls (see
 * {@link LayoutNodesGenerator})</li>
 * </ol>
 *
 * @author Paul Bärnreuther
 */
final class JsonFormsUiSchemaGenerator {

    private final ObjectMapper m_mapper;

    private final SerializerProvider m_serializerProvider;

    private final Map<String, Class<?>> m_settings;

    JsonFormsUiSchemaGenerator(final Map<String, Class<?>> settings, final ObjectMapper mapper) {
        m_settings = settings;
        m_mapper = mapper;
        m_serializerProvider = m_mapper.getSerializerProviderInstance();
    }

    ObjectNode build() {
        final var layoutSkeleton = resolveLayout();
        return new LayoutNodesGenerator(m_mapper, layoutSkeleton).build();
    }

    static record LayoutSkeleton(LayoutTreeNode layoutTreeRoot, Map<Class<?>, JsonFormsExpression> signals) {
    }

    private LayoutSkeleton resolveLayout() {
        final var controlsAndSignals = getLayoutPartToControls();
        final var layoutClassesToControls = controlsAndSignals.getFirst();
        final var layoutTreeRoot = new LayoutTree(layoutClassesToControls).getRootNode();
        final var signals = controlsAndSignals.getSecond();
        return new LayoutSkeleton(layoutTreeRoot, signals);
    }

    /**
     * @return A mapping from classes annotated as certain layout parts (see {@link LayoutPart}) to the
     *         settings/controls associated to them by {@link Layout} annotations. If a setting has no {@Link Layout}
     *         annotation it is associated to {@code null}.
     */
    private Pair<Map<Class<?>, List<JsonFormsControl>>, Map<Class<?>, JsonFormsExpression>> getLayoutPartToControls() {
        final Map<Class<?>, List<JsonFormsControl>> layoutPartToControls = new HashMap<>();
        final Map<Class<?>, JsonFormsExpression> signals = new HashMap<>();
        m_settings.forEach((settingsKey, setting) -> {
            final var prefix = settingsKey == null ? "#" : addPropertyToPrefix("#", settingsKey);
            final Class<?> defaultLayout = null;
            addAllFields(setting, layoutPartToControls, signals, prefix, defaultLayout, false);
        });
        return new Pair<>(layoutPartToControls, signals);
    }

    private void addAllFields(final Class<?> clazz, final Map<Class<?>, List<JsonFormsControl>> layoutControls,
        final Map<Class<?>, JsonFormsExpression> signals, final String parentScope, final Class<?> defaultLayout,
        final boolean enclosingFieldSetsLayout) {
        final var layout = mergeLayouts(clazz, defaultLayout, enclosingFieldSetsLayout);
        final var properties = getSerializableProperties(clazz);
        properties.forEachRemaining(field -> addField(layoutControls, signals, parentScope, layout, field));
    }

    private Iterator<PropertyWriter> getSerializableProperties(final Class<?> clazz) {
        try {
            final var settingsSerializer = m_serializerProvider.findValueSerializer(clazz);
            return settingsSerializer.properties();
        } catch (JsonMappingException ex) {
            throw new UiSchemaGenerationException(
                String.format("Error while obtaining serializer for class %s.", clazz.getSimpleName()), ex);
        }
    }

    private static Class<?> mergeLayouts(final Class<?> clazz, final Class<?> defaultLayout,
        final boolean enclosingFieldSetsLayout) {
        final var classLayout = getClassLayout(clazz);
        if (classLayout.isPresent() && enclosingFieldSetsLayout) {
            throw new UiSchemaGenerationException(String.format(
                "The layout annotation for class %s collides with the layout annotation of the enclosing field.",
                clazz.getSimpleName()));
        }
        return classLayout.orElse(defaultLayout);
    }

    private static Optional<Class<?>> getClassLayout(final Class<?> settingsClass) {
        return Optional.ofNullable(settingsClass.getAnnotation(Layout.class)).map(Layout::value);
    }

    static record JsonFormsControl(String scope, PropertyWriter field) {
    }

    private void addField(final Map<Class<?>, List<JsonFormsControl>> layoutControls,
        final Map<Class<?>, JsonFormsExpression> signals, final String parentScope, final Class<?> defaultLayout,
        final PropertyWriter field) {
        if (isHidden(field)) {
            return;
        }
        final var scope = addPropertyToPrefix(parentScope, field.getName());
        final var fieldType = field.getType().getRawClass();
        final var layoutByFieldAnnotation = getFieldLayout(field);
        final var declaringClassLayout = getClassLayout(field.getMember().getDeclaringClass()).orElse(defaultLayout);
        final var fieldLayout = layoutByFieldAnnotation.orElse(declaringClassLayout);
        if (LayoutGroup.class.isAssignableFrom(fieldType)) {
            this.addAllFields(fieldType, layoutControls, signals, scope, fieldLayout,
                layoutByFieldAnnotation.isPresent());
        } else {
            layoutControls.compute(fieldLayout, (k, previous) -> {
                final var newControls = previous == null ? new ArrayList<JsonFormsControl>() : previous;
                newControls.add(new JsonFormsControl(scope, field));
                return newControls;
            });
            getSignal(field).ifPresent(signal -> {
                final var conditionClass = signal.condition();
                final var condition = createInstance(conditionClass);
                final var scopedSignal = new JsonFormsExpression(scope, condition);
                final var signalId = signal.id();
                signals.put(signalId.equals(Class.class) ? conditionClass : signalId, scopedSignal);
            });
        }
    }

    private static Optional<Signal> getSignal(final PropertyWriter field) {
        return Optional.ofNullable(field.getAnnotation(Signal.class));
    }

    private static boolean isHidden(final PropertyWriter field) {
        return field.getAnnotation(Hidden.class) != null;
    }

    private static Optional<Class<?>> getFieldLayout(final PropertyWriter field) {
        return Optional.ofNullable(field.getAnnotation(Layout.class)).map(Layout::value);
    }

    private static String addPropertyToPrefix(final String prefix, final String property) {
        return String.format("%s/properties/%s", prefix, property);
    }
}
