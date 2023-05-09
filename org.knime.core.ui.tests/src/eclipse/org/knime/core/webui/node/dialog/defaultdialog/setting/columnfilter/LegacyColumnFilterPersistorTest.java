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
import static org.junit.jupiter.api.Assertions.assertTrue;

import org.junit.jupiter.api.Test;
import org.knime.core.data.StringValue;
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
final class LegacyColumnFilterPersistorTest {

    private final LegacyColumnFilterPersistor m_persistor = createPersistor();

    private static LegacyColumnFilterPersistor createPersistor() {
        var persistor = new LegacyColumnFilterPersistor();
        persistor.setConfigKey("config_key");
        return persistor;
    }

    @Test
    void testManualSelection() throws InvalidSettingsException {
        var columnFilter = new ColumnFilter(new String[]{"foo", "bar"});
        var manualFilter = columnFilter.m_manualFilter;
        manualFilter.m_manuallySelected = new String[]{"foo"};
        manualFilter.m_manuallyDeselected = new String[]{"bar"};
        manualFilter.m_includeUnknownColumns = true;
        testPersistence(columnFilter);
    }

    @Test
    void testRegexSelection() throws Exception {
        var columnFilter = new ColumnFilter(new String[]{"bar", "baz"});
        columnFilter.m_mode = ColumnFilterMode.REGEX;
        columnFilter.m_patternFilter.m_pattern = "ba.+";
        columnFilter.m_patternFilter.m_isCaseSensitive = true;
        testPersistence(columnFilter);
    }

    @Test
    void testWildcardSelection() throws InvalidSettingsException {
        var columnFilter = new ColumnFilter(new String[]{"bar", "baz"});
        columnFilter.m_mode = ColumnFilterMode.WILDCARD;
        columnFilter.m_patternFilter.m_pattern = "ba*";
        columnFilter.m_patternFilter.m_isInverted = true;
        testPersistence(columnFilter);
    }

    @Test
    void testTypeSelection() throws InvalidSettingsException {
        var columnFilter = new ColumnFilter(new String[]{"bli", "bla"});
        columnFilter.m_mode = ColumnFilterMode.TYPE;
        columnFilter.m_typeFilter.m_selectedTypes = new String[]{StringValue.class.getName()};
        testPersistence(columnFilter);
    }

    private void testPersistence(final ColumnFilter columnFilter) throws InvalidSettingsException {
        var settings = new NodeSettings("test");
        m_persistor.save(columnFilter, settings);
        checkSettingsStructure(columnFilter, settings);
        var loaded = m_persistor.load(settings);
        checkEqual(columnFilter, loaded);
    }

    private static void checkSettingsStructure(final ColumnFilter columnFilter, final NodeSettingsRO settings)
        throws InvalidSettingsException {
        var columnFilterSettings = settings.getNodeSettings("config_key");
        assertEquals(getExpectedMode(columnFilter.m_mode), columnFilterSettings.getString("filter-type"),
            "Unexpected mode");
        checkManualSettings(columnFilter.m_manualFilter, columnFilterSettings);
        checkPatternSettings(columnFilter, columnFilterSettings.getNodeSettings(PatternFilterConfiguration.TYPE));
        checkTypeSettings(columnFilter.m_typeFilter, columnFilterSettings.getNodeSettings("datatype"));
    }

    private static String getExpectedMode(final ColumnFilterMode mode) {
        switch (mode) {
            case MANUAL:
                return "STANDARD";
            case REGEX:
            case WILDCARD:
                return PatternFilterConfiguration.TYPE;
            case TYPE:
                return "datatype";
            default:
                throw new IllegalArgumentException("Unknown mode: " + mode);

        }
    }

    private static void checkManualSettings(final ManualColumnFilter manualFilter, final NodeSettingsRO settings)
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

    private static void checkPatternSettings(final ColumnFilter columnFilter, final NodeSettingsRO settings)
        throws InvalidSettingsException {
        var mode = columnFilter.m_mode;
        var patternFilter = columnFilter.m_patternFilter;
        assertEquals(mode == ColumnFilterMode.REGEX ? "Regex" : "Wildcard", settings.getString("type"),
            "Unexpected pattern matching type");
        assertEquals(patternFilter.m_isCaseSensitive, settings.getBoolean("caseSensitive"),
            "Unexpected case sensitivity");
        assertEquals(patternFilter.m_isInverted, settings.getBoolean("excludeMatching"),
            "Unexpected value for excludeMatching");
        assertEquals(patternFilter.m_pattern, settings.getString("pattern"), "Unexpected pattern");
    }

    private static void checkTypeSettings(final TypeColumnFilter typeFilter, final NodeSettingsRO settings)
        throws InvalidSettingsException {
        var typeListSettings = settings.getNodeSettings("typelist");
        for (var type : typeFilter.m_selectedTypes) {
            assertTrue(typeListSettings.getBoolean(type),
                String.format("The selected type %s was not selected in settings", type));
        }
    }

    private static void checkEqual(final ColumnFilter left, final ColumnFilter right) {
        assertEquals(left.m_mode, right.m_mode, "Unexpected mode");
        checkEqual(left.m_manualFilter, right.m_manualFilter);
        checkEqual(left.m_patternFilter, right.m_patternFilter);
        checkEqual(left.m_typeFilter, right.m_typeFilter);
    }

    private static void checkEqual(final TypeColumnFilter left, final TypeColumnFilter right) {
        assertArrayEquals(left.m_selectedTypes, right.m_selectedTypes, "Unexpected selected types");
    }

    private static void checkEqual(final PatternColumnFilter left, final PatternColumnFilter right) {
        assertEquals(left.m_isCaseSensitive, right.m_isCaseSensitive, "Case sensitivity doesn't match");
        assertEquals(left.m_isInverted, right.m_isInverted, "isInverted doesn't match");
        assertEquals(left.m_pattern, right.m_pattern, "Pattern doesn't match");
    }

    private static void checkEqual(final ManualColumnFilter left, final ManualColumnFilter right) {
        assertArrayEquals(left.m_manuallySelected, right.m_manuallySelected, "Manually selected columns doesn't match");
    }

}
