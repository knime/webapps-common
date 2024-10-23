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

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Function;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeLogger;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.webui.node.dialog.configmapping.ConfigsDeprecation;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.NodeSettingsPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.PersistableSettings;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.ReflectionUtil;
import org.knime.core.webui.node.dialog.defaultdialog.tree.Tree;
import org.knime.core.webui.node.dialog.defaultdialog.tree.TreeNode;
import org.knime.core.webui.node.dialog.defaultdialog.widget.LatentWidget;

/**
 * Creates persistors for fields of a {@link PersistableSettings} class.
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 */
final class FieldNodeSettingsPersistorFactory {

    private static final NodeLogger LOGGER = NodeLogger.getLogger(FieldNodeSettingsPersistorFactory.class);

    private final Tree<PersistableSettings> m_settingsTree;

    private final Object m_defaultSettings;

    FieldNodeSettingsPersistorFactory(final Tree<PersistableSettings> settingsTree) {
        m_settingsTree = settingsTree;
        final var settingsClass = settingsTree.getType();
        m_defaultSettings = ReflectionUtil.createInstance(settingsClass)
            .orElseThrow(() -> new IllegalArgumentException(String.format(
                "The PersistableSettings class '%s' doesn't provide an empty constructor for persistence.",
                settingsClass)));
    }

    Map<TreeNode<PersistableSettings>, FieldNodeSettingsPersistor<?>> createPersistors() {//NOSONAR
        return m_settingsTree.getChildren().stream().collect(toMap(Function.identity(), this::createPersistorForNode));

    }

    private FieldNodeSettingsPersistor<?> createPersistorForNode(final TreeNode<PersistableSettings> node) {
        var customOrDefaultPersistor = getCustomOrDefaultPersistor(node);
        return createOptionalPersistor(node, customOrDefaultPersistor);
    }

    /**
     *
     * @param node the node for which to create a persistor
     * @return the persistor inherent to the associated field if it is persistable
     */
    static Optional<NodeSettingsPersistor<?>>
        getCustomOrDefaultPersistorIfPresent(final TreeNode<PersistableSettings> node) {
        try {
            return Optional.of(getCustomOrDefaultPersistor(node));
        } catch (IllegalArgumentException ex) { // NOSONAR
            return Optional.empty();
        }
    }

    /**
     * @throws IllegalArgumentException if there is no persistor available for the provided field
     */
    @SuppressWarnings({"rawtypes", "unchecked"})
    private static FieldNodeSettingsPersistor<?> getCustomOrDefaultPersistor(final TreeNode<PersistableSettings> node) {
        var isLatentWidget = node.getAnnotation(LatentWidget.class).isPresent();
        if (isLatentWidget) {
            return new LatentWidgetPersistor<>();
        }

        var configKey = ConfigKeyUtil.getConfigKey(node);
        var persist = node.getAnnotation(Persist.class);
        if (persist.isPresent()) {
            final var customPersistorClass = persist.get().customPersistor();
            if (!customPersistorClass.equals(FieldNodeSettingsPersistor.class)) {
                final var customPersistor = createCustomPersistor(customPersistorClass, node.getType(), configKey);
                if (DefaultPersistorWithDeprecations.class.isAssignableFrom(customPersistorClass)) {
                    return new DefaultPersistorWithDeprecationsWrapper(
                        (DefaultPersistorWithDeprecations)customPersistor, createDefaultPersistor(node, configKey));
                }
                return customPersistor;
            }
        }
        return createDefaultPersistor(node, configKey);

    }

    private static FieldNodeSettingsPersistor<?> createDefaultPersistor(final TreeNode<PersistableSettings> node,
        final String configKey) {
        return DefaultFieldNodeSettingsPersistorFactory.createDefaultPersistor(node, configKey);
    }

    @SuppressWarnings("rawtypes")
    private static FieldNodeSettingsPersistor createCustomPersistor(
        final Class<? extends FieldNodeSettingsPersistor> customPersistorClass, final Class<?> type,
        final String configKey) {
        return FieldNodeSettingsPersistor.createInstance(customPersistorClass, type, configKey);
    }

    private <F> FieldNodeSettingsPersistor<F> createOptionalPersistor(final TreeNode<PersistableSettings> node,
        final FieldNodeSettingsPersistor<F> delegate) {
        var persist = node.getAnnotation(Persist.class);
        if (persist.isEmpty() || !isOptional(persist.get(), node)) {
            return delegate;
        }
        var configKey = ConfigKeyUtil.getConfigKey(node);
        F defaultValue = getDefault(node, persist.get());//NOSONAR
        return new OptionalFieldPersistor<>(defaultValue, configKey, delegate);
    }

    private boolean isOptional(final Persist persist, final TreeNode<PersistableSettings> node) {
        boolean isOptional = persist.optional();
        boolean hasDefaultProvider = !DefaultProvider.class.equals(persist.defaultProvider());
        if (isOptional && hasDefaultProvider) {
            LOGGER.codingWithFormat(
                "The optional parameter of the Persist annotation of field '%s' of PersistableSettings class '%s' "
                    + "is ignored in favor of the defaultProvider parameter.",
                node.getName().orElse(null), m_settingsTree.getType());
        }
        return isOptional || hasDefaultProvider;
    }

    @SuppressWarnings("unchecked")
    private <F> F getDefault(final TreeNode<PersistableSettings> node, final Persist persist) {
        var defaultProviderClass = persist.defaultProvider();
        if (DefaultProvider.class.equals(persist.defaultProvider())) {
            return getDefaultFromDefaultSettings(node);
        } else {
            var defaultProvider = ReflectionUtil.createInstance(persist.defaultProvider())//
                .orElseThrow(() -> new IllegalArgumentException(String.format(
                    "The provided DefaultProvider '%s' does not provide an empty constructor.", defaultProviderClass)));
            return (F)defaultProvider.getDefault();
        }
    }

    @SuppressWarnings("unchecked")
    private <F> F getDefaultFromDefaultSettings(final TreeNode<PersistableSettings> node) {
        try {

            return (F)node.getFromParentValue(m_defaultSettings);
        } catch (IllegalAccessException ex) {
            // not reachable
            throw new IllegalArgumentException(
                String.format("Can't access field '%s' of PersistableSettings class '%s'.", node.getName().orElse(null),
                    m_defaultSettings.getClass().getName()),
                ex);
        }
    }

    static final class OptionalFieldPersistor<S> implements FieldNodeSettingsPersistor<S> {

        private final S m_default;

        private final String m_configKey;

        private final FieldNodeSettingsPersistor<S> m_delegate;

        OptionalFieldPersistor(final S defaultValue, final String configKey,
            final FieldNodeSettingsPersistor<S> delegate) {
            m_default = defaultValue;
            m_configKey = configKey;
            m_delegate = delegate;
        }

        @Override
        public S load(final NodeSettingsRO settings) throws InvalidSettingsException {
            return m_delegate.load(settings);
        }

        @Override
        public void save(final S obj, final NodeSettingsWO settings) {
            m_delegate.save(obj, settings);
        }

        @Override
        public String[][] getConfigPaths() {
            return m_delegate.getConfigPaths();
        }

        @Override
        public List<ConfigsDeprecation<S>> getConfigsDeprecations() {
            return List.of(new ConfigsDeprecation.Builder<S>(settings -> m_default).withNewConfigPath(m_configKey)
                .withMatcher(settings -> !settings.containsKey(m_configKey)).build());
        }
    }
}
