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
 * A class used to store several representation of column choices.
 *
 * @author Paul Bärnreuther
 */
public class ColumnSelection {
    public ColumnSelectionMode m_mode;

    public String[] m_manuallySelected;

    public String m_pattern;

    public boolean m_isCaseSensitive;

    public boolean m_isInverted;

    public List<String> m_selectedTypes;

    public ColumnSelection(final String[] initialSelected) {
        m_mode = ColumnSelectionMode.MANUAL;
        m_isCaseSensitive = false;
        m_isInverted = false;
        m_manuallySelected = initialSelected;
        m_pattern = "";
        m_selectedTypes = List.of();
    }

    public ColumnSelection() {
        this(new String[0]);
    }

    public ColumnSelection(final SettingsCreationContext context) {
        this();
    }

    /**
     * @param columnChoices
     * @param choices
     * @param spec
     * @return
     */
    @JsonIgnore
    public static String[] get(final ColumnSelection columnChoices, final String[] choices, final DataTableSpec spec) {
        return get(columnChoices, choices, new SettingsCreationContext(new PortObjectSpec[]{spec}, null));
    }

    /**
     * @param columnChoices
     * @param choices
     * @param context
     * @return
     */
    @JsonIgnore
    public static String[] get(final ColumnSelection columnChoices, final String[] choices,
        final SettingsCreationContext context) {
        final Predicate<String> predicate;
        final var casedPattern =
            columnChoices.m_isCaseSensitive ? columnChoices.m_pattern : columnChoices.m_pattern.toLowerCase();
        switch (columnChoices.m_mode) {
            case MANUAL:
                return columnChoices.m_manuallySelected;
            case TYPE:
                final var types = getTypes(choices, context);
                return IntStream.range(0, types.length).filter(i -> columnChoices.m_selectedTypes.contains(types[i]))
                    .mapToObj(i -> choices[i]).toArray(String[]::new);
            case REGEX:
                predicate = casedPattern.isEmpty() ? (choice) -> false : Pattern.compile(casedPattern).asPredicate();
                break;

            case WILDCARD:
                predicate = choice -> wildcardMatch(choice, casedPattern);
                break;
            default:
                return new String[0];
        }
        final var augmentedPredicate =
            getAugmentedPredicate(predicate, columnChoices.m_isCaseSensitive, columnChoices.m_isInverted);
        return Arrays.asList(choices).stream().filter(augmentedPredicate).toArray(String[]::new);
    }

    private static Predicate<String> getAugmentedPredicate(final Predicate<String> originalPredicate,
        final boolean isCaseSensitive, final boolean isInverted) {
        final var directedPredicate = isInverted ? originalPredicate.negate() : originalPredicate;
        return (string) -> directedPredicate.test(isCaseSensitive ? string : string.toLowerCase());
    }

    private static String[] getTypes(final String[] choices, final SettingsCreationContext context) {
        final var spec = context.getDataTableSpecs()[0];
        return Arrays.asList(choices).stream() //
            .map(choice -> spec.getColumnSpec(choice)) //
            .map(DataColumnSpec::getType) //
            .map(ColumnSelection::typeToString) //
            .toArray(String[]::new);
    }

    /**
     * @param type
     * @return
     */
    public static String typeToString(final DataType type) {
        return type.getPreferredValueClass().getSimpleName();
    }
}
