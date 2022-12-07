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
 *   Dec 5, 2022 (Adrian Nembach, KNIME GmbH, Konstanz, Germany): created
 */
package org.knime.core.webui.node.dialog.serialization.field;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.defaultnodesettings.SettingsModel;
import org.knime.core.node.defaultnodesettings.SettingsModelBoolean;
import org.knime.core.node.defaultnodesettings.SettingsModelColumnFilter2;
import org.knime.core.node.defaultnodesettings.SettingsModelDouble;
import org.knime.core.node.defaultnodesettings.SettingsModelInteger;
import org.knime.core.node.defaultnodesettings.SettingsModelLong;
import org.knime.core.node.defaultnodesettings.SettingsModelString;
import org.knime.core.node.util.filter.NameFilterConfiguration;
import org.knime.core.node.util.filter.NameFilterConfiguration.EnforceOption;
import org.knime.core.webui.node.dialog.serialization.NodeSettingsSerializer;

import com.google.common.collect.HashBasedTable;
import com.google.common.collect.Table;

/**
 * Factory for serializers that mimic the behavior of SettingsModels.
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 * @noreference non-public API
 */
final class SettingsModelFieldNodeSettingsSerializerFactory {

    private static final Table<Class<?>, Class<? extends SettingsModel>, FieldSerializerImpl> IMPL_TABLE =
        createImplTable();

    private static Table<Class<?>, Class<? extends SettingsModel>, FieldSerializerImpl> createImplTable() {
        Table<Class<?>, Class<? extends SettingsModel>, FieldSerializerImpl> table = HashBasedTable.create();
        for (var value : SettingsModelFieldSerializer.values()) {
            table.put(value.getFieldType(), value.getSettingsModelType(), value);
        }
        return table;
    }

