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
package org.knime.core.webui.node.dialog.defaultdialog.setting.columnselection;

import org.knime.core.data.DataColumnSpec;
import org.knime.core.data.DataType;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.PersistableSettings;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.Persist;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * A class used to store a selected column together with additional information (e.g. type).
 *
 * @author Paul Bärnreuther
 */
public final class ColumnSelection implements PersistableSettings {

    /**
     * The selected column
     */
    public String m_selected; // NOSONAR

    /**
     * The collection of the names of all types with respect to which the current selected column is compatible
     */
    @Persist(hidden = true, optional = true)
    public String[] m_compatibleTypes;

    /**
     * @param colSpec the spec of the initially selected column
     */
    public ColumnSelection(final DataColumnSpec colSpec) {
        this(colSpec.getName(), colSpec.getType());
    }

    /**
     * @param name the name of the selected column
     * @param type the type of the selected column
     */
    public ColumnSelection(final String name, final DataType type) {
        m_selected = name;
        m_compatibleTypes = getCompatibleTypes(type);
    }

    /**
     * Initialises the column selection with no initially selected columns.
     */
    public ColumnSelection() {
        // Default constructor is needed for schema generation but does not need to set anything.
    }

    /**
     * @return the currently selected column
     */
    @JsonIgnore
    public String getSelected() {
        return m_selected;
    }

    /**
     * @param type against which compatibility is checked
     * @return A list of string representations of all the types the given one is compatible to
     */
    public static String[] getCompatibleTypes(final DataType type) {
        if (type == null) {
            return new String[0];
        }
        return type.getValueClasses().stream().map(Class::getName).toArray(String[]::new);
    }
}
