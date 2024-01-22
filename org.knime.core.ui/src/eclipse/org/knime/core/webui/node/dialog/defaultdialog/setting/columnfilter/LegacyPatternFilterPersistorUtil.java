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
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnfilter.PatternFilter.PatternMode;

/**
 *
 * @author Paul Bärnreuther
 */
class LegacyPatternFilterPersistorUtil {

    private LegacyPatternFilterPersistorUtil() {
        // Utility
    }


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


    static PatternMode loadPatternMode(final NodeSettingsRO patternMatchingSettings) throws InvalidSettingsException {
        var patternMatchingType = patternMatchingSettings.getString(PATTERN_FILTER_TYPE);
        if (PATTERN_FILTER_WILDCARD.equals(patternMatchingType)) {
            return PatternMode.WILDCARD;
        } else if (PATTERN_FILTER_REGEX.equals(patternMatchingType)) {
            return PatternMode.REGEX;
        } else {
            throw new InvalidSettingsException("Unsupported name pattern type: " + patternMatchingType);
        }
    }

    static PatternFilter loadPatternMatching(final NodeSettingsRO patternMatchingSettings)
        throws InvalidSettingsException {
        var patternFilter = new PatternFilter();
        patternFilter.m_pattern = patternMatchingSettings.getString("pattern");
        patternFilter.m_isCaseSensitive = patternMatchingSettings.getBoolean("caseSensitive");
        patternFilter.m_isInverted = patternMatchingSettings.getBoolean("excludeMatching");
        return patternFilter;
    }

    static void savePatternMatching(final PatternFilter patternFilter, final PatternMode mode,
        final NodeSettingsWO patternMatchingSettings) {
        patternMatchingSettings.addString("pattern", patternFilter.m_pattern);
        // not entirely backwards compatible because we don't persist the pattern type if pattern matching
        // is not the current mode but we accept that
        patternMatchingSettings.addString("type",
            mode == PatternMode.REGEX ? PATTERN_FILTER_REGEX : PATTERN_FILTER_WILDCARD);
        patternMatchingSettings.addBoolean("caseSensitive", patternFilter.m_isCaseSensitive);
        patternMatchingSettings.addBoolean("excludeMatching", patternFilter.m_isInverted);
    }

}
