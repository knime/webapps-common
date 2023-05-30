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
 *   Dec 10, 2021 (konrad-amtenbrink): created
 */

package org.knime.core.webui.node.view.table;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;
import static org.assertj.core.api.Assertions.assertThatNullPointerException;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.knime.core.webui.data.RpcDataService.jsonRpcRequest;
import static org.knime.testing.node.view.TableTestUtil.createDefaultTestTable;
import static org.knime.testing.node.view.TableTestUtil.createTableFromColumns;
import static org.knime.testing.node.view.TableTestUtil.getDefaultTestSpec;
import static org.knime.testing.node.view.TableTestUtil.getExec;

import java.awt.Color;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collections;
import java.util.Map;
import java.util.Set;
import java.util.function.Supplier;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import javax.imageio.ImageIO;

import org.apache.commons.io.IOUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.knime.core.data.DataColumnSpecCreator;
import org.knime.core.data.DataTableSpec;
import org.knime.core.data.DataValue;
import org.knime.core.data.MissingCell;
import org.knime.core.data.RowKey;
import org.knime.core.data.def.DoubleCell;
import org.knime.core.data.def.IntCell;
import org.knime.core.data.def.StringCell;
import org.knime.core.data.property.ColorAttr;
import org.knime.core.data.property.ColorHandler;
import org.knime.core.data.property.ColorModelNominal;
import org.knime.core.data.property.ColorModelRange;
import org.knime.core.data.property.ValueFormatHandler;
import org.knime.core.data.property.ValueFormatModel;
import org.knime.core.node.BufferedDataTable;
import org.knime.core.node.config.ConfigWO;
import org.knime.core.node.port.PortObject;
import org.knime.core.node.port.PortType;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.node.workflow.NodeContext;
import org.knime.core.node.workflow.virtual.DefaultVirtualPortObjectInNodeFactory;
import org.knime.core.node.workflow.virtual.DefaultVirtualPortObjectInNodeModel;
import org.knime.core.node.workflow.virtual.VirtualNodeInput;
import org.knime.core.webui.data.DataServiceContextTest;
import org.knime.core.webui.node.NodeWrapper;
import org.knime.core.webui.node.view.NodeViewManager;
import org.knime.core.webui.node.view.PageFormat.AspectRatio;
import org.knime.core.webui.node.view.table.data.Cell;
import org.knime.core.webui.node.view.table.data.MissingCellWithMessage;
import org.knime.core.webui.node.view.table.data.Renderer;
import org.knime.core.webui.node.view.table.data.TableViewDataService;
import org.knime.core.webui.node.view.table.data.TableViewDataServiceImpl;
import org.knime.core.webui.node.view.table.data.TableViewInitialDataImpl;
import org.knime.core.webui.node.view.table.data.render.DataValueImageRendererRegistry;
import org.knime.core.webui.node.view.table.data.render.SwingBasedRendererFactory;
import org.knime.core.webui.page.Resource;
import org.knime.testing.node.view.NodeViewNodeFactory;
import org.knime.testing.node.view.NodeViewNodeModel;
import org.knime.testing.node.view.TableTestUtil;
import org.knime.testing.node.view.TableTestUtil.ObjectColumn;
import org.knime.testing.node.view.TableTestUtil.TableBuilder;
import org.knime.testing.node.view.WarningMessageAsserterUtil.DataServiceContextWarningMessagesAsserter;
import org.knime.testing.util.WorkflowManagerUtil;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * @author Konrad Amtenbrink, KNIME GmbH, Berlin, Germany
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
@SuppressWarnings("java:S2698") // we accept assertions without messages
class TableViewTest {

    @BeforeEach
    void initDataServiceContext() {
        DataServiceContextTest.initDataServiceContext(() -> getExec());
    }

    @AfterEach
    void removeDataServiceContext() {
        DataServiceContextTest.removeDataServiceContext();
    }

