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
package org.knime.core.webui.node.dialog.persistence.field;

import java.util.ArrayList;
import java.util.stream.Stream;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeLogger;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.util.filter.NameFilterConfiguration.EnforceOption;
import org.knime.core.node.util.filter.PatternFilterConfiguration;
import org.knime.core.node.util.filter.column.DataColumnSpecFilterConfiguration;
import org.knime.core.node.workflow.NodeContext;
import org.knime.core.webui.node.dialog.impl.ColumnFilter;
import org.knime.core.webui.node.dialog.impl.ColumnFilterMode;
import org.knime.core.webui.node.dialog.impl.ManualColumnFilter;
import org.knime.core.webui.node.dialog.impl.PatternColumnFilter;
import org.knime.core.webui.node.dialog.impl.TypeColumnFilter;
import org.knime.core.webui.node.dialog.persistence.NodeSettingsPersistor;
import org.knime.core.webui.node.dialog.persistence.NodeSettingsPersistorWithConfigKey;

/**
 * {@link NodeSettingsPersistor} for {@link ColumnFilter} that persists it in a way compatible to
 * {@link DataColumnSpecFilterConfiguration}.
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 */
public final class LegacyColumnFilterPersistor extends NodeSettingsPersistorWithConfigKey<ColumnFilter> {

    private static final NodeLogger LOGGER = NodeLogger.getLogger(LegacyColumnFilterPersistor.class);

    /**
     * See NameFilterConfiguration.KEY_FILTER_TYPE
     */
    private static final String KEY_FILTER_TYPE = "filter-type";

    /**
     * See NameFilterConfiguration.TYPE.
     */
    private static final String KEY_FILTER_TYPE_MANUAL = "STANDARD";

    /**
     * See NameFilterConfiguration.KEY_ENFORCE_OPTION
     */
    private static final String KEY_ENFORCE_OPTION = "enforce_option";

    /**
     * See NameFilterConfiguration.KEY_EXCLUDED_NAMES
     */
    private static final String OLD_EXCLUDED_NAMES = "excluded_names";

    /**
     * See NameFilterConfiguration.KEY_INCLUDED_NAMES
     */
    private static final String KEY_INCLUDED_NAMES = "included_names";

    /**
     * See PatternFilterConfiguration.CFG_TYPE
     */
    private static final String PATTERN_FILTER_TYPE = "type";

    /**
     * See PatternFilterConfiguration.PatternFilterType.Regex
     */
    private static final String PATTERN_FILTER_REGEX = "Regex";

    /**
     * See PatternFilterConfiguration.PatternFilterType.Wildcard
     */
    private static final String PATTERN_FILTER_WILDCARD = "Wildcard";

    /**
     * See TypeFilterConfigurationImpl.TYPE
     */
    private static final String OLD_FILTER_TYPE_DATATYPE = "datatype";

    /**
     * See TypeFilterConfigurationImpl.CFG_TYPELIST
     */
    private static final String TYPELIST = "typelist";

    static ColumnFilter load(final NodeSettingsRO nodeSettings, final String configKey)
        throws InvalidSettingsException {
        var columnFilterSettings = nodeSettings.getNodeSettings(configKey);
        var columnFilter = new ColumnFilter();
        columnFilter.m_mode = loadMode(columnFilterSettings);
        columnFilter.m_selected = columnFilterSettings.getStringArray(KEY_INCLUDED_NAMES);
        columnFilter.m_manualFilter = loadManualFilter(columnFilterSettings);
        columnFilter.m_patternFilter =
            loadPatternMatching(columnFilterSettings.getNodeSettings(PatternFilterConfiguration.TYPE));
        columnFilter.m_typeFilter = loadTypeFilter(columnFilterSettings.getNodeSettings(OLD_FILTER_TYPE_DATATYPE));
        return columnFilter;
    }

    private static ColumnFilterMode loadMode(final NodeSettingsRO columnFilterSettings)
        throws InvalidSettingsException {
        var filterType = columnFilterSettings.getString(KEY_FILTER_TYPE);
        if (KEY_FILTER_TYPE_MANUAL.equals(filterType)) {
            return ColumnFilterMode.MANUAL;
        } else if (PatternFilterConfiguration.TYPE.equals(filterType)) {
            var patternMatchingSettings = columnFilterSettings.getNodeSettings(PatternFilterConfiguration.TYPE);
            var patternMatchingType = patternMatchingSettings.getString(PATTERN_FILTER_TYPE);
            if (PATTERN_FILTER_WILDCARD.equals(patternMatchingType)) {
                return ColumnFilterMode.WILDCARD;
            } else if (PATTERN_FILTER_REGEX.equals(patternMatchingType)) {
                return ColumnFilterMode.REGEX;
            } else {
                throw new InvalidSettingsException("Unsupported name pattern type: " + patternMatchingType);
            }
        } else if (OLD_FILTER_TYPE_DATATYPE.equals(filterType)) {
            return ColumnFilterMode.TYPE;
        } else {
            throw new InvalidSettingsException("Unsupported column filter type: " + filterType);
        }
    }

