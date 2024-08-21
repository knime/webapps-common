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
 *   7 Aug 2024 (Robin Gerling): created
 */
package org.knime.core.webui.node.view.table;

import java.util.Optional;
import java.util.function.Supplier;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.webui.node.dialog.configmapping.ConfigsDeprecation;
import org.knime.core.webui.node.dialog.configmapping.ConfigsDeprecation.Builder;
import org.knime.core.webui.node.view.table.TableViewViewSettings.RowHeightMode;
import org.knime.core.webui.node.view.table.TableViewViewSettings.VerticalPaddingMode;

/**
 * Contains utility methods to maintain backwards compatibility for the row height related settings (legacy row height
 * mode, legacy compact mode) which were replaced by the row height mode V2 with different options, vertical padding
 * mode, and the custom row height.
 *
 * @author Robin Gerling
 */
public final class RowHeightPersistorUtil {
    /**
     * Config key for the legacy setting using a checkbox for the compact mode.
     */
    static final String COMPACT_MODE_LEGACY_CONFIG_KEY = "compactMode";

    /**
     * Config key for the legacy row height mode. The legacy row height mode had the three options default, compact, and
     * custom.
     */
    static final String ROW_HEIGHT_MODE_LEGACY_CONFIG_KEY = "rowHeightMode";

    /**
     * "Compact" option name of the legacy row height mode which is not part of the current row height mode.
     */
    static final String ROW_HEIGHT_MODE_COMPACT = "COMPACT";

    /**
     * "Default" option name of the legacy row height mode which is not part of the current row height mode.
     */
    static final String ROW_HEIGHT_MODE_DEFAULT = "DEFAULT";

    /**
     * "Custom" option name of the legacy row height mode which is not part of the current row height mode.
     */
    static final String ROW_HEIGHT_MODE_CUSTOM = "CUSTOM";

    /**
     * The implicit row height used for the "compact" option of the legacy row height mode.
     */
    public static final int LEGACY_CUSTOM_ROW_HEIGHT_COMPACT = 24;

    /**
     * The implicit row height used for the "default" option of the legacy row height mode.
     */
    public static final int LEGACY_CUSTOM_ROW_HEIGHT_DEFAULT = 40;

    private RowHeightPersistorUtil() {
        // Utility
    }

    private static boolean hasTrueLegacyCompactMode(final NodeSettingsRO settings) throws InvalidSettingsException {
        return settings.containsKey(COMPACT_MODE_LEGACY_CONFIG_KEY)
            && settings.getBoolean(COMPACT_MODE_LEGACY_CONFIG_KEY);
    }

    private static boolean hasFalseLegacyCompactMode(final NodeSettingsRO settings) throws InvalidSettingsException {
        return settings.containsKey(COMPACT_MODE_LEGACY_CONFIG_KEY)
            && !settings.getBoolean(COMPACT_MODE_LEGACY_CONFIG_KEY);
    }

    private static boolean hasCompactLegacyRowHeightMode(final NodeSettingsRO settings)
        throws InvalidSettingsException {
        return settings.containsKey(ROW_HEIGHT_MODE_LEGACY_CONFIG_KEY)
            && settings.getString(ROW_HEIGHT_MODE_LEGACY_CONFIG_KEY).equals(ROW_HEIGHT_MODE_COMPACT);
    }

    private static boolean hasDefaultLegacyRowHeightMode(final NodeSettingsRO settings)
        throws InvalidSettingsException {
        return settings.containsKey(ROW_HEIGHT_MODE_LEGACY_CONFIG_KEY)
            && settings.getString(ROW_HEIGHT_MODE_LEGACY_CONFIG_KEY).equals(ROW_HEIGHT_MODE_DEFAULT);
    }

    private static boolean hasCustomLegacyRowHeightMode(final NodeSettingsRO settings) throws InvalidSettingsException {
        return settings.containsKey(ROW_HEIGHT_MODE_LEGACY_CONFIG_KEY)
            && settings.getString(ROW_HEIGHT_MODE_LEGACY_CONFIG_KEY).equals(ROW_HEIGHT_MODE_CUSTOM);
    }

    static final class LegacyLoadResult {

        private final RowHeightMode m_rowHeightMode;

        private final VerticalPaddingMode m_verticalPaddingMode;

        private Integer m_customRowHeight;

        LegacyLoadResult(final RowHeightMode rowHeightMode, final VerticalPaddingMode verticalPaddingMode,
            final int customRowHeight) {
            m_rowHeightMode = rowHeightMode;
            m_verticalPaddingMode = verticalPaddingMode;
            m_customRowHeight = customRowHeight;
        }

        /**
         * custom row height does not depend on this result.
         */
        LegacyLoadResult(final RowHeightMode rowHeightMode, final VerticalPaddingMode verticalPaddingMode) {
            m_rowHeightMode = rowHeightMode;
            m_verticalPaddingMode = verticalPaddingMode;
        }

        RowHeightMode getRowHeightMode() {
            return m_rowHeightMode;
        }

        VerticalPaddingMode getVerticalPaddingMode() {
            return m_verticalPaddingMode;
        }

        Optional<Integer> getCustomRowHeight() {
            return Optional.ofNullable(m_customRowHeight);
        }

    }

    static final LegacyLoadResult LEGACY_COMPACT =
        new LegacyLoadResult(RowHeightMode.CUSTOM, VerticalPaddingMode.COMPACT, LEGACY_CUSTOM_ROW_HEIGHT_COMPACT);

    static final LegacyLoadResult LEGACY_DEFAULT = new LegacyLoadResult(RowHeightMode.AUTO, VerticalPaddingMode.DEFAULT,
        TableViewViewSettings.DEFAULT_CUSTOM_ROW_HEIGHT);

    static final LegacyLoadResult LEGACY_CUSTOM =
        new LegacyLoadResult(RowHeightMode.CUSTOM, VerticalPaddingMode.DEFAULT);

    static Optional<LegacyLoadResult> getLoadResultFromLegacySettings(final NodeSettingsRO settings)
        throws InvalidSettingsException {
        if (hasTrueLegacyCompactMode(settings) || hasCompactLegacyRowHeightMode(settings)) {
            return Optional.of(LEGACY_COMPACT);
        }
        if (hasFalseLegacyCompactMode(settings) || hasDefaultLegacyRowHeightMode(settings)) {
            return Optional.of(LEGACY_DEFAULT);
        }
        if (hasCustomLegacyRowHeightMode(settings)) {
            return Optional.of(LEGACY_CUSTOM);
        }
        /*
         * Only possible for the very first version of the table view given the if conditions above.
         */
        if (!settings.containsKey(TableViewViewSettings.CURRENT_ROW_HEIGHT_MODE_CFG_KEY)) {
            return Optional.of(LEGACY_DEFAULT);
        }
        return Optional.empty();
    }

    static ConfigsDeprecation[] createDefaultConfigsDeprecations(final String configKey) {
        Supplier<Builder> getBuilder = () -> new Builder().forNewConfigPath(configKey);

        return new ConfigsDeprecation[]{ //
            getBuilder.get().build(), // accounting for a time where none of the settings existed
            getBuilder.get().forDeprecatedConfigPath(COMPACT_MODE_LEGACY_CONFIG_KEY).build(),
            getBuilder.get().forDeprecatedConfigPath(ROW_HEIGHT_MODE_LEGACY_CONFIG_KEY).build()};
    }
}