    @Test
    void testDataServiceGetData() {
        final var expectedResult =
            new String[][]{{"2", "rowkey 1", "1", "1", "11", "uiext/pageId/images/tableId/2018748495.png", "0001",
                "true", "uiext/pageId/images/tableId/-1084641940.png"}};
        var rendererRegistry = new DataValueImageRendererRegistry(() -> "pageId");
        var rendererIds = new String[expectedResult[0].length];
        rendererIds[3] = "org.knime.core.data.renderer.DoubleBarRenderer$Factory";
        final var table = new TableViewDataServiceImpl(createDefaultTestTable(2), "tableId",
            new SwingBasedRendererFactory(), rendererRegistry).getTable(getDefaultTestSpec().getColumnNames(), 1, 1,
                rendererIds, false, true, false);
        var rows = table.getRows();
        assertThat(rows).as("check that the first row has the correct test values")
            .overridingErrorMessage("The values of the first row should be %s, not %s.", rows[0].toString(),
                expectedResult[0].toString())
            .isEqualTo(expectedResult);
        assertThat(rendererRegistry.numRegisteredRenderers("tableId")).isEqualTo(2);

        // check content types
        assertThat(table.getColumnContentTypes())
            .isEqualTo(new String[]{"txt", "txt", "txt", "img_path", "txt", "txt", "img_path"});

        // try out 'cell renderer'
        var cellImg = rendererRegistry.renderImage("tableId/-1084641940.png?w=1&h=2");
        assertThat(new String(cellImg, StandardCharsets.UTF_8)).startsWith("�PNG");
        var cellImg2 = rendererRegistry.renderImage("tableId/2018748495.png?w=1&h=2");
        assertThat(new String(cellImg2, StandardCharsets.UTF_8)).startsWith("�PNG");
        assertThat(table.getRowCount()).isEqualTo(2);
    }

    @Test
    void testDataServiceGetDataWithAttachedFormatter() {

        var tableWithFormatters = createTableWithFormatters();
        var rendererRegistry = new DataValueImageRendererRegistry(() -> "pageId");

        var rendererIds =
            new String[]{null, "org.knime.core.data.renderer.DoubleValueRenderer$PercentageRendererFactory", null};
        final var table = new TableViewDataServiceImpl(tableWithFormatters, "tableId", new SwingBasedRendererFactory(),
            rendererRegistry).getTable(new String[]{"firstCol", "secondCol", "thirdCol"}, 0, 1, rendererIds, false,
                true, false);
        var rows = table.getRows();
        assertThat(rows[0][2]).isEqualTo("<h1>dummy html</h1>");
        assertThat(rows[0][3]).isEqualTo("50.0%");
        assertThat(rows[0][4]).isEqualTo("B");

        assertThat(table.getColumnContentTypes()).isEqualTo(new String[]{"html", "txt", "txt"});
        assertThat(table.getColumnFormatterDescriptions())
            .isEqualTo(new String[]{"Attached formatter", "Attached formatter", null});

    }

    private static Supplier<BufferedDataTable> createTableWithFormatters() {
        final var valueFormatHandler = new ValueFormatHandler(new ValueFormatModel() {

            @Override
            public void save(final ConfigWO configuration) {
                // Do nothing
            }

            @Override
            public String getHTML(final DataValue dataCell) {
                return "<h1>dummy html</h1>";
            }
        });
        final var firstColCreator = new DataColumnSpecCreator("firstCol", StringCell.TYPE);
        firstColCreator.setValueFormatHandler(valueFormatHandler);
        final var secondColCreator = new DataColumnSpecCreator("secondCol", DoubleCell.TYPE);
        secondColCreator.setValueFormatHandler(valueFormatHandler);
        final var spec = new DataTableSpec( //
            firstColCreator.createSpec(), //
            secondColCreator.createSpec(), //
            new DataColumnSpecCreator("thirdCol", StringCell.TYPE).createSpec());
        return new TableBuilder(spec).addRow(new Object[]{"A", 0.5, "B"}).build();
    }

