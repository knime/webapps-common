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
 *   Oct 4, 2021 (hornm): created
 */
package org.knime.core.node.wizard.page;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatExceptionOfType;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.knime.core.node.port.PortType;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.node.workflow.NodeContainer;
import org.knime.core.node.workflow.NodeID;
import org.knime.core.node.workflow.NodeID.NodeIDSuffix;
import org.knime.core.node.workflow.SubNodeContainer;
import org.knime.core.node.workflow.WorkflowAnnotationID;
import org.knime.core.node.workflow.WorkflowLock;
import org.knime.core.node.workflow.WorkflowManager;
import org.knime.core.util.Pair;
import org.knime.testing.node.view.NodeViewNodeFactory;
import org.knime.testing.util.WorkflowManagerUtil;

/**
 * Tests {@link WizardPageUtil}.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
// NOTE on the class name:
// This class actually tests class which lives in org.knime.core (knime-core repo) because the test requires
// core-ui classes which aren't available there and can't be made available due to circular dependencies.
// And it seems that this test can't be named exactly after the 'placeholder-test' in org.knime.core.tests
// (this test won't execute). Hence the trailing '2'.
@SuppressWarnings("java:S2698") // we accept assertions without messages
class WizardPageUtilTest2 {

    private WorkflowManager m_wfm;

    @BeforeEach
    void createEmptyWorkflow() throws IOException {
        m_wfm = WorkflowManagerUtil.createEmptyWorkflow();
    }

    /**
     * Tests {@link WizardPageUtil#isWizardPage(WorkflowManager, NodeID)}.
     */
    @Test
    void testIsWizardPage() {

        NodeID nonExistentNode = new NodeID(4).createChild(5);
        assertThat(WizardPageUtil.isWizardPage(m_wfm, nonExistentNode)).isFalse();

        NodeID metanode = m_wfm.createAndAddSubWorkflow(new PortType[0], new PortType[0], "metanode").getID();
        assertThat(WizardPageUtil.isWizardPage(m_wfm, metanode)).isFalse();

        m_wfm.convertMetaNodeToSubNode(metanode);
        NodeID emptyComponent = metanode;
        assertThat(WizardPageUtil.isWizardPage(m_wfm, emptyComponent)).isFalse();

        SubNodeContainer component = (SubNodeContainer)m_wfm.getNodeContainer(emptyComponent);
        WorkflowManagerUtil.createAndAddNode(component.getWorkflowManager(), new WizardNodeFactory());
        NodeID componentWithWizardNode = emptyComponent;
        assertThat(WizardPageUtil.isWizardPage(m_wfm, componentWithWizardNode)).isTrue();

        NodeID componentWithNodeViewNode = m_wfm.collapseIntoMetaNode(
            new NodeID[]{WorkflowManagerUtil.createAndAddNode(m_wfm, new NodeViewNodeFactory(0, 0)).getID()},
            new WorkflowAnnotationID[0], "component").getCollapsedMetanodeID();
        m_wfm.convertMetaNodeToSubNode(componentWithNodeViewNode);
        assertThat(WizardPageUtil.isWizardPage(m_wfm, componentWithNodeViewNode)).isTrue();

        NodeID componentWithAComponentWithNodeView = m_wfm.collapseIntoMetaNode(new NodeID[]{componentWithNodeViewNode},
            new WorkflowAnnotationID[0], "component of a component").getCollapsedMetanodeID();
        m_wfm.convertMetaNodeToSubNode(componentWithAComponentWithNodeView);
        assertThat(WizardPageUtil.isWizardPage(m_wfm, componentWithAComponentWithNodeView)).isTrue();
    }

    /**
     * Tests {@link WizardPageUtil#getWizardPageNodes(WorkflowManager)} etc.
     */
    @Test
    void testGetWizardPageNodes() {
        NodeID componentWithNodeViewNode = m_wfm.collapseIntoMetaNode(
            new NodeID[]{WorkflowManagerUtil.createAndAddNode(m_wfm, new NodeViewNodeFactory(0, 0)).getID()},
            new WorkflowAnnotationID[0], "component").getCollapsedMetanodeID();
        m_wfm.convertMetaNodeToSubNode(componentWithNodeViewNode);
        WorkflowManager componentWfm =
            ((SubNodeContainer)m_wfm.getNodeContainer(componentWithNodeViewNode)).getWorkflowManager();
        List<NativeNodeContainer> wizardPageNodes = WizardPageUtil.getWizardPageNodes(componentWfm);
        assertThat(wizardPageNodes).hasSize(1);
        assertThat(wizardPageNodes.get(0).getName()).isEqualTo("NodeView");

        NodeID componentWithAComponentWithNodeView = m_wfm.collapseIntoMetaNode(new NodeID[]{componentWithNodeViewNode},
            new WorkflowAnnotationID[0], "component of a component").getCollapsedMetanodeID();
        m_wfm.convertMetaNodeToSubNode(componentWithAComponentWithNodeView);
        componentWfm =
            ((SubNodeContainer)m_wfm.getNodeContainer(componentWithAComponentWithNodeView)).getWorkflowManager();
        wizardPageNodes = WizardPageUtil.getWizardPageNodes(componentWfm);
        assertThat(wizardPageNodes).isEmpty();
        wizardPageNodes = WizardPageUtil.getWizardPageNodes(componentWfm, false);
        assertThat(wizardPageNodes).isEmpty();
        wizardPageNodes = WizardPageUtil.getWizardPageNodes(componentWfm, true);
        assertThat(wizardPageNodes).hasSize(1);
        assertThat(wizardPageNodes.get(0).getName()).isEqualTo("NodeView");

        NodeID componentWithNodeWizardNode = m_wfm.collapseIntoMetaNode(
            new NodeID[]{WorkflowManagerUtil.createAndAddNode(m_wfm, new WizardNodeFactory()).getID()},
            new WorkflowAnnotationID[0], "component").getCollapsedMetanodeID();
        m_wfm.convertMetaNodeToSubNode(componentWithNodeWizardNode);
        componentWfm = ((SubNodeContainer)m_wfm.getNodeContainer(componentWithNodeWizardNode)).getWorkflowManager();
        wizardPageNodes = WizardPageUtil.getWizardPageNodes(componentWfm);
        assertThat(wizardPageNodes).hasSize(1);
        assertThat(wizardPageNodes.get(0).getName()).isEqualTo("Wizard");

        // test that wizard-nodes in metanodes are ignored
        NodeID metanodeWithNodeViewNode = m_wfm.collapseIntoMetaNode(
            new NodeID[]{WorkflowManagerUtil.createAndAddNode(m_wfm, new NodeViewNodeFactory(0, 0)).getID()},
            new WorkflowAnnotationID[0], "metanode").getCollapsedMetanodeID();
        NodeID componentWithNodeViewAndMetanode = m_wfm.collapseIntoMetaNode(
            new NodeID[]{WorkflowManagerUtil.createAndAddNode(m_wfm, new NodeViewNodeFactory(0, 0)).getID(),
                metanodeWithNodeViewNode},
            new WorkflowAnnotationID[0], "component").getCollapsedMetanodeID();
        m_wfm.convertMetaNodeToSubNode(componentWithNodeViewAndMetanode);
        componentWfm =
            ((SubNodeContainer)m_wfm.getNodeContainer(componentWithNodeViewAndMetanode)).getWorkflowManager();

        wizardPageNodes = WizardPageUtil.getWizardPageNodes(componentWfm);
        assertThat(wizardPageNodes).hasSize(1);
        assertThat(wizardPageNodes.get(0).getName()).isEqualTo("NodeView");

    }

    /**
     * Tests {@link WizardPageUtil#getAllWizardPageNodes(WorkflowManager, boolean)}.
     */
    @Test
    void testGetAllWizardPageNodes() {
        NodeID n1 = WorkflowManagerUtil.createAndAddNode(m_wfm, new NodeViewNodeFactory(0, 0)).getID();
        NodeID n2 = WorkflowManagerUtil.createAndAddNode(m_wfm, new WizardNodeFactory()).getID();

        NodeID component = m_wfm.collapseIntoMetaNode(new NodeID[]{n1, n2}, new WorkflowAnnotationID[0], "component")
            .getCollapsedMetanodeID();
        m_wfm.convertMetaNodeToSubNode(component);
        WorkflowManager componentWfm = ((SubNodeContainer)m_wfm.getNodeContainer(component)).getWorkflowManager();

        List<NativeNodeContainer> wizardPageNodes = WizardPageUtil.getAllWizardPageNodes(componentWfm, false);
        assertThat(wizardPageNodes).hasSize(2);

        WizardNodeModel wnm =
            (WizardNodeModel)((NativeNodeContainer)m_wfm.findNodeContainer(component.createChild(0).createChild(2)))
                .getNodeModel();
        wnm.setHideInWizard(true);

        wizardPageNodes = WizardPageUtil.getAllWizardPageNodes(componentWfm, false);
        assertThat(wizardPageNodes).hasSize(2);

        wizardPageNodes = WizardPageUtil.getWizardPageNodes(componentWfm);
        assertThat(wizardPageNodes).hasSize(1);
    }

    /**
     * Tests {@link WizardPageUtil#createWizardPage(WorkflowManager, NodeID)}.
     */
    @Test
    void testCreateWizardPage() {
        NodeID n1 = WorkflowManagerUtil.createAndAddNode(m_wfm, new NodeViewNodeFactory(0, 0)).getID();
        NodeID n2 = WorkflowManagerUtil.createAndAddNode(m_wfm, new NodeViewNodeFactory(0, 0)).getID();

        try (WorkflowLock lock = m_wfm.lock()) {
            assertThatExceptionOfType(IllegalArgumentException.class)
                .isThrownBy(() -> WizardPageUtil.createWizardPage(m_wfm, n1));
        }

        NodeID component = m_wfm.collapseIntoMetaNode(new NodeID[]{n1}, new WorkflowAnnotationID[0], "component")
            .getCollapsedMetanodeID();
        m_wfm.convertMetaNodeToSubNode(component);
        component = m_wfm.collapseIntoMetaNode(new NodeID[]{component, n2}, new WorkflowAnnotationID[0], "component")
            .getCollapsedMetanodeID();
        m_wfm.convertMetaNodeToSubNode(component);

        WizardPage wizardPage;
        try (WorkflowLock lock = m_wfm.lock()) {
            wizardPage = WizardPageUtil.createWizardPage(m_wfm, component);
        }
        assertThat(wizardPage.getPageNodeID()).isEqualTo(component);
        assertThat(wizardPage.getPageMap()).hasSize(2);
        assertThat(wizardPage.getPageMap().keySet()).containsExactlyInAnyOrder(NodeIDSuffix.fromString("4:0:2"),
            NodeIDSuffix.fromString("4:0:3:0:1"));
        assertThat(wizardPage.getPageMap().values().stream().map(n -> n.getName()).collect(Collectors.toList()))
            .containsExactlyInAnyOrder("NodeView", "NodeView");
    }

    /**
     * Tests {@link WizardPageUtil#getSuccessorWizardPageNodesWithinComponent(WorkflowManager, NodeID, NodeID)}.
     */
    @Test
    void testGetSuccessorWizardPageNodesWithinComponent() {

        // top-level component
        NodeID n1 = WorkflowManagerUtil.createAndAddNode(m_wfm, new NodeViewNodeFactory(0, 0)).getID();
        NodeID n2 = WorkflowManagerUtil.createAndAddNode(m_wfm, new WizardNodeFactory()).getID();
        NodeID component = m_wfm.collapseIntoMetaNode(new NodeID[]{n1, n2}, new WorkflowAnnotationID[0], "component")
            .getCollapsedMetanodeID();
        m_wfm.convertMetaNodeToSubNode(component);
        var componentWfm = ((SubNodeContainer) m_wfm.getNodeContainer(component)).getWorkflowManager();
        n1 = componentWfm.getID().createChild(n1.getIndex());
        n2 = componentWfm.getID().createChild(n2.getIndex());

        // nested component
        NodeID n3 = WorkflowManagerUtil.createAndAddNode(componentWfm, new NodeViewNodeFactory(0, 0)).getID();
        NodeID n4 = WorkflowManagerUtil.createAndAddNode(componentWfm, new WizardNodeFactory()).getID();
        componentWfm.addConnection(n1, 0, n3, 0);
        componentWfm.addConnection(n1, 0, n4, 0);
        NodeID nestedComponent =
            componentWfm.collapseIntoMetaNode(new NodeID[]{n3, n4}, new WorkflowAnnotationID[0], "nested component")
                .getCollapsedMetanodeID();
        componentWfm.convertMetaNodeToSubNode(nestedComponent);
        var nestedComponentWfm =
            ((SubNodeContainer)componentWfm.getNodeContainer(nestedComponent)).getWorkflowManager();
        n3 = nestedComponentWfm.getID().createChild(n3.getIndex());
        n4 = nestedComponentWfm.getID().createChild(n4.getIndex());

        // nested metanode
        NodeID n5 = WorkflowManagerUtil.createAndAddNode(componentWfm, new NodeViewNodeFactory(0, 0)).getID();
        NodeID n6 = WorkflowManagerUtil.createAndAddNode(componentWfm, new WizardNodeFactory()).getID();
        componentWfm.addConnection(n2, 0, n5, 0);
        componentWfm.addConnection(n2, 0, n6, 0);
        componentWfm.collapseIntoMetaNode(new NodeID[]{n5, n6}, new WorkflowAnnotationID[0], "nested metanode")
            .getCollapsedMetanodeID();

        // double nested component
        NodeID n7 = WorkflowManagerUtil.createAndAddNode(nestedComponentWfm, new NodeViewNodeFactory(0, 0)).getID();
        NodeID n8 = WorkflowManagerUtil.createAndAddNode(nestedComponentWfm, new WizardNodeFactory()).getID();
        NodeID doubleNestedComponent = nestedComponentWfm
            .collapseIntoMetaNode(new NodeID[]{n7, n8}, new WorkflowAnnotationID[0], "double nested component")
            .getCollapsedMetanodeID();
        nestedComponentWfm.convertMetaNodeToSubNode(doubleNestedComponent);
        var doubleNestedComponentWfm =
            ((SubNodeContainer)nestedComponentWfm.getNodeContainer(doubleNestedComponent)).getWorkflowManager();
        n7 = doubleNestedComponentWfm.getID().createChild(n7.getIndex());
        n8 = doubleNestedComponentWfm.getID().createChild(n8.getIndex());

        // the actual tests

        var nodes = WizardPageUtil.getSuccessorWizardPageNodesWithinComponent(m_wfm, component, n1)
            .map(Pair::getSecond).map(NodeContainer::getID).collect(Collectors.toList());
        assertThat(nodes).containsExactlyInAnyOrder(n1, n3, n4, n7, n8);

        nodes = WizardPageUtil.getSuccessorWizardPageNodesWithinComponent(m_wfm, component, n2).map(Pair::getSecond)
            .map(NodeContainer::getID).collect(Collectors.toList());
        assertThat(nodes).containsExactly(n2);

    }

    @AfterEach
    void disposeWorkflow() {
        WorkflowManagerUtil.disposeWorkflow(m_wfm);
    }

}
