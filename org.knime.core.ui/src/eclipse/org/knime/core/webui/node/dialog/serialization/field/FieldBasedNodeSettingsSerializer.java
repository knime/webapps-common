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
 *   Nov 14, 2022 ("Adrian Nembach, KNIME GmbH, Konstanz, Germany"): created
 */
package org.knime.core.webui.node.dialog.serialization.field;

import static java.util.stream.Collectors.toMap;

import java.lang.reflect.Field;
import java.util.Map;
import java.util.stream.Stream;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.defaultnodesettings.SettingsModel;
import org.knime.core.webui.node.dialog.impl.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.serialization.CustomNodeSettingsSerializer;
import org.knime.core.webui.node.dialog.serialization.NodeSettingsSerializer;

/**
 * Performs serialization of DefaultNodeSettings on a per-field basis. The serialization of individual fields can be
 * controlled with the {@link FieldSerialization} annotation.
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 * @param <S> The concrete {@link DefaultNodeSettings} class
 * @noreference non-public API
 * @noinstantiate non-public API
 */
public final class FieldBasedNodeSettingsSerializer<S extends DefaultNodeSettings>
    implements NodeSettingsSerializer<S> {

    private final Map<String, NodeSettingsSerializer<?>> m_serializers;

    private final Class<S> m_settingsClass;

    /**
     * Constructor.
     *
     * @param settingsClass the class of settings to serialize
     */
    public FieldBasedNodeSettingsSerializer(final Class<S> settingsClass) {
        m_serializers = createSerializers(settingsClass);
        m_settingsClass = settingsClass;
    }

    private static Map<String, NodeSettingsSerializer<?>>
        createSerializers(final Class<? extends DefaultNodeSettings> settingsClass) {
        return Stream.of(settingsClass.getDeclaredFields())//
            .collect(toMap(Field::getName, FieldBasedNodeSettingsSerializer::createSerializerForField));
    }

    private static NodeSettingsSerializer<?> createSerializerForField(final Field field) {
        var serialization = field.getAnnotation(FieldSerialization.class);
        var type = field.getType();
        if (DefaultNodeSettings.class.isAssignableFrom(type)) {
            // TODO support nested DefaultNodeSettings i.e. fields that are themselves DefaultNodeSettings
            throw new UnsupportedOperationException("Nested DefaultNodeSettings aren't supported yet.");
        }
        if (serialization != null) {
            return createSerializerFromSerializationAnnotation(serialization, field);
        } else {
            return DefaultFieldNodeSettingsSerializerFactory.createSerializer(field.getType(),
                extractConfigKeyFromFieldName(field.getName()));
        }
    }

    private static String extractConfigKeyFromFieldName(final String fieldName) {
        if (fieldName.startsWith("m_")) {
            return fieldName.substring(2);
        } else {
            return fieldName;
        }
    }

    private static NodeSettingsSerializer<?>
        createSerializerFromSerializationAnnotation(final FieldSerialization serialization, final Field field) {
        var customSerializerClass = serialization.customSerializer();
        if (!customSerializerClass.equals(CustomNodeSettingsSerializer.class)) {
            return CustomNodeSettingsSerializer.createInstance(customSerializerClass);
        }
        var settingsModelClass = serialization.settingsModel();
        var configKey = serialization.configKey();
        if (configKey.strip().equals("")) {
            configKey = extractConfigKeyFromFieldName(field.getName());
        }
        if (!settingsModelClass.equals(SettingsModel.class)) {
            return SettingsModelFieldNodeSettingsSerializerFactory.createSerializer(field.getType(), settingsModelClass,
                configKey);
        }
        return DefaultFieldNodeSettingsSerializerFactory.createSerializer(field.getType(), configKey);
    }

    @SuppressWarnings("unchecked")
    private static <T> void uncheckedSave(final NodeSettingsSerializer<T> serializer, final Object value,
        final NodeSettingsWO nodeSettings) {
        serializer.save((T)value, nodeSettings);
    }

    @Override
    public void save(final S obj, final NodeSettingsWO settings) {
        try {
            useBlackMagicToAccessFields((serializer, field) -> uncheckedSave(serializer, field.get(obj), settings));
        } catch (InvalidSettingsException ex) {
            // because the origin of the InvalidSettingsException would be our SerializerConsumer which does not
            // throw such an exception
            throw new IllegalStateException("This catch block is not supposed to be reachable.");
        }
    }

    @Override
    public S load(final NodeSettingsRO settings) throws InvalidSettingsException {
        final var loaded = DefaultNodeSettings.createSettings(m_settingsClass);
        useBlackMagicToAccessFields((serializer, field) -> field.set(loaded, serializer.load(settings)));
        return loaded;
    }

    @FunctionalInterface
    private interface SerializerConsumer {
        void accept(final NodeSettingsSerializer<?> serializer, final Field field)
            throws InvalidSettingsException, IllegalAccessException;
    }

    private void useBlackMagicToAccessFields(final SerializerConsumer consumer) throws InvalidSettingsException {
        for (var field : m_settingsClass.getDeclaredFields()) {
            try {
                field.setAccessible(true);
                var serializer = m_serializers.get(field.getName());
                consumer.accept(serializer, field);
            } catch (IllegalAccessException ex) {
                // because we use black magic (Field#setAccessible) to make the field accessible
                throw new IllegalStateException("This catch block is not supposed to be reachable.");
            }
        }
    }

}
