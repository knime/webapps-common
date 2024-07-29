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

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.failBecauseExceptionWasNotThrown;

import java.time.LocalDate;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.knime.chem.types.SmilesAdapterCell;
import org.knime.chem.types.SmilesCell;
import org.knime.core.data.DataColumnSpecCreator;
import org.knime.core.data.DataType;
import org.knime.core.data.collection.CollectionCellFactory;
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

    @Test
    void testIllegalMissingCellInput() throws IllegalArgumentException, InvalidSettingsException {
        final var dcs = new DataColumnSpecCreator("stringCol", StringCell.TYPE).createSpec();
        try {
            new DynamicValuesInput(DataType.getMissingCell().getType(), DataType.getMissingCell()) //
                .validate(dcs);
        } catch (final IllegalArgumentException e) {
            // expected
            return;
        }
        failBecauseExceptionWasNotThrown(IllegalArgumentException.class);
    }

    @Test
    void testIllegalCollectionInput() throws IllegalArgumentException, InvalidSettingsException {
        final var collection = CollectionCellFactory.createListCell(List.of(new StringCell("test")));
        final var dcs = new DataColumnSpecCreator("stringCol", collection.getType()).createSpec();
        try {
            new DynamicValuesInput(collection.getType(), collection) //
                .validate(dcs);
        } catch (final IllegalArgumentException e) {
            // expected
            return;
        }
        failBecauseExceptionWasNotThrown(IllegalArgumentException.class);
    }

    /**
     * Tests that the widget does not validate if error was stored (as StringCell).
     * @throws InvalidSettingsException expected since provided input was not valid
     */
    @Test
    void testParseErrorHandling() throws InvalidSettingsException {
        final var dcs = new DataColumnSpecCreator("localDateCol", LocalDateCellFactory.TYPE).createSpec();
        try {
            new DynamicValuesInput(dcs.getType(), new StringCell("Non-parseable-input")).validate(dcs);
        } catch (final InvalidSettingsException e) {
            // expected
            return;
        }
        failBecauseExceptionWasNotThrown(InvalidSettingsException.class);
    }

    /**
     * Tests that the widget does not validate if types do not fit.
     * @throws InvalidSettingsException expected since provided input was not valid
     */
    @Test
    void testTypeErrorHandling() throws InvalidSettingsException {
        final var dcs = new DataColumnSpecCreator("localDateCol", LocalDateCellFactory.TYPE).createSpec();
        try {
            new DynamicValuesInput(StringCell.TYPE, new StringCell("Non-parseable-input")).validate(dcs);
        } catch (final InvalidSettingsException e) {
            // expected
            return;
        }
        failBecauseExceptionWasNotThrown(InvalidSettingsException.class);
    }

    /**
     * Tests that a round-trip conversion from local date to string and back works.
     */
    @Test
    void testSuccessfulConversion() {
        final var dateCell = LocalDateCellFactory.create(LocalDate.of(2024, 7, 10));
        final var dateInput = new DynamicValuesInput(LocalDateCellFactory.TYPE, dateCell);

        final var converted = dateInput
            .convertToType(DynamicValuesInput.singleValueWithCaseMatchingForStringWithDefault(StringCell.TYPE));

        assertThat(converted).isPresent().as("Local date value was successfully converted");
        assertThat(converted).contains(new DynamicValuesInput(StringCell.TYPE, new StringCell("2024-07-10")))
            .as("Local date value was converted to correct string value");

        final var dateCellAgain = converted.orElseThrow().convertToType(
            new DynamicValuesInput(LocalDateCellFactory.TYPE, LocalDateCellFactory.create(LocalDate.of(1970, 1, 1))));
        assertThat(dateCellAgain).isPresent().as("String value was successfully converted");
        assertThat(dateCellAgain).contains(dateInput)
            .as("String value was successfully converted back to original local date");
    }

    /**
     * Tests that a no-op conversion also round-trips.
     */
    @Test
    void testNoopConversion() {
        final var dateCell = LocalDateCellFactory.create(LocalDate.of(2024, 7, 10));
        final var dateInput = new DynamicValuesInput(LocalDateCellFactory.TYPE, dateCell);

        final var template =
            new DynamicValuesInput(LocalDateCellFactory.TYPE, LocalDateCellFactory.create(LocalDate.of(1970, 1, 1)));
        final var converted = dateInput.convertToType(template);

        assertThat(converted).isPresent().as("Local date value was successfully converted");
        assertThat(converted) //
            .contains( //
                new DynamicValuesInput( //
                    LocalDateCellFactory.TYPE, LocalDateCellFactory.create(LocalDate.of(2024, 7, 10)))) //
            .as("Local date value was used as-is");

        final var dateCellAgain = converted.orElseThrow().convertToType(template);
        assertThat(dateCellAgain).isPresent().as("Value was successfully converted");
        assertThat(dateCellAgain) //
            .contains(dateInput) //
            .as("Value was successfully converted back to original local date");
    }

    /**
     * Tests that a conversion from a string that does not represent a local date returns an error.
     */
    @Test
    void testConversionNotPossible() {
        // provide empty string as input, which is not a valid local date
        final var stringInput = DynamicValuesInput.singleValueWithCaseMatchingForStringWithDefault(StringCell.TYPE);
        final var template =
            new DynamicValuesInput(LocalDateCellFactory.TYPE, LocalDateCellFactory.create(LocalDate.of(1970, 1, 1)));
        final var converted = stringInput.convertToType(template);
        assertThat(converted).isPresent().as("Some value is returned");
        assertThat(converted.get()).isNotEqualTo(template).as("Template value should not be returned");
        try {
            converted.get().checkParseError();
        } catch (InvalidSettingsException ex) {
            // expected
            return;
        }
        failBecauseExceptionWasNotThrown(InvalidSettingsException.class);
    }

    @Test
    void testConversionErrorHandling() {
        final var input =
            new DynamicValuesInput(LocalDateCellFactory.TYPE, LocalDateCellFactory.create(LocalDate.of(2024, 7, 10)));
        final var converted = input.convertToType(DynamicValuesInput.emptySingle());
        assertThat(converted).isEmpty().as("Conversion should fail due to mismatched input kind");
    }

}
