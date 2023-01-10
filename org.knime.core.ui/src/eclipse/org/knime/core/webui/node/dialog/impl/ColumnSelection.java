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
package org.knime.core.webui.node.dialog.impl;

import static org.apache.commons.io.FilenameUtils.wildcardMatch;

import java.util.Arrays;
import java.util.List;
import java.util.Locale;
import java.util.function.Predicate;
import java.util.regex.Pattern;
import java.util.stream.IntStream;

import org.knime.core.data.DataColumnSpec;
import org.knime.core.data.DataTableSpec;
import org.knime.core.data.DataType;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.webui.node.dialog.impl.DefaultNodeSettings.SettingsCreationContext;

import com.fasterxml.jackson.annotation.JsonIgnore;

/**
 * A class used to store several representation of column choices. I.e. the columns can be determined using one of the
 * modes of {@link ColumnSelectionMode}. For using this class in order to render a twinlist, one has to create a
 * subclass with a member "selected" with the 'columns' Schema annotation.
 *
 * @author Paul Bärnreuther
 */
public class ColumnSelection {
    /**
     * The way the selection is determined by
     */
    public ColumnSelectionMode m_mode; //NOSONAR

    /**
     * the manually selected columns in case of m_mode = "MANUAL"
     */
    public String[] m_manuallySelected; //NOSONAR

    /**
     * the pattern to which column names are matched in case of m_mode = "REGEX" or "WILDCARD"
     */
    public String m_pattern; //NOSONAR

    /**
     * whether m_pattern is case sensitive
     */
    public boolean m_isCaseSensitive; //NOSONAR

    /**
     * whether the pattern determines the excluded columns or the included ones
     */
    public boolean m_isInverted; //NOSONAR

    /**
     * A list of string representations of types of columns which are used in case of m_mode = "TYPE"
     */
    public List<String> m_selectedTypes; //NOSONAR

    /**
     * Initialises the column selection with an initial array of columns which are manually selected
     *
     * @param initialSelected the initial manually selected columns
     */
    public ColumnSelection(final String[] initialSelected) {
        m_mode = ColumnSelectionMode.MANUAL;
        m_isCaseSensitive = false;
        m_isInverted = false;
        m_manuallySelected = initialSelected;
        m_pattern = "";
        m_selectedTypes = List.of();
    }

    @SuppressWarnings("javadoc")
    public ColumnSelection() {
        this(new String[0]);
    }

    @SuppressWarnings("javadoc")
    public ColumnSelection(final SettingsCreationContext context) {
        this();
    }

    /**
     * @param choices the list of all possible column names
     * @param spec of the input data table (for type selection)
     * @return the array of currently selected columns with respect to the mode
     */
    @JsonIgnore
    public String[] getSelected(final String[] choices, final DataTableSpec spec) {
        return getSelected(choices, new SettingsCreationContext(new PortObjectSpec[]{spec}, null));
    }

    /**
     * @param choices the list of all possible column names
     * @param context the creation context (for type selection)
     * @return the array of currently selected columns with respect to the mode
     */
    @JsonIgnore
    public String[] getSelected(final String[] choices, final SettingsCreationContext context) {
        final Predicate<String> predicate;
        final var casedPattern = m_isCaseSensitive ? m_pattern : m_pattern.toLowerCase(Locale.getDefault());
        switch (m_mode) {
            case MANUAL:
                return m_manuallySelected;
            case TYPE:
                final var types = getTypes(choices, context);
                return IntStream.range(0, types.length).filter(i -> m_selectedTypes.contains(types[i]))
                    .mapToObj(i -> choices[i]).toArray(String[]::new);
            case REGEX:
                predicate = casedPattern.isEmpty() ? choice -> false
                    : Pattern.compile(String.format("^%s$", casedPattern)).asPredicate();
                break;
            case WILDCARD:
                predicate = choice -> wildcardMatch(choice, casedPattern);
                break;
            default:
                return new String[0];
        }
        final var augmentedPredicate = getAugmentedPredicate(predicate, m_isCaseSensitive, m_isInverted);
        return Arrays.asList(choices).stream().filter(augmentedPredicate).toArray(String[]::new);
    }

    private static Predicate<String> getAugmentedPredicate(final Predicate<String> originalPredicate,
        final boolean isCaseSensitive, final boolean isInverted) {
        final var directedPredicate = isInverted ? originalPredicate.negate() : originalPredicate;
        return string -> directedPredicate.test(isCaseSensitive ? string : string.toLowerCase(Locale.getDefault()));
    }

    private static String[] getTypes(final String[] choices, final SettingsCreationContext context) {
        final var spec = context.getDataTableSpecs()[0];
        return Arrays.asList(choices).stream() //
            .map(spec::getColumnSpec) //
            .map(DataColumnSpec::getType) //
            .map(ColumnSelection::typeToString) //
            .toArray(String[]::new);
    }

    /**
     * @param type the {@link DataType} of a column
     * @return the string representation of the data type
     */
    public static String typeToString(final DataType type) {
        return type.getPreferredValueClass().getSimpleName();
    }
}
