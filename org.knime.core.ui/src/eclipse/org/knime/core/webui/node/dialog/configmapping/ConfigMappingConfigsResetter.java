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
 *   Jun 6, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.configmapping;

import static org.knime.core.webui.node.dialog.configmapping.NodeSettingsAtPathUtil.deletePath;
import static org.knime.core.webui.node.dialog.configmapping.NodeSettingsAtPathUtil.getNodeSettingsAtPath;
import static org.knime.core.webui.node.dialog.configmapping.NodeSettingsAtPathUtil.getNodeSettingsROAtPath;
import static org.knime.core.webui.node.dialog.configmapping.NodeSettingsAtPathUtil.replaceAtPathIfPresent;

import java.util.function.Function;
import java.util.function.UnaryOperator;
import java.util.stream.Stream;

import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;

/**
 * Conditionally resets node settings to previous settings by taking {@link ConfigMappings} into account.
 *
 * @author Paul Bärnreuther
 */
class ConfigMappingConfigsResetter implements ConfigsResetter {

    private ConfigPath m_basePath;

    private NewAndDeprecatedConfigPaths m_newAndDeprecatedConfigPaths;

    private Function<NodeSettingsRO, NodeSettingsRO> m_oldSettingsToNewSettings;

    private NodeSettingsRO m_previousNodeSettings;

    private NodeSettings m_nodeSettings;

    NodeSettingsRO m_mappedPreviousSettings;

    private NodeSettingsRO getMappedPreviousSettings() {
        if (m_mappedPreviousSettings == null) {
            m_mappedPreviousSettings = m_oldSettingsToNewSettings.apply(m_previousNodeSettings);
        }
        return m_mappedPreviousSettings;
    }

    record ConfigMapping(ConfigPath basePath, NewAndDeprecatedConfigPaths newAndDeprecatedConfigPaths,
        UnaryOperator<NodeSettingsRO> oldSettingsToNewSettings) {
    }

    ConfigMappingConfigsResetter(final ConfigMapping configMapping, final NodeSettingsRO previousNodeSettings,
        final NodeSettings nodeSettings) {
        m_basePath = configMapping.basePath;
        m_newAndDeprecatedConfigPaths = configMapping.newAndDeprecatedConfigPaths;
        m_oldSettingsToNewSettings = configMapping.oldSettingsToNewSettings;
        m_previousNodeSettings = getNodeSettingsROAtPath(previousNodeSettings, m_basePath).orElse(null);
        m_nodeSettings = getNodeSettingsAtPath(nodeSettings, m_basePath).orElse(null);
    }

    @Override
    public boolean isApplicable(final ConfigPath path) {
        // The base path needs to be present both in previous and new settings
        if (m_previousNodeSettings == null || m_nodeSettings == null) {
            return false;
        }
        // The path needs to be more specific than the base path
        if (!path.startsWith(m_basePath) || path.equals(m_basePath)) {
            return false;
        }
        // the relative path needs to be referenced in the ConfigsDeprecation
        return getNewAndOldPaths().anyMatch(path.relativize(m_basePath)::startsWith);
    }

    @Override
    public void resetAtPath(final ConfigPath path) {
        final var relativeToBasePath = path.relativize(m_basePath);
        final var isOldPath =
            m_newAndDeprecatedConfigPaths.getDeprecatedConfigPaths().stream().anyMatch(relativeToBasePath::startsWith);

        if (isOldPath) {
            getNewAndOldPaths().forEach(subPath -> {
                deletePath(m_nodeSettings, subPath);
                replaceAtPathIfPresent(m_nodeSettings, subPath, m_previousNodeSettings);
            });
        } else {
            replaceAtPathIfPresent(m_nodeSettings, relativeToBasePath, getMappedPreviousSettings());
        }

    }

    private Stream<ConfigPath> getNewAndOldPaths() {
        return Stream.concat(m_newAndDeprecatedConfigPaths.getNewConfigPaths().stream(),
            m_newAndDeprecatedConfigPaths.getDeprecatedConfigPaths().stream());
    }

}
