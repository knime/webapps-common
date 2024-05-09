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
 *   May 8, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.modification;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.stream.StreamSupport;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.util.CheckUtils;
import org.knime.core.webui.node.dialog.VariableSettingsRO;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.DeprecatedConfigs;
import org.knime.core.webui.node.dialog.modification.ApplyModification.VariableLeavesUtil.VariableLeaf;
import org.knime.core.webui.node.dialog.util.NodeSettingsAtPathUtil;

/**
 * Apply a modification to {@link ToBeModifiedSettings} given a {@link Modification}.
 *
 * @author Paul Bärnreuther
 */
final class ApplyModification {

    private final Optional<VariableSettingsRO> m_variableSettings;

    private final DeprecatedConfigsHandler m_deprecatedConfigsHandler;

    private final Optional<NodeSettingsRO> m_previousSettings;

    private NodeSettingsRO m_saveLoadedPreviousSettings;

    private Modification m_modification;

    private NodeSettings m_appliedSettings;

    /**
     * Used within {@link #applyModification}.
     */
    private ApplyModification(final Modification modification, final ToBeModifiedSettings toBeModified) {
        m_modification = modification;
        CheckUtils.checkArgument(toBeModified.provisionalSettings().isPresent(),
            "Applied settings must be present where modifications are required.");
        m_appliedSettings = toBeModified.provisionalSettings().get();
        m_variableSettings = toBeModified.appliedVariableSettings();
        m_previousSettings = toBeModified.previousSettings();
        m_deprecatedConfigsHandler = new DeprecatedConfigsHandler(modification.deprecatedConfigs());
    }

    /**
     * Corrects the applied settings with respect to flow variables and previous settings given the information on how
     * to modify given by the modification
     *
     * @param modification context information needed to modify the given settings
     * @param settings the to be modified settings
     */
    public static void applyModification(final Modification modification, final ToBeModifiedSettings settings) {
        new ApplyModification(modification, settings).modifyAppliedSettings();
    }

    /**
     * Saves the provided object into the settings.
     *
     * @param settings to save into
     */
    private void modifyAppliedSettings() {
        if (m_variableSettings != null) {
            final var variableLeaves = m_variableSettings
                .map(varSettings -> VariableLeavesUtil.getVariableSettingsLeaves(varSettings)).orElse(List.of());
            final var variablesByIsDeprecated = variableLeaves.stream()
                .collect(Collectors.partitioningBy(leaf -> m_deprecatedConfigsHandler.isDeprecated(leaf.path())));

            // deprecated flow variables --> revert value changes for all related paths of the deprecated config
            m_deprecatedConfigsHandler
                .getActiveDeprecatedConfigs(variablesByIsDeprecated.get(true).stream().map(VariableLeaf::path).toList())
                .forEach(deprecatedConfigs -> replaceWithPreviousSettingsForDeprecatedConfigs(m_appliedSettings,
                    deprecatedConfigs));

            // non-deprecated flow variables --> revert value changes of the underlying path (only for used flow vars)
            variablesByIsDeprecated.get(false).stream().filter(VariableLeaf::isUsed).map(VariableLeaf::path).forEach(
                path -> replaceWithPreviousSettingsAtPath(m_appliedSettings, path.stream().toArray(String[]::new)));
        }
    }

    /**
     * Remove all configs (new and old) given by the deprecatedConfigs and re-add those which are present in the
     * previous settings.
     */
    private void replaceWithPreviousSettingsForDeprecatedConfigs(final NodeSettings settings,
        final DeprecatedConfigs deprecatedConfigs) {
        Stream.concat(Arrays.stream(deprecatedConfigs.getDeprecatedConfigPaths()),
            Arrays.stream(deprecatedConfigs.getNewConfigPaths())).forEach(path -> {
                NodeSettingsAtPathUtil.deletePath(settings, path);
                if (m_previousSettings.isPresent()) {
                    NodeSettingsAtPathUtil.replaceAtPathIfPresent(settings, path, m_previousSettings.get());
                }
            });
    }

    /**
     * Either overwrite directly with the previous settings at the given path if those exist. If not, then use the
     * saveLoaded settings of the previousSettings instead.
     */
    private void replaceWithPreviousSettingsAtPath(final NodeSettings settings, final String[] path) {
        final NodeSettingsRO previousSettings = getToBeUsedPreviousSettings(path);
        NodeSettingsAtPathUtil.replaceAtPathIfPresent(settings, path, previousSettings);
    }

