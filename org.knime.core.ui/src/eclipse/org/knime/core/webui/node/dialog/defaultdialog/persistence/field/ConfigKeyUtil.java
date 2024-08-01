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
 *   Feb 8, 2023 (benjamin): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.persistence.field;

import java.lang.reflect.Field;
import java.util.Optional;

import org.knime.core.node.defaultnodesettings.SettingsModel;
import org.knime.core.webui.node.dialog.configmapping.ConfigsDeprecation;

/**
 * Utilities for getting the used config keys from a {@link Field} with a {@link Persist} annotation.
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 * @author Benjamin Wilhelm, KNIME GmbH, Berlin, Germany
 */
public final class ConfigKeyUtil {

    private ConfigKeyUtil() {
        // static utility
    }

    /**
     * Get the config keys that are used by the given field if it is annotated with a {@link Persist} annotation. If the
     * annotation defines a {@link Persist#customPersistor()} returns the values of
     * {@link FieldNodeSettingsPersistor#getConfigKeys()}. Otherwise, the value of {@link Persist#configKey()} or an
     * extracted config key are returned.
     *
     * @param field
     * @return the config keys used by the persistor or an empty array if the field has no {@link Persist} annotation.
     */
    public static String[] getConfigKeysUsedByField(final Field field) {
        var persist = field.getAnnotation(Persist.class);
        if (persist == null) {
            return new String[]{};
        } else {
            var configKey = getConfigKey(field);
            var customPersistor = persist.customPersistor();
            if (customPersistor.equals(FieldNodeSettingsPersistor.class)) {
                // No custom persistor is set -> just use the config key
                return new String[]{configKey};
            } else {
                // Custom persistor -> get the config keys from it
                return FieldNodeSettingsPersistor.createInstance(customPersistor, field.getType(), configKey)
                    .getConfigKeys();
            }
        }
    }

    /**
     * Get the sub config keys (i.e., keys of subsettings under this setting that don't have their own control) that are
     * used by the given field if it is annotated with a {@link Persist} annotation and if the annotation defines a
     * {@link Persist#customPersistor()} that overrides {@link FieldNodeSettingsPersistor#getSubConfigKeys()}.
     *
     * @param field
     * @return the sub config keys used by the persistor or null, if the sub config keys are to be inferred from the
     *         schema by the frontend
     */
    public static String[][] getSubConfigKeysUsedByField(final Field field) {
        return extractFieldNodeSettingsPersistor(field).map(FieldNodeSettingsPersistor::getSubConfigKeys).orElse(null);
    }

    /**
     * Get the collection of {@link ConfigsDeprecation} that are used by the given field if it is annotated with a
     * {@link Persist} annotation.
     *
     * @param field
     * @return the deprecated configs defined by the {@link Persist#customPersistor} or an empty array none exists.
     */
    public static ConfigsDeprecation[] getDeprecatedConfigsUsedByField(final Field field) {
        var persist = field.getAnnotation(Persist.class);
        if (persist == null) {
            return new ConfigsDeprecation[]{};
        }

        return extractFieldNodeSettingsPersistor(field).map(FieldNodeSettingsPersistor::getConfigsDeprecations)
            .orElse(new ConfigsDeprecation[]{});
    }

    private static Optional<FieldNodeSettingsPersistor<?>> extractFieldNodeSettingsPersistor(final Field field) {
        /**
         * There might not exist a persistor in some cases where the persistence is defined on a parent level class or
         * field.
         */
        return FieldNodeSettingsPersistorFactory.getCustomOrDefaultPersistorIfPresent(field).flatMap(persistor -> {
            if (persistor instanceof FieldNodeSettingsPersistor<?> fieldNodeSettingsPersistor) {
                return Optional.of(fieldNodeSettingsPersistor);
            }
            return Optional.empty();
        });

    }

    /**
     * Get the configKey defined by the {@link Persist} annotation on the given field. If the field is not annotated or
     * the {@link Persist#configKey()} option is not set, a default key is extracted from the field name.
     */
    static String getConfigKey(final Field field) {
        var persist = field.getAnnotation(Persist.class);
        if (persist == null) {
            return extractConfigKeyFromFieldName(field.getName());
        } else {
            var configKey = persist.configKey();
            if (!hasConfigKeySet(configKey)) {
                configKey = extractConfigKeyFromFieldName(field.getName());
            }
            if (persist.hidden()) {
                configKey += SettingsModel.CFGKEY_INTERNAL;
            }
            return configKey;
        }
    }

    private static boolean hasConfigKeySet(final String configKey) {
        return !"".equals(configKey);
    }

    private static String extractConfigKeyFromFieldName(final String fieldName) {
        if (fieldName.startsWith("m_")) {
            return fieldName.substring(2);
        } else {
            return fieldName;
        }
    }
}