    @Test
    void testTableViewNodeFactoryImageResources() throws IOException {
        var wfm = WorkflowManagerUtil.createEmptyWorkflow();
        var tableId = "test_table_id";
        var nnc =
            WorkflowManagerUtil.createAndAddNode(wfm, new NodeViewNodeFactory(nodeModel -> new TableNodeView(tableId,
                () -> nodeModel.getInternalTables()[0], NodeContext.getContext().getNodeContainer())));
        ((NodeViewNodeModel)nnc.getNodeModel())
            .setInternalTables(new BufferedDataTable[]{createDefaultTestTable(2).get()});

        var nodeViewManager = NodeViewManager.getInstance();
        var mapper = new ObjectMapper();

        // request rows to create the 'image renderers' whose images are later access as 'page resources'
        var dataServiceResult = mapper.readTree(nodeViewManager.callRpcDataService(NodeWrapper.of(nnc),
            jsonRpcRequest("getTable", "image", "0", "2", "", "true", "true", "false")));
        var imgPath = dataServiceResult.get("result").get("rows").get(0).get(2).asText();
        var imgPath2 = dataServiceResult.get("result").get("rows").get(1).get(2).asText();
        assertThat(TableViewUtil.RENDERER_REGISTRY.numRegisteredRenderers(tableId)).isEqualTo(2);

        // get page path to 'register' the page
        nodeViewManager.getPagePath(NodeWrapper.of(nnc));

        // request a cell image resource
        var img = toString(nodeViewManager.getPageResource(imgPath).orElse(null));
        assertThat(img).startsWith("�PNG");
        // request same image again
        img = toString(nodeViewManager.getPageResource(imgPath).orElse(null));
        assertThat(img).startsWith("�PNG");
        assertThat(TableViewUtil.RENDERER_REGISTRY.numRegisteredRenderers(tableId)).isEqualTo(2);

        // request cell image resource with custom dimension
        try (final var is = nodeViewManager.getPageResource(imgPath2 + "?w=12&h=13").get().getInputStream()) {
            var bufferedImage = ImageIO.read(is);
            assertThat(bufferedImage.getWidth()).isEqualTo(12);
            assertThat(bufferedImage.getHeight()).isEqualTo(13);
        }

        // request an image through an invalid path
        var invalidImgPath = imgPath.substring(0, imgPath.lastIndexOf("/") + 1) + "0.png";
        var emptyImg = toString(nodeViewManager.getPageResource(invalidImgPath).orElse(null));
        assertThat(emptyImg).isEmpty();

        WorkflowManagerUtil.disposeWorkflow(wfm);
    }

    private static String toString(final Resource resource) throws IOException {
        return resource == null ? null : IOUtils.toString(resource.getInputStream(), StandardCharsets.UTF_8);
    }

    /**
     * Makes sure that the renderes registered with {@link DataValueImageRendererRegistry} are properly cleaned up,
     * e.g., on node state change.
     *
     * @throws Exception
     */
    @Test
    void testTableViewNodeFactoryRendererRegistryCleanUp() throws Exception {
        var wfm = WorkflowManagerUtil.createEmptyWorkflow();
        var tableId = "test_table_id";
        var nnc = WorkflowManagerUtil.createAndAddNode(wfm,
            new NodeViewNodeFactory(1, 0, nodeModel -> new TableNodeView(tableId,
                () -> nodeModel.getInternalTables()[0], NodeContext.getContext().getNodeContainer())));
        final var sourceNodeFactory = new DefaultVirtualPortObjectInNodeFactory(new PortType[]{BufferedDataTable.TYPE});
        final var sourceNode = WorkflowManagerUtil.createAndAddNode(wfm, sourceNodeFactory);
        var testTable = createDefaultTestTable(2).get();
        ((DefaultVirtualPortObjectInNodeModel)sourceNode.getNodeModel())
            .setVirtualNodeInput(new VirtualNodeInput(new PortObject[]{testTable}, Collections.emptyList()));
        wfm.addConnection(sourceNode.getID(), 1, nnc.getID(), 1);

        wfm.executeAllAndWaitUntilDone();
        var tables = new BufferedDataTable[]{testTable};
        ((NodeViewNodeModel)nnc.getNodeModel()).setInternalTables(tables);

        var nodeViewManager = NodeViewManager.getInstance();

        // call data service to register renderers
        callDataServiceToRegisterRenderes(nnc, nodeViewManager);
        assertThat(TableViewUtil.RENDERER_REGISTRY.numRegisteredRenderers(tableId)).isEqualTo(2);

        // must clear the registry for the given 'table id' (i.e. node id here)
        wfm.resetAndConfigureNode(nnc.getID());
        assertThat(TableViewUtil.RENDERER_REGISTRY.numRegisteredRenderers(tableId)).isZero();

        // make sure that the a 2nd node state change still clears the registry
        wfm.executeAllAndWaitUntilDone();
        ((NodeViewNodeModel)nnc.getNodeModel()).setInternalTables(tables);
        callDataServiceToRegisterRenderes(nnc, nodeViewManager);
        assertThat(TableViewUtil.RENDERER_REGISTRY.numRegisteredRenderers(tableId)).isEqualTo(2);
        wfm.resetAndConfigureNode(nnc.getID());
        assertThat(TableViewUtil.RENDERER_REGISTRY.numRegisteredRenderers(tableId)).isZero();

        // assert that registry is cleared on delete
        ((NodeViewNodeModel)nnc.getNodeModel()).setInternalTables(tables);
        callDataServiceToRegisterRenderes(nnc, nodeViewManager);
        assertThat(TableViewUtil.RENDERER_REGISTRY.numRegisteredRenderers(tableId)).isEqualTo(2);
        wfm.removeNode(nnc.getID());
        assertThat(TableViewUtil.RENDERER_REGISTRY.numRegisteredRenderers(tableId)).isZero();
    }

