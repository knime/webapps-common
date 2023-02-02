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
 *   Feb 2, 2023 (Adrian Nembach, KNIME GmbH, Konstanz, Germany): created
 */
package org.knime.core.webui.node.dialog.persistence.field;

import static java.util.stream.Collectors.toMap;

import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.defaultnodesettings.SettingsModel;
import org.knime.core.webui.node.dialog.impl.PersistableSettings;
import org.knime.core.webui.node.dialog.persistence.NodeSettingsPersistor;
import org.knime.core.webui.node.dialog.persistence.NodeSettingsPersistorFactory;
import org.knime.core.webui.node.dialog.persistence.NodeSettingsPersistorWithConfigKey;

/**
 * Creates persistors for fields of a {@link PersistableSettings} class.
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 */
final class FieldNodeSettingsPersistorFactory<S extends PersistableSettings> {

    private final Class<S> m_settingsClass;

    FieldNodeSettingsPersistorFactory(final Class<S> settingsClass) {
        m_settingsClass = settingsClass;
    }

    Map<String, NodeSettingsPersistor<?>> createPersistors() {
        return getAllPersistableFields(m_settingsClass)//
            .collect(toMap(Field::getName, FieldNodeSettingsPersistorFactory::createPersistorForField, (a, b) -> a,
                LinkedHashMap::new));
    }

    static Stream<Field> getAllPersistableFields(final Class<?> clazz) {
        List<Field> fields = new ArrayList<>();
        for (Class<?> c = clazz; c != null; c = c.getSuperclass()) {
            fields.addAll(Arrays.asList(c.getDeclaredFields()));
        }
        return fields.stream().filter(FieldNodeSettingsPersistorFactory::isPersistable);
    }

    static boolean isPersistable(final Field field) {
        int modifiers = field.getModifiers();//NOSONAR
        return !Modifier.isStatic(modifiers) && !Modifier.isPrivate(modifiers);
    }

    private static NodeSettingsPersistor<?> createPersistorForField(final Field field) {
        var persistence = field.getAnnotation(Persist.class);
        if (persistence != null) {
            return createPersistorFromPersistAnnotation(persistence, field);
        } else {
            return createDefaultPersistor(field.getType(), getConfigKey(field));
        }
    }

    static String extractConfigKeyFromFieldName(final String fieldName) {
        if (fieldName.startsWith("m_")) {
            return fieldName.substring(2);
        } else {
            return fieldName;
        }
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    static NodeSettingsPersistor<?> createPersistorFromPersistAnnotation(final Persist persistence, final Field field) {
        var customPersistorClass = persistence.customPersistor();
        var type = field.getType();
        var configKey = getConfigKey(field);
        if (!customPersistorClass.equals(NodeSettingsPersistor.class)) {
            final var customPersistor = NodeSettingsPersistor.createInstance(customPersistorClass, type);
            if (customPersistor instanceof NodeSettingsPersistorWithConfigKey) {
                final var customPersistorWithConfigKey = (NodeSettingsPersistorWithConfigKey)customPersistor;
                customPersistorWithConfigKey.setConfigKey(configKey);
                return customPersistorWithConfigKey;
            }
            return customPersistor;
        }
        var settingsModelClass = persistence.settingsModel();
        if (!settingsModelClass.equals(SettingsModel.class)) {
            return SettingsModelFieldNodeSettingsPersistorFactory.createPersistor(type, settingsModelClass, configKey);
        } else {
            return createDefaultPersistor(type, configKey);
        }
    }

    private static String getConfigKey(final Field field) {
        var persist = field.getAnnotation(Persist.class);
        if (persist == null) {
            return extractConfigKeyFromFieldName(field.getName());
        } else {
            var configKey = persist.configKey();
            if ("".equals(configKey)) {
                configKey = extractConfigKeyFromFieldName(field.getName());
            }
            if (persist.hidden()) {
                configKey += SettingsModel.CFGKEY_INTERNAL;
            }
            return configKey;
        }
    }

    private static NodeSettingsPersistor<?> createDefaultPersistor(final Class<?> type, final String configKey) {
        if (type.isArray() && PersistableSettings.class.isAssignableFrom(type.getComponentType())) {
            return createDefaultArrayPersistor(type.getComponentType(), configKey);
        } else if (PersistableSettings.class.isAssignableFrom(type)) {
            return new NestedFieldBasedNodeSettingsPersistor<>(configKey, type.asSubclass(PersistableSettings.class));
        } else {
            return DefaultFieldNodeSettingsPersistorFactory.createPersistor(type, configKey);
        }
    }

    @SuppressWarnings("unchecked")
    private static <S extends PersistableSettings> NodeSettingsPersistor<S[]>
        createDefaultArrayPersistor(final Class<?> elementType, final String configKey) {
        return new ArrayFieldPersistor<>((Class<S>)elementType, configKey);
    }

    static final class NestedFieldBasedNodeSettingsPersistor<S extends PersistableSettings>
        implements NodeSettingsPersistor<S> {

        private final String m_configKey;

        private final NodeSettingsPersistor<S> m_persistor;

        NestedFieldBasedNodeSettingsPersistor(final String configKey, final Class<S> settingsClass) {
            m_configKey = configKey;
            m_persistor = NodeSettingsPersistorFactory.createPersistor(settingsClass);
        }

        @Override
        public S load(final NodeSettingsRO settings) throws InvalidSettingsException {
            return m_persistor.load(settings.getNodeSettings(m_configKey));
        }

        @Override
        public void save(final S obj, final NodeSettingsWO settings) {
            m_persistor.save(obj, settings.addNodeSettings(m_configKey));
        }

    }

    static final class ArrayFieldPersistor<S extends PersistableSettings> implements NodeSettingsPersistor<S[]> {

        private final String m_configKey;

        private final Class<S> m_elementType;

        private final ArrayList<NodeSettingsPersistor<S>> m_persistors = new ArrayList<>();

        ArrayFieldPersistor(final Class<S> elementType, final String configKey) {
            m_configKey = configKey;
            m_elementType = elementType;
        }

        @Override
        public S[] load(final NodeSettingsRO settings) throws InvalidSettingsException {
            var arraySettings = settings.getNodeSettings(m_configKey);
            int size = arraySettings.keySet().size();
            ensureEnoughPersistors(size);
            @SuppressWarnings("unchecked")
            var values = (S[])Array.newInstance(m_elementType, size);
            for (int i = 0; i < size; i++) {
                values[i] = m_persistors.get(i).load(arraySettings);
            }
            return values;
        }

        private void ensureEnoughPersistors(final int numPersistors) {
            for (int i = m_persistors.size(); i < numPersistors; i++) {
                m_persistors.add(new NestedFieldBasedNodeSettingsPersistor<>(Integer.toString(i), m_elementType));
            }
        }

        @Override
        public void save(final S[] array, final NodeSettingsWO settings) {
            ensureEnoughPersistors(array.length);
            var arraySettings = settings.addNodeSettings(m_configKey);
            for (int i = 0; i < array.length; i++) {
                m_persistors.get(i).save(array[i], arraySettings);
            }
        }

    }

}
