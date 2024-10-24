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
 *   4 Apr 2024 (Robin Gerling): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.widget.choices;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import java.util.Set;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Test;
import org.knime.core.data.DataColumnDomain;
import org.knime.core.data.DataColumnDomainCreator;
import org.knime.core.data.DataColumnSpec;
import org.knime.core.data.DataColumnSpecCreator;
import org.knime.core.data.DataTableSpec;
import org.knime.core.data.DataType;
import org.knime.core.data.def.BooleanCell;
import org.knime.core.data.def.StringCell;
import org.knime.core.node.BufferedDataTable;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.node.port.PortType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.widget.handler.WidgetHandlerException;

/**
 *
 * @author Robin Gerling
 */
class DomainChoicesUtilTest {

    private static DefaultNodeSettingsContext createContext(final String colName, final List<String> domain) {
        final var colDomainCreator = new DataColumnDomainCreator();
        colDomainCreator.setValues(domain.stream().map(StringCell::new).collect(Collectors.toSet()));
        final var colDomain = colDomainCreator.createDomain();

        return createContextFromDomain(colName, colDomain, StringCell.TYPE);

    }

    private static DefaultNodeSettingsContext createContextFromDomain(final String colName,
        final DataColumnDomain colDomain, final DataType dataType) {
        final var colSpecCreator = new DataColumnSpecCreator(colName, dataType);
        colSpecCreator.setDomain(colDomain);
        final var colSpec = colSpecCreator.createSpec();

        return DefaultNodeSettingsContext.createDefaultNodeSettingsContext(new PortType[]{BufferedDataTable.TYPE},
            new PortObjectSpec[]{new DataTableSpec(//
                new DataColumnSpec[]{colSpec} //
            )}, null, null);
    }

    @Test
    void testDomainChoicesMissingColumn() throws WidgetHandlerException {

        final var colName = "existingColName";

        final var domainValues = DomainChoicesUtil
            .getChoicesByContextAndColumn(createContext(colName, List.of("foo", "bar")), "missingColName");

        assertThat(domainValues).isEmpty();

    }

    @Test
    void testDomainChoicesBooleanColumn() throws WidgetHandlerException {

        final var colName = "colName";
        final var booleanDomain =
            new DataColumnDomainCreator(Set.of(BooleanCell.TRUE, BooleanCell.FALSE)).createDomain();

        final var domainValues = DomainChoicesUtil
            .getChoicesByContextAndColumn(createContextFromDomain(colName, booleanDomain, BooleanCell.TYPE), colName);

        assertThat(domainValues).hasSize(2);

    }

    @Test
    void testChoicesUpdateHandlerMissingSpec() throws WidgetHandlerException {

        final var colName = "colName";

        final var context = DefaultNodeSettingsContext.createDefaultNodeSettingsContext(
            new PortType[]{BufferedDataTable.TYPE}, new PortObjectSpec[]{null}, null, null);

        final var domainValues = DomainChoicesUtil.getChoicesByContextAndColumn(context, colName);

        assertThat(domainValues).isEmpty();
    }

    @Test
    void testChoicesUpdateHandlerMissingDomain() throws InterruptedException, ExecutionException {

        final var colName = "colName";

        final var exception = assertThrows(WidgetHandlerException.class, () -> DomainChoicesUtil
            .getChoicesByContextAndColumn(createContextFromDomain(colName, null, StringCell.TYPE), colName));

        assertThat(exception.getMessage()).isEqualTo(
            "No column domain values present for column \"colName\". Consider using a Domain Calculator node.");
    }

}
