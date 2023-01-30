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
package org.knime.core.webui.node.dialog.persistence.field;

import static java.util.stream.Collectors.toMap;

import java.util.Map;
import java.util.function.Function;
import java.util.stream.Stream;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.webui.node.dialog.persistence.NodeSettingsPersistor;

/**
 * Factory for default persistors that store values directly in NodeSettings.
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 */
final class DefaultFieldNodeSettingsPersistorFactory {

    private static final Map<Class<?>, PersistorImpl> IMPL_MAP = Stream.of(PersistorImpl.values())//
        .collect(toMap(PersistorImpl::getFieldType, Function.identity()));

    private static final Map<Class<?>, OptionalPersistorImpl> IMPL_OPT_MAP = Stream.of(OptionalPersistorImpl.values())//
        .collect(toMap(OptionalPersistorImpl::getFieldType, Function.identity()));

    /**
     * Creates a persistor for the provided type that uses the configKey to store and retrieve the value.
     *
     * @param <T> the type of field
     * @param fieldType the type of field the created persistor should persist
     * @param configKey the key to use for storing and retrieving the value to and from the NodeSettings
     * @return a new persistor
     * @throws IllegalArgumentException if there is no persistor available for the provided fieldType
     */
    public static <T> NodeSettingsPersistor<T> createPersistor(final Class<T> fieldType, final String configKey) {
        var impl = IMPL_MAP.get(fieldType);
        return createPersistorFromImpl(fieldType, configKey, impl);
    }

    /**
     * Creates a persistor for the provided type that uses the configKey to store and retrieve the value. For types in
     * {@link OptionalPersistorImpl} the returned persistor uses a default value when no field with the given configKey
     * is present during loading.
     *
     * @param <T> the type of field
     * @param fieldType the type of field the created persistor should persist
     * @param configKey the key to use for storing and retrieving the value to and from the NodeSettings
     * @return a new persistor
     * @throws IllegalArgumentException if there is no persistor available for the provided fieldType
     */
    @SuppressWarnings("java:S1166") // we accept that the illegalArgumentException is not thrown
    public static <T> NodeSettingsPersistor<T> createOptionalPersistor(final Class<T> fieldType,
        final String configKey) {
        var impl = IMPL_OPT_MAP.get(fieldType);
        try {
            return createPersistorFromImpl(fieldType, configKey, impl);
        } catch (IllegalArgumentException ex) {
            return createPersistor(fieldType, configKey);
        }
    }

    private static <T> NodeSettingsPersistor<T> createPersistorFromImpl(final Class<T> fieldType,
        final String configKey, final FieldPersistor impl) {
        if (impl != null) {
            return new FieldNodeSettingsPersistor<>(configKey, impl);
        } else if (fieldType.isEnum()) {
            return createEnumPersistor(configKey, fieldType);
        } else {
            throw new IllegalArgumentException(
                String.format("No default persistor available for type '%s'.", fieldType));
        }
    }

