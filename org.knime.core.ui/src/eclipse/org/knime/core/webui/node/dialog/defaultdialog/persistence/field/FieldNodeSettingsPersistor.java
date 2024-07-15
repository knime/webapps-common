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
 *   Feb 8, 2023 (Benjamin Wilhelm, KNIME GmbH, Berlin, Germany): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.persistence.field;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeLogger;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.webui.node.dialog.configmapping.ConfigMappings;
import org.knime.core.webui.node.dialog.configmapping.ConfigsDeprecation;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.NodeSettingsPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.NodeSettingsPersistorWithConfigKey;

/**
 * A {@link NodeSettingsPersistor} that persists a single field of a settings object. Implementing classes must provide
 * all config keys which are used via the {@link #getConfigKeys()} method.
 *
 * @author Benjamin Wilhelm, KNIME GmbH, Berlin, Germany
 * @param <T> type of object loaded by the persistor
 */
public interface FieldNodeSettingsPersistor<T> extends NodeSettingsPersistor<T> {
    @SuppressWarnings("javadoc")
    NodeLogger LOGGER = NodeLogger.getLogger(FieldNodeSettingsPersistor.class);

    @Override
    default ConfigMappings getConfigMappings(final T obj) {
        return new ConfigMappings(getConfigsDeprecations(), settings -> {
            T fromPrevious = loadOrDefault(settings, obj);
            final var newSettings = new NodeSettings("newSettings");
            save(fromPrevious, newSettings);
            return newSettings;
        });
    }

    private T loadOrDefault(final NodeSettingsRO settings, final T obj) {
        try {
            return load(settings);
        } catch (InvalidSettingsException ex) {
            LOGGER
                .warn(String.format("Error when trying to load from previous settings when modifying settings on save. "
                    + "Using the saved settings instead. Exception: %s", ex));
            return obj;
        }
    }

    /**
     * @return an array of all config keys that are used to save the setting to the node settings
     */
    String[] getConfigKeys();

    /**
     * @return an array of all overridden sub config keys (i.e., keys of subsettings under this setting that don't have
     *         their own control)
     */
    default String[][] getSubConfigKeys() {
        return null; // NOSONAR null and [] have different meanings here:
        // null means that sub config keys are to be inferred from the schema
        // [] means that there are no sub config keys
    }

    /**
     * @return an array of all pairs of collections of deprecated and accociated new configs (see
     *         {@link ConfigsDeprecation})
     */
    default ConfigsDeprecation[] getConfigsDeprecations() {
        return new ConfigsDeprecation[0];
    }

    /**
     * Create an instance of a {@link FieldNodeSettingsPersistor} by calling
     * {@link NodeSettingsPersistor#createInstance(Class, Class)} and sets the config key if the result implements
     * {@link NodeSettingsPersistorWithConfigKey}.
     *
     * @param <S> the type of object to persist
     * @param <P> the type of persistor to instantiate
     * @param persistorClass the class of NodeSettingsPersistor
     * @param persistedObjectClass
     * @param configKey the key that should be used by the persistor if it implements
     *            {@link NodeSettingsPersistorWithConfigKey}
     * @return a new instance of the provided class
     * @throws IllegalStateException if the class does not have an empty constructor, is abstract, or the constructor
     *             raises an exception
     */
    @SuppressWarnings("rawtypes")
    static <S, P extends FieldNodeSettingsPersistor<S>> P createInstance(final Class<P> persistorClass,
        final Class<S> persistedObjectClass, final String configKey) {
        final var customPersistor = NodeSettingsPersistor.createInstance(persistorClass, persistedObjectClass);
        if (customPersistor instanceof NodeSettingsPersistorWithConfigKey persistorWithKey) {
            persistorWithKey.setConfigKey(configKey);
        }
        return customPersistor;
    }
}