    private static void callDataServiceToRegisterRenderes(final NativeNodeContainer nnc,
        final NodeViewManager nodeViewManager) {
        nodeViewManager.callRpcDataService(NodeWrapper.of(nnc),
            jsonRpcRequest("getTable", "image", "0", "2", "", "true", "true", "false"));
    }

    @Test
    void testDataServiceGetSortedData() {
        final var testTable = createTableViewDataServiceInstance(createDefaultTestTable(5));
        final var sortColumnIndex = 0;
        final var sortColumnName = getDefaultTestSpec().getColumnNames()[sortColumnIndex];
        var columns = getDefaultTestSpec().getColumnNames();
        final var tableSortedAscending = testTable.getFilteredAndSortedTable(columns, 0, 5, sortColumnName, true, null,
            null, true, null, false, false, true, false).getRows();
        IntStream.range(1, tableSortedAscending.length).forEach(rowIndex -> {
            assertThat((String)tableSortedAscending[rowIndex][sortColumnIndex])
                .isGreaterThanOrEqualTo((String)tableSortedAscending[rowIndex - 1][sortColumnIndex]);
        });
        final var tableSortedDescending = testTable.getFilteredAndSortedTable(getDefaultTestSpec().getColumnNames(), 0,
            5, sortColumnName, false, null, null, true, null, false, false, true, false).getRows();
        IntStream.range(1, tableSortedDescending.length).forEach(rowIndex -> {
            assertThat((String)tableSortedDescending[rowIndex][sortColumnIndex])
                .isLessThanOrEqualTo((String)tableSortedDescending[rowIndex - 1][sortColumnIndex]);
        });
    }

    @Test
    void testDataServiceGetCachedSortedData() {
        final var testTable = createTableViewDataServiceInstance(createDefaultTestTable(10));
        final var sortColumnIndex = 0;
        var sortColumnIndexInResultTable = sortColumnIndex + 2; //  the first two columns are row index and row key
        final var sortColumnName = getDefaultTestSpec().getColumnNames()[sortColumnIndex];
        final var tableSortedAscending = testTable.getFilteredAndSortedTable(getDefaultTestSpec().getColumnNames(), 0,
            5, sortColumnName, true, null, null, true, null, false, false, true, false).getRows();
        IntStream.range(1, tableSortedAscending.length).forEach(rowIndex -> {
            assertThat((String)tableSortedAscending[rowIndex][sortColumnIndexInResultTable])
                .isGreaterThanOrEqualTo((String)tableSortedAscending[rowIndex - 1][sortColumnIndexInResultTable]);
        });
        final var tableSortedDescending = testTable.getFilteredAndSortedTable(getDefaultTestSpec().getColumnNames(), 5,
            5, sortColumnName, true, null, null, true, null, false, false, true, false).getRows();
        IntStream.range(1, tableSortedDescending.length).forEach(rowIndex -> {
            assertThat((String)tableSortedDescending[rowIndex][sortColumnIndexInResultTable])
                .isGreaterThanOrEqualTo((String)tableSortedDescending[rowIndex - 1][sortColumnIndexInResultTable]);
        });
    }

