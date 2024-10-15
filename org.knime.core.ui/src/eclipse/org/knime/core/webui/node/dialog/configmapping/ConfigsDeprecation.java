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
import java.util.Collection;
import java.util.List;
import java.util.Objects;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.FieldNodeSettingsPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.Persist;

/**
 * This class provides a connection from an array of config paths relative to the base config of the field to another
 * one and specifies how old configs should be loaded.
 * <ul>
 * <li>Deprecated config paths: Configs which are respected during {@link FieldNodeSettingsPersistor#load load} but are
 * not written to when saving the loaded data back during {@link FieldNodeSettingsPersistor#save save}.</li>
 * <li>New config paths: Those configs that are affected by the deprecated config paths. I.e. on
 * {@link FieldNodeSettingsPersistor#save save} their values might differ depending on the values of any of the
 * deprecated config paths during {@link FieldNodeSettingsPersistor#load load}</li>
 * </ul>
 * The matcher determines whether the settings contain deprecated configs and should be loaded in a different way by the
 * loader. Matcher and loader cannot be specified at all, but in case matcher is specified, a loader must be specified.
 *
 * @author Paul Bärnreuther
 * @param <T> the type of the loaded config object
 */
public final class ConfigsDeprecation<T> {

    /**
     * Loads a deprecated config based on the given settings and can throw an InvalidSettingsException
     *
     * @param <T> the type of the object of the new config
     */
    @FunctionalInterface
    public interface DeprecationLoader<T> {
        /**
         * @param settings the settings containing the deprecated config to load
         * @return T the type of the new config
         * @throws InvalidSettingsException
         */
        T apply(NodeSettingsRO settings) throws InvalidSettingsException;
    }

    /**
     * Specifies a predicate which can throw an InvalidSettingsException
     */
    @FunctionalInterface
    public interface DeprecationMatcher {
        /**
         * @param settings the settings on which to search a deprecated config
         * @return whether a deprecated config was found
         * @throws InvalidSettingsException
         */
        boolean test(NodeSettingsRO settings) throws InvalidSettingsException;
    }

    private Collection<NewAndDeprecatedConfigPaths> m_newAndDeprecatedConfigPaths;

    private DeprecationMatcher m_matcher;

    private DeprecationLoader<T> m_loader;

    /**
     * Private. Use the {@link Builder} instead.
     */
    private ConfigsDeprecation(final Collection<NewAndDeprecatedConfigPaths> newAndDeprecatedConfigPaths,
        final DeprecationMatcher matcher, final DeprecationLoader<T> loader) {
        this.m_newAndDeprecatedConfigPaths = newAndDeprecatedConfigPaths;
        this.m_matcher = matcher;
        this.m_loader = loader;
    }

    /**
     * @return the newConfigPaths and the deprecatedConfigPaths relative to the base config path of the annotated
     *         setting
     */
    public Collection<NewAndDeprecatedConfigPaths> getNewAndDeprecatedConfigPaths() {
        return m_newAndDeprecatedConfigPaths;
    }

    /**
     * @return the loader, which converts the old config into the new one during load
     */
    public DeprecationLoader<T> getLoader() {
        return m_loader;
    }

    /**
     * @return the matchers, which determines when to use the loader
     */
    public DeprecationMatcher getMatcher() {
        return m_matcher;
    }

    /**
     * Builder for {@link ConfigsDeprecation}.
     *
     * @author Paul Bärnreuther
     * @param <T> the type of the loaded config object
     */
    public static final class Builder<T> {

        private final List<NewAndDeprecatedConfigPaths> m_newAndDeprecatedConfigPaths = new ArrayList<>(0);

        private DeprecationMatcher m_matcher;

        private DeprecationLoader<T> m_loader;

        /**
         * Builder for {@link ConfigsDeprecation}. See {@link ConfigsDeprecation} for more information.
         *
         * @param loader the loader which uses the deprecated config to load the settings based on the new config
         */
        public Builder(final DeprecationLoader<T> loader) {
            m_loader = Objects.requireNonNull(loader);
        }

        /**
         * This method can called multiple times.
         *
         * @param newAndDeprecatedConfigPaths the config keys forming a path from the base config of the
         *            {@link Persist#customPersistor} to a desired subconfig for the new and corresponding deprecated
         *            config (see {@link NewAndDeprecatedConfigPaths}).
         * @return the builder
         */
        public Builder<T>
            linkingNewAndDeprecatedConfigPaths(final NewAndDeprecatedConfigPaths newAndDeprecatedConfigPaths) {
            m_newAndDeprecatedConfigPaths.add(newAndDeprecatedConfigPaths);
            return this;
        }

        /**
         * Specify a predicate, which determines based on the {@link NodeSettingsRO} whether a deprecated config exists
         * which should be loaded in a different way by the specified {@link #Builder(DeprecationLoader) loader}. This
         * method can be called once. If it is not called, a matcher will be created based on the deprecatedConfigKeys
         * given with {@link #linkingNewAndDeprecatedConfigPaths(NewAndDeprecatedConfigPaths)
         * linkingNewAndDeprecatedConfigPaths}. In case all deprecated config keys are contained in the settings the
         * matcher will return {@code true}.
         *
         * @param matcher the matcher used to determine whether settings are deprecated and should be loaded in a
         *            different way
         * @return the builder
         */
        public Builder<T> withMatcher(final DeprecationMatcher matcher) {
            m_matcher = matcher;
            return this;
        }

        private void setMatcher(final DeprecationMatcher matcher) {
            this.m_matcher = matcher;
        }

        /**
         * @return a new {@link ConfigsDeprecation} to be used in
         *         {@link FieldNodeSettingsPersistor#getConfigsDeprecations()}
         */
        public ConfigsDeprecation<T> build() {
            final var matcherIsNull = m_matcher == null;
            if (matcherIsNull) {
                createMatcherByDeprecatedConfigPaths();
            }
            return new ConfigsDeprecation<>(m_newAndDeprecatedConfigPaths, m_matcher, m_loader);
        }

        private void createMatcherByDeprecatedConfigPaths() {
            final List<ConfigPath> deprecatedConfigPaths =
                m_newAndDeprecatedConfigPaths.stream().flatMap(val -> val.getDeprecatedConfigPaths().stream()).toList();
            if (deprecatedConfigPaths.isEmpty()) {
                throw new IllegalStateException("Cannot create a matcher by deprecated config paths, because no "
                    + "deprecated config paths exist. Either specify a matcher or deprecated config paths.");
            }

            this.setMatcher(settings -> {
                for (final var configPath : deprecatedConfigPaths) {
                    if (!traversedSettingsContainConfigPath(settings, configPath.path(), 0)) {
                        return false;
                    }
                }
                return true;
            });
        }

        private static boolean traversedSettingsContainConfigPath(final NodeSettingsRO settings,
            final List<String> configPath, final int index) throws InvalidSettingsException {
            final var currConfigKey = configPath.get(index);
            final var currLayerContainsKey = settings.containsKey(currConfigKey);
            if (index == configPath.size() - 1 || !currLayerContainsKey) {
                return currLayerContainsKey;
            }
            return traversedSettingsContainConfigPath(settings.getNodeSettings(currConfigKey), configPath, index + 1);
        }
    }
}
