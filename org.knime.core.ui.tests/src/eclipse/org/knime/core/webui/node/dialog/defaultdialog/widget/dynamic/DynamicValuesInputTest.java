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
 *   11 Jul 2024 (manuelhotz): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.widget.dynamic;

import static org.assertj.core.api.Assertions.failBecauseExceptionWasNotThrown;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.knime.chem.types.SmilesAdapterCell;
import org.knime.chem.types.SmilesCell;
import org.knime.core.data.DataColumnSpecCreator;
import org.knime.core.data.def.StringCell;
import org.knime.core.data.time.localdate.LocalDateCellFactory;
import org.knime.core.node.InvalidSettingsException;

/**
 * Tests for the {@link DynamicValuesInput} widget.
 *
 * @author Manuel Hotz, KNIME GmbH, Konstanz, Germany
 */
class DynamicValuesInputTest {

    @SuppressWarnings("deprecation")
    @Test
    void testSmilesAdapterCell() throws InvalidSettingsException {
        // spec has the adapter cell
        final var dcs =
            new DataColumnSpecCreator("smilesAdapterCol", new SmilesAdapterCell(new SmilesCell("C")).getType())
                .createSpec();
        new DynamicValuesInput(dcs.getType(), new SmilesCell("C")) //
            .validate(dcs);
    }

    @SuppressWarnings("deprecation")
    @Test
    void testSmilesCell() throws InvalidSettingsException {
        // spec has the normal cell
        final var dcs = new DataColumnSpecCreator("smilesCol", new SmilesCell("C").getType()).createSpec();
        new DynamicValuesInput(dcs.getType(), new SmilesAdapterCell(new SmilesCell("C"))) //
            .validate(dcs);
    }

    /**
     * Tests that the widget does not validate if error was stored (as StringCell).
     * @throws InvalidSettingsException expected since provided input was not valid
     */
    @Test
    void testErrorHandling() throws InvalidSettingsException {
        final var cell = LocalDateCellFactory.create(LocalDate.of(2024, 7, 10));
        final var dcs = new DataColumnSpecCreator("localDateCol", cell.getType()).createSpec();
        try {
            new DynamicValuesInput(dcs.getType(), new StringCell("Non-parseable-input")).validate(dcs);
        } catch (final InvalidSettingsException e) {
            // expected
            return;
        }
        failBecauseExceptionWasNotThrown(InvalidSettingsException.class);
    }

}
