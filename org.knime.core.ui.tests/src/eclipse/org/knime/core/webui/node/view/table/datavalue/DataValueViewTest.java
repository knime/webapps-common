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
 *   Oct 16, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.view.table.datavalue;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.apache.xmlbeans.XmlException;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.knime.core.data.def.DoubleCell.DoubleCellFactory;
import org.knime.core.data.def.StringCell;
import org.knime.core.data.property.ValueFormatHandler;
import org.knime.core.node.BufferedDataTable;
import org.knime.core.node.CanceledExecutionException;
import org.knime.core.node.ExecutionContext;
import org.knime.core.node.ExecutionMonitor;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NoDescriptionProxy;
import org.knime.core.node.NodeDescription;
import org.knime.core.node.NodeDialogPane;
import org.knime.core.node.NodeFactory;
import org.knime.core.node.NodeModel;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.NodeView;
import org.knime.core.node.port.PortObject;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.node.port.PortType;
import org.knime.core.node.port.PortTypeRegistry;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.node.workflow.WorkflowManager;
import org.knime.core.webui.data.InitialDataService;
import org.knime.core.webui.data.RpcDataService;
import org.knime.core.webui.node.DataValueWrapper;
import org.knime.core.webui.node.view.table.datavalue.views.StringCellViewWithFormatter;
import org.knime.core.webui.page.Page;
import org.knime.testing.util.TableTestUtil;
import org.knime.testing.util.TableTestUtil.ObjectColumn;
import org.knime.testing.util.WorkflowManagerUtil;
import org.xml.sax.SAXException;

/**
 * This test tests both the {@link DataValueViewManager} and the {@link DataValueViewWrapper} interface.
 *
 * @author Paul Bärnreuther
 */
final class DataValueViewTest {

    private static final DataValueViewManager INSTANCE = DataValueViewManager.getInstance();

    /**
     * Node model with buffered data table output ports.
     */
    private static final class TestNodeModel extends NodeModel {

        private final PortObject[] m_executeResult;

        TestNodeModel(final PortObject[] executeResult) {
            super(new PortType[0], extractPortTypes(executeResult));
            m_executeResult = executeResult;
        }

        /**
         * Define the output ports of the node. The execution will fill these output ports with null
         */
        TestNodeModel(final PortType[] outputPorts) {
            super(new PortType[0], outputPorts);
            m_executeResult = new PortObject[outputPorts.length];
        }

        private static PortType[] extractPortTypes(final PortObject[] executeResult) {
            return Arrays.stream(executeResult).map(PortObject::getClass)
                .map(PortTypeRegistry.getInstance()::getPortType).toArray(PortType[]::new);
        }

        @Override
        protected PortObjectSpec[] configure(final PortObjectSpec[] inSpecs) throws InvalidSettingsException {
            return null;
        }

        @Override
        protected PortObject[] execute(final PortObject[] inObjects, final ExecutionContext exec) throws Exception {
            return m_executeResult;
        }

        @Override
        protected void loadInternals(final File nodeInternDir, final ExecutionMonitor exec)
            throws IOException, CanceledExecutionException {
            // Do nothing
        }

        @Override
        protected void saveInternals(final File nodeInternDir, final ExecutionMonitor exec)
            throws IOException, CanceledExecutionException {
            // Do nothing
        }

        @Override
        protected void saveSettingsTo(final NodeSettingsWO settings) {
            // Do nothing
        }

        @Override
        protected void validateSettings(final NodeSettingsRO settings) throws InvalidSettingsException {
            // Do nothing
        }

        @Override
        protected void loadValidatedSettingsFrom(final NodeSettingsRO settings) throws InvalidSettingsException {
            // Do nothing
        }

        @Override
        protected void reset() {
            // Do nothing
        }

    }

    /**
     * For a node two buffered data table output ports.
     */
    private static final class TestNodeFactory extends NodeFactory<TestNodeModel> {

        final TestNodeModel m_nodeModel;

        TestNodeFactory(final PortObject[] executeResult) {
            m_nodeModel = new TestNodeModel(executeResult);
        }

        TestNodeFactory(final PortType[] outputPorts) {
            m_nodeModel = new TestNodeModel(outputPorts);
        }

        @Override
        public TestNodeModel createNodeModel() {
            return m_nodeModel;
        }

        @Override
        protected int getNrNodeViews() {
            return 0;
        }

        @Override
        public NodeView<TestNodeModel> createNodeView(final int viewIndex, final TestNodeModel nodeModel) {
            return null;
        }