    private NodeSettingsRO getToBeUsedPreviousSettings(final String[] path) {
        if (m_previousSettings.isPresent() && NodeSettingsAtPathUtil.hasPath(m_previousSettings.get(), path)) {
            return m_previousSettings.get();
        }
        return getSavedLoadedPreviousSettings();
    }

    private NodeSettingsRO getSavedLoadedPreviousSettings() {
        if (m_saveLoadedPreviousSettings == null) {
            m_saveLoadedPreviousSettings = m_modification.oldSettingsToNewSettings()
                .apply(m_previousSettings.orElseGet(() -> new NodeSettings("emptyPreviousSettings")));
        }
        return m_saveLoadedPreviousSettings;
    }

    static class DeprecatedConfigsHandler {

        private final Set<String> m_deprecatedConfigPaths;

        private final DeprecatedConfigs[] m_deprecatedConfigs;

        DeprecatedConfigsHandler(final DeprecatedConfigs[] deprecatedConfigs) {
            m_deprecatedConfigs = deprecatedConfigs;
            m_deprecatedConfigPaths = Arrays.stream(deprecatedConfigs)
                .flatMap(DeprecatedConfigsHandler::getDeprecatedPathHashes).collect(Collectors.toSet());
        }

        public boolean isDeprecated(final List<String> configPath) {
            return m_deprecatedConfigPaths.contains(hash(configPath));
        }

        private static Stream<String> getDeprecatedPathHashes(final DeprecatedConfigs deprecatedConfigs) {
            return Arrays.stream(deprecatedConfigs.getDeprecatedConfigPaths()).map(path -> hash(Arrays.asList(path)));
        }

        public Stream<DeprecatedConfigs> getActiveDeprecatedConfigs(final List<List<String>> deprecatedConfigPaths) {
            return Arrays.stream(m_deprecatedConfigs).filter(//
                deprecatedConfigs -> deprecatedConfigPaths.stream()
                    .anyMatch(path -> isDeprecatedIn(path, deprecatedConfigs))//
            );
        }

        private static boolean isDeprecatedIn(final List<String> path, final DeprecatedConfigs deprecatedConfigs) {
            return getDeprecatedPathsSet(deprecatedConfigs).contains(hash(path));
        }

        private static Set<String> getDeprecatedPathsSet(final DeprecatedConfigs deprecatedConfigs) {
            return getDeprecatedPathHashes(deprecatedConfigs).collect(Collectors.toSet());
        }

        private static String hash(final List<String> path) {
            return String.join(".", path);
        }
    }

    static class VariableLeavesUtil {

        record VariableLeaf(List<String> path, boolean isUsed) {
            VariableLeaf(final List<String> path, final VariableSettingsRO variableSettings, final String key)
                throws InvalidSettingsException {
                this(path, variableSettings.getUsedVariable(key) != null);

            }
        }

        private static List<VariableLeaf> getVariableSettingsLeaves(final VariableSettingsRO variableSettings) {
            return getVariableSettingsLeaves(List.of(), variableSettings).toList();
        }

        private static Stream<VariableLeaf> getVariableSettingsLeaves(final List<String> currentPath,
            final VariableSettingsRO variableSettings) {
            return StreamSupport.stream(variableSettings.getVariableSettingsIterable().spliterator(), false)
                .flatMap(key -> getVariableSettingsLeaves(currentPath, variableSettings, key));

        }

        private static Stream<VariableLeaf> getVariableSettingsLeaves(final List<String> currentPath,
            final VariableSettingsRO variableSettings, final String key) {
            try {
                final var nextPath = Stream.concat(currentPath.stream(), Stream.of(key)).toList();
                if (variableSettings.isVariableSetting(key)) {
                    return Stream.of(new VariableLeaf(nextPath, variableSettings, key));
                }
                return getVariableSettingsLeaves(nextPath, variableSettings.getVariableSettings(key));
            } catch (InvalidSettingsException ex) {
                // because we only get the variable settings at keys provided by the variableSettingsIterable
                throw new IllegalStateException("This catch block is not supposed to be reachable.");
            }
        }
    }
}
