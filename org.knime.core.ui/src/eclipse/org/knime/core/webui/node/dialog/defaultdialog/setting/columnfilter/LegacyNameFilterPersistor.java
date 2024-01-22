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
 *   Jan 13, 2023 (Adrian Nembach, KNIME GmbH, Konstanz, Germany): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.setting.columnfilter;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeLogger;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.util.filter.NameFilterConfiguration;
import org.knime.core.node.util.filter.PatternFilterConfiguration;
import org.knime.core.node.workflow.NodeContext;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.NodeSettingsPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.NodeSettingsPersistorWithConfigKey;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnfilter.PatternFilter.PatternMode;

/**
 * {@link NodeSettingsPersistor} for {@link NameFilter} that persists it in a way compatible to
 * {@link NameFilterConfiguration}.
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 */
public final class LegacyNameFilterPersistor extends NodeSettingsPersistorWithConfigKey<NameFilter> {

    private static final NodeLogger LOGGER = NodeLogger.getLogger(LegacyNameFilterPersistor.class);

    /**
     * See NameFilterConfiguration.KEY_FILTER_TYPE
     */
    private static final String KEY_FILTER_TYPE = "filter-type";

    /**
     * See NameFilterConfiguration.TYPE.
     */
    private static final String KEY_FILTER_TYPE_MANUAL = "STANDARD";

    @SuppressWarnings("javadoc")
    public static NameFilter load(final NodeSettingsRO nodeSettings, final String configKey)
        throws InvalidSettingsException {
        var nameFilterSettings = nodeSettings.getNodeSettings(configKey);
        var nameFilter = new NameFilter();
        nameFilter.m_mode = loadMode(nameFilterSettings);
        nameFilter.m_manualFilter = LegacyManualFilterPersistorUtil.loadManualFilter(nameFilterSettings);
        nameFilter.m_patternFilter =
            loadPatternMatching(nameFilterSettings.getNodeSettings(PatternFilterConfiguration.TYPE));
        return nameFilter;
    }

    private static NameFilterMode loadMode(final NodeSettingsRO nameFilterSettings) throws InvalidSettingsException {
        var filterType = nameFilterSettings.getString(KEY_FILTER_TYPE);
        if (KEY_FILTER_TYPE_MANUAL.equals(filterType)) {
            return NameFilterMode.MANUAL;
        } else if (PatternFilterConfiguration.TYPE.equals(filterType)) {
            var patternMatchingSettings = nameFilterSettings.getNodeSettings(PatternFilterConfiguration.TYPE);
            return LegacyPatternFilterPersistorUtil.loadPatternMode(patternMatchingSettings).toNameFilterMode();
        } else {
            throw new InvalidSettingsException("Unsupported name filter type: " + filterType);
        }
    }

    private static PatternFilter loadPatternMatching(final NodeSettingsRO patternMatchingSettings)
        throws InvalidSettingsException {
        var patternFilter = new PatternFilter();
        patternFilter.m_pattern = patternMatchingSettings.getString("pattern");
        patternFilter.m_isCaseSensitive = patternMatchingSettings.getBoolean("caseSensitive");
        patternFilter.m_isInverted = patternMatchingSettings.getBoolean("excludeMatching");
        return patternFilter;
    }

    @SuppressWarnings("javadoc")
    public static void save(NameFilter nameFilter, final NodeSettingsWO settings, final String configKey) {
        if (nameFilter == null) {
            LOGGER.coding(createFilterNullError(configKey));
            nameFilter = new NameFilter();
        }
        var nameFilterSettings = settings.addNodeSettings(configKey);
        nameFilterSettings.addString(KEY_FILTER_TYPE, toFilterType(nameFilter.m_mode));
        LegacyManualFilterPersistorUtil.saveManualFilter(nameFilter.m_manualFilter, nameFilterSettings);
        LegacyPatternFilterPersistorUtil.savePatternMatching(nameFilter.m_patternFilter,
            PatternMode.of(nameFilter.m_mode), nameFilterSettings.addNodeSettings(PatternFilterConfiguration.TYPE));
    }

    private static String createFilterNullError(final String configKey) {
        var nodeContext = NodeContext.getContext();
        String prefix;
        if (nodeContext != null) {
            prefix = String.format("The NameFilter with key '%s' of the node '%s' is null.", configKey,
                nodeContext.getNodeContainer().getNameWithID());
        } else {
            prefix = String.format("The NameFilter with key '%s' is null. ", configKey);
        }
        return prefix
            + " It is replaced by a new NameFilter instance to prevent errors but please fix this issue anyway.";
    }

    private static String toFilterType(final NameFilterMode mode) {
        switch (mode) {
            case MANUAL:
                return KEY_FILTER_TYPE_MANUAL;
            case REGEX:
            case WILDCARD:
                return PatternFilterConfiguration.TYPE;
            default:
                throw new IllegalArgumentException("Unsupported NameSelectionMode: " + mode);
        }
    }

    @Override
    public NameFilter load(final NodeSettingsRO settings) throws InvalidSettingsException {
        return load(settings, getConfigKey());
    }

    @Override
    public void save(final NameFilter obj, final NodeSettingsWO settings) {
        save(obj, settings, getConfigKey());
    }
}