        @Override
        protected boolean hasDialog() {
            return false;
        }

        @Override
        protected NodeDialogPane createNodeDialogPane() {
            return null;
        }

        @Override
        protected NodeDescription createNodeDescription() throws SAXException, IOException, XmlException {
            return new NoDescriptionProxy(this.getClass());
        }

    }

    private static final class TestStringCellView implements DataValueView {

        final StringCell m_value;

        TestStringCellView(final StringCell value) {
            m_value = value;
        }

        boolean hasValue(final String string) {
            return m_value.getStringValue().equals(string);
        }

        @Override
        public Page getPage() {
            return Page.builder(DataValueViewTest.class, "blub", "page.js").build();
        }

        @Override
        public <D> Optional<InitialDataService<D>> createInitialDataService() {
            return Optional.empty();
        }

        @Override
        public Optional<RpcDataService> createRpcDataService() {
            return Optional.empty();
        }

    }

    @BeforeAll
    static void registerStringValueViewFactory() {
        DataValueViewManager.registerDataValueViewFactory(StringCell.class, TestStringCellView::new);
    }

    private WorkflowManager m_wfm;

    @BeforeEach
    void setUpWorkflowManager() throws IOException {
        m_wfm = WorkflowManagerUtil.createEmptyWorkflow();
    }

    private static final class TestDataValueWrapperBuilder {

        private final NativeNodeContainer m_nnc;

        /** Default is the first non-flow-variable port */
        private int portIdx = 1;

        private int rowIdx = 0;

        private int colIdx = 0;

        public TestDataValueWrapperBuilder(final NativeNodeContainer nnc) {
            m_nnc = nnc;
        }

        public TestDataValueWrapperBuilder portIdx(final int portIdx) {
            this.portIdx = portIdx;
            return this;
        }

        public TestDataValueWrapperBuilder rowIdx(final int rowIdx) {
            this.rowIdx = rowIdx;
            return this;
        }

        public TestDataValueWrapperBuilder colIdx(final int colIdx) {
            this.colIdx = colIdx;
            return this;
        }

        DataValueWrapper build() {
            return DataValueWrapper.of(m_nnc, portIdx, rowIdx, colIdx);
        }

    }

    private TestDataValueWrapperBuilder setUpDataValueWrapper(final PortObject[] executeResult) {
        final var testNodeFactory = new TestNodeFactory(executeResult);
        return new TestDataValueWrapperBuilder(setUpTestNodeFromFactory(testNodeFactory));
    }

    private TestDataValueWrapperBuilder setUpDataValueWrapper(final PortType[] outputPorts) {
        final var testNodeFactory = new TestNodeFactory(outputPorts);
        return new TestDataValueWrapperBuilder(setUpTestNodeFromFactory(testNodeFactory));
    }

    private NativeNodeContainer setUpTestNodeFromFactory(final TestNodeFactory testNodeFactory) {
        final var nnc = WorkflowManagerUtil.createAndAddNode(m_wfm, testNodeFactory);
        m_wfm.executeAllAndWaitUntilDone();
        assertThat(nnc.getNodeContainerState().isIdle()).as("Test set up: The set up node should not be idle.")
            .isFalse();
        return nnc;
    }

    @Test
    void testThrowsOnMissingPort() {
        final var executeResult = new BufferedDataTable[0];
        final var dataValueWrapper = setUpDataValueWrapper(executeResult).build();
        assertThat(
            assertThrows(NoSuchElementException.class, () -> INSTANCE.getDataValueView(dataValueWrapper)).getMessage())
                .isEqualTo("No port at index 1");
    }

    @Test
    void testThrowsOnWrongPortType() {
        final var executeResult = new PortObject[]{mock(PortObject.class)};
        final var dataValueWrapper = setUpDataValueWrapper(executeResult).build();
        assertThat(
            assertThrows(NoSuchElementException.class, () -> INSTANCE.getDataValueView(dataValueWrapper)).getMessage())
                .isEqualTo("No data table at index 1");
    }

    @Test
    void testThrowsOnMissingPortObject() {
        final var outputPorts = new PortType[]{BufferedDataTable.TYPE};
        final var dataValueWrapper = setUpDataValueWrapper(outputPorts).build();
        assertThat(
            assertThrows(NoSuchElementException.class, () -> INSTANCE.getDataValueView(dataValueWrapper)).getMessage())
                .isEqualTo("No data table available at index 1");
    }

