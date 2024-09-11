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
import static org.awaitility.Awaitility.await;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.knime.core.webui.data.RpcDataService.jsonRpcRequest;
import static org.knime.testing.util.TableTestUtil.createDefaultTestTable;
import static org.knime.testing.util.TableTestUtil.createTableFromColumns;
import static org.knime.testing.util.TableTestUtil.getDefaultTestSpec;
import static org.knime.testing.util.TableTestUtil.getExec;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import java.awt.Color;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Supplier;
import java.util.stream.IntStream;
import java.util.stream.Stream;

import javax.imageio.ImageIO;

import org.apache.commons.io.IOUtils;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.knime.core.data.DataCell;
import org.knime.core.data.DataColumnSpecCreator;
import org.knime.core.data.DataTableSpec;
import org.knime.core.data.DataTableSpecCreator;
import org.knime.core.data.DataValue;
import org.knime.core.data.MissingCell;
import org.knime.core.data.RowKey;
import org.knime.core.data.def.DoubleCell;
import org.knime.core.data.def.IntCell;
import org.knime.core.data.def.StringCell;
import org.knime.core.data.filestore.internal.NotInWorkflowDataRepository;
import org.knime.core.data.property.ColorAttr;
import org.knime.core.data.property.ColorHandler;
import org.knime.core.data.property.ColorModelNominal;
import org.knime.core.data.property.ColorModelRange;
import org.knime.core.data.property.ValueFormatHandler;
import org.knime.core.data.property.ValueFormatModel;
import org.knime.core.node.BufferedDataTable;
import org.knime.core.node.DefaultNodeProgressMonitor;
import org.knime.core.node.ExecutionContext;
import org.knime.core.node.config.ConfigWO;
import org.knime.core.node.port.PortObject;
import org.knime.core.node.port.PortType;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.node.workflow.SingleNodeContainer;
import org.knime.core.node.workflow.virtual.DefaultVirtualPortObjectInNodeFactory;
import org.knime.core.node.workflow.virtual.DefaultVirtualPortObjectInNodeModel;
import org.knime.core.node.workflow.virtual.VirtualNodeInput;
import org.knime.core.webui.data.DataServiceContextTest;
import org.knime.core.webui.node.NodeWrapper;
import org.knime.core.webui.node.view.NodeViewManager;
import org.knime.core.webui.node.view.PageFormat;
import org.knime.core.webui.node.view.table.data.Cell;
import org.knime.core.webui.node.view.table.data.MissingCellWithMessage;
import org.knime.core.webui.node.view.table.data.Renderer;
import org.knime.core.webui.node.view.table.data.TableViewDataService;
import org.knime.core.webui.node.view.table.data.TableViewDataService.SpecialColumnConfig;
import org.knime.core.webui.node.view.table.data.TableViewDataServiceImpl;
import org.knime.core.webui.node.view.table.data.TableViewInitialDataImpl;
import org.knime.core.webui.node.view.table.data.render.DataValueImageRenderer.ImageDimension;
import org.knime.core.webui.node.view.table.data.render.DataValueImageRendererRegistry;
import org.knime.core.webui.node.view.table.data.render.SwingBasedRendererFactory;
import org.knime.core.webui.page.Resource;
import org.knime.testing.node.view.NodeViewNodeFactory;
import org.knime.testing.node.view.NodeViewNodeModel;
import org.knime.testing.node.view.WarningMessageAsserterUtil.DataServiceContextWarningMessagesAsserter;
import org.knime.testing.util.TableTestUtil;
import org.knime.testing.util.TableTestUtil.ObjectColumn;
import org.knime.testing.util.TableTestUtil.TableBuilder;
import org.knime.testing.util.WorkflowManagerUtil;
import org.mockito.Mockito;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * @author Konrad Amtenbrink, KNIME GmbH, Berlin, Germany
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
@SuppressWarnings("java:S2698") // we accept assertions without messages
class TableViewTest {

    @BeforeEach
    void initDataServiceContext() {
        DataServiceContextTest.initDataServiceContext(() -> getExec(), null);
    }

    @AfterEach
    void removeDataServiceContext() {
        DataServiceContextTest.removeDataServiceContext();
    }