    @Test
    void testDataServiceSetsGetTableWithOneMissingColumn() {
        final var warningMessageAsserter =
            new DataServiceContextWarningMessagesAsserter("The selected column foo is not present in the table.");
        final var testTable = createTableViewDataServiceInstance(createDefaultTestTable(1));
        final var rows = testTable
            .getTable(Stream.concat(Arrays.asList(getDefaultTestSpec().getColumnNames()).stream(), Stream.of("foo"))
                .toArray(String[]::new), 0, 1, null, true, true, false)
            .getRows();
        assertThat(rows[0]).as("The output table has the correct amount of columns")
            .hasSize(getDefaultTestSpec().getNumColumns() + 2);
        assertTrue(warningMessageAsserter.allRegisteredMessagesCalled(),
            "Adds warning message for single missing column.");
    }

    @Test
    void testDataServiceSetsGetTableColumnCount() {
        final var testTable = createTableViewDataServiceInstance(createDefaultTestTable(1));
        final var result = testTable.getTable(getDefaultTestSpec().getColumnNames(), 0, 1, null, true, true, false);
        assertThat(result.getColumnCount()).isEqualTo(7);
    }

    @Test
    void testDataServiceSetsGetTableTrimColumns() {
        final var numColumns = 200;
        var stringColumns = IntStream.range(0, numColumns)
            .mapToObj(i -> new ObjectColumn(String.format("Column %s", i), StringCell.TYPE, new String[]{"content"}))
            .toArray(ObjectColumn[]::new);
        final var inputTable = createTableFromColumns(stringColumns);
        final var testTable = createTableViewDataServiceInstance(() -> inputTable);
        final var result = testTable.getTable(inputTable.getSpec().getColumnNames(), 0, 1, null, true, true, true);
        assertThat(result.getColumnCount()).isEqualTo(numColumns);
        assertThat(result.getDisplayedColumns().length).isEqualTo(100);
    }

    @Test
    void testDataServiceGetCurrentRowKeys() {
        final var size = 3;
        final var dataService = createTableViewDataServiceInstance(createDefaultTestTable(size));
        assertThat(dataService.getCurrentRowKeys()).hasSize(size);

        final var filterTestTable = createTestTableFiltering();
        final var filterDataService = createTableViewDataServiceInstance(() -> filterTestTable);
        final var columnFilterValue = new String[][]{new String[0], new String[0], new String[]{"1"}};
        filterDataService.getFilteredAndSortedTable(filterTestTable.getDataTableSpec().getColumnNames(), 0, 2, "string",
            true, "STRING1", columnFilterValue, false, null, false, false, true, false);
        assertThat(filterDataService.getCurrentRowKeys()).hasSize(1);
    }

    @Test
    void testDataServiceGetTotalSelected() {
        final var table = createTestTableFiltering();
        final var globalSearchTerm = "STRING1";
        final var columnFilterValue = new String[][]{new String[0], new String[0], new String[]{"1"}};
        final var filterRowKeys = false;
        final var selection = Set.of(new RowKey("rowkey 0"));
        final var dataService = TableViewUtil.createTableViewDataService(() -> table, () -> selection, null);
        dataService.getFilteredAndSortedTable(table.getDataTableSpec().getColumnNames(), 0, 2, "string", true,
            globalSearchTerm, columnFilterValue, filterRowKeys, null, false, false, true, false);
        assertThat(dataService.getTotalSelected()).isEqualTo(1);
    }

    @Test
    void testDataServiceSetsGetTableWithMultipleMissingColumn() {
        final var warningMessageAsserter = new DataServiceContextWarningMessagesAsserter(
            "The selected columns foo, bar are not present in the table.");
        final var testTable = createTableViewDataServiceInstance(createDefaultTestTable(1));
        final var rows = testTable.getTable(
            Stream.concat(Arrays.asList(getDefaultTestSpec().getColumnNames()).stream(), Stream.of("foo", "bar"))
                .toArray(String[]::new),
            0, 1, null, true, true, false).getRows();
        assertThat(rows[0]).as("The output table has the correct amount of columns")
            .hasSize(getDefaultTestSpec().getNumColumns() + 2);
        assertTrue(warningMessageAsserter.allRegisteredMessagesCalled(),
            "Adds warning message for single missing column.");
    }

