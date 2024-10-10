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
import org.knime.core.webui.node.dialog.defaultdialog.persistence.PersistableSettings;
import org.knime.core.webui.node.dialog.defaultdialog.tree.TreeNode;

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
     * @param node
     * @return the config key used by the persistor or the default key if none is set
     */
    public static String[] getConfigKeysUsedByField(final TreeNode<PersistableSettings> node) {
        var configKey = getConfigKey(node);
        var persist = node.getAnnotation(Persist.class);
        if (persist.isPresent()) {
            var customPersistor = persist.get().customPersistor();
            if (!customPersistor.equals(FieldNodeSettingsPersistor.class)) {
                return extractFieldNodeSettingsPersistor(node).map(FieldNodeSettingsPersistor::getConfigKeys)
                    .orElse(new String[]{configKey});
            }
        }
        return new String[]{configKey};
    }

    /**
     * Get the collection of {@link ConfigsDeprecation} that are used by the given field if it is annotated with a
     * {@link Persist} annotation.
     *
     * @param node
     * @return the deprecated configs defined by the {@link Persist#customPersistor} or an empty array none exists.
     */
    public static ConfigsDeprecation[] getDeprecatedConfigsUsedByField(final TreeNode<PersistableSettings> node) {
        var persist = node.getAnnotation(Persist.class);
        if (persist.isEmpty()) {
            return new ConfigsDeprecation[]{};
        }

        return extractFieldNodeSettingsPersistor(node).map(FieldNodeSettingsPersistor::getConfigsDeprecations)
            .orElse(new ConfigsDeprecation[]{});
    }

    public static Optional<FieldNodeSettingsPersistor<?>>
        extractFieldNodeSettingsPersistor(final TreeNode<PersistableSettings> node) {
        /**
         * There might not exist a persistor in some cases where the persistence is defined on a parent level class or
         * field.
         */
        return FieldNodeSettingsPersistorFactory.getCustomOrDefaultPersistorIfPresent(node).flatMap(persistor -> {
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
    static String getConfigKey(final TreeNode<PersistableSettings> node) {
        var persist = node.getAnnotation(Persist.class);
        final var fieldName = node.getName().orElse(null); // should never be null
        if (persist.isEmpty()) {
            return fieldName;
        } else {
            return getConfigKeyFromPersist(persist.get(), fieldName);
        }
    }

    private static String getConfigKeyFromPersist(final Persist persist, final String fieldName) {
        var configKey = persist.configKey();
        if (!hasConfigKeySet(configKey)) {
            configKey = fieldName;
        }
        if (persist.hidden()) {
            configKey += SettingsModel.CFGKEY_INTERNAL;
        }
        return configKey;
    }

    private static boolean hasConfigKeySet(final String configKey) {
        return !"".equals(configKey);
    }

}