    /**
     * @param <T> the type of the field that needs a serializer
     * @param fieldType the type of field to serialize
     * @param settingsModelType the type of SettingsModel previously used for serialization
     * @param configKey the key under which to store the field
     * @return a serializer for the field
     * @throws IllegalArgumentException if there is no serializer available for the fieldType-settingsModelType
     *             combination
     */
    public static final <T> NodeSettingsSerializer<T> createSerializer(final Class<T> fieldType,
        final Class<? extends SettingsModel> settingsModelType, final String configKey) {
        if (fieldType.isEnum() && settingsModelType.equals(SettingsModelString.class)) {
            return createEnumSerializer(fieldType, configKey);
        } else if (IMPL_TABLE.contains(fieldType, settingsModelType)) {
            var impl = IMPL_TABLE.get(fieldType, settingsModelType);
            return new FieldNodeSettingsSerializer<>(configKey, impl);
        }
        throw new IllegalArgumentException(
            String.format("There is no serializer registered for the type '%s' and the SettingModel type '%s'.",
                fieldType, settingsModelType));
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    private static <T> NodeSettingsSerializer<T> createEnumSerializer(final Class<T> fieldType,
        final String configKey) {
        return new EnumSettingsModelStringSerializer<>((Class)fieldType, configKey);
    }

    private enum SettingsModelFieldSerializer implements FieldSerializerImpl {
            INT(int.class, SettingsModelInteger.class, SettingsModelFieldSerializer::loadInt,
                SettingsModelFieldSerializer::saveInt),
            STRING(String.class, SettingsModelString.class, SettingsModelFieldSerializer::loadString,
                SettingsModelFieldSerializer::saveString),
            LONG(long.class, SettingsModelLong.class, SettingsModelFieldSerializer::loadLong,
                SettingsModelFieldSerializer::saveLong),
            DOUBLE(double.class, SettingsModelDouble.class, SettingsModelFieldSerializer::loadDouble,
                SettingsModelFieldSerializer::saveDouble),
            BOOLEAN(boolean.class, SettingsModelBoolean.class, SettingsModelFieldSerializer::loadBoolean,
                SettingsModelFieldSerializer::saveBoolean),
            COLUMN_FILTER2(String[].class, SettingsModelColumnFilter2.class,
                SettingsModelFieldSerializer::loadColumnFilter2, SettingsModelFieldSerializer::saveColumnFilter2);

        private final Class<?> m_fieldType;

        private final Class<? extends SettingsModel> m_settingsModelType;

        private final FieldLoader<?> m_loader;

        private final FieldSaver<?> m_saver;

        private <T> SettingsModelFieldSerializer(final Class<T> fieldType,
            final Class<? extends SettingsModel> settingsModelType, final FieldLoader<T> loader,
            final FieldSaver<T> saver) {
            m_fieldType = fieldType;
            m_settingsModelType = settingsModelType;
            m_loader = loader;
            m_saver = saver;
        }

        @SuppressWarnings("unchecked") // type-safety is ensured by createSerializer
        @Override
        public <T> T load(final NodeSettingsRO settings, final String configKey) throws InvalidSettingsException {
            return (T)m_loader.load(settings, configKey);
        }

        @Override
        public <T> void save(final T obj, final NodeSettingsWO settings, final String configKey) {
            @SuppressWarnings("unchecked") // type-safety is ensured by createSerializer
            var saver = (FieldSaver<T>)m_saver;
            saver.save(obj, settings, configKey);
        }

        Class<?> getFieldType() {
            return m_fieldType;
        }

        Class<? extends SettingsModel> getSettingsModelType() {
            return m_settingsModelType;
        }

        private static int loadInt(final NodeSettingsRO settings, final String configKey)
            throws InvalidSettingsException {
            return load(new SettingsModelInteger(configKey, 0), settings).getIntValue();
        }

        private static void saveInt(final int value, final NodeSettingsWO settings, final String configKey) {
            new SettingsModelInteger(configKey, value).saveSettingsTo(settings);
        }

        private static String loadString(final NodeSettingsRO settings, final String configKey)
            throws InvalidSettingsException {
            return load(new SettingsModelString(configKey, ""), settings).getStringValue();
        }

        private static void saveString(final String value, final NodeSettingsWO settings, final String configKey) {
            new SettingsModelString(configKey, value).saveSettingsTo(settings);
        }

        private static long loadLong(final NodeSettingsRO settings, final String configKey)
            throws InvalidSettingsException {
            return load(new SettingsModelLong(configKey, 0), settings).getLongValue();
        }

        private static void saveLong(final long value, final NodeSettingsWO settings, final String configKey) {
            new SettingsModelLong(configKey, value).saveSettingsTo(settings);
        }

        private static double loadDouble(final NodeSettingsRO settings, final String configKey)
            throws InvalidSettingsException {
            return load(new SettingsModelDouble(configKey, 0), settings).getDoubleValue();
        }

        private static void saveDouble(final double value, final NodeSettingsWO settings, final String configKey) {
            new SettingsModelDouble(configKey, value).saveSettingsTo(settings);
        }

        private static boolean loadBoolean(final NodeSettingsRO settings, final String configKey)
            throws InvalidSettingsException {
            return load(new SettingsModelBoolean(configKey, false), settings).getBooleanValue();
        }

        private static void saveBoolean(final boolean value, final NodeSettingsWO settings, final String configKey) {
            new SettingsModelBoolean(configKey, value).saveSettingsTo(settings);
        }

        private static String[] loadColumnFilter2(final NodeSettingsRO nodeSettings, final String configKey)
            throws InvalidSettingsException {
            var inclColsSettings = nodeSettings.getNodeSettings(configKey);
            return inclColsSettings.getStringArray("included_names");
        }

        private static void saveColumnFilter2(final String[] includedColumns, final NodeSettingsWO nodeSettings,
            final String configKey) {
            var model = new NameFilterConfiguration(configKey);
            model.loadDefaults(includedColumns, null, EnforceOption.EnforceInclusion);
            model.saveConfiguration(nodeSettings);
        }

        private static <S extends SettingsModel> S load(final S model, final NodeSettingsRO settings)
            throws InvalidSettingsException {
            model.loadSettingsFrom(settings);
            return model;
        }

    }

    private static final class EnumSettingsModelStringSerializer<E extends Enum<E>>
        implements NodeSettingsSerializer<E> {

        private final Class<E> m_enumType;

        private final SettingsModelString m_model;

        EnumSettingsModelStringSerializer(final Class<E> enumType, final String configKey) {
            m_enumType = enumType;
            m_model = new SettingsModelString(configKey, "");
        }

        @Override
        public void save(final E obj, final NodeSettingsWO settings) {
            m_model.setStringValue(obj != null ? obj.name() : null);
            m_model.saveSettingsTo(settings);
        }

        @Override
        public E load(final NodeSettingsRO settings) throws InvalidSettingsException {
            m_model.loadSettingsFrom(settings);
            var name = m_model.getStringValue();
            return name != null ? Enum.valueOf(m_enumType, name) : null;
        }

    }

    private SettingsModelFieldNodeSettingsSerializerFactory() {

    }
}
