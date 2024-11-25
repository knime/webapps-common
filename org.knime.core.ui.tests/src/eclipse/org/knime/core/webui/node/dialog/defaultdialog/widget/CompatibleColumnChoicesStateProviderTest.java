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
 *   Nov 15, 2024 (Tobias Kampmann): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.widget;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;

import org.junit.jupiter.api.Test;
import org.knime.core.data.DataColumnSpecCreator;
import org.knime.core.data.DataTableSpec;
import org.knime.core.data.DataValue;
import org.knime.core.data.IntValue;
import org.knime.core.data.StringValue;
import org.knime.core.data.def.BooleanCell;
import org.knime.core.data.def.DoubleCell;
import org.knime.core.data.def.IntCell;
import org.knime.core.data.def.StringCell;
import org.knime.core.node.BufferedDataTable;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.node.port.PortType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.Persist;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnfilter.ColumnFilter;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnfilter.LegacyColumnFilterPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.PossibleColumnValue;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Reference;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueReference;
import org.knime.testing.node.dialog.updates.DialogUpdateSimulator;
import org.knime.testing.node.dialog.updates.UpdateSimulator;
import org.knime.testing.node.dialog.updates.UpdateSimulator.UpdateSimulatorResult;

class CompatibleColumnChoicesStateProviderTest {

    final String stringColumn = "StringColumn";

    final String intColumn = "IntColumn";

    // Booleans are compatible with Ints
    final String boolColumn = "BoolColumn";

    final String doubleColumn = "DoubleColumn";

    final DataTableSpec testSpec =
        new DataTableSpec(new DataColumnSpecCreator(stringColumn, StringCell.TYPE).createSpec(), //
            new DataColumnSpecCreator(intColumn, IntCell.TYPE).createSpec(), //
            new DataColumnSpecCreator(boolColumn, BooleanCell.TYPE).createSpec(), //
            new DataColumnSpecCreator(doubleColumn, DoubleCell.TYPE).createSpec() //
        );

    @Test
    void testChoicesFromCompatibleDataValueClassesSupplier() {

        class TestSettings implements DefaultNodeSettings {
            @Widget(title = "The setting that determines what columns are applicable", description = "")
            @ValueSwitchWidget
            @ValueReference(ReferenceForSetting.class)
            SettingsEnumThatDeterminesCompatibleColumnDataValues m_behaviourType =
                SettingsEnumThatDeterminesCompatibleColumnDataValues.BOTH;

            @Widget(title = "Test colum choices with only compatible column data types", description = "")
            @Persist(configKey = "col_select", customPersistor = LegacyColumnFilterPersistor.class)
            @ChoicesWidget(choicesProvider = ColumnProvider.class)
            ColumnFilter m_columnFilter = new ColumnFilter();
        }

        var settings = new TestSettings();

        UpdateSimulator simulator = new DialogUpdateSimulator(settings,
            DefaultNodeSettings.DefaultNodeSettingsContext.createDefaultNodeSettingsContext(
                new PortType[]{BufferedDataTable.TYPE}, new PortObjectSpec[]{testSpec}, null, null));

        UpdateSimulatorResult beforeOpenDialogResults = simulator.simulateBeforeOpenDialog();

        assertColumnChoices(beforeOpenDialogResults, stringColumn, intColumn, boolColumn);

        settings.m_behaviourType = SettingsEnumThatDeterminesCompatibleColumnDataValues.ONLY_INT_COLUMNS;
        var nextUpdateResult = simulator.simulateValueChange(ReferenceForSetting.class);

        assertColumnChoices(nextUpdateResult, intColumn, boolColumn);
    }

    private static void assertColumnChoices(final UpdateSimulatorResult result, final String... expectedColumnNames) {
        var columnChoices = result.getUiStateUpdateAt(ColumnProvider.class);
        assertThat(Arrays.stream(columnChoices).map(PossibleColumnValue::id).toList())
            .isEqualTo(List.of(expectedColumnNames));
    }

    static final class ReferenceForSetting implements Reference<SettingsEnumThatDeterminesCompatibleColumnDataValues> {
    }

    enum SettingsEnumThatDeterminesCompatibleColumnDataValues implements CompatibleDataValueClassesSupplier {
            @Label(value = "A setting so that the node accepts a string column", description = "")
            ONLY_STRING_COLUMNS(List.of(StringValue.class)), //
            @Label(value = "A setting so that the node accepts an int column", description = "")
            ONLY_INT_COLUMNS(List.of(IntValue.class)), //
            @Label(value = "A setting so that the node accepts a string or an int column", description = "")
            BOTH(List.of(IntValue.class, StringValue.class));

        private List<Class<? extends DataValue>> m_compatibleDataValues;

        SettingsEnumThatDeterminesCompatibleColumnDataValues(
            final List<Class<? extends DataValue>> compatibleDataValues) {
            this.m_compatibleDataValues = compatibleDataValues;
        }

        /**
         * {@inheritDoc}
         */
        @Override
        public Collection<Class<? extends DataValue>> getCompatibleDataValueClasses() {
            return m_compatibleDataValues;
        }
    }

    static final class ColumnProvider
        extends CompatibleColumnChoicesStateProvider<SettingsEnumThatDeterminesCompatibleColumnDataValues> {

        @Override
        protected Class<? extends Reference<SettingsEnumThatDeterminesCompatibleColumnDataValues>> getReferenceClass() {
            return ReferenceForSetting.class;
        }
    }
}
