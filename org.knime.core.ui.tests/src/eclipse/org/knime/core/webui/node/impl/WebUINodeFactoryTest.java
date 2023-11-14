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
 *   10 Nov 2022 (marcbux): created
 */
package org.knime.core.webui.node.impl;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.io.File;
import java.io.IOException;
import java.util.Optional;

import org.apache.xmlbeans.XmlException;
import org.junit.jupiter.api.Test;
import org.knime.core.data.DataTableSpec;
import org.knime.core.data.def.IntCell;
import org.knime.core.node.BufferedDataTable;
import org.knime.core.node.CanceledExecutionException;
import org.knime.core.node.ConfigurableNodeFactory;
import org.knime.core.node.ExecutionContext;
import org.knime.core.node.ExecutionMonitor;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeDescription;
import org.knime.core.node.NodeDialogPane;
import org.knime.core.node.NodeFactory.NodeType;
import org.knime.core.node.NodeModel;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.NodeView;
import org.knime.core.node.context.NodeCreationConfiguration;
import org.knime.core.node.context.ports.PortsConfiguration;
import org.knime.core.node.extension.NodeFactoryProvider;
import org.knime.core.node.port.PortObject;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.webui.node.dialog.NodeDialog;
import org.knime.core.webui.node.dialog.NodeDialogFactory;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeDialog;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.testing.util.TableTestUtil;
import org.xml.sax.SAXException;

