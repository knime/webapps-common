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
package org.knime.core.webui.node.dialog.defaultdialog.persistence.field;

import static java.util.stream.Collectors.toMap;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Stream;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.config.base.ConfigBaseRO;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.NodeSettingsPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.Credentials;
import org.knime.core.webui.node.dialog.defaultdialog.setting.filechooser.FileChooser;

/**
 * Factory for default persistors that store values directly in NodeSettings.
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 */
final class DefaultFieldNodeSettingsPersistorFactory {

    private static final Map<Class<?>, PersistorImpl> IMPL_MAP = Stream.of(PersistorImpl.values())//
        .collect(toMap(PersistorImpl::getFieldType, Function.identity()));

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

    @SuppressWarnings("unchecked")
    private static <T> NodeSettingsPersistor<T> createPersistorFromImpl(final Class<T> fieldType,
        final String configKey, final FieldPersistor impl) {
        if (impl != null) {
            return new DefaultFieldNodeSettingsPersistor<>(configKey, impl);
        } else if (fieldType.isEnum()) {
            return createEnumPersistor(configKey, fieldType);
        } else if (fieldType.equals(LocalDate.class)) {
            return (NodeSettingsPersistor<T>)createLocalDatePersistor(configKey);
        } else if (fieldType.equals(Credentials.class)) {
            return (NodeSettingsPersistor<T>)createCredentialsPersistor(configKey);
        } else if (fieldType.equals(FileChooser.class)) {
            return (NodeSettingsPersistor<T>)createFileChooserPersistor(configKey);
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
            INT(int.class, ConfigBaseRO::getInt, (v, s, k) -> s.addInt(k, v)),
            DOUBLE(double.class, ConfigBaseRO::getDouble, (v, s, k) -> s.addDouble(k, v)),
            LONG(long.class, ConfigBaseRO::getLong, (v, s, k) -> s.addLong(k, v)),
            STRING(String.class, ConfigBaseRO::getString, (v, s, k) -> s.addString(k, v)),
            BOOLEAN(boolean.class, ConfigBaseRO::getBoolean, (v, s, k) -> s.addBoolean(k, v)),
            FLOAT(float.class, ConfigBaseRO::getFloat, (v, s, k) -> s.addFloat(k, v)),
            CHAR(char.class, ConfigBaseRO::getChar, (v, s, k) -> s.addChar(k, v)),
            BYTE(byte.class, ConfigBaseRO::getByte, (v, s, k) -> s.addByte(k, v)),
            INT_ARRAY(int[].class, ConfigBaseRO::getIntArray, (v, s, k) -> s.addIntArray(k, v)),
            DOUBLE_ARRAY(double[].class, ConfigBaseRO::getDoubleArray, (v, s, k) -> s.addDoubleArray(k, v)),
            LONG_ARRAY(long[].class, ConfigBaseRO::getLongArray, (v, s, k) -> s.addLongArray(k, v)),
            STRING_ARRAY(String[].class, ConfigBaseRO::getStringArray, (v, s, k) -> s.addStringArray(k, v)),
            BOOLEAN_ARRAY(boolean[].class, ConfigBaseRO::getBooleanArray, (v, s, k) -> s.addBooleanArray(k, v)),
            FLOAT_ARRAY(float[].class, ConfigBaseRO::getFloatArray, (v, s, k) -> s.addFloatArray(k, v)),
            CHAR_ARRAY(char[].class, ConfigBaseRO::getCharArray, (v, s, k) -> s.addCharArray(k, v)),
            BYTE_ARRAY(byte[].class, ConfigBaseRO::getByteArray, (v, s, k) -> s.addByteArray(k, v));

        private Class<?> m_type;

        private FieldLoader<?> m_loader;

        private FieldSaver<?> m_saver;

        <T> PersistorImpl(final Class<T> type, final FieldLoader<T> loader, final FieldSaver<T> saver) {
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

    private static NodeSettingsPersistor<LocalDate> createLocalDatePersistor(final String configKey) {
        return new LocalDatePersistor(configKey);
    }

    static final class LocalDatePersistor implements NodeSettingsPersistor<LocalDate> {

        static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ISO_LOCAL_DATE;

        private final String m_configKey;

        LocalDatePersistor(final String configKey) {
            m_configKey = configKey;
        }

        @Override
        public LocalDate load(final NodeSettingsRO settings) throws InvalidSettingsException {
            final var value = settings.getString(m_configKey);
            if (value == null) {
                return null;
            }
            return LocalDate.parse(value, DATE_FMT);
        }

        @Override
        public void save(final LocalDate date, final NodeSettingsWO settings) {
            settings.addString(m_configKey, date == null ? null : date.format(DATE_FMT));
        }

    }

    private static NodeSettingsPersistor<Credentials> createCredentialsPersistor(final String configKey) {
        return new Credentials.CredentialsPersistor(configKey);
    }

    private static NodeSettingsPersistor<FileChooser> createFileChooserPersistor(final String configKey) {
        final var persistor = new FileChooser.DefaultPersistor();
        persistor.setConfigKey(configKey);
        return persistor;
    }

    private DefaultFieldNodeSettingsPersistorFactory() {

    }

}
