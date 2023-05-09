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
package org.knime.core.webui.node.dialog.defaultdialog.persistence.field;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.defaultnodesettings.SettingsModel;
import org.knime.core.node.defaultnodesettings.SettingsModelBoolean;
import org.knime.core.node.defaultnodesettings.SettingsModelColumnFilter2;
import org.knime.core.node.defaultnodesettings.SettingsModelColumnName;
import org.knime.core.node.defaultnodesettings.SettingsModelDouble;
import org.knime.core.node.defaultnodesettings.SettingsModelInteger;
import org.knime.core.node.defaultnodesettings.SettingsModelLong;
import org.knime.core.node.defaultnodesettings.SettingsModelString;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.NodeSettingsPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnfilter.ColumnFilter;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnfilter.LegacyColumnFilterPersistor;

import com.google.common.collect.HashBasedTable;
import com.google.common.collect.Table;

/**
 * Factory for persistors that mimic the behavior of SettingsModels.
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 */
final class SettingsModelFieldNodeSettingsPersistorFactory {

    private static final Table<Class<?>, Class<? extends SettingsModel>, FieldPersistor> IMPL_TABLE = createImplTable();

    private static Table<Class<?>, Class<? extends SettingsModel>, FieldPersistor> createImplTable() {
        Table<Class<?>, Class<? extends SettingsModel>, FieldPersistor> table = HashBasedTable.create();
        for (var value : SettingsModelFieldPersistor.values()) {
            table.put(value.getFieldType(), value.getSettingsModelType(), value);
        }
        return table;
    }

    /**
     * @param <T> the type of the field that needs a persistor
     * @param fieldType the type of field to persist
     * @param settingsModelType the type of SettingsModel previously used for persistence
     * @param configKey the key under which to store the field
     * @return a persistor for the field
     * @throws IllegalArgumentException if there is no persistor available for the fieldType-settingsModelType
     *             combination
     */
    public static <T> NodeSettingsPersistor<T> createPersistor(final Class<T> fieldType,
        final Class<? extends SettingsModel> settingsModelType, final String configKey) {
        if (fieldType.isEnum() && settingsModelType.equals(SettingsModelString.class)) {
            return createEnumPersistor(fieldType, configKey);
        } else if (IMPL_TABLE.contains(fieldType, settingsModelType)) {
            var impl = IMPL_TABLE.get(fieldType, settingsModelType);
            return new DefaultFieldNodeSettingsPersistor<>(configKey, impl);
        }
        throw new IllegalArgumentException(
            String.format("There is no persistor registered for the type '%s' and the SettingModel type '%s'.",
                fieldType, settingsModelType));
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    private static <T> NodeSettingsPersistor<T> createEnumPersistor(final Class<T> fieldType, final String configKey) {
        return new EnumSettingsModelStringPersistor<>((Class)fieldType, configKey);
    }

    private enum SettingsModelFieldPersistor implements FieldPersistor {
            INT(int.class, SettingsModelInteger.class, SettingsModelFieldPersistor::loadInt,
                SettingsModelFieldPersistor::saveInt),
            STRING(String.class, SettingsModelString.class, SettingsModelFieldPersistor::loadString,
                SettingsModelFieldPersistor::saveString),
            LONG(long.class, SettingsModelLong.class, SettingsModelFieldPersistor::loadLong,
                SettingsModelFieldPersistor::saveLong),
            DOUBLE(double.class, SettingsModelDouble.class, SettingsModelFieldPersistor::loadDouble,
                SettingsModelFieldPersistor::saveDouble),
            BOOLEAN(boolean.class, SettingsModelBoolean.class, SettingsModelFieldPersistor::loadBoolean,
                SettingsModelFieldPersistor::saveBoolean),
            COLUMN_NAME(String.class, SettingsModelColumnName.class, SettingsModelFieldPersistor::loadColumnName,
                SettingsModelFieldPersistor::saveColumnName),
            COLUMN_FILTER2(ColumnFilter.class, SettingsModelColumnFilter2.class, LegacyColumnFilterPersistor::load,
                LegacyColumnFilterPersistor::save);

        private static final String ROW_KEYS_PLACEHOLDER = "<row-keys>";

        private final Class<?> m_fieldType;

        private final Class<? extends SettingsModel> m_settingsModelType;

        private final FieldLoader<?> m_loader;

        private final FieldSaver<?> m_saver;

        <T> SettingsModelFieldPersistor(final Class<T> fieldType,
            final Class<? extends SettingsModel> settingsModelType, final FieldLoader<T> loader,
            final FieldSaver<T> saver) {
            m_fieldType = fieldType;
            m_settingsModelType = settingsModelType;
            m_loader = loader;
            m_saver = saver;
        }

        @SuppressWarnings("unchecked") // type-safety is ensured by createPersistor
        @Override
        public <T> T load(final NodeSettingsRO settings, final String configKey) throws InvalidSettingsException {
            return (T)m_loader.load(settings, configKey);
        }

        @Override
        public <T> void save(final T obj, final NodeSettingsWO settings, final String configKey) {
            @SuppressWarnings("unchecked") // type-safety is ensured by createPersistor
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

        private static String loadColumnName(final NodeSettingsRO nodeSettings, final String configKey)
            throws InvalidSettingsException {
            final var sm = load(new SettingsModelColumnName(configKey, ""), nodeSettings);
            return sm.useRowID() ? ROW_KEYS_PLACEHOLDER : sm.getColumnName();
        }

        private static void saveColumnName(final String column, final NodeSettingsWO nodeSettings,
            final String configKey) {
            var sm = new SettingsModelColumnName(configKey, "");
            if (ROW_KEYS_PLACEHOLDER.equals(column)) {
                sm.setSelection("", true);
            } else {
                sm.setSelection(column, false);
            }
            sm.saveSettingsTo(nodeSettings);
        }

        private static <S extends SettingsModel> S load(final S model, final NodeSettingsRO settings)
            throws InvalidSettingsException {
            model.loadSettingsFrom(settings);
            return model;
        }

    }

    private static final class EnumSettingsModelStringPersistor<E extends Enum<E>> implements NodeSettingsPersistor<E> {

        private final Class<E> m_enumType;

        private final SettingsModelString m_model;

        EnumSettingsModelStringPersistor(final Class<E> enumType, final String configKey) {
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

    private SettingsModelFieldNodeSettingsPersistorFactory() {

    }
}
