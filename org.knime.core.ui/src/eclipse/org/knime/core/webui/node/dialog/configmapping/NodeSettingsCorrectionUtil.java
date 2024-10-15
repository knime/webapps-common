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
 *   May 29, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.configmapping;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.function.Function;
import java.util.stream.Stream;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.webui.node.dialog.VariableSettingsRO;
import org.knime.core.webui.node.dialog.configmapping.ConfigMappingConfigsResetter.ConfigMapping;

/**
 * A utility class used to correct provosionally applied settings (i.e. node settings that were saved without respecting
 * flow variables) given a tree of {@link ConfigMappings}s by resetting parts of the settings to given previous settings
 * wherever certain set flow variables require this.
 *
 * @author Paul Bärnreuther
 */
public final class NodeSettingsCorrectionUtil {

    private NodeSettingsCorrectionUtil() {
        // Utility
    }

    /**
     * Use this method to align settings which were extracted without paying attention to flow variables. If there exist
     * controlling flow variables for saved configs, this method reverts the settings at these configs to the previous
     * settings.
     *
     * @param toBeCorrectedSettings
     * @param previousSettings
     * @param variableSettings
     */
    public static void correctNodeSettingsRespectingFlowVariables(final NodeSettings toBeCorrectedSettings,
        final NodeSettingsRO previousSettings, final VariableSettingsRO variableSettings) {
        correctNodeSettingsRespectingFlowVariables(new ConfigMappings(List.of()), toBeCorrectedSettings,
            previousSettings, variableSettings);
    }

    /**
     * Use this method to align settings which were extracted without paying attention to flow variables. The following
     * transformations can be necessary:
     * <ul>
     * <li>There exist controlling flow variables for saved configs: In this case we want to revert the settings at
     * these configs to the previous settings. If no such previous settings are present, the given
     * {@link ConfigMappings} has to provide a way to get suitable configs from the previous settings.</li>
     * <li>There exist flow variables for a deprecated config, i.e. a config which can never be saved to. In this case
     * the given {@link ConfigMappings} needs to provide additional information on which configs were deprecated to
     * which. This way we can revert the settings to previous settings for all related configs.</li>
     * </ul>
     *
     * @param configMappings
     * @param toBeCorrectedSettings
     * @param previousSettings
     * @param variableSettings
     */
    public static void correctNodeSettingsRespectingFlowVariables(final ConfigMappings configMappings,
        final NodeSettings toBeCorrectedSettings, final NodeSettingsRO previousSettings,
        final VariableSettingsRO variableSettings) {
        final Collection<ConfigPath> controlledPaths = new ArrayList<>();
        final Collection<ConfigPath> exposedAndNotControlledPaths = new ArrayList<>();
        final Collection<ConfigMapping> configMappingCollection = new ArrayList<>();
        final var rootPath = new ConfigPath(List.of());
        toCollections(variableSettings, controlledPaths, exposedAndNotControlledPaths, rootPath);
        toCollection(configMappings, configMappingCollection, rootPath);

        final Function<ConfigMapping, ConfigsResetter> createDeprecationResetter =
            configMapping -> new ConfigMappingConfigsResetter(configMapping, previousSettings, toBeCorrectedSettings);
        final Collection<ConfigsResetter> deprecationResetters =
            configMappingCollection.stream().map(createDeprecationResetter::apply).toList();

        // Add one standard resetter in both cases
        // For controlling variables a resetter that resets to the previous settings
        correctNodeSettings(controlledPaths,
            Stream.concat(Stream.of(new ControlledConfigsResetter(previousSettings, toBeCorrectedSettings)),
                deprecationResetters.stream()).toList());
        // For exposed variables a no-operation resetter that is only preventing further resetters if applicable
        correctNodeSettings(exposedAndNotControlledPaths, Stream
            .concat(Stream.of(new StopWhenPathExists(toBeCorrectedSettings)), deprecationResetters.stream()).toList());
    }

    private static void toCollections(final VariableSettingsRO variableSettings,
        final Collection<ConfigPath> controlledPaths, final Collection<ConfigPath> exposedAndNotControlledPaths,
        final ConfigPath path) {
        try {
            for (var key : variableSettings.getVariableSettingsIterable()) {
                final var nextPath = path.plus(key);

                if (variableSettings.isVariableSetting(key)) {
                    addFlowVariablePath(variableSettings, key, controlledPaths, exposedAndNotControlledPaths, nextPath);
                } else {
                    toCollections(variableSettings.getVariableSettings(key), controlledPaths,
                        exposedAndNotControlledPaths, nextPath);
                }

            }
        } catch (InvalidSettingsException ex) {
            // Should never happen because we check appropriately
            throw new IllegalStateException("This catch block should not be reached", ex);
        }
    }

    private static void addFlowVariablePath(final VariableSettingsRO variableSettings, final String key,
        final Collection<ConfigPath> controlledPaths, final Collection<ConfigPath> exposedAndNotControlledPaths,
        final ConfigPath nextPath) throws InvalidSettingsException {
        if (variableSettings.getUsedVariable(key) != null) {
            controlledPaths.add(nextPath);
        } else if (variableSettings.getExposedVariable(key) != null) {
            exposedAndNotControlledPaths.add(nextPath);
        }
    }

    private static void toCollection(final ConfigMappings configMappings, final Collection<ConfigMapping> collection,
        final ConfigPath path) {
        final var currentPath = configMappings.m_key == null ? path : path.plus(configMappings.m_key);

        // depth first in order to have more specific mappings first
        configMappings.m_children.forEach(child -> toCollection(child, collection, currentPath));

        if (configMappings.m_newAndDeprecatedConfigPaths != null) {
            collection.add(new ConfigMapping(currentPath, configMappings.m_newAndDeprecatedConfigPaths,
                configMappings.m_oldSettingsToNewSettings));
        }

    }

    private static void correctNodeSettings(final Collection<ConfigPath> flowVariablePaths,
        final Collection<ConfigsResetter> configsResetter) {
        flowVariablePaths.forEach(path -> correctNodeSettings(path, configsResetter));
    }

    private static void correctNodeSettings(final ConfigPath flowVariablePath,
        final Collection<ConfigsResetter> configsResetter) {
        configsResetter.stream().filter(resetter -> resetter.isApplicable(flowVariablePath)).findFirst()
            .ifPresent(resetter -> resetter.resetAtPath(flowVariablePath));

    }

}
