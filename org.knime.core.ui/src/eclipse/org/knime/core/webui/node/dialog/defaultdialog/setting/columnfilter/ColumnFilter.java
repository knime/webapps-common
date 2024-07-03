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
 *   15 Dec 2022 Paul Bärnreuther: created
 */
package org.knime.core.webui.node.dialog.defaultdialog.setting.columnfilter;

import java.util.Objects;

import org.knime.core.data.DataTableSpec;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.PersistableSettings;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.Persist;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnfilter.PatternFilter.PatternMode;
import org.knime.core.webui.node.dialog.defaultdialog.util.InstantiationUtil;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesProvider;

/**
 * A class used to store several representation of column choices. I.e. the columns can be determined using one of the
 * modes of {@link ColumnFilterMode}.
 *
 * @author Paul Bärnreuther
 */
public class ColumnFilter implements PersistableSettings {

    /**
     * The setting representing the selected columns
     */
    @Persist(hidden = true, optional = true)
    public String[] m_selected;

    /**
     * The way the selection is determined by
     */
    public ColumnFilterMode m_mode; //NOSONAR

    /**
     * Settings regarding selection by pattern matching (regex or wildcard)
     */
    public PatternFilter m_patternFilter; //NOSONAR

    /**
     * Settings regarding manual selection
     */
    public ManualFilter m_manualFilter; //NOSONAR

    /**
     * Settings regarding selection per type
     */
    public TypeFilter m_typeFilter; //NOSONAR

    /**
     * Initialises the column selection with an initial array of columns which are manually selected
     *
     * @param initialSelected the initial manually selected non-null columns
     */
    public ColumnFilter(final String[] initialSelected) {
        m_mode = ColumnFilterMode.MANUAL;
        m_manualFilter = new ManualFilter(Objects.requireNonNull(initialSelected));
        m_patternFilter = new PatternFilter();
        m_typeFilter = new TypeFilter();
        m_selected = initialSelected;
    }

    /**
     * Set the column filter to exclude unknown columns while in manual mode.
     *
     * @return the instance
     */
    public ColumnFilter withExcludeUnknownColumns() {
        m_manualFilter.m_includeUnknownColumns = false;
        return this;
    }

    /**
     * Set the column filter to include unknown columns while in manual mode.
     *
     * @return the instance
     */
    public ColumnFilter withIncludeUnknownColumns() {
        m_manualFilter.m_includeUnknownColumns = true;
        return this;
    }

    /**
     * Initialises the column selection with no initially selected columns.
     */
    public ColumnFilter() {
        this(new String[0]);
    }

    /**
     * Initialises the column selection based on the given context.
     *
     * @param context settings creation context
     */
    public ColumnFilter(final DefaultNodeSettingsContext context) {
        this();
    }

    /**
     * Creates a ColumnFilter that includes all columns the choicesProvider selects including unknown new columns.
     *
     * @param choicesProviderClass the class of {@link ChoicesProvider}
     * @param context of the settings creation
     * @return a new ColumnFilter
     */
    public static ColumnFilter createDefault(final Class<? extends ChoicesProvider> choicesProviderClass,
        final DefaultNodeSettingsContext context) {
        ChoicesProvider choicesProvider = InstantiationUtil.createInstance(choicesProviderClass);
        return new ColumnFilter(choicesProvider.choices(context)).withIncludeUnknownColumns();
    }

    /**
     * Get selected columns, including columns that were selected but are not in the provided column list.
     * You likely want to use {@link #getSelected(String[], DataTableSpec)} instead.
     *
     * @see #getSelected(String[], DataTableSpec)
     * @param choices the non-null list of all possible column names
     * @param spec of the input data table (for type selection)
     * @return the array of currently selected columns with respect to the mode
     * @throws NullPointerException if {@code choices} is {@code null} or the filter mode
     *             is @{@link ColumnFilterMode#TYPE} and {@code spec} is {@code null}
     */
    public String[] getSelectedIncludingMissing(final String[] choices, final DataTableSpec spec) {
        Objects.requireNonNull(choices);
        return switch (m_mode) {
            case MANUAL -> m_manualFilter.getUpdatedManuallySelectedIncludingMissing(choices);
            case TYPE -> m_typeFilter.getSelected(choices, spec);
            default -> m_patternFilter.getSelected(PatternMode.of(m_mode), choices);
        };
    }

    /**
     * Get selected columns, but only those that are available in the provided column list. This is likely the method
     * you want to use.
     *
     * @see #getSelectedIncludingMissing(String[], DataTableSpec)
     * @param choices the non-null list of all possible column names
     * @param spec of the input data table (for type selection)
     * @return the array of currently selected columns with respect to the mode which are contained in the given array
     *         of choices
     * @throws NullPointerException if {@code choices} is {@code null} or the filter mode
     *             is @{@link ColumnFilterMode#TYPE} and {@code spec} is {@code null}
     */
    public String[] getSelected(final String[] choices, final DataTableSpec spec) {
        Objects.requireNonNull(choices);
        return switch (m_mode) {
            case MANUAL -> m_manualFilter.getUpdatedManuallySelected(choices).toArray(String[]::new);
            default -> getSelectedIncludingMissing(choices, spec);
        };
    }
}