    private static BufferedDataTable createTestTableFiltering() {
        var stringColumn = new ObjectColumn("string", StringCell.TYPE, new String[]{"StRinG1", "string"});
        var doubleColumn = new ObjectColumn("double", DoubleCell.TYPE, new Double[]{1d, -1d});

        return createTableFromColumns(stringColumn, doubleColumn);

    }

    @Test
    void testDataServiceGetFilteredAndSortedData() {
        final var filterTestTable = createTestTableFiltering();
        final var testTable = createTableViewDataServiceInstance(() -> filterTestTable);
        final var sortColumnName = "string";
        final var columnFilterValue = new String[][]{new String[0], new String[0], new String[]{"1"}};
        final var emptyTable = testTable.getFilteredAndSortedTable(filterTestTable.getDataTableSpec().getColumnNames(),
            0, 2, sortColumnName, true, "wrongSearchTerm", columnFilterValue, false, null, false, false, true, false)
            .getRows();
        assertThat(emptyTable.length).as("filters and excludes all rows").isEqualTo(0);

        final var table = testTable.getFilteredAndSortedTable(filterTestTable.getDataTableSpec().getColumnNames(), 0, 2,
            sortColumnName, true, "STRING1", columnFilterValue, false, null, false, false, true, false).getRows();
        assertThat(table.length).as("filters all rows correctly").isEqualTo(1);
    }

    @Test
    void testDataServiceGetCachedFilteredAndSortedData() {
        final var testTable = createTableViewDataServiceInstance(createDefaultTestTable(10));
        final var sortColumnIndex = 0;
        final var sortColumnName = getDefaultTestSpec().getColumnNames()[sortColumnIndex];
        final var globalSearchTerm = "1";
        final var columnFilterValue = new String[][]{new String[0], new String[]{"1"}, new String[0], new String[0],
            new String[0], new String[0], new String[0], new String[0], new String[0]};
        final var tableSortedAscending =
            testTable.getFilteredAndSortedTable(getDefaultTestSpec().getColumnNames(), 0, 5, sortColumnName, true,
                globalSearchTerm, columnFilterValue, true, null, false, false, true, false).getRows();
        IntStream.range(1, tableSortedAscending.length).forEach(rowIndex -> {
            assertThat((String)tableSortedAscending[rowIndex][sortColumnIndex])
                .isGreaterThanOrEqualTo((String)tableSortedAscending[rowIndex - 1][sortColumnIndex]);
        });
        assertThat(tableSortedAscending.length).as("filters rows correctly").isEqualTo(1);

        final var cachedTable = testTable.getFilteredAndSortedTable(getDefaultTestSpec().getColumnNames(), 0, 5,
            sortColumnName, true, globalSearchTerm, columnFilterValue, true, null, false, false, true, false).getRows();
        assertThat(cachedTable).isDeepEqualTo(tableSortedAscending);
    }

    @Test
    void testDataServiceGetFilteredAndSortedDataWithExcludedColumns() {
        final var testTable = createTableViewDataServiceInstance(createDefaultTestTable(10));
        final var columnNames = new String[]{"string", "long"};
        final var sortColumnName = "long";
        final var columnFilterValues = new String[][]{new String[0], new String[0], new String[]{"1"}};

        testTable.getTable(columnNames, 0, 10, null, true, true, false);
        final var tableRemColSortCol = testTable.getFilteredAndSortedTable(columnNames, 0, 10, sortColumnName, false,
            null, columnFilterValues, false, null, false, false, true, false);
        assertThat(tableRemColSortCol.getRowCount()).as("filters correctly after removing the first column")
            .isEqualTo(1);
    }

