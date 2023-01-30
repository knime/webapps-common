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
 *   16 Jan 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.impl;

import java.util.Arrays;
import java.util.HashSet;
import java.util.LinkedHashSet;

import org.knime.core.data.DataTableSpec;

/**
 *
 * @author Paul Bärnreuther
 */
public class ManualColumnFilter implements DialogComponentSettings {

    /**
     * the manually selected columns in case of m_mode = "MANUAL"
     */
    public String[] m_manuallySelected; //NOSONAR

    /**
     * the (last) deselected columns. It is necessary to store these in order to know which colums of a new input
     * {@link DataTableSpec} are unknown.
     */
    public String[] m_manuallyDeselected; //NOSONAR

    /**
     * A column is unknown if it is was not present in the last executed input table. If this setting is true, these
     * columns will be selected/included when the selected columns are updated after a reconfiguration of the input
     * table.
     */
    public boolean m_includeUnknownColumns; //NOSONAR

    /**
     * @param initialSelected the initially manually selected columns
     */
    public ManualColumnFilter(final String[] initialSelected) {
        m_manuallySelected = initialSelected;
        m_manuallyDeselected = new String[0];
    }

    @SuppressWarnings("javadoc")
    public ManualColumnFilter() {
    }

    /**
     * Returns the manually selected columns plus any unknown columns if these are included. Note that the manually
     * selected and manually deselected do not get updated by this method. The only place where these get altered is if
     * the dialog gets opened and new settings get saved. This way, excluded columns stay marked as excluded when a view
     * is executed without opening the dialog.
     *
     * @param choices for selected values from which previously unknown ones are either selected or deselected.
     * @return the manually selected columns plus the new previously unknown ones if these are included.
     */
    public String[] getUpdatedManuallySelected(final String[] choices) {
        final var result = new LinkedHashSet<>(Arrays.asList(m_manuallySelected));
        if (m_includeUnknownColumns) {
            final var unknownValues = new HashSet<>(Arrays.asList(choices));
            unknownValues.removeAll(Arrays.asList(m_manuallyDeselected));
            result.addAll(unknownValues);
        }
        return result.stream().toArray(String[]::new);
    }
}
