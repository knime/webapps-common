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
package org.knime.core.webui.node.dialog.defaultdialog.persistence.field;

import static java.util.stream.Collectors.toMap;

import java.lang.reflect.Array;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Pattern;
import java.util.stream.Stream;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeLogger;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.defaultnodesettings.SettingsModel;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.NodeSettingsPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.NodeSettingsPersistorFactory;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.PersistableSettings;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.ReflectionUtil;

/**
 * Creates persistors for fields of a {@link PersistableSettings} class.
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 */
final class FieldNodeSettingsPersistorFactory<S extends PersistableSettings> {

    /**
     *
     */
    private static final NodeLogger LOGGER = NodeLogger.getLogger(FieldNodeSettingsPersistorFactory.class);

    private final Class<S> m_settingsClass;

    private final S m_defaultSettings;

    FieldNodeSettingsPersistorFactory(final Class<S> settingsClass) {
        m_settingsClass = settingsClass;
        m_defaultSettings = ReflectionUtil.createInstance(settingsClass)
            .orElseThrow(() -> new IllegalArgumentException(String.format(
                "The PersistableSettings class '%s' doesn't provide an empty constructor for persistence.",
                settingsClass)));
    }

    Map<String, NodeSettingsPersistor<?>> createPersistors() {//NOSONAR
        return getAllPersistableFields(m_settingsClass)//
            .collect(toMap(Field::getName, this::createPersistorForField, (a, b) -> a, LinkedHashMap::new));
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

    private NodeSettingsPersistor<?> createPersistorForField(final Field field) {
        var persistence = field.getAnnotation(Persist.class);
        if (persistence != null) {
            return createPersistorFromPersistAnnotation(persistence, field);
        } else {
            return createDefaultPersistor(field.getType(), ConfigKeyUtil.getConfigKey(field));
        }
    }

    private NodeSettingsPersistor<?> createPersistorFromPersistAnnotation(final Persist persistence,
        final Field field) {
        var customPersistorClass = persistence.customPersistor();
        var type = field.getType();
        var configKey = ConfigKeyUtil.getConfigKey(field);
        if (!customPersistorClass.equals(FieldNodeSettingsPersistor.class)) {
            return FieldNodeSettingsPersistor.createInstance(customPersistorClass, type, configKey);
        }
        var persistor = createNonCustomPersistor(persistence, type, configKey);
        if (isOptional(persistence, field.getName())) {
            persistor = createOptionalPersistor(field, configKey, persistor, persistence);
        }
        return persistor;
    }

    private boolean isOptional(final Persist persist, final String fieldName) {
        boolean isOptional = persist.optional();
        boolean hasDefaultProvider = !DefaultProvider.class.equals(persist.defaultProvider());
        if (isOptional && hasDefaultProvider) {
            LOGGER.codingWithFormat(
                "The optional parameter of the Persist annotation of field '%s' of PersistableSettings class '%s' "
                    + "is ignored in favor of the defaultProvider parameter.",
                fieldName, m_settingsClass);
        }
        return isOptional || hasDefaultProvider;
    }

    private <F> NodeSettingsPersistor<F> createOptionalPersistor(final Field field, final String configKey,
        final NodeSettingsPersistor<F> delegate, final Persist persist) {
        F defaultValue = getDefault(field, persist);//NOSONAR
        return new OptionalFieldPersistor<>(defaultValue, configKey, delegate);
    }

    @SuppressWarnings("unchecked")
    private <F> F getDefault(final Field field, final Persist persist) {
        var defaultProviderClass = persist.defaultProvider();
        if (DefaultProvider.class.equals(persist.defaultProvider())) {
            return getDefaultFromDefaultSettings(field);
        } else {
            var defaultProvider = ReflectionUtil.createInstance(persist.defaultProvider())//
                .orElseThrow(() -> new IllegalArgumentException(String.format(
                    "The provided DefaultProvider '%s' does not provide an empty constructor.", defaultProviderClass)));
            return (F)defaultProvider.getDefault();
        }
    }

    @SuppressWarnings("unchecked")
    private <F> F getDefaultFromDefaultSettings(final Field field) {
        try {
            // use black magic to make the field accessible
            field.setAccessible(true);//NOSONAR
            return (F)field.get(m_defaultSettings);
        } catch (IllegalAccessException ex) {
            // not reachable
            throw new IllegalArgumentException(
                String.format("Can't access field '%s' of PersistableSettings class '%s'.", field, m_defaultSettings),
                ex);
        }
    }

    private static NodeSettingsPersistor<?> createNonCustomPersistor(final Persist persistence, final Class<?> type,
        final String configKey) {
        var settingsModelClass = persistence.settingsModel();
        if (!settingsModelClass.equals(SettingsModel.class)) {
            return SettingsModelFieldNodeSettingsPersistorFactory.createPersistor(type, settingsModelClass, configKey);
        } else {
            return createDefaultPersistor(type, configKey);
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

        public static Pattern isDigit = Pattern.compile("^\\d+$");

        ArrayFieldPersistor(final Class<S> elementType, final String configKey) {
            m_configKey = configKey;
            m_elementType = elementType;
        }

        @Override
        public S[] load(final NodeSettingsRO settings) throws InvalidSettingsException {
            var arraySettings = settings.getNodeSettings(m_configKey);
            int size = arraySettings.keySet().stream().filter(s -> isDigit.matcher(s).matches()).toList().size();
            ensureEnoughPersistors(size);
            @SuppressWarnings("unchecked")
            var values = (S[])Array.newInstance(m_elementType, size);
            for (int i = 0; i < size; i++) {//NOSONAR
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
            for (int i = 0; i < array.length; i++) {//NOSONAR
                m_persistors.get(i).save(array[i], arraySettings);
            }
        }

    }

    static final class OptionalFieldPersistor<S> implements NodeSettingsPersistor<S> {

        private final S m_default;

        private final String m_configKey;

        private final NodeSettingsPersistor<S> m_delegate;

        OptionalFieldPersistor(final S defaultValue, final String configKey, final NodeSettingsPersistor<S> delegate) {
            m_default = defaultValue;
            m_configKey = configKey;
            m_delegate = delegate;
        }

        @Override
        public S load(final NodeSettingsRO settings) throws InvalidSettingsException {
            if (settings.containsKey(m_configKey)) {
                return m_delegate.load(settings);
            } else {
                return m_default;
            }
        }

        @Override
        public void save(final S obj, final NodeSettingsWO settings) {
            m_delegate.save(obj, settings);
        }
    }
}
