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
 *   Feb 16, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.configmapping;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.FieldNodeSettingsPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.Persist;

/**
 * This class provides a connection from an array of config paths relative to the base config of the field to another
 * one.
 * <ul>
 * <li>Deprecated config paths: Configs which are respected during {@link FieldNodeSettingsPersistor#load load} but are
 * not written to when saving the loaded data back during {@link FieldNodeSettingsPersistor#save save}.</li>
 * <li>New config paths: Those configs that are affected by the deprecated config paths. I.e. on
 * {@link FieldNodeSettingsPersistor#save save} their values might differ depending on the values of any of the legacy
 * config paths during {@link FieldNodeSettingsPersistor#load load}</li>
 * </ul>
 *
 * @author Paul Bärnreuther
 */
public final class ConfigsDeprecation {

    private Collection<ConfigPath> m_newConfigPaths;

    private Collection<ConfigPath> m_deprecatedConfigPaths;

    /**
     * Private. Use the {@link Builder} instead.
     *
     * @param newConfigPaths
     * @param deprecatedConfigPaths
     */
    private ConfigsDeprecation(final Collection<ConfigPath> newConfigPaths,
        final Collection<ConfigPath> deprecatedConfigPaths) {
        this.m_newConfigPaths = newConfigPaths;
        this.m_deprecatedConfigPaths = deprecatedConfigPaths;
    }

    /**
     * @return the newConfigPaths relative to the base config path of the annotated setting
     */
    public Collection<ConfigPath> getNewConfigPaths() {
        return m_newConfigPaths;
    }

    /**
     * @return the deprecatedConfigPaths relative to the base config path of the annotated setting
     */
    public Collection<ConfigPath> getDeprecatedConfigPaths() {
        return m_deprecatedConfigPaths;
    }

    /**
     * Builder for {@link ConfigsDeprecation}.
     *
     * @author Paul Bärnreuther
     */
    public static final class Builder {

        private final List<ConfigPath> m_newConfigPaths = new ArrayList<>(0);

        private final List<ConfigPath> m_deprecatedConfigPaths = new ArrayList<>(0);

        /**
         * Builder for {@link ConfigsDeprecation}. See {@link ConfigsDeprecation} for more information.
         */
        public Builder() {
            // Builder
        }

        /**
         * Enter a path to a config set during {@link FieldNodeSettingsPersistor#save} affected by the values of all of
         * the config paths set with {@link #forDeprecatedConfigPath}. This method can called multiple times.
         *
         * @param configKeys the configKeys forming a path from the base config of the {@link Persist#customPersistor}
         *            to a desired subconfig.
         * @return the builder
         */
        public Builder forNewConfigPath(final String... configKeys) {
            m_newConfigPaths.add(new ConfigPath(Arrays.stream(configKeys).toList()));
            return this;
        }

        /**
         * Enter a path to a config used during {@link FieldNodeSettingsPersistor#load} which is not written to in
         * {@link FieldNodeSettingsPersistor#save} but instead affects the values of the configs specified with
         * {@link #forNewConfigPath}. This method can called multiple times.
         *
         * @param configKeys the configKeys forming a path from the base config of the {@link Persist#customPersistor}
         *            to a desired subconfig.
         * @return the builder
         */
        public Builder forDeprecatedConfigPath(final String... configKeys) {
            m_deprecatedConfigPaths.add(new ConfigPath(Arrays.stream(configKeys).toList()));
            return this;
        }

        /**
         * @return a new {@link ConfigsDeprecation} to be used in
         *         {@link FieldNodeSettingsPersistor#getConfigsDeprecations()}
         */
        public ConfigsDeprecation build() {
            return new ConfigsDeprecation(m_newConfigPaths, m_deprecatedConfigPaths);
        }

    }

}
