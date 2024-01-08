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
 *   Aug 10, 2022 (konrad-amtenbrink): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.widget.choices;

import static org.assertj.core.api.Assertions.assertThat;

import java.awt.Color;
import java.util.List;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.knime.core.data.BooleanValue;
import org.knime.core.data.DataCell;
import org.knime.core.data.DataColumnSpec;
import org.knime.core.data.DataColumnSpecCreator;
import org.knime.core.data.DataTableSpec;
import org.knime.core.data.DoubleValue;
import org.knime.core.data.def.BooleanCell;
import org.knime.core.data.def.DoubleCell;
import org.knime.core.data.def.IntCell;
import org.knime.core.data.def.LongCell;
import org.knime.core.data.def.StringCell;
import org.knime.core.data.image.png.PNGImageCellFactory;
import org.knime.core.data.property.ColorAttr;
import org.knime.core.data.property.ColorHandler;
import org.knime.core.data.property.ColorModel;
import org.knime.core.data.property.ColorModelNominal;
import org.knime.core.data.property.ColorModelRange;
import org.knime.core.data.vector.bitvector.SparseBitVectorCell;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.ColumnChoicesProviderUtil.ColorColumnsProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.ColumnChoicesProviderUtil.CompatibleColumnChoicesProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.ColumnChoicesProviderUtil.DoubleColumnChoicesProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.ColumnChoicesProviderUtil.StringColumnChoicesProvider;
import org.knime.testing.util.TableTestUtil.SpecBuilder;

/**
 *
 * @author Konrad Amtenbrink, KNIME GmbH, Berlin, Germany
 */
@SuppressWarnings("java:S2698") // we accept assertions without message

class ColumnChoicesProviderUtilTest {

    private static DataTableSpec createDefaultTestSpec() {
        return new SpecBuilder().addColumn("int", IntCell.TYPE)//
            .addColumn("string", StringCell.TYPE)//
            .addColumn("long", LongCell.TYPE)//
            .addColumn("double", DoubleCell.TYPE)//
            .addColumn("bitvector", SparseBitVectorCell.TYPE)//
            .addColumn("boolean", BooleanCell.TYPE)//
            .addColumn("image", new PNGImageCellFactory().getDataType())//
            .build();
    }

    @Test
    void testStringColumnChoicesProvider() {
        final var spec = createDefaultTestSpec();
        var choicesProvider = new StringColumnChoicesProvider();
        assertThat(
            choicesProvider.choices(DefaultNodeSettings.createDefaultNodeSettingsContext(new PortObjectSpec[]{spec})))
                .isEqualTo(new String[]{"string"});
    }

    @Test
    void testDoubleColumnChoicesProvider() {
        final var spec = createDefaultTestSpec();
        var choicesProvider = new DoubleColumnChoicesProvider();
        assertThat(
            choicesProvider.choices(DefaultNodeSettings.createDefaultNodeSettingsContext(new PortObjectSpec[]{spec})))
                .isEqualTo(new String[]{"int", "long", "double", "boolean"});
    }

    @Test
    void testColumnChoicesProvider() {
        final var spec = createDefaultTestSpec();
        var choicesProvider = new CompatibleColumnChoicesProvider(List.of(DoubleValue.class, BooleanValue.class));
        assertThat(
            choicesProvider.choices(DefaultNodeSettings.createDefaultNodeSettingsContext(new PortObjectSpec[]{spec})))
                .isEqualTo(new String[]{"int", "long", "double", "boolean"});
    }

    @Test
    void testColorColumnsProvider() {
        var numericColorModel = new ColorModelRange(0, new Color(0, 255, 0), 1, new Color(0, 0, 255));
        var nominalColorModel = new ColorModelNominal(
            Map.of((DataCell)new StringCell("foo"), ColorAttr.getInstance(new Color(0, 255, 0))), new ColorAttr[0]);

        final DataColumnSpec[] dataColumnSpecs = new DataColumnSpec[]{
            createDataColumnSpec(numericColorModel, "foo"),
            createDataColumnSpec(nominalColorModel, "bar"),
            new DataColumnSpecCreator("baz", StringCell.TYPE).createSpec()

        };
        final var spec = new DataTableSpec(dataColumnSpecs);
        var choicesProvider = new ColorColumnsProvider();
        assertThat(
            choicesProvider.choices(DefaultNodeSettings.createDefaultNodeSettingsContext(new PortObjectSpec[]{spec})))
                .isEqualTo(new String[]{"foo", "bar"});
    }

    private static DataColumnSpec createDataColumnSpec(final ColorModel colorModel, final String name) {
        final var creator = new DataColumnSpecCreator(name, StringCell.TYPE);
        creator.setColorHandler(new ColorHandler(colorModel));
        return creator.createSpec();
    }

}