    @Test
    void testInitialDataGetDataTypes() {
        final var initData =
            new TableViewInitialDataImpl(new TableViewViewSettings(getDefaultTestSpec()), createDefaultTestTable(11),
                "tableId", new SwingBasedRendererFactory(), new DataValueImageRendererRegistry(() -> "pageId"));
        var dataTypes = initData.getDataTypes();
        var table = initData.getTable();

        var stringType = dataTypes.get(table.getColumnDataTypeIds()[1]);
        assertThat(stringType.getName()).isEqualTo("String");
        assertRendererNames(stringType.getRenderers(), "Multi-line String", "String");

        var doubleType = dataTypes.get(table.getColumnDataTypeIds()[3]);
        assertThat(doubleType.getName()).isEqualTo("Number (double)");
        assertRendererNames(doubleType.getRenderers(), "Standard Double", "Percentage", "Full Precision", "Gray Scale",
            "Bars", "Standard Complex Number", "Default");

        var booleanType = dataTypes.get(table.getColumnDataTypeIds()[5]);
        assertThat(booleanType.getName()).isEqualTo("Boolean value");
        assertRendererNames(booleanType.getRenderers(), "Default", "Default", "Standard Double", "Percentage",
            "Full Precision", "Gray Scale", "Bars", "Standard Complex Number", "Default");

        var imageType = dataTypes.get(table.getColumnDataTypeIds()[6]);
        assertThat(imageType.getName()).isEqualTo("PNG Image");
        assertRendererNames(imageType.getRenderers(), "PNG Image", "Default");
    }

    private static void assertRendererNames(final Renderer[] renderers, final String... expectedRendererNames) {
        assertThat(Arrays.stream(renderers).map(Renderer::getName).toArray(String[]::new))
            .isEqualTo(expectedRendererNames);
        assertThat(renderers[0].getId()).isNotNull();
    }

    @Test
    void testDataServiceGetInvalidIndices() {
        final var dataService = createTableViewDataServiceInstance(createDefaultTestTable(2));
        final var colNames = getDefaultTestSpec().getColumnNames();
        assertThatExceptionOfType(IndexOutOfBoundsException.class)
            .isThrownBy(() -> dataService.getTable(colNames, -1, 2, null, false, true, false));
    }

    @Test
    void testDataServiceGetDataNullSupplier() {
        assertThatNullPointerException()
            .isThrownBy(() -> createTableViewDataServiceInstance((Supplier<BufferedDataTable>)null)
                .getTable(getDefaultTestSpec().getColumnNames(), 0, 0, null, false, true, false));
    }

    @Test
    void testDataServiceGetDataNullTable() {
        final var rows = createTableViewDataServiceInstance(() -> null)
            .getTable(getDefaultTestSpec().getColumnNames(), 0, 2, null, false, true, false).getRows();
        assertThat(rows).hasDimensions(0, 0);
    }

    @Test
    void testDataServiceGetDataZeroRows() {
        final var rows = createTableViewDataServiceInstance(() -> null)
            .getTable(getDefaultTestSpec().getColumnNames(), 0, 0, null, false, true, false).getRows();
        assertThat(rows).hasDimensions(0, 0);
    }

    @Test
    void testPageFormat() throws IOException {
        var wfm = WorkflowManagerUtil.createEmptyWorkflow();
        var tableId = "test_table_id";
        var nnc =
            WorkflowManagerUtil.createAndAddNode(wfm, new NodeViewNodeFactory(nodeModel -> new TableNodeView(tableId,
                () -> nodeModel.getInternalTables()[0], NodeContext.getContext().getNodeContainer())));
        ((NodeViewNodeModel)nnc.getNodeModel())
            .setInternalTables(new BufferedDataTable[]{createDefaultTestTable(2).get()});

        var nodeView = NodeViewManager.getInstance().getNodeView(nnc);
        var pageFormat = nodeView.getDefaultPageFormat();
        assertThat(pageFormat.getAspectRatio().get()).isEqualTo(AspectRatio.RATIO_4BY3);

        WorkflowManagerUtil.disposeWorkflow(wfm);
    }

