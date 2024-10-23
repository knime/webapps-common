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

import static org.knime.core.webui.node.dialog.configmapping.NodeSettingsAtPathUtil.hasPath;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.Objects;
import java.util.function.Function;
import java.util.function.Predicate;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.FieldNodeSettingsPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.Persist;

/**
 * This class can be used to deprecate a state of the config representation of a setting in favor of a new state in a
 * certain point in time. Since the deprecated configs should still be supported, we need a loader that is able to load
 * from these. To detect that this certain deprecated state is present in a given {@link NodeSettingsRO} we additionally
 * need a so-called matcher.
 *
 * For keeping track of flow variables, it is important to define a connection from an array of config paths relative to
 * the base config of the field to another one.
 * <ul>
 * <li>Deprecated config paths: Configs which are respected during {@link FieldNodeSettingsPersistor#load load} but are
 * not written to when saving the loaded data back during {@link FieldNodeSettingsPersistor#save save}.</li>
 * <li>New config paths: Those configs that are affected by the deprecated config paths. I.e. on
 * {@link FieldNodeSettingsPersistor#save save} their values might differ depending on the values of any of the
 * deprecated config paths during {@link FieldNodeSettingsPersistor#load load}</li>
 * </ul>
 *
 * If no matcher is specified, a default one checking for the existence of the given deprecated configs is inferred.
 *
 * @author Paul Bärnreuther
 * @param <T> the type of the loaded config object
 */
public final class ConfigsDeprecation<T> implements NewAndDeprecatedConfigPaths {

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

    private final Predicate<NodeSettingsRO> m_matcher;

    private final DeprecationLoader<T> m_loader;

    private final Collection<ConfigPath> m_newConfigPaths;

    private final Collection<ConfigPath> m_deprecatedConfigPaths;

    /**
     * Private. Use the {@link Builder} or {@link #builder} instead.
     */
    private ConfigsDeprecation(final Collection<ConfigPath> newConfigPaths,
        final Collection<ConfigPath> deprecatedConfigPaths, final Predicate<NodeSettingsRO> matcher,
        final DeprecationLoader<T> loader) {
        this.m_newConfigPaths = newConfigPaths;
        this.m_deprecatedConfigPaths = deprecatedConfigPaths;
        this.m_matcher = matcher;
        this.m_loader = loader;
    }

    /**
     * @return the loader, which is able to load from the old config keys
     */
    public DeprecationLoader<T> getLoader() {
        return m_loader;
    }

    /**
     * @return the matchers, which determines when to use the loader
     */
    public Predicate<NodeSettingsRO> getMatcher() {
        return m_matcher;
    }

    @Override
    public Collection<ConfigPath> getNewConfigPaths() {
        return m_newConfigPaths;
    }

    @Override
    public Collection<ConfigPath> getDeprecatedConfigPaths() {
        return m_deprecatedConfigPaths;
    }

    /**
     * @param <T> the type of the loaded object
     * @param loader used to load from the deprecated configs
     * @return a builder for {@link ConfigsDeprecation}.
     */
    public static <T> Builder<T> builder(final DeprecationLoader<T> loader) {
        return new Builder<>(loader);
    }

    /**
     * Builder for {@link ConfigsDeprecation}.
     *
     * @param <T> the type of the loaded object
     * @author Paul Bärnreuther
     */
    public static final class Builder<T> {

        private Predicate<NodeSettingsRO> m_matcher;

        private DeprecationLoader<T> m_loader;

        private final Collection<ConfigPath> m_newConfigPaths = new ArrayList<>(0);

        private final Collection<ConfigPath> m_deprecatedConfigPaths = new ArrayList<>(0);

        /**
         * Builder for {@link ConfigsDeprecation}. See {@link ConfigsDeprecation} for more information.
         *
         * @param loader used to load from the deprecated configs
         */
        public Builder(final DeprecationLoader<T> loader) {
            m_loader = Objects.requireNonNull(loader);
        }

        /**
         * Enter a path to a config set during {@link FieldNodeSettingsPersistor#save} affected by the values of all of
         * the config paths set with {@link #withDeprecatedConfigPath}. This method can called multiple times.
         *
         * @param configKeys the configKeys forming a path from the base config of the {@link Persist#customPersistor}
         *            to a desired subconfig.
         * @return the builder
         */
        public Builder<T> withNewConfigPath(final String... configKeys) {
            m_newConfigPaths.add(new ConfigPath(Arrays.stream(configKeys).toList()));
            return this;
        }

        /**
         * Enter a path to a config used within the loader which is not saved back again in
         * {@link FieldNodeSettingsPersistor#save}. This method can called multiple times.
         *
         * @param configKeys the configKeys forming a path from the base config of the {@link Persist#customPersistor}
         *            to a desired subconfig.
         * @return the builder
         */
        public Builder<T> withDeprecatedConfigPath(final String... configKeys) {
            m_deprecatedConfigPaths.add(new ConfigPath(Arrays.stream(configKeys).toList()));
            return this;
        }

        /**
         * Specify a predicate, which determines based on the {@link NodeSettingsRO} whether these are in the deprecated
         * state defined by the to be constructed deprecation.
         *
         * This method can be called at most once. If it is not called, a matcher will be created based on the
         * deprecatedConfigPaths given with {@link #withDeprecatedConfigPath}. This default matcher simply checks
         * whether all deprecated config paths are contained in the settings.
         *
         * @param matcher the matcher used to determine whether settings are deprecated and should be loaded by the
         *            given loader
         * @return the builder
         */
        public Builder<T> withMatcher(final Predicate<NodeSettingsRO> matcher) {
            setMatcher(matcher);
            return this;
        }

        private void setMatcher(final Predicate<NodeSettingsRO> matcher) {
            this.m_matcher = matcher;
        }

        /**
         * @return a new {@link ConfigsDeprecation} to be used in
         *         {@link FieldNodeSettingsPersistor#getConfigsDeprecations()}
         */
        public ConfigsDeprecation<T> build() {
            if (m_matcher == null) {
                createMatcherByDeprecatedConfigPaths();
            }
            return new ConfigsDeprecation<>(m_newConfigPaths, m_deprecatedConfigPaths, m_matcher, m_loader);
        }

        private void createMatcherByDeprecatedConfigPaths() {
            if (m_deprecatedConfigPaths.isEmpty()) {
                throw new IllegalStateException("Cannot create a matcher by deprecated config paths, because no "
                    + "deprecated config paths exist. Either specify a matcher or deprecated config paths.");
            }

            Function<NodeSettingsRO, Predicate<ConfigPath>> settingsContainPath =
                settings -> configPath -> hasPath(settings, configPath);

            this.setMatcher(settings -> m_deprecatedConfigPaths.stream().allMatch(settingsContainPath.apply(settings)));

        }

    }

}