    @Test
    void testThrowsOnMissingDataValueView() {
        final var executeResult = createSingleTableFromColumns(createUnsupportedColumn());
        final var dataValueWrapper = setUpDataValueWrapper(executeResult).build();
        assertThat(
            assertThrows(NoSuchElementException.class, () -> INSTANCE.getDataValueView(dataValueWrapper)).getMessage())
                .isEqualTo("No data value view is available for data type Number (double)");
    }

    @Test
    void testGetDataValueView() {
        final var executeResult =
            createSingleTableFromColumns(createSupportedColumn(new String[]{"foo", "bar", "baz"}));
        final var dataValueWrapper = setUpDataValueWrapper(executeResult).build();
        assertDataValueView(dataValueWrapper, "foo");
    }

    @Test
    void testGetDataValueViewWithPortIdx() {
        final var executeResult = new BufferedDataTable[]{//
            TableTestUtil.createTableFromColumns(createUnsupportedColumn()), //
            TableTestUtil.createTableFromColumns(createSupportedColumn(new String[]{"foo", "bar", "baz"})) //
        };
        final var dataValueWrapper = setUpDataValueWrapper(executeResult).portIdx(2).build();
        assertDataValueView(dataValueWrapper, "foo");
    }

    @Test
    void testGetDataValueViewWithColIdx() {
        final var executeResult = createSingleTableFromColumns(createUnsupportedColumn(),
            createSupportedColumn(new String[]{"foo", "bar", "baz"}));
        final var dataValueWrapper = setUpDataValueWrapper(executeResult).colIdx(1).build();
        assertDataValueView(dataValueWrapper, "foo");
    }

    @Test
    void testGetDataValueViewWithRowIdx() {
        final var executeResult =
            createSingleTableFromColumns(createSupportedColumn(new String[]{"foo", "bar", "baz"}));
        final var dataValueWrapper = setUpDataValueWrapper(executeResult).rowIdx(1).build();
        assertDataValueView(dataValueWrapper, "bar");
    }

    @Test
    void testUsesDataValueDependentWrapperId() {
        final var executeResult =
            createSingleTableFromColumns(createSupportedColumn(new String[]{"foo", "bar", "baz"}));
        final var dataValueWrapper = setUpDataValueWrapper(executeResult).build();
        final var pageResourceManager = INSTANCE.getPageResourceManager();
        final var pagePath = pageResourceManager.getPagePath(dataValueWrapper);

        assertThat(pagePath).isEqualTo("uiext-data_value/org.knime.core.data.def.StringCell/page.js");
    }

    @Test
    void testCreatesStringCellViewWithFormatterWhenValueFormatHandlerIsAttached() {
        final var executeResult = createSingleTableFromColumns(new ObjectColumn("String", StringCell.TYPE, null,
            new String[]{"foo"}, new ValueFormatHandler(value -> "bar")));
        final var dataValueWrapper = setUpDataValueWrapper(executeResult).build();
        final var dataValueView = INSTANCE.getDataValueView(dataValueWrapper);
        assertThat(dataValueView.dataValueClass()).isEqualTo(StringCell.class);
        assertThat(dataValueView.view()).isInstanceOf(StringCellViewWithFormatter.class);
        assertThat(((StringCellViewWithFormatter)(dataValueView.view())).getInitialData().value()).isEqualTo("bar");
    }

    private static ObjectColumn createSupportedColumn(final String[] cells) {
        return new ObjectColumn("Strings (supported)", StringCell.TYPE, cells);

    }

    private static ObjectColumn createUnsupportedColumn() {
        return new ObjectColumn("Doubles (not supported)", DoubleCellFactory.TYPE, new Double[]{1.0, 2.0, 3.0});
    }

    private static BufferedDataTable[] createSingleTableFromColumns(final ObjectColumn... column) {
        return new BufferedDataTable[]{TableTestUtil.createTableFromColumns(column)};
    }

    private static void assertDataValueView(final DataValueWrapper dataValueWrapper,
        final String expectedExtractedValue) {
        final var dataValueView = INSTANCE.getDataValueView(dataValueWrapper);
        assertThat(dataValueView.dataValueClass()).isEqualTo(StringCell.class);
        assertThat(dataValueView.view()).isInstanceOf(TestStringCellView.class);
        assertThat(((TestStringCellView)(dataValueView.view())).hasValue(expectedExtractedValue)).isTrue();
    }
}