    @Test
    void testDataServiceGetData() {
        final var expectedResult =
            List.of(List.of("2", "rowkey 1", "1", "1", "11", "uiext/pageId/images/tableId/2018748495.png", "0001",
                "true", "uiext/pageId/images/tableId/-1084641940.png"));
        var rendererRegistry = new DataValueImageRendererRegistry(() -> "pageId");
        var rendererIds = new String[expectedResult.get(0).size()];
        rendererIds[3] = "org.knime.core.data.renderer.DoubleBarRenderer$Factory";
        final var table = new TableViewDataServiceImpl(createDefaultTestTable(2), "tableId",
            new SwingBasedRendererFactory(), rendererRegistry).getTable(getDefaultTestSpec().getColumnNames(), 1, 1,
                rendererIds, false, true, false, false);
        var rows = table.getRows();
        assertThat(rows).as("check that the first row has the correct test values")
            .overridingErrorMessage("The values of the first row should be %s, not %s.", rows.get(0).toString(),
                expectedResult.get(0).toString())
            .isEqualTo(expectedResult);
        assertThat(rendererRegistry.numRegisteredRenderers("tableId")).isEqualTo(2);

        // check content types
        assertThat(table.getColumnContentTypes())
            .isEqualTo(new String[]{"txt", "multi_line_txt", "txt", "img_path", "txt", "txt", "img_path"});

        // try out 'cell renderer'
        var cellImg = rendererRegistry.renderImage("tableId/-1084641940.png?w=1&h=2");
        assertThat(new String(cellImg, StandardCharsets.UTF_8)).startsWith("�PNG");
        var cellImg2 = rendererRegistry.renderImage("tableId/2018748495.png?w=1&h=2");
        assertThat(new String(cellImg2, StandardCharsets.UTF_8)).startsWith("�PNG");
        assertThat(table.getRowCount()).isEqualTo(2);

        assertThat(table.getFirstRowImageDimensions())
            .isEqualTo(Map.of("double", new ImageDimension(2, 2), "image", new ImageDimension(11, 11)));
        assertThat(table.getColumnNamesColors()).isEmpty();
    }

    @Test
    void testDataServiceGetDataWithAttachedFormatter() {

        var tableWithFormatters = createTableWithFormatters();
        var rendererRegistry = new DataValueImageRendererRegistry(() -> "pageId");

        var rendererIds =
            new String[]{null, "org.knime.core.data.renderer.DoubleValueRenderer$PercentageRendererFactory", null};
        final var table = new TableViewDataServiceImpl(tableWithFormatters, "tableId", new SwingBasedRendererFactory(),
            rendererRegistry).getTable(new String[]{"firstCol", "secondCol", "thirdCol"}, 0, 1, rendererIds, false,
                true, false, false);
        var rows = table.getRows();
        assertThat(rows.get(0).get(2)).isEqualTo("<h1>dummy html</h1>");
        assertThat((String)rows.get(0).get(3)).endsWith("%"); // Asserting the exact string is not possible as it is locale-dependent.
        assertThat(rows.get(0).get(4)).isEqualTo("B");

        assertThat(table.getColumnContentTypes()).isEqualTo(new String[]{"html", "txt", "multi_line_txt"});
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
            WorkflowManagerUtil.createAndAddNode(wfm, new NodeViewNodeFactory(
                nodeModel -> new TableNodeView(tableId, () -> nodeModel.getInternalTables()[0], 0)));
        ((NodeViewNodeModel)nnc.getNodeModel())
            .setInternalTables(new BufferedDataTable[]{createDefaultTestTable(2).get()});

        var nodeViewManager = NodeViewManager.getInstance();
        var mapper = new ObjectMapper();

        // request rows to create the 'image renderers' whose images are later access as 'page resources'
        var dataServiceResult =
            mapper.readTree(nodeViewManager.getDataServiceManager().callRpcDataService(NodeWrapper.of(nnc),
                jsonRpcRequest("getTable", "image", "0", "2", "", "true", "true", "false", "false")));
        var imgPath = dataServiceResult.get("result").get("rows").get(0).get(2).asText();
        var imgPath2 = dataServiceResult.get("result").get("rows").get(1).get(2).asText();
        assertThat(TableViewUtil.RENDERER_REGISTRY.numRegisteredRenderers(tableId)).isEqualTo(2);

        // get page path to 'register' the page
        nodeViewManager.getPageResourceManager().getPagePath(NodeWrapper.of(nnc));

        // request a cell image resource
        var img = toString(nodeViewManager.getPageResourceManager().getPageResource(imgPath).orElse(null));
        assertThat(img).startsWith("�PNG");
        // request same image again
        img = toString(nodeViewManager.getPageResourceManager().getPageResource(imgPath).orElse(null));
        assertThat(img).startsWith("�PNG");
        assertThat(TableViewUtil.RENDERER_REGISTRY.numRegisteredRenderers(tableId)).isEqualTo(2);

        // request cell image resource with custom dimension
        try (final var is =
            nodeViewManager.getPageResourceManager().getPageResource(imgPath2 + "?w=8&h=7").get().getInputStream()) {
            var bufferedImage = ImageIO.read(is);
            assertThat(bufferedImage.getWidth()).isEqualTo(7);
            assertThat(bufferedImage.getHeight()).isEqualTo(7);
        }

        // request cell image resource with a dimension larger than the original one
        try (final var is =
            nodeViewManager.getPageResourceManager().getPageResource(imgPath2 + "?w=15&h=16").get().getInputStream()) {
            var bufferedImage = ImageIO.read(is);
            assertThat(bufferedImage.getWidth()).isEqualTo(11);
            assertThat(bufferedImage.getHeight()).isEqualTo(11);
        }

        // request an image through an invalid path
        var invalidImgPath = imgPath.substring(0, imgPath.lastIndexOf("/") + 1) + "0.png";
        var emptyImg = toString(nodeViewManager.getPageResourceManager().getPageResource(invalidImgPath).orElse(null));
        assertThat(emptyImg).isEmpty();

        WorkflowManagerUtil.disposeWorkflow(wfm);
    }