/**
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
@SuppressWarnings("java:S2698") // we accept assertions without messages
class WebUINodeFactoryTest {

    static {
        try {
            NodeFactoryProvider.getInstance();
        } catch (IllegalStateException e) { // NOSONAR
            // HACK to make tests work in the build system where the org.knime.workbench.repository plugin
            // is not present (causes an exception on the first call
            // 'Invalid extension point: org.knime.workbench.repository.nodes')
        }
    }

    /**
     * Test that information passed to the WebUINodeFactory in the TestWebUINode is correctly translated to a node
     * description.
     */
    @Test
    void testNodeDescription() throws SAXException, IOException, XmlException {
        // given the description of the test node factory
        final var factory = new TestWebUINodeFactory();
        final var nodeDescription = factory.createNodeDescription();

        // when reading out the properties
        final var name = nodeDescription.getNodeName();
        final var icon = nodeDescription.getIconPath();
        final var shortDescription = nodeDescription.getShortDescription().get();
        final var longDescription = nodeDescription.getIntro().get();
        final var nodeType = nodeDescription.getType();
        final var inputDescription = nodeDescription.getInportDescription(0);
        final var outputDescription = nodeDescription.getOutportDescription(0);

        // then we get the values passed to the WebUINodeFactory constructor.
        assertEquals("Template", name, "Name is not set correctly.");
        assertEquals("./Template.png", icon, "Icon is not set correctly.");
        assertEquals("Short Description", shortDescription, "Short description is not set correctly.");
        assertEquals("Full Description", longDescription, "Long description is not set correctly.");
        assertEquals(NodeType.Sink, nodeType, "Node type is not set correctly.");
        assertEquals("Input Port Description", inputDescription, "Input description is not set correctly.");
        assertEquals("Output Port Description", outputDescription, "Output description is not set correctly.");
    }

    /**
     * Test that the legacy {@link NodeDescription} is created correctly by the WebUINodeFactory static method.
     */
    @Test
    void testCreateStatic() {
        // given the a node description
        final var name = "Node name";
        final var icon = "some/icon path.png";
        final var inPortDescriptions = new PortDescription[]{
            new PortDescription("In1", BufferedDataTable.TYPE_OPTIONAL, "Input port description")};
        final var outPortDescriptions =
            new PortDescription[]{new PortDescription("Out1", BufferedDataTable.TYPE, "Output port description")};
        final var shortDescription = "Short description";
        final var longDescription = "Long description";
        final Class<? extends DefaultNodeSettings> modelSettingsClass = TestWebUINodeModelSettings.class;
        final var viewDescription = "View description";
        final var nodeType = NodeType.Sink;
        final var keywords = new String[]{"keyword1", "keyword2"};

        // when creating a node description via the static constructor
        final var nodeDescription =
            WebUINodeFactory.createNodeDescription(name, icon, inPortDescriptions, outPortDescriptions,
                shortDescription, longDescription, modelSettingsClass, null, viewDescription, nodeType, keywords);

        // then we get the same values back
        assertEquals(name, nodeDescription.getNodeName(), "Name is not set correctly.");
        assertEquals(icon, nodeDescription.getIconPath(), "Icon is not set correctly.");
        assertEquals(shortDescription, nodeDescription.getShortDescription().get(),
            "Short description is not set correctly.");
        assertEquals(longDescription, nodeDescription.getIntro().get(), "Long description is not set correctly.");
        assertEquals(nodeType, nodeDescription.getType(), "Node type is not set correctly.");
        assertEquals(inPortDescriptions[0].getName(), nodeDescription.getInportName(0),
            "Input port name is not set correctly.");
        assertEquals(inPortDescriptions[0].getDescription(), nodeDescription.getInportDescription(0),
            "Input description is not set correctly.");
        assertEquals(outPortDescriptions[0].getName(), nodeDescription.getOutportName(0),
            "Output port name is not set correctly.");
        assertEquals(outPortDescriptions[0].getDescription(), nodeDescription.getOutportDescription(0),
            "Output description is not set correctly.");
        assertEquals("Some Model Setting", nodeDescription.getDialogOptionGroups().get(0).getOptions().get(0).getName(),
            "Option description is not set correctly");
        final var nodeKeywords = nodeDescription.getKeywords();
        assertEquals(keywords.length, nodeKeywords.length, "Number of keywords is not set correctly.");
        for (int i = 0; i < keywords.length; i++) {
            assertEquals(keywords[i], nodeKeywords[i], "Keyword " + i + " is not set correctly.");
        }

    }

    @Test
    void testConfigure() throws InvalidSettingsException {
        // given
        final var factory = new TestWebUINodeFactory();
        final var model = factory.createNodeModel();
        final var testSpecs =
            new DataTableSpec[]{new TableTestUtil.SpecBuilder().addColumn("intCol", IntCell.TYPE).build()};

        // test that no settings are when node unconfigured
        final var nodeSettings = new NodeSettings("test");
        model.saveSettingsTo(nodeSettings);
        assertThat(nodeSettings.getChildCount()).isZero();

        // test that settings are initialized and correctly saved when node is configured
        model.configure(testSpecs);
        model.saveSettingsTo(nodeSettings);
        assertThat(nodeSettings.getChildCount()).isEqualTo(2);

        // test that modified settings are loaded correctly
        final var modelSettings = new TestWebUINodeModelSettings();
        modelSettings.m_someModelSetting = 42;
        final var nodeSettings42 = new NodeSettings("test");
        DefaultNodeSettings.saveSettings(TestWebUINodeModelSettings.class, modelSettings, nodeSettings42);
        model.validateSettings(nodeSettings42);
        model.loadValidatedSettingsFrom(nodeSettings42);
        model.configure(testSpecs);
        model.saveSettingsTo(nodeSettings);
        assertThat(DefaultNodeSettings.loadSettings(nodeSettings, TestWebUINodeModelSettings.class).m_someModelSetting)
            .isEqualTo(42);
    }

    @Test
    void testExecute() throws Exception {
        final var factory = new TestWebUINodeFactory();
        final var model = factory.createNodeModel();
        final var exec = TableTestUtil.getExec();
        final var testSpec = new TableTestUtil.SpecBuilder().addColumn("intCol", IntCell.TYPE).build();
        final var testTable = new TableTestUtil.TableBuilder(testSpec, TableTestUtil::cellify).addRow(1).addRow(2)
            .addRow(3).buildDataTable();

        TableTestUtil.assertTableResults(model.execute(new BufferedDataTable[]{testTable}, exec)[0],
            new String[]{"Integer"}, new Object[][]{{1, 2, 3}});
    }

    @Test
    void testNoopMethods() throws IOException, CanceledExecutionException {
        final var factory = new TestWebUINodeFactory();
        final var model = factory.createNodeModel();
        final var exec = TableTestUtil.getExec();
        final var file = new File(".");

        assertThat(factory.getNrNodeViews()).isZero();
        assertThat(factory.createNodeView(0, model)).isNull();
        assertThat(factory.hasDialog()).isTrue();

        model.saveInternals(file, exec);
        model.loadInternals(file, exec);
        model.reset();
    }

    static final class TestDynamicPortsNodeModel extends NodeModel {

        TestDynamicPortsNodeModel(final PortsConfiguration portsConfiguration) {
            super(portsConfiguration.getInputPorts(), portsConfiguration.getOutputPorts());
        }

        @Override
        protected PortObjectSpec[] configure(final PortObjectSpec[] inSpecs) {
            return new PortObjectSpec[0];
        }

        @Override
        protected PortObject[] execute(final PortObject[] inObjects, final ExecutionContext exec) {
            return new PortObject[0];
        }

        @Override
        protected void loadInternals(final File nodeInternDir, final ExecutionMonitor exec) {
            // nothing to do
        }

        @Override
        protected void saveInternals(final File nodeInternDir, final ExecutionMonitor exec) {
            // nothing to do
        }

        @Override
        protected void saveSettingsTo(final NodeSettingsWO settings) {
            // nothing to do
        }

        @Override
        protected void validateSettings(final NodeSettingsRO settings) {
            // nothing to do
        }

        @Override
        protected void loadValidatedSettingsFrom(final NodeSettingsRO settings) {
            // nothing to do
        }

        @Override
        protected void reset() {
            // nothing to do
        }
    }

    static final class TestDynamicPortsNodeFactory extends ConfigurableNodeFactory<TestDynamicPortsNodeModel>
        implements NodeDialogFactory {

        private static final String INPUT_PORT_GROUP_1 = "Foo";

        private static final String INPUT_PORT_GROUP_2 = "Bar";

        private static final String OUTPUT_PORT_GROUP = "Baz";

        private static WebUINodeConfiguration CONFIGURATION = WebUINodeConfiguration.builder()//
            .name("Template")//
            .icon("./Template.png")//
            .shortDescription("Short Description")//
            .fullDescription("Full Description")//
            .modelSettingsClass(TestWebUINodeModelSettings.class)//
            .addInputTable(INPUT_PORT_GROUP_1, "Input Port Group 1 Description", true)//
            .addInputTable(INPUT_PORT_GROUP_2, "Input Port Group 2 Description", true)//
            .addOutputTable(OUTPUT_PORT_GROUP, "Output Port Group Description", true)//
            .build();

        @Override
        public TestDynamicPortsNodeModel createNodeModel(final NodeCreationConfiguration creationConfig) {
            return new TestDynamicPortsNodeModel(creationConfig.getPortConfig().orElseThrow());
        }

        @Override
        protected NodeDescription createNodeDescription() {
            return WebUINodeFactory.createNodeDescription(CONFIGURATION);
        }

        @Override
        public NodeDialog createNodeDialog() {
            return new DefaultNodeDialog(SettingsType.MODEL, TestWebUINodeModelSettings.class);
        }

        @Override
        protected Optional<PortsConfigurationBuilder> createPortsConfigBuilder() {
            final var builder = new PortsConfigurationBuilder();
            builder.addOptionalInputPortGroup(INPUT_PORT_GROUP_1, BufferedDataTable.TYPE);
            builder.addNonInteractiveExtendableInputPortGroup(INPUT_PORT_GROUP_2, BufferedDataTable.TYPE::equals);
            builder.addNonInteractiveExtendableOutputPortGroup(OUTPUT_PORT_GROUP, BufferedDataTable.TYPE::equals);
            return Optional.of(builder);
        }

        @Override
        protected NodeDialogPane createNodeDialogPane(final NodeCreationConfiguration creationConfig) {
            return null;
        }

        @Override
        protected int getNrNodeViews() {
            return 0;
        }

        @Override
        public NodeView<TestDynamicPortsNodeModel> createNodeView(final int viewIndex,
            final TestDynamicPortsNodeModel nodeModel) {
            return null;
        }

        @Override
        protected boolean hasDialog() {
            return false;
        }
    }

    @Test
    void testNodeDescriptionWithDynamicPorts() throws SAXException, IOException, XmlException {
        final var factory = new TestDynamicPortsNodeFactory();
        final var nodeDescription = factory.createNodeDescription();
        final var dynamicInputPortGroups = nodeDescription.getDynamicInPortGroups();
        final var inputPortGroup1 = dynamicInputPortGroups.get(0);
        final var inputPortGroup2 = dynamicInputPortGroups.get(1);
        final var outputPortGroup = nodeDescription.getDynamicOutPortGroups().get(0);

        assertEquals(TestDynamicPortsNodeFactory.INPUT_PORT_GROUP_1, inputPortGroup1.getGroupIdentifier(),
            "Input Port Group 1 identifier is not set correctly.");
        assertEquals(TestDynamicPortsNodeFactory.INPUT_PORT_GROUP_1, inputPortGroup1.getGroupName(),
            "Input Port Group 1 name is not set correctly.");
        assertEquals("Input Port Group 1 Description", inputPortGroup1.getGroupDescription(),
            "Input Port Group 1 description is not set correctly.");

        assertEquals(TestDynamicPortsNodeFactory.INPUT_PORT_GROUP_2, inputPortGroup2.getGroupIdentifier(),
            "Input Port Group 2 identifier is not set correctly.");
        assertEquals(TestDynamicPortsNodeFactory.INPUT_PORT_GROUP_2, inputPortGroup2.getGroupName(),
            "Input Port Group 2 name is not set correctly.");
        assertEquals("Input Port Group 2 Description", inputPortGroup2.getGroupDescription(),
            "Input Port Group 2 description is not set correctly.");

        assertEquals(TestDynamicPortsNodeFactory.OUTPUT_PORT_GROUP, outputPortGroup.getGroupIdentifier(),
            "Output Port Group identifier is not set correctly.");
        assertEquals(TestDynamicPortsNodeFactory.OUTPUT_PORT_GROUP, outputPortGroup.getGroupName(),
            "Output Port Group name is not set correctly.");
        assertEquals("Output Port Group Description", outputPortGroup.getGroupDescription(),
            "Output Port Group description is not set correctly.");
    }

}
