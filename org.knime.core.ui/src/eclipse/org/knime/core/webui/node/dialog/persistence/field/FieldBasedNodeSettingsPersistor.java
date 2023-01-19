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
package org.knime.core.webui.node.dialog.persistence.field;

import static java.util.stream.Collectors.toMap;

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
import org.knime.core.webui.node.dialog.persistence.ReflectionUtil;

/**
 * Performs persistence of DefaultNodeSettings on a per-field basis. The persistence of individual fields can be
 * controlled with the {@link Persist} annotation.
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 * @param <S> The concrete {@link PersistableSettings} class
 */
public class FieldBasedNodeSettingsPersistor<S extends PersistableSettings> implements NodeSettingsPersistor<S> {

    @SuppressWarnings("javadoc")
    protected Map<String, NodeSettingsPersistor<?>> m_persistors;

    private final Class<S> m_settingsClass;

    /**
     * Constructor.
     *
     * @param settingsClass the class of settings to persist
     */
    public FieldBasedNodeSettingsPersistor(final Class<S> settingsClass) {
        m_persistors = createPersistors(settingsClass);
        m_settingsClass = settingsClass;
    }

    private static Map<String, NodeSettingsPersistor<?>>
        createPersistors(final Class<? extends PersistableSettings> settingsClass) {
        return getAllPersistableFields(settingsClass)//
            .collect(toMap(Field::getName, FieldBasedNodeSettingsPersistor::createPersistorForField, (a, b) -> a,
                LinkedHashMap::new));
    }

    @SuppressWarnings("javadoc")
    protected static Stream<Field> getAllPersistableFields(final Class<?> clazz) {
        List<Field> fields = new ArrayList<>();
        for (Class<?> c = clazz; c != null; c = c.getSuperclass()) {
            fields.addAll(Arrays.asList(c.getDeclaredFields()));
        }
        return fields.stream().filter(FieldBasedNodeSettingsPersistor::isPersistable);
    }

    private static boolean isPersistable(final Field field) {
        return !Modifier.isStatic(field.getModifiers());
    }

    private static NodeSettingsPersistor<?> createPersistorForField(final Field field) {
        var persistence = field.getAnnotation(Persist.class);
        if (persistence != null) {
            return createPersistorFromPersistenceAnnotation(persistence, field);
        } else {
            return createDefaultPersistor(field.getType(), extractConfigKeyFromFieldName(field.getName()));
        }
    }

    @SuppressWarnings("javadoc")
    protected static String extractConfigKeyFromFieldName(final String fieldName) {
        if (fieldName.startsWith("m_")) {
            return fieldName.substring(2);
        } else {
            return fieldName;
        }
    }

    @SuppressWarnings({"unchecked", "rawtypes", "javadoc"})
    protected static NodeSettingsPersistor<?> createPersistorFromPersistenceAnnotation(final Persist persistence,
        final Field field) {
        var customPersistorClass = persistence.customPersistor();
        var type = field.getType();
        var configKey = persistence.configKey();
        if (configKey.strip().equals("")) {
            configKey = extractConfigKeyFromFieldName(field.getName());
        }
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

    private static NodeSettingsPersistor<?> createDefaultPersistor(final Class<?> type, final String configKey) {
        if (PersistableSettings.class.isAssignableFrom(type)) {
            return new NestedFieldBasedNodeSettingsPersistor<>(configKey, type.asSubclass(PersistableSettings.class));
        }
        return DefaultFieldNodeSettingsPersistorFactory.createPersistor(type, configKey);
    }

    @SuppressWarnings("unchecked")
    private static <T> void uncheckedSave(final NodeSettingsPersistor<T> persistor, final Object value,
        final NodeSettingsWO nodeSettings) {
        persistor.save((T)value, nodeSettings);
    }

    @Override
    public void save(final S obj, final NodeSettingsWO settings) {
        try {
            useBlackMagicToAccessFields((persistor, field) -> uncheckedSave(persistor, field.get(obj), settings));
        } catch (InvalidSettingsException ex) {//NOSONAR
            // because the origin of the InvalidSettingsException would be our PersistorConsumer which does not
            // throw such an exception
            throw new IllegalStateException("This catch block is not supposed to be reachable.");
        }
    }

    @Override
    public S load(final NodeSettingsRO settings) throws InvalidSettingsException {
        final var loaded =
            ReflectionUtil.createInstance(m_settingsClass).orElseThrow(() -> new IllegalArgumentException(String
                .format("The provided PersistableSettings '%s' don't provide an empty constructor.", m_settingsClass)));
        useBlackMagicToAccessFields((persistor, field) -> field.set(loaded, persistor.load(settings)));//NOSONAR
        return loaded;
    }

    @FunctionalInterface
    private interface PersistorConsumer {
        void accept(final NodeSettingsPersistor<?> persistor, final Field field)
            throws InvalidSettingsException, IllegalAccessException;
    }

    private void useBlackMagicToAccessFields(final PersistorConsumer consumer) throws InvalidSettingsException {
        for (var entry : m_persistors.entrySet()) {
            var fieldName = entry.getKey();
            try {
                var field = getFromAllFields(m_settingsClass, entry.getKey());
                field.setAccessible(true);//NOSONAR
                var persistor = entry.getValue();
                consumer.accept(persistor, field);
            } catch (IllegalAccessException ex) {
                // because we use black magic (Field#setAccessible) to make the field accessible
                throw new IllegalStateException(
                    String.format("Could not access the field '%s' although reflection was used to make it accessible.",
                        fieldName),
                    ex);
            } catch (NoSuchFieldException ex) {
                throw new IllegalStateException(String
                    .format("The field '%s' no longer exists in class '%s' although it existed during creation of the"
                        + " persistor. Most likely an implementation error.", fieldName, m_settingsClass),
                    ex);
            } catch (SecurityException ex) {
                throw new IllegalStateException(
                    "Security exception while accessing field although it was possible to access it during creation of"
                        + " the persistor. Most likely an implementation error.",
                    ex);
            }
        }

    }

    private static Field getFromAllFields(final Class<?> clazz, final String key)
        throws NoSuchFieldException, SecurityException {
        for (Class<?> c = clazz; c != null; c = c.getSuperclass()) {
            try {
                return c.getDeclaredField(key);
            } catch (NoSuchFieldException ex) { //NOSONAR
            } catch (SecurityException ex) {
                throw ex;
            }
        }
        throw new NoSuchFieldException(key);
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

}