    private static String toString(final Resource resource) throws IOException {
        return resource == null ? null : IOUtils.toString(resource.getInputStream(), StandardCharsets.UTF_8);
    }

    /**
     * Makes sure that the renderers registered with {@link DataValueImageRendererRegistry} and the cached tables (by
     * the {@link TableViewDataServiceImpl}) are properly cleaned up, when the data services are deactived, the
     * respective node deleted or the entire workflow disposed.
     *
     * @throws Exception
     */
    @Test
    void testTableViewNodeFactoryRendererRegistryAndCachedTablesCleanUp() throws Exception {

        var wfm = WorkflowManagerUtil.createEmptyWorkflow();
        var tableId = "test_table_id";
        var tableId2 = "test_table_id2";
        var nnc = WorkflowManagerUtil.createAndAddNode(wfm,
            new NodeViewNodeFactory(1, 0,
                nodeModel -> new TableNodeView(tableId, () -> nodeModel.getInternalTables()[0], 0)));
        var nnc2 = WorkflowManagerUtil.createAndAddNode(wfm,
            new NodeViewNodeFactory(1, 0,
                nodeModel -> new TableNodeView(tableId2, () -> nodeModel.getInternalTables()[0], 0)));
        final var sourceNodeFactory = new DefaultVirtualPortObjectInNodeFactory(new PortType[]{BufferedDataTable.TYPE});
        final var sourceNode = WorkflowManagerUtil.createAndAddNode(wfm, sourceNodeFactory);

        var exec = new ExecutionContext(new DefaultNodeProgressMonitor(), nnc.getNode(),
            SingleNodeContainer.MemoryPolicy.CacheSmallInMemory, NotInWorkflowDataRepository.newInstance());

        var testTable = createDefaultTestTable(2, idx -> idx, exec).get();
        ((DefaultVirtualPortObjectInNodeModel)sourceNode.getNodeModel())
            .setVirtualNodeInput(new VirtualNodeInput(new PortObject[]{testTable}, Collections.emptyList()));
        wfm.addConnection(sourceNode.getID(), 1, nnc.getID(), 1);
        wfm.addConnection(sourceNode.getID(), 1, nnc2.getID(), 1);

        wfm.executeAllAndWaitUntilDone();
        var tables = new BufferedDataTable[]{testTable};
        ((NodeViewNodeModel)nnc.getNodeModel()).setInternalTables(tables);

        var nodeViewManager = NodeViewManager.getInstance();
        var execSpy = Mockito.spy(exec);

        // call data service to register renderers and sort table
        callDataServiceToRegisterRenderes(nnc, nodeViewManager, execSpy);
        assertThat(TableViewUtil.RENDERER_REGISTRY.numRegisteredRenderers(tableId)).isEqualTo(2);
        callDataServiceToSortTable(nnc, nodeViewManager, execSpy);
        verify(execSpy).createDataContainer(any(), eq(false));

        // must clear the registry for the given 'table id' (i.e. node id here) and cached tables when
        // deactivating the data services
        nodeViewManager.getDataServiceManager().deactivateDataServices(NodeWrapper.of(nnc));
        assertThat(TableViewUtil.RENDERER_REGISTRY.numRegisteredRenderers(tableId)).isZero();
        // called 3 times for each temporary table being used (see TableViewDataServiceImpl.clearCache)
        verify(execSpy, times(3)).clearTable(any());

        // assert that registry and cached tables are cleared on delete
        ((NodeViewNodeModel)nnc.getNodeModel()).setInternalTables(tables);
        callDataServiceToRegisterRenderes(nnc, nodeViewManager, execSpy);
        assertThat(TableViewUtil.RENDERER_REGISTRY.numRegisteredRenderers(tableId)).isEqualTo(2);
        callDataServiceToSortTable(nnc, nodeViewManager, execSpy);
        verify(execSpy, times(2)).createDataContainer(any(), eq(false));
        wfm.removeNode(nnc.getID());
        await()
            .untilAsserted(() -> assertThat(TableViewUtil.RENDERER_REGISTRY.numRegisteredRenderers(tableId)).isZero());
        await().untilAsserted(() -> verify(execSpy, times(6)).clearTable(any()));

        // assert that registry and cached tables are cleared when workflow is disposed
        var exec2 = new ExecutionContext(new DefaultNodeProgressMonitor(), nnc2.getNode(),
            SingleNodeContainer.MemoryPolicy.CacheSmallInMemory, NotInWorkflowDataRepository.newInstance());
        var execSpy2 = Mockito.spy(exec2);
        var testTable2 = createDefaultTestTable(2, idx -> idx, exec2).get();
        ((NodeViewNodeModel)nnc2.getNodeModel()).setInternalTables(new BufferedDataTable[]{testTable2});
        callDataServiceToRegisterRenderes(nnc2, nodeViewManager, execSpy2);
        assertThat(TableViewUtil.RENDERER_REGISTRY.numRegisteredRenderers(tableId2)).isEqualTo(2);
        callDataServiceToSortTable(nnc2, nodeViewManager, execSpy2);
        WorkflowManagerUtil.disposeWorkflow(wfm);
        await()
            .untilAsserted(() -> assertThat(TableViewUtil.RENDERER_REGISTRY.numRegisteredRenderers(tableId2)).isZero());
        await().untilAsserted(() -> verify(execSpy2, times(3)).clearTable(any()));
    }