    private static ManualColumnFilter loadManualFilter(final NodeSettingsRO columnFilterSettings)
        throws InvalidSettingsException {
        var manualFilter = new ManualColumnFilter(columnFilterSettings.getStringArray(KEY_INCLUDED_NAMES));
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

    private static PatternColumnFilter loadPatternMatching(final NodeSettingsRO patternMatchingSettings)
        throws InvalidSettingsException {
        var patternFilter = new PatternColumnFilter();
        patternFilter.m_pattern = patternMatchingSettings.getString("pattern");
        patternFilter.m_isCaseSensitive = patternMatchingSettings.getBoolean("caseSensitive");
        patternFilter.m_isInverted = patternMatchingSettings.getBoolean("excludeMatching");
        return patternFilter;
    }

    private static TypeColumnFilter loadTypeFilter(final NodeSettingsRO typeFilterSettings)
        throws InvalidSettingsException {
        var typeFilter = new TypeColumnFilter();
        typeFilter.m_selectedTypes = loadSelectedTypes(typeFilterSettings);
        return typeFilter;
    }

    private static String[] loadSelectedTypes(final NodeSettingsRO typeFilterSettings) throws InvalidSettingsException {
        var typeListSettings = typeFilterSettings.getNodeSettings(TYPELIST);
        var keys = typeListSettings.keySet();
        var selectedTypes = new ArrayList<String>(keys.size());
        for (var key : keys) {
            if (typeListSettings.getBoolean(key)) {
                selectedTypes.add(key);
            }
        }
        return selectedTypes.toArray(String[]::new);
    }

    static void save(ColumnFilter columnFilter, final NodeSettingsWO settings, final String configKey) {
        if (columnFilter == null) {
            LOGGER.coding(createFilterNullError(configKey));
            columnFilter = new ColumnFilter();
        }
        var columnFilterSettings = settings.addNodeSettings(configKey);
        columnFilterSettings.addString(KEY_FILTER_TYPE, toFilterType(columnFilter.m_mode));
        saveManualFilter(columnFilter.m_manualFilter, columnFilterSettings);
        savePatternMatching(columnFilter.m_patternFilter, columnFilter.m_mode,
            columnFilterSettings.addNodeSettings(PatternFilterConfiguration.TYPE));
        saveTypeFilter(columnFilter.m_typeFilter, columnFilterSettings.addNodeSettings(OLD_FILTER_TYPE_DATATYPE));
    }

    private static String createFilterNullError(final String configKey) {
        var nodeContext = NodeContext.getContext();
        String prefix;
        if (nodeContext != null) {
            prefix = String.format("The ColumnFilter with key '%s' of the node '%s' is null.", configKey,
                nodeContext.getNodeContainer().getNameWithID());
        } else {
            prefix = String.format("The ColumnFilter with key '%s' is null. ", configKey);
        }
        return prefix
            + " It is replaced by a new ColumnFilter instance to prevent errors but please fix this issue anyway.";
    }

    private static String toFilterType(final ColumnFilterMode mode) {
        switch (mode) {
            case MANUAL:
                return KEY_FILTER_TYPE_MANUAL;
            case REGEX:
            case WILDCARD:
                return PatternFilterConfiguration.TYPE;
            case TYPE:
                return OLD_FILTER_TYPE_DATATYPE;
            default:
                throw new IllegalArgumentException("Unsupported ColumnSelectionMode: " + mode);
        }
    }

    private static void saveManualFilter(final ManualColumnFilter manualFilter,
        final NodeSettingsWO columnFilterSettings) {
        columnFilterSettings.addStringArray(KEY_INCLUDED_NAMES, manualFilter.m_manuallySelected);
        columnFilterSettings.addStringArray(OLD_EXCLUDED_NAMES, manualFilter.m_manuallyDeselected);
        columnFilterSettings.addString(KEY_ENFORCE_OPTION, getEnforceOption(manualFilter).name());
    }

    private static EnforceOption getEnforceOption(final ManualColumnFilter manualFilter) {
        if (manualFilter.m_includeUnknownColumns) {
            return EnforceOption.EnforceExclusion;
        } else {
            return EnforceOption.EnforceInclusion;
        }
    }

    private static void savePatternMatching(final PatternColumnFilter patternFilter, final ColumnFilterMode mode,
        final NodeSettingsWO patternMatchingSettings) {
        patternMatchingSettings.addString("pattern", patternFilter.m_pattern);
        // not entirely backwards compatible because we don't persist the pattern type if pattern matching
        // is not the current mode but we accept that
        patternMatchingSettings.addString("type",
            mode == ColumnFilterMode.REGEX ? PATTERN_FILTER_REGEX : PATTERN_FILTER_WILDCARD);
        patternMatchingSettings.addBoolean("caseSensitive", patternFilter.m_isCaseSensitive);
        patternMatchingSettings.addBoolean("excludeMatching", patternFilter.m_isInverted);
    }

    private static void saveTypeFilter(final TypeColumnFilter typeFilter, final NodeSettingsWO typeFilterSettings) {
        var typeListSettings = typeFilterSettings.addNodeSettings(TYPELIST);
        if (typeFilter.m_selectedTypes != null) {
            Stream.of(typeFilter.m_selectedTypes).forEach(t -> typeListSettings.addBoolean(t, true));
        }
    }

    @Override
    public ColumnFilter load(final NodeSettingsRO settings) throws InvalidSettingsException {
        return load(settings, getConfigKey());
    }

    @Override
    public void save(final ColumnFilter obj, final NodeSettingsWO settings) {
        save(obj, settings, getConfigKey());
    }
}
