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
 *   Jan 22, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.setting.columnfilter;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.util.filter.NameFilterConfiguration.EnforceOption;

/**
 * @author Paul Bärnreuther
 */
public class LegacyManualFilterPersistorUtil {

    /**
     * See NameFilterConfiguration.KEY_ENFORCE_OPTION
     */
    static final String KEY_ENFORCE_OPTION = "enforce_option";

    /**
     * See NameFilterConfiguration.KEY_EXCLUDED_NAMES
     */
    static final String OLD_EXCLUDED_NAMES = "excluded_names";

    /**
     * See NameFilterConfiguration.KEY_INCLUDED_NAMES
     */
    static final String KEY_INCLUDED_NAMES = "included_names";

    private LegacyManualFilterPersistorUtil() {
        // Utility
    }

    static ManualFilter loadManualFilter(final NodeSettingsRO columnFilterSettings) throws InvalidSettingsException {
        var manualFilter = new ManualFilter(columnFilterSettings.getStringArray(KEY_INCLUDED_NAMES));
        manualFilter.m_manuallyDeselected = columnFilterSettings.getStringArray(OLD_EXCLUDED_NAMES);
        manualFilter.m_includeUnknownColumns = loadIncludeUnknownColumns(columnFilterSettings);
        return manualFilter;
    }

    private static boolean loadIncludeUnknownColumns(final NodeSettingsRO columnFilterSettings)
        throws InvalidSettingsException {
        var enforceOptionName = columnFilterSettings.getString(KEY_ENFORCE_OPTION);
        var enforceOption = EnforceOption.valueOf(enforceOptionName);
        return enforceOption == EnforceOption.EnforceExclusion;
    }

    static void saveManualFilter(final ManualFilter manualFilter, final NodeSettingsWO columnFilterSettings) {
        columnFilterSettings.addStringArray(KEY_INCLUDED_NAMES, manualFilter.m_manuallySelected);
        columnFilterSettings.addStringArray(OLD_EXCLUDED_NAMES, manualFilter.m_manuallyDeselected);
        columnFilterSettings.addString(KEY_ENFORCE_OPTION, getEnforceOption(manualFilter).name());
    }

    private static EnforceOption getEnforceOption(final ManualFilter manualFilter) {
        if (manualFilter.m_includeUnknownColumns) {
            return EnforceOption.EnforceExclusion;
        } else {
            return EnforceOption.EnforceInclusion;
        }
    }
}