    private static void callDataServiceToRegisterRenderes(final NativeNodeContainer nnc,
        final NodeViewManager nodeViewManager, final ExecutionContext exec) {
        DataServiceContextTest.removeDataServiceContext();
        DataServiceContextTest.initDataServiceContext(() -> exec, null);
        nodeViewManager.getDataServiceManager().callRpcDataService(NodeWrapper.of(nnc),
            jsonRpcRequest("getTable", "image", "0", "2", "", "true", "true", "false", "false"));
        DataServiceContextTest.removeDataServiceContext();
    }

    private static void callDataServiceToSortTable(final NativeNodeContainer nnc, final NodeViewManager nodeViewManager,
        final ExecutionContext exec) {
        DataServiceContextTest.removeDataServiceContext();
        DataServiceContextTest.initDataServiceContext(() -> exec, null);
        nodeViewManager.getDataServiceManager().callRpcDataService(NodeWrapper.of(nnc),
            jsonRpcRequest("getFilteredAndSortedTable", "string", "0", "2", "string", "true", "", "[[\"\"],[\"\"]]",
                "true", "", "false", "false", "false", "true", "false"));
        DataServiceContextTest.removeDataServiceContext();
    }

    @Test
    void testDataServiceGetSortedData() {
        final var testTable = createTableViewDataServiceInstance(createDefaultTestTable(5));
        final var sortColumnIndex = 0;
        final var sortColumnName = getDefaultTestSpec().getColumnNames()[sortColumnIndex];
        var columns = getDefaultTestSpec().getColumnNames();
        final var tableSortedAscending = testTable.getFilteredAndSortedTable(columns, 0, 5, sortColumnName, true, null,
            null, true, null, false, false, true, false, false).getRows();
        IntStream.range(1, tableSortedAscending.size()).forEach(rowIndex -> {
            assertThat((String)tableSortedAscending.get(rowIndex).get(sortColumnIndex))
                .isGreaterThanOrEqualTo((String)tableSortedAscending.get(rowIndex - 1).get(sortColumnIndex));
        });
        final var tableSortedDescending = testTable.getFilteredAndSortedTable(getDefaultTestSpec().getColumnNames(), 0,
            5, sortColumnName, false, null, null, true, null, false, false, true, false, false).getRows();
        IntStream.range(1, tableSortedDescending.size()).forEach(rowIndex -> {
            assertThat((String)tableSortedDescending.get(rowIndex).get(sortColumnIndex))
                .isLessThanOrEqualTo((String)tableSortedDescending.get(rowIndex - 1).get(sortColumnIndex));
        });
    }

    @Test
    void testDataServiceGetCachedSortedData() {
        final var testTable = createTableViewDataServiceInstance(createDefaultTestTable(10));
        final var sortColumnIndex = 0;
        var sortColumnIndexInResultTable = sortColumnIndex + 2; //  the first two columns are row index and row key
        final var sortColumnName = getDefaultTestSpec().getColumnNames()[sortColumnIndex];
        final var tableSortedAscending = testTable.getFilteredAndSortedTable(getDefaultTestSpec().getColumnNames(), 0,
            5, sortColumnName, true, null, null, true, null, false, false, true, false, false).getRows();
        IntStream.range(1, tableSortedAscending.size()).forEach(rowIndex -> {
            assertThat((String)tableSortedAscending.get(rowIndex).get(sortColumnIndexInResultTable))
                .isGreaterThanOrEqualTo(
                    (String)tableSortedAscending.get(rowIndex - 1).get(sortColumnIndexInResultTable));
        });
        final var tableSortedDescending = testTable.getFilteredAndSortedTable(getDefaultTestSpec().getColumnNames(), 5,
            5, sortColumnName, true, null, null, true, null, false, false, true, false, false).getRows();
        IntStream.range(1, tableSortedDescending.size()).forEach(rowIndex -> {
            assertThat((String)tableSortedDescending.get(rowIndex).get(sortColumnIndexInResultTable))
                .isGreaterThanOrEqualTo(
                    (String)tableSortedDescending.get(rowIndex - 1).get(sortColumnIndexInResultTable));
        });
    }

    @Test
    void testDataServiceSetsGetTableWithOneMissingColumn() {
        final var warningMessageAsserter =
            new DataServiceContextWarningMessagesAsserter("The selected column foo is not present in the table.");
        final var testTable = createTableViewDataServiceInstance(createDefaultTestTable(1));
        final var rows = testTable
            .getTable(Stream.concat(Arrays.asList(getDefaultTestSpec().getColumnNames()).stream(), Stream.of("foo"))
                .toArray(String[]::new), 0, 1, null, true, true, false, false)
            .getRows();
        assertThat(rows.get(0)).as("The output table has the correct amount of columns")
            .hasSize(getDefaultTestSpec().getNumColumns() + 2);
        assertTrue(warningMessageAsserter.allRegisteredMessagesCalled(),
            "Adds warning message for single missing column.");
    }