    @Test
    void testDataServiceIndicesAreAppended() throws Exception {
        final var stringColumnContent = new String[]{"A", "B"};
        final var intColumnContent = new Integer[]{1, 3};
        final var inputTable = TableTestUtil.createTableFromColumns( //
            new ObjectColumn("col1", StringCell.TYPE, stringColumnContent), //
            new ObjectColumn("col2", IntCell.TYPE, intColumnContent) //
        );

        var dataService = createTableViewDataServiceInstance(() -> inputTable);
        var table = dataService.getTable(new String[]{"col1", "col2"}, 0, 2, null, false, false, false);

        assertThat(table.getDisplayedColumns()).isEqualTo(new String[]{"col1", "col2"});
        assertThat(table.getColumnContentTypes()).isEqualTo(new String[]{"txt", "txt"});
        assertThat(table.getRows()).isEqualTo(new String[][]{{"1", "rowkey 0", "A", "1"}, {"2", "rowkey 1", "B", "3"}});
    }

    @Test
    void testDataServiceGetRowsContainingMissingValues() {
        final var firstMissingColumnContent = new MissingCell[]{new MissingCell("Row1_Col1"), new MissingCell(null)};
        final var secondMissingColumnContent =
            new MissingCell[]{new MissingCell("Row1_Col2"), new MissingCell("Row2_Col2")};
        final var inputTable = TableTestUtil.createTableFromColumns( //
            new ObjectColumn("col1", StringCell.TYPE, firstMissingColumnContent), //
            new ObjectColumn("col2", IntCell.TYPE, secondMissingColumnContent) //
        );

        final var dataService = createTableViewDataServiceInstance(() -> inputTable);
        final var table = dataService.getTable(new String[]{"col1", "col2"}, 0, 2, null, false, false, false);
        final var rows = table.getRows();

        assertThat(((MissingCellWithMessage)rows[0][2]).getMetadata()).isEqualTo("Row1_Col1");
        assertThat(((MissingCellWithMessage)rows[0][3]).getMetadata()).isEqualTo("Row1_Col2");
        assertThat(rows[1][2]).isNull();
        assertThat(((MissingCellWithMessage)rows[1][3]).getMetadata()).isEqualTo("Row2_Col2");
    }

    @Test
    void testDataServiceGetRowsWithColoredCells() {
        final var numericColorModel = new ColorModelRange(0, new Color(0, 0, 0), 1.0, new Color(255, 255, 255));
        final var nominalColorModel =
            new ColorModelNominal(Map.of(new StringCell("value1"), ColorAttr.getInstance(new Color(0, 255, 0))), null);

        final var nominalColumn = new Object[]{"value1", null};
        final var numericColumn = new Object[]{new MissingCell("Row1_Col2"), new MissingCell("Row2_Col2")};
        final var inputTable = TableTestUtil.createTableFromColumns( //
            new ObjectColumn("col1", StringCell.TYPE, new ColorHandler(nominalColorModel), nominalColumn), //
            new ObjectColumn("col2", IntCell.TYPE, new ColorHandler(numericColorModel), numericColumn) //
        );

        final var dataService = createTableViewDataServiceInstance(() -> inputTable);
        final var table = dataService.getTable(new String[]{"col1", "col2"}, 0, 2, null, false, false, false);
        final var rows = table.getRows();

        final var missingCellsColor = "#404040";

        assertThat(((Cell)rows[0][2]).getColor()).isEqualTo("#00FF00");
        assertThat(((Cell)rows[0][2]).getValue()).isEqualTo("value1");
        assertThat(((Cell)rows[1][2]).getColor()).isEqualTo("#404040");
        assertThat(((Cell)rows[1][2]).getValue()).isEqualTo(null);

        assertThat(((Cell)rows[0][3]).getColor()).isEqualTo("#404040");
        assertThat(((Cell)rows[0][3]).getValue()).isEqualTo(null);
        assertThat(((MissingCellWithMessage)rows[0][3]).getMetadata()).isEqualTo("Row1_Col2");
        assertThat(((Cell)rows[1][3]).getColor()).isEqualTo("#404040");
        assertThat(((Cell)rows[1][3]).getValue()).isEqualTo(null);
        assertThat(((MissingCellWithMessage)rows[1][3]).getMetadata()).isEqualTo("Row2_Col2");
    }

    private static TableViewDataService
        createTableViewDataServiceInstance(final Supplier<BufferedDataTable> tableSupplier) {
        return new TableViewDataServiceImpl(tableSupplier, "tableId", new SwingBasedRendererFactory(),
            new DataValueImageRendererRegistry(() -> "pageId"));
    }
}
