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
 *   Mar 13, 2023 (hornm): created
 */
package org.knime.core.webui.node.view.table.data;

import static org.knime.testing.util.TableTestUtil.assertTableResults;
import static org.knime.testing.util.TableTestUtil.getExec;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.knime.core.data.def.IntCell;
import org.knime.core.data.def.StringCell;
import org.knime.core.webui.data.DataServiceContextTest;
import org.knime.testing.util.TableTestUtil;
import org.knime.testing.util.TableTestUtil.ObjectColumn;

/**
 * Tests {@link TableWithIndicesSupplier}.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
class TableWithIndicesSupplierTest {

    @BeforeEach
    void initDataServiceContext() {
        DataServiceContextTest.initDataServiceContext(() -> getExec());
    }

    @AfterEach
    void removeDataServiceContext() {
        DataServiceContextTest.removeDataServiceContext();
    }

    @Test
    void testIndicesAreAppended() throws Exception {
        final var stringColumnContent = new String[]{"A", "B"};
        final var intColumnContent = new Integer[]{1, 3};
        final var inputTable = TableTestUtil.createTableFromColumns( //
            new ObjectColumn("col1", StringCell.TYPE, stringColumnContent), //
            new ObjectColumn("col2", IntCell.TYPE, intColumnContent) //
        );

        var tableWithIndicesSupplier = new TableWithIndicesSupplier(() -> inputTable);

        assertTableResults(tableWithIndicesSupplier.get(), new String[]{"Long", "String", "Integer"},
            new Object[][]{{1l, 2l}, stringColumnContent, intColumnContent});
    }

    @Test
    void testIndexColumnAdjustsName() throws Exception {
        final var stringColumnContent = new String[]{"A", "B"};
        final var intColumnContent = new Integer[]{1, 3};
        final var inputTable = TableTestUtil.createTableFromColumns( //
            new ObjectColumn("<index>", StringCell.TYPE, stringColumnContent), //
            new ObjectColumn("<index>(1)", IntCell.TYPE, intColumnContent) //
        );

        var tableWithIndicesSupplier = new TableWithIndicesSupplier(() -> inputTable);

        assertTableResults(tableWithIndicesSupplier.get(), new String[]{"Long", "String", "Integer"},
            new Object[][]{{1l, 2l}, stringColumnContent, intColumnContent});
    }

}
