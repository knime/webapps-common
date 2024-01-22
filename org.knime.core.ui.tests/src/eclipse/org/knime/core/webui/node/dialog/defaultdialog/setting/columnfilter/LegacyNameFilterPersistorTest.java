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
 *   Jan 20, 2023 (Adrian Nembach, KNIME GmbH, Konstanz, Germany): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.setting.columnfilter;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;

import org.junit.jupiter.api.Test;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.util.filter.NameFilterConfiguration.EnforceOption;
import org.knime.core.node.util.filter.PatternFilterConfiguration;

/**
 * Unit tests for the {@link LegacyColumnFilterPersistor}.
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 */
final class LegacyNameFilterPersistorTest {

    private final LegacyNameFilterPersistor m_persistor = createPersistor();

    private static LegacyNameFilterPersistor createPersistor() {
        var persistor = new LegacyNameFilterPersistor();
        persistor.setConfigKey("config_key");
        return persistor;
    }

    @Test
    void testManualSelection() throws InvalidSettingsException {
        var nameFilter = new NameFilter(new String[]{"foo", "bar"});
        var manualFilter = nameFilter.m_manualFilter;
        manualFilter.m_manuallySelected = new String[]{"foo"};
        manualFilter.m_manuallyDeselected = new String[]{"bar"};
        manualFilter.m_includeUnknownColumns = true;
        testPersistence(nameFilter);
    }

    @Test
    void testRegexSelection() throws Exception {
        var nameFilter = new NameFilter(new String[]{"bar", "baz"});
        nameFilter.m_mode = NameFilterMode.REGEX;
        nameFilter.m_patternFilter.m_pattern = "ba.+";
        nameFilter.m_patternFilter.m_isCaseSensitive = true;
        testPersistence(nameFilter);
    }

    @Test
    void testWildcardSelection() throws InvalidSettingsException {
        var nameFilter = new NameFilter(new String[]{"bar", "baz"});
        nameFilter.m_mode = NameFilterMode.WILDCARD;
        nameFilter.m_patternFilter.m_pattern = "ba*";
        nameFilter.m_patternFilter.m_isInverted = true;
        testPersistence(nameFilter);
    }

    private void testPersistence(final NameFilter nameFilter) throws InvalidSettingsException {
        var settings = new NodeSettings("test");
        m_persistor.save(nameFilter, settings);
        checkSettingsStructure(nameFilter, settings);
        var loaded = m_persistor.load(settings);
        checkEqual(nameFilter, loaded);
    }

    private static void checkSettingsStructure(final NameFilter nameFilter, final NodeSettingsRO settings)
        throws InvalidSettingsException {
        var columnFilterSettings = settings.getNodeSettings("config_key");
        assertEquals(getExpectedMode(nameFilter.m_mode), columnFilterSettings.getString("filter-type"),
            "Unexpected mode");
        checkManualSettings(nameFilter.m_manualFilter, columnFilterSettings);
        checkPatternSettings(nameFilter, columnFilterSettings.getNodeSettings(PatternFilterConfiguration.TYPE));
    }

    private static String getExpectedMode(final NameFilterMode mode) {
        switch (mode) {
            case MANUAL:
                return "STANDARD";
            case REGEX:
            case WILDCARD:
                return PatternFilterConfiguration.TYPE;
            default:
                throw new IllegalArgumentException("Unknown mode: " + mode);

        }
    }

    private static void checkManualSettings(final ManualFilter manualFilter, final NodeSettingsRO settings)
        throws InvalidSettingsException {
        assertArrayEquals(manualFilter.m_manuallySelected, settings.getStringArray("included_names"),
            "Unexpected included names");
        assertArrayEquals(manualFilter.m_manuallyDeselected, settings.getStringArray("excluded_names"),
            "The excluded names were not empty");
        assertEquals(
            manualFilter.m_includeUnknownColumns ? EnforceOption.EnforceExclusion.name()
                : EnforceOption.EnforceInclusion.name(),
            settings.getString("enforce_option"), "The enforce option was not EnforceInclusion");
    }

    private static void checkPatternSettings(final NameFilter columnFilter, final NodeSettingsRO settings)
        throws InvalidSettingsException {
        var mode = columnFilter.m_mode;
        var patternFilter = columnFilter.m_patternFilter;
        assertEquals(mode == NameFilterMode.REGEX ? "Regex" : "Wildcard", settings.getString("type"),
            "Unexpected pattern matching type");
        assertEquals(patternFilter.m_isCaseSensitive, settings.getBoolean("caseSensitive"),
            "Unexpected case sensitivity");
        assertEquals(patternFilter.m_isInverted, settings.getBoolean("excludeMatching"),
            "Unexpected value for excludeMatching");
        assertEquals(patternFilter.m_pattern, settings.getString("pattern"), "Unexpected pattern");
    }

    private static void checkEqual(final NameFilter left, final NameFilter right) {
        assertEquals(left.m_mode, right.m_mode, "Unexpected mode");
        checkEqual(left.m_manualFilter, right.m_manualFilter);
        checkEqual(left.m_patternFilter, right.m_patternFilter);
    }

    private static void checkEqual(final PatternFilter left, final PatternFilter right) {
        assertEquals(left.m_isCaseSensitive, right.m_isCaseSensitive, "Case sensitivity doesn't match");
        assertEquals(left.m_isInverted, right.m_isInverted, "isInverted doesn't match");
        assertEquals(left.m_pattern, right.m_pattern, "Pattern doesn't match");
    }

    private static void checkEqual(final ManualFilter left, final ManualFilter right) {
        assertArrayEquals(left.m_manuallySelected, right.m_manuallySelected, "Manually selected columns doesn't match");
    }

}
