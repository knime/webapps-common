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
 *   Dec 4, 2022 (Adrian Nembach, KNIME GmbH, Konstanz, Germany): created
 */
package org.knime.core.webui.node.dialog.serialization.field;

import static java.util.stream.Collectors.toMap;

import java.util.Map;
import java.util.function.Function;
import java.util.stream.Stream;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.webui.node.dialog.serialization.NodeSettingsSerializer;

/**
 * Factory for default serializers that store values directly in NodeSettings.
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 * @noreference non-public API
 */
final class DefaultFieldNodeSettingsSerializerFactory {

    private static final Map<Class<?>, SerializerImpl> IMPL_MAP = Stream.of(SerializerImpl.values())//
        .collect(toMap(SerializerImpl::getFieldType, Function.identity()));

    /**
     * Creates a serializer for the provided type that uses the configKey to store and retrieve the value.
     *
     * @param <T> the type of field
     * @param fieldType the type of field the created serializer should serialize
     * @param configKey the key to use for storing and retrieving the value to and from the NodeSettings
     * @return a new serializer
     * @throws IllegalArgumentException if there is no serializer available for the provided fieldType
     */
    public static <T> NodeSettingsSerializer<T> createSerializer(final Class<T> fieldType, final String configKey) {
        var impl = IMPL_MAP.get(fieldType);
        if (impl != null) {
            return new FieldNodeSettingsSerializer<>(configKey, impl);
        } else {
            throw new IllegalArgumentException(
                String.format("No default serializer available for type '%s'.", fieldType));
        }
    }

    /**
     * When extending this enum only use lambdas if the definition fits a single line, otherwise use function references
     * as is done for {@link SerializerImpl#CHARACTER}.
     *
     * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
     */
    private enum SerializerImpl implements FieldSerializerImpl {
            INT(int.class, (s, k) -> s.getInt(k), (v, s, k) -> s.addInt(k, v)),
            DOUBLE(double.class, (s, k) -> s.getDouble(k), (v, s, k) -> s.addDouble(k, v)),
            LONG(long.class, (s, k) -> s.getLong(k), (v, s, k) -> s.addLong(k, v)),
            STRING(String.class, (s, k) -> s.getString(k), (v, s, k) -> s.addString(k, v)),
            BOOLEAN(boolean.class, (s, k) -> s.getBoolean(k), (v, s, k) -> s.addBoolean(k, v)),
            FLOAT(float.class, (s, k) -> s.getFloat(k), (v, s, k) -> s.addFloat(k, v)),
            CHAR(char.class, (s, k) -> s.getChar(k), (v, s, k) -> s.addChar(k, v)),
            CHARACTER(Character.class, SerializerImpl::loadCharacter, SerializerImpl::saveCharacter),
            // TODO how to handle CharSequence properly?
            BYTE(byte.class, (s, k) -> s.getByte(k), (v, s, k) -> s.addByte(k, v)),
            // TODO how to handle null values in boxed Byte objects? Store an array?
            INT_ARRAY(int[].class, (s, k) -> s.getIntArray(k), (v, s, k) -> s.addIntArray(k, v)),
            DOUBLE_ARRAY(double[].class, (s, k) -> s.getDoubleArray(k), (v, s, k) -> s.addDoubleArray(k, v)),
            LONG_ARRAY(long[].class, (s, k) -> s.getLongArray(k), (v, s, k) -> s.addLongArray(k, v)),
            STRING_ARRAY(String[].class, (s, k) -> s.getStringArray(k), (v, s, k) -> s.addStringArray(k, v)),
            BOOLEAN_ARRAY(boolean[].class, (s, k) -> s.getBooleanArray(k), (v, s, k) -> s.addBooleanArray(k, v)),
            FLOAT_ARRAY(float[].class, (s, k) -> s.getFloatArray(k), (v, s, k) -> s.addFloatArray(k, v)),
            CHAR_ARRAY(char[].class, (s, k) -> s.getCharArray(k), (v, s, k) -> s.addCharArray(k, v)),
            CHARACTER_ARRAY(Character[].class, SerializerImpl::loadCharacterArray, SerializerImpl::saveCharacterArray),
            BYTE_ARRAY(byte[].class, (s, k) -> s.getByteArray(k), (v, s, k) -> s.addByteArray(k, v));

        private Class<?> m_type;

        private FieldLoader<?> m_loader;

        private FieldSaver<?> m_saver;

        private <T> SerializerImpl(final Class<T> type, final FieldLoader<T> loader, final FieldSaver<T> saver) {
            m_type = type;
            m_loader = loader;
            m_saver = saver;
        }

        Class<?> getFieldType() {
            return m_type;
        }

        @Override
        @SuppressWarnings("unchecked")
        public <T> T load(final NodeSettingsRO settings, final String configKey) throws InvalidSettingsException {
            return (T)m_loader.load(settings, configKey);
        }

        @Override
        public <T> void save(final T obj, final NodeSettingsWO settings, final String configKey) {
            @SuppressWarnings("unchecked") // type-safety is ensured via the constructor
            var saver = (FieldSaver<T>)m_saver;
            saver.save(obj, settings, configKey);
        }

        private static Character loadCharacter(final NodeSettingsRO settings, final String configKey)
            throws InvalidSettingsException {
            var stringRepresentation = settings.getString(configKey);
            if (stringRepresentation == null) {
                return null;
            } else {
                return stringRepresentation.charAt(0);
            }
        }

        private static void saveCharacter(final Character value, final NodeSettingsWO settings,
            final String configKey) {
            if (value == null) {
                settings.addString(configKey, null);
            } else {
                settings.addString(configKey, value.toString());
            }
        }

        private static Character[] loadCharacterArray(final NodeSettingsRO settings, final String configKey)
            throws InvalidSettingsException {
            return Stream.of(settings.getStringArray(configKey))//
                .map(s -> s == null ? null : s.charAt(0))//
                .toArray(Character[]::new);
        }

        private static void saveCharacterArray(final Character[] value, final NodeSettingsWO settings,
            final String configKey) {
            var stringArray = Stream.of(value).map(c -> c == null ? null : c.toString()).toArray(String[]::new);
            settings.addStringArray(configKey, stringArray);
        }

    }

    private DefaultFieldNodeSettingsSerializerFactory() {

    }

}