    @Test
    void testDataServiceSetsGetTableColumnCount() {
        final var testTable = createTableViewDataServiceInstance(createDefaultTestTable(1));
        final var result =
            testTable.getTable(getDefaultTestSpec().getColumnNames(), 0, 1, null, true, true, false, false);
        assertThat(result.getColumnCount()).isEqualTo(7);
    }

    @Test
    void testDataServiceSetsGetTableTrimColumns() {
        final var numColumns = 1200;
        var stringColumns = IntStream.range(0, numColumns)
            .mapToObj(i -> new ObjectColumn(String.format("Column %s", i), StringCell.TYPE, new String[]{"content"}))
            .toArray(ObjectColumn[]::new);
        final var inputTable = createTableFromColumns(stringColumns);
        final var testTable = createTableViewDataServiceInstance(() -> inputTable);
        final var result =
            testTable.getTable(inputTable.getSpec().getColumnNames(), 0, 1, null, true, true, true, false);
        assertThat(result.getColumnCount()).isEqualTo(numColumns);
        assertThat(result.getDisplayedColumns().length).isEqualTo(1000);
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
            true, "STRING1", columnFilterValue, false, null, false, false, true, false, false);
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
            globalSearchTerm, columnFilterValue, filterRowKeys, null, false, false, true, false, false);
        assertThat(dataService.getTotalSelected()).isEqualTo(1);
    }

    @Test
    void testDataServiceGetSelectedOnly() {
        final var table = createTestTableFiltering();
        final var globalSearchTerm = "";
        final var columnFilterValue = new String[][]{new String[0], new String[0], new String[0]};
        final var filterRowKeys = false;
        final var selection = Set.of(new RowKey("rowkey 0"));
        final var dataService = TableViewUtil.createTableViewDataService(() -> table, () -> selection, null);
        final var resultTable = dataService.getFilteredAndSortedTable(table.getDataTableSpec().getColumnNames(), 0, 2,
            "string", true, globalSearchTerm, columnFilterValue, filterRowKeys, null, false, false, true, false, true);
        assertThat(resultTable.getRowCount()).isEqualTo(1);
    }

    @Test
    void testDataServiceGetSelectedOnlyWithGlobalSearch() {
        final var table = createTestTableFiltering();
        var globalSearchTerm = "StRinG1";
        final var columnFilterValue = new String[][]{new String[0], new String[0], new String[0]};
        final var filterRowKeys = false;
        final var selection = Set.of(new RowKey("rowkey 0"));
        final var dataService = TableViewUtil.createTableViewDataService(() -> table, () -> selection, null);
        var resultTable = dataService.getFilteredAndSortedTable(table.getDataTableSpec().getColumnNames(), 0, 2,
            "string", true, globalSearchTerm, columnFilterValue, filterRowKeys, null, false, false, true, false, true);
        assertThat(resultTable.getRowCount()).isEqualTo(1);

        // search for something that is not selected
        globalSearchTerm = "NotInTable";
        resultTable = dataService.getFilteredAndSortedTable(table.getDataTableSpec().getColumnNames(), 0, 2, "string",
            true, globalSearchTerm, columnFilterValue, filterRowKeys, null, false, false, true, false, true);
        assertThat(resultTable.getRowCount()).isZero();
    }

    @Test
    void testDataServiceSetsGetTableWithMultipleMissingColumn() {
        final var warningMessageAsserter = new DataServiceContextWarningMessagesAsserter(
            "The selected columns foo, bar are not present in the table.");
        final var testTable = createTableViewDataServiceInstance(createDefaultTestTable(1));
        final var rows = testTable.getTable(
            Stream.concat(Arrays.asList(getDefaultTestSpec().getColumnNames()).stream(), Stream.of("foo", "bar"))
                .toArray(String[]::new),
            0, 1, null, true, true, false, false).getRows();
        assertThat(rows.get(0)).as("The output table has the correct amount of columns")
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
        final var emptyTable =
            testTable
                .getFilteredAndSortedTable(filterTestTable.getDataTableSpec().getColumnNames(), 0, 2, sortColumnName,
                    true, "wrongSearchTerm", columnFilterValue, false, null, false, false, true, false, false)
                .getRows();
        assertThat(emptyTable.size()).as("filters and excludes all rows").isZero();

        final var table = testTable.getFilteredAndSortedTable(filterTestTable.getDataTableSpec().getColumnNames(), 0, 2,
            sortColumnName, true, "STRING1", columnFilterValue, false, null, false, false, true, false, false)
            .getRows();
        assertThat(table.size()).as("filters all rows correctly").isEqualTo(1);
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
                globalSearchTerm, columnFilterValue, true, null, false, false, true, false, false).getRows();
        IntStream.range(1, tableSortedAscending.size()).forEach(rowIndex -> {
            assertThat((String)tableSortedAscending.get(rowIndex).get(sortColumnIndex))
                .isGreaterThanOrEqualTo((String)tableSortedAscending.get(rowIndex - 1).get(sortColumnIndex));
        });
        assertThat(tableSortedAscending.size()).as("filters rows correctly").isEqualTo(1);

        final var cachedTable =
            testTable.getFilteredAndSortedTable(getDefaultTestSpec().getColumnNames(), 0, 5, sortColumnName, true,
                globalSearchTerm, columnFilterValue, true, null, false, false, true, false, false).getRows();
        assertThat(cachedTable).hasSameSizeAs(tableSortedAscending);
        for (int i = 0; i < cachedTable.size(); i++) {
            assertThat(cachedTable.get(i)).hasSameElementsAs(tableSortedAscending.get(i));
        }
    }

    @Test
    void testDataServiceGetFilteredAndSortedDataWithExcludedColumns() {
        final var testTable = createTableViewDataServiceInstance(createDefaultTestTable(10));
        final var columnNames = new String[]{"string", "long"};
        final var sortColumnName = "long";
        final var columnFilterValues = new String[][]{new String[0], new String[0], new String[]{"1"}};

        testTable.getTable(columnNames, 0, 10, null, true, true, false, false);
        final var tableRemColSortCol = testTable.getFilteredAndSortedTable(columnNames, 0, 10, sortColumnName, false,
            null, columnFilterValues, false, null, false, false, true, false, false);
        assertThat(tableRemColSortCol.getRowCount()).as("filters correctly after removing the first column")
            .isEqualTo(1);
    }

    @Test
    void testInitialDataGetDataTypes() {
        final var initData = new TableViewInitialDataImpl(new TableViewViewSettings(getDefaultTestSpec()),
            createDefaultTestTable(11), () -> Collections.emptySet(), "tableId", new SwingBasedRendererFactory(),
            new DataValueImageRendererRegistry(() -> "pageId"));
        var dataTypes = initData.getDataTypes();
        var table = initData.getTable();

        var stringType = dataTypes.get(table.getColumnDataTypeIds()[1]);
        assertThat(stringType.getName()).isEqualTo("String");
        assertRendererNames(stringType.getRenderers(), "Multi-line String", "String");

        var doubleType = dataTypes.get(table.getColumnDataTypeIds()[3]);
        assertThat(doubleType.getName()).isEqualTo("Number (double)");
        assertRendererNames(doubleType.getRenderers(), "Standard Double", "Percentage", "Full Precision", "Gray Scale",
            "Bars", "Default");

        var booleanType = dataTypes.get(table.getColumnDataTypeIds()[5]);
        assertThat(booleanType.getName()).isEqualTo("Boolean value");
        assertRendererNames(booleanType.getRenderers(), "Boolean", "Integer", "Standard Double", "Percentage",
            "Full Precision", "Gray Scale", "Bars", "Default");

        var imageType = dataTypes.get(table.getColumnDataTypeIds()[6]);
        assertThat(imageType.getName()).isEqualTo("PNG Image");
        assertRendererNames(imageType.getRenderers(), "PNG Image", "Image");
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
            .isThrownBy(() -> dataService.getTable(colNames, -1, 2, null, false, true, false, false));
    }

    @Test
    void testDataServiceGetDataNullSupplier() {
        assertThatNullPointerException()
            .isThrownBy(() -> createTableViewDataServiceInstance((Supplier<BufferedDataTable>)null)
                .getTable(getDefaultTestSpec().getColumnNames(), 0, 0, null, false, true, false, false));
    }

    @Test
    void testDataServiceGetDataNullTable() {
        final var rows = createTableViewDataServiceInstance(() -> null)
            .getTable(getDefaultTestSpec().getColumnNames(), 0, 2, null, false, true, false, false).getRows();
        assertThat(rows).isEmpty();
    }

    @Test
    void testDataServiceGetDataZeroRows() {
        final var rows = createTableViewDataServiceInstance(() -> null)
            .getTable(getDefaultTestSpec().getColumnNames(), 0, 0, null, false, true, false, false).getRows();
        assertThat(rows).isEmpty();
    }

    @Test
    void testPageFormat() throws IOException {
        var wfm = WorkflowManagerUtil.createEmptyWorkflow();
        var tableId = "test_table_id";
        var nnc =
            WorkflowManagerUtil.createAndAddNode(wfm, new NodeViewNodeFactory(
                nodeModel -> new TableNodeView(tableId, () -> nodeModel.getInternalTables()[0], 0)));
        ((NodeViewNodeModel)nnc.getNodeModel())
            .setInternalTables(new BufferedDataTable[]{createDefaultTestTable(2).get()});

        var pageFormat = NodeViewManager.getInstance().getDefaultPageFormat(nnc);
        assertThat(pageFormat).isEqualTo(PageFormat.ASPECT_RATIO_4BY3);

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
        var table = dataService.getTable(new String[]{"col1", "col2"}, 0, 2, null, false, false, false, false);

        assertThat(table.getDisplayedColumns()).isEqualTo(new String[]{"col1", "col2"});
        assertThat(table.getColumnContentTypes()).isEqualTo(new String[]{"multi_line_txt", "txt"});
        assertThat(table.getRows())
            .isEqualTo(List.of(List.of("1", "rowkey 0", "A", "1"), List.of("2", "rowkey 1", "B", "3")));
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
        final var table = dataService.getTable(new String[]{"col1", "col2"}, 0, 2, null, false, false, false, false);
        final var rows = table.getRows();

        assertThat(((MissingCellWithMessage)rows.get(0).get(2)).getMetadata()).isEqualTo("Row1_Col1");
        assertThat(((MissingCellWithMessage)rows.get(0).get(3)).getMetadata()).isEqualTo("Row1_Col2");
        assertThat(rows.get(1).get(2)).isNull();
        assertThat(((MissingCellWithMessage)rows.get(1).get(3)).getMetadata()).isEqualTo("Row2_Col2");
    }

    @Test
    void testDataServiceGetRowsWithColoredCells() {
        final var numericColorModel = new ColorModelRange(0, new Color(0, 0, 0), 1.0, new Color(255, 255, 255));
        final var nominalColorModel =
            new ColorModelNominal(Map.of(new StringCell("value1"), ColorAttr.getInstance(new Color(0, 255, 0))), null);

        final var nominalColumn = new Object[]{"value1", null};
        final var numericColumn = new Object[]{new MissingCell("Row1_Col2"), new MissingCell(null)};
        final var inputTable = TableTestUtil.createTableFromColumns( //
            new ObjectColumn("col1", StringCell.TYPE, new ColorHandler(nominalColorModel), nominalColumn), //
            new ObjectColumn("col2", IntCell.TYPE, new ColorHandler(numericColorModel), numericColumn) //
        );

        final var dataService = createTableViewDataServiceInstance(() -> inputTable);
        final var table = dataService.getTable(new String[]{"col1", "col2"}, 0, 2, null, false, false, false, false);
        final var rows = table.getRows();

        final var missingCellsColor = "#404040";

        assertThat(((Cell)rows.get(0).get(2)).getColor()).isEqualTo("#00FF00");
        assertThat(((Cell)rows.get(0).get(2)).getValue()).isEqualTo("value1");
        assertThat(((Cell)rows.get(1).get(2)).getColor()).isEqualTo(missingCellsColor);
        assertThat(((Cell)rows.get(1).get(2)).getValue()).isNull();

        assertThat(((Cell)rows.get(0).get(3)).getColor()).isEqualTo(missingCellsColor);
        assertThat(((Cell)rows.get(0).get(3)).getValue()).isNull();
        assertThat(((MissingCellWithMessage)rows.get(0).get(3)).getMetadata()).isEqualTo("Row1_Col2");
        assertThat(((Cell)rows.get(1).get(3)).getColor()).isEqualTo(missingCellsColor);
        assertThat(((Cell)rows.get(1).get(3)).getValue()).isNull();
        assertThat(((MissingCellWithMessage)rows.get(1).get(3)).getMetadata()).isNull();
    }

    @Test
    void testDataServiceGetRowsWithColumnNameColors() {
        final var expectedResult = new String[]{"#FF0000", "#0000FF"};
        final var column1 = "column1";
        final var column2 = "column2";
        final var column3 = "column3";
        Map<DataCell, ColorAttr> columnNamesColorMap = new HashMap<>();
        columnNamesColorMap.put(new StringCell(column1), ColorAttr.getInstance(new Color(255, 0, 0)));
        columnNamesColorMap.put(new StringCell(column2), ColorAttr.getInstance(new Color(0, 255, 0)));
        columnNamesColorMap.put(new StringCell(column3), ColorAttr.getInstance(new Color(0, 0, 255)));
        var columnNamesColorModel = new ColorModelNominal(columnNamesColorMap, new ColorAttr[0]);

        final var firstColSpec = new DataColumnSpecCreator("column1", StringCell.TYPE).createSpec();
        final var secondColSpec = new DataColumnSpecCreator("column2", DoubleCell.TYPE).createSpec();
        final var thirdColSpec = new DataColumnSpecCreator("column3", StringCell.TYPE).createSpec();
        final var dtsc = new DataTableSpecCreator();
        dtsc.addColumns(firstColSpec);
        dtsc.addColumns(secondColSpec);
        dtsc.addColumns(thirdColSpec);
        dtsc.setColumnNamesColorHandler(new ColorHandler(columnNamesColorModel));

        final var inputTable = new TableBuilder(dtsc.createSpec()).addRow(new Object[]{"A", 0.5, "B"}).build();
        var dataService = createTableViewDataServiceInstance(() -> inputTable.get());
        var table = dataService.getTable(new String[]{"column1", "column3"}, 0, 1, null, false, false, false, false);
        assertArrayEquals(table.getColumnNamesColors(), expectedResult);
    }

    @Nested
    class GetCopyContentTest {

        private final String[] allTestColumns = getDefaultTestSpec().getColumnNames();

        private final String[] selectedTestColumns = new String[]{allTestColumns[2], allTestColumns[3]};

        private TableViewDataService dataService;

        @BeforeEach
        void createDataService() {
            dataService = new TableViewDataServiceImpl(createDefaultTestTable(10), null, null, null);
        }

        @Test
        void testGetCopyContent() throws IOException {
            final var rowIndexConfig = new SpecialColumnConfig(false, "#");
            final var rowKeyConfig = new SpecialColumnConfig(false, "RowID");
            final var expectedResult = new TableViewDataService.HTMLAndCSV(//
                "<html><body><table>" //
                    + "<tr><td>11</td><td>1.0</td></tr>" //
                    + "<tr><td>22</td><td>2.0</td></tr>" //
                    + "<tr><td>33</td><td>3.0</td></tr>" //
                    + "</table></body></html>",
                "11\t1.0\r\n" //
                    + "22\t2.0\r\n" //
                    + "33\t3.0");

            final var copyContent =
                dataService.getCopyContent(rowIndexConfig, rowKeyConfig, false, selectedTestColumns, 1, 3);
            assertThat(copyContent).isEqualTo(expectedResult);
        }

        @Test
        void testGetCopyContentWithRowKeys() throws IOException {
            final var rowIndexConfig = new SpecialColumnConfig(false, "#");
            final var rowKeyConfig = new SpecialColumnConfig(true, "RowID");
            final var expectedResult = new TableViewDataService.HTMLAndCSV(//
                "<html><body><table>" //
                    + "<tr><td>rowkey 1</td><td>11</td><td>1.0</td></tr>" //
                    + "<tr><td>rowkey 2</td><td>22</td><td>2.0</td></tr>" //
                    + "<tr><td>rowkey 3</td><td>33</td><td>3.0</td></tr>" //
                    + "</table></body></html>",
                "rowkey 1\t11\t1.0\r\n" //
                    + "rowkey 2\t22\t2.0\r\n" //
                    + "rowkey 3\t33\t3.0");

            final var copyContent =
                dataService.getCopyContent(rowIndexConfig, rowKeyConfig, false, selectedTestColumns, 1, 3);
            assertThat(copyContent).isEqualTo(expectedResult);
        }

        @Test
        void testGetCopyContentWithIndices() throws IOException {
            final var rowIndexConfig = new SpecialColumnConfig(true, "#");
            final var rowKeyConfig = new SpecialColumnConfig(false, "RowID");
            final var expectedResult = new TableViewDataService.HTMLAndCSV(//
                "<html><body><table>" //
                    + "<tr><td>2</td><td>11</td><td>1.0</td></tr>" //
                    + "<tr><td>3</td><td>22</td><td>2.0</td></tr>" //
                    + "<tr><td>4</td><td>33</td><td>3.0</td></tr>" //
                    + "</table></body></html>",
                "2\t11\t1.0\r\n" //
                    + "3\t22\t2.0\r\n" //
                    + "4\t33\t3.0");

            final var copyContent =
                dataService.getCopyContent(rowIndexConfig, rowKeyConfig, false, selectedTestColumns, 1, 3);
            assertThat(copyContent).isEqualTo(expectedResult);
        }

        @Test
        void testGetCopyContentWithHeaders() throws IOException {
            final var rowIndexConfig = new SpecialColumnConfig(true, "#");
            final var rowKeyConfig = new SpecialColumnConfig(true, "RowID");
            final var expectedResult = new TableViewDataService.HTMLAndCSV(//
                "<html><body><table>" //
                    + "<tr><th>#</th><th>RowID</th><th>long</th><th>double</th></tr>" //
                    + "<tr><td>2</td><td>rowkey 1</td><td>11</td><td>1.0</td></tr>" //
                    + "<tr><td>3</td><td>rowkey 2</td><td>22</td><td>2.0</td></tr>" //
                    + "<tr><td>4</td><td>rowkey 3</td><td>33</td><td>3.0</td></tr>" //
                    + "</table></body></html>",
                "\"#\"\tRowID\tlong\tdouble\r\n" //
                    + "2\trowkey 1\t11\t1.0\r\n" //
                    + "3\trowkey 2\t22\t2.0\r\n" //
                    + "4\trowkey 3\t33\t3.0");

            final var copyContent =
                dataService.getCopyContent(rowIndexConfig, rowKeyConfig, true, selectedTestColumns, 1, 3);
            assertThat(copyContent).isEqualTo(expectedResult);
        }

        @Test
        void testGetCopyContentForFilteredAndSortedTable() throws IOException {
            final var rowIndexConfig = new SpecialColumnConfig(false, "#");
            final var rowKeyConfig = new SpecialColumnConfig(false, "RowID");
            final var expectedResult = new TableViewDataService.HTMLAndCSV(//
                "<html><body><table>" //
                    + "<tr><td>1034</td><td>94.0</td></tr>"//
                    + "<tr><td>1023</td><td>93.0</td></tr>"//
                    + "</table></body></html>", //
                "1034\t94.0\r\n" //
                    + "1023\t93.0");

            dataService =
                new TableViewDataServiceImpl(createDefaultTestTable(100), null, new SwingBasedRendererFactory(), null);

            dataService.getFilteredAndSortedTable(selectedTestColumns, 1, 1, selectedTestColumns[0], false, "3", null,
                false, null, false, false, false, false, false);
            final var copyContent =
                dataService.getCopyContent(rowIndexConfig, rowKeyConfig, false, selectedTestColumns, 0, 1);
            assertThat(copyContent).isEqualTo(expectedResult);
        }

    }

    private static TableViewDataService
        createTableViewDataServiceInstance(final Supplier<BufferedDataTable> tableSupplier) {
        return new TableViewDataServiceImpl(tableSupplier, "tableId", new SwingBasedRendererFactory(),
            new DataValueImageRendererRegistry(() -> "pageId"));
    }
}
