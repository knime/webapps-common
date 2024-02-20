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

import java.util.Objects;

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.Persist;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnfilter.PatternFilter.PatternMode;

/**
 *
 * @author Paul Bärnreuther
 */
public class NameFilter {
    /**
     * The setting representing the selected strings
     */
    @Persist(hidden = true, optional = true)
    public String[] m_selected;

    /**
     * The way the selection is determined by
     */
    public NameFilterMode m_mode; //NOSONAR

    /**
     * Settings regarding selection by pattern matching (regex or wildcard)
     */
    public PatternFilter m_patternFilter; //NOSONAR

    /**
     * Settings regarding manual selection
     */
    public ManualFilter m_manualFilter; //NOSONAR

    /**
     * Use this to construct a string array filter with an initial array of columns which are manually selected
     *
     * @param initialSelected the initial manually selected non-null columns
     */
    public NameFilter(final String[] initialSelected) {
        m_mode = NameFilterMode.MANUAL;
        m_manualFilter = new ManualFilter(Objects.requireNonNull(initialSelected));
        m_patternFilter = new PatternFilter();
    }

    /**
     * Exclude the unknown columns while in manual mode
     */
    public void excludeUnknownColumn() {
        m_manualFilter.m_includeUnknownColumns = false;
    }

    /**
     * Initializes the column selection with no initially selected columns.
     */
    public NameFilter() {
        this(new String[0]);
    }

    /**
     * Initializes the column selection with no initially selected columns.
     *
     * @param context settings creation context
     */
    public NameFilter(final DefaultNodeSettingsContext context) {
        this();
    }

    /**
     * @param allCurrentChoices the non-null list of all possible names
     * @return the array of currently selected names with respect to the mode
     */
    public String[] getSelected(final String[] allCurrentChoices) {
        switch (m_mode) {
            case MANUAL:
                return m_manualFilter.getUpdatedManuallySelected(Objects.requireNonNull(allCurrentChoices));
            default:
                return m_patternFilter.getSelected(PatternMode.of(m_mode), allCurrentChoices);
        }
    }

    /**
     * @param allCurrentChoices the non-null list of all possible names
     * @return the array of currently selected names with respect to the mode which are contained in the given array of
     *         choices
     */
    public String[] getNonMissingSelected(final String[] allCurrentChoices) {
        if (m_mode == NameFilterMode.MANUAL) {
            return m_manualFilter.getNonMissingUpdatedManuallySelected(Objects.requireNonNull(allCurrentChoices))
                .toArray(String[]::new);
        } else {
            return getSelected(allCurrentChoices);
        }
    }
}