    /**
     * When extending this enum only use lambdas if the definition fits a single line, otherwise use function references
     * as is done for {@link PersistorImpl#CHARACTER}.
     *
     * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
     */
    private enum PersistorImpl implements FieldPersistor {
            INT(int.class, (s, k) -> s.getInt(k), (v, s, k) -> s.addInt(k, v)),
            DOUBLE(double.class, (s, k) -> s.getDouble(k), (v, s, k) -> s.addDouble(k, v)),
            LONG(long.class, (s, k) -> s.getLong(k), (v, s, k) -> s.addLong(k, v)),
            STRING(String.class, (s, k) -> s.getString(k), (v, s, k) -> s.addString(k, v)),
            BOOLEAN(boolean.class, (s, k) -> s.getBoolean(k), (v, s, k) -> s.addBoolean(k, v)),
            FLOAT(float.class, (s, k) -> s.getFloat(k), (v, s, k) -> s.addFloat(k, v)),
            CHAR(char.class, (s, k) -> s.getChar(k), (v, s, k) -> s.addChar(k, v)),
            BYTE(byte.class, (s, k) -> s.getByte(k), (v, s, k) -> s.addByte(k, v)),
            INT_ARRAY(int[].class, (s, k) -> s.getIntArray(k), (v, s, k) -> s.addIntArray(k, v)),
            DOUBLE_ARRAY(double[].class, (s, k) -> s.getDoubleArray(k), (v, s, k) -> s.addDoubleArray(k, v)),
            LONG_ARRAY(long[].class, (s, k) -> s.getLongArray(k), (v, s, k) -> s.addLongArray(k, v)),
            STRING_ARRAY(String[].class, (s, k) -> s.getStringArray(k), (v, s, k) -> s.addStringArray(k, v)),
            BOOLEAN_ARRAY(boolean[].class, (s, k) -> s.getBooleanArray(k), (v, s, k) -> s.addBooleanArray(k, v)),
            FLOAT_ARRAY(float[].class, (s, k) -> s.getFloatArray(k), (v, s, k) -> s.addFloatArray(k, v)),
            CHAR_ARRAY(char[].class, (s, k) -> s.getCharArray(k), (v, s, k) -> s.addCharArray(k, v)),
            BYTE_ARRAY(byte[].class, (s, k) -> s.getByteArray(k), (v, s, k) -> s.addByteArray(k, v));

        private Class<?> m_type;

        private FieldLoader<?> m_loader;

        private FieldSaver<?> m_saver;

        private <T> PersistorImpl(final Class<T> type, final FieldLoader<T> loader, final FieldSaver<T> saver) {
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

    }

    /**
     * @author Paul Bärnreuther
     */
    @SuppressWarnings("java:S3878") // we accept empty array as arguments
    private enum OptionalPersistorImpl implements FieldPersistor {
            INT(int.class, (s, k) -> s.getInt(k, 0), (v, s, k) -> s.addInt(k, v)),
            DOUBLE(double.class, (s, k) -> s.getDouble(k, 0d), (v, s, k) -> s.addDouble(k, v)),
            LONG(long.class, (s, k) -> s.getLong(k, 0l), (v, s, k) -> s.addLong(k, v)),
            STRING(String.class, (s, k) -> s.getString(k, ""), (v, s, k) -> s.addString(k, v)),
            BOOLEAN(boolean.class, (s, k) -> s.getBoolean(k, false), (v, s, k) -> s.addBoolean(k, v)),
            DOUBLE_ARRAY(double[].class, (s, k) -> s.getDoubleArray(k, new double[0]),
                (v, s, k) -> s.addDoubleArray(k, v)),
            STRING_ARRAY(String[].class, (s, k) -> s.getStringArray(k, new String[0]),
                (v, s, k) -> s.addStringArray(k, v));

        private Class<?> m_type;

        private FieldLoader<?> m_loader;

        private FieldSaver<?> m_saver;

        <T> OptionalPersistorImpl(final Class<T> type, final FieldLoader<T> loader, final FieldSaver<T> saver) {
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

    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    private static <T> NodeSettingsPersistor<T> createEnumPersistor(final String configKey, final Class<T> fieldType) {
        return new EnumFieldPersistor<>(configKey, (Class)fieldType);
    }

    private static final class EnumFieldPersistor<E extends Enum<E>> implements NodeSettingsPersistor<E> {

        private final String m_configKey;

        private final Class<E> m_enumClass;

        EnumFieldPersistor(final String configKey, final Class<E> enumClass) {
            m_enumClass = enumClass;
            m_configKey = configKey;
        }

        @Override
        public E load(final NodeSettingsRO settings) throws InvalidSettingsException {
            var name = settings.getString(m_configKey);
            try {
                return name == null ? null : Enum.valueOf(m_enumClass, name);
            } catch (IllegalArgumentException ex) {
                throw new InvalidSettingsException(
                    String.format("There is no enum constant with name '%s' in enum '%s'.", name, m_enumClass), ex);
            }
        }

        @Override
        public void save(final E obj, final NodeSettingsWO settings) {
            settings.addString(m_configKey, obj == null ? null : obj.name());
        }

    }

    private DefaultFieldNodeSettingsPersistorFactory() {

    }

}
