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
import java.util.Optional;
import java.util.Set;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import org.knime.core.data.DataColumnSpec;
import org.knime.core.data.DataTableSpec;
import org.knime.core.data.DataType;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.webui.node.dialog.persistence.field.FieldNodeSettingsPersistor;
import org.knime.core.webui.node.dialog.persistence.field.Persist;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 *
 * @author Paul Bärnreuther
 */
public class TypeColumnFilter implements DialogComponentSettings {

    /**
     * A list of string representations of types of columns which are used in case of m_mode = "TYPE"
     */
    public String[] m_selectedTypes; //NOSONAR

    /**
     * Additional information necessary to display the types in the dialog. This has to be persisted in order to display
     * previously selected types stored in {@link #m_selectedTypes} which are not present in the table anymore.
     */
    @Persist(customPersistor = ColumnTypeDisplaysPersistor.class)
    public ColumnTypeDisplay[] m_typeDisplays = new ColumnTypeDisplay[0]; //NOSONAR

    /**
     * Filter with no selected Types
     */
    public TypeColumnFilter() {
        m_selectedTypes = new String[0];
    }

    /**
     * @param choices the list of all possible column names
     * @param spec of the input data table (for type selection)
     * @return the array of currently selected columns with respect to the mode
     */
    @JsonIgnore
    public String[] getSelected(final String[] choices, final DataTableSpec spec) {
        final var types = getTypes(choices, spec);
        var selectedTypes = Set.of(m_selectedTypes);
        return IntStream.range(0, types.length)//
            .filter(i -> selectedTypes.contains(types[i]))//
            .mapToObj(i -> choices[i])//
            .toArray(String[]::new);
    }

    private static String[] getTypes(final String[] choices, final DataTableSpec spec) {
        final var choicesSet = new HashSet<>(Arrays.asList(choices));
        return spec.stream()//
            .filter(colSpec -> choicesSet.contains(colSpec.getName())) //
            .map(DataColumnSpec::getType) //
            .map(TypeColumnFilter::typeToString) //
            .toArray(String[]::new);
    }

    /**
     * @param type the {@link DataType} of a column
     * @return the string representation of the data type
     */
    public static String typeToString(final DataType type) {
        return type.getPreferredValueClass().getName();
    }


    private static final class ColumnTypeDisplaysPersistor implements FieldNodeSettingsPersistor<ColumnTypeDisplay[]> {

        @Override
        public ColumnTypeDisplay[] load(final NodeSettingsRO settings) throws InvalidSettingsException {
            var selectedTypes = settings.getStringArray("selectedTypes");
            return Stream.of(selectedTypes)//
                .map(ColumnTypeDisplay::fromPreferredValueClass)//
                .flatMap(Optional::stream)//
                .toArray(ColumnTypeDisplay[]::new);
        }

        @Override
        public void save(final ColumnTypeDisplay[] obj, final NodeSettingsWO settings) {
            // don't save the displays
        }

        @Override
        public String[] getConfigKeys() {
            return new String[0];
        }

    }
}
