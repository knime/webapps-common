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
 *   Apr 9, 2024 (hornm): created
 */
package org.knime.core.webui.data.util;

import static org.assertj.core.api.Assertions.assertThat;

import java.io.File;
import java.io.IOException;

import org.junit.jupiter.api.Test;
import org.knime.core.data.DataTableSpec;
import org.knime.core.node.BufferedDataTable;
import org.knime.core.node.CanceledExecutionException;
import org.knime.core.node.ExecutionContext;
import org.knime.core.node.ExecutionMonitor;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeDialogPane;
import org.knime.core.node.NodeFactory;
import org.knime.core.node.NodeModel;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.NodeView;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.node.port.inactive.InactiveBranchPortObjectSpec;
import org.knime.testing.util.WorkflowManagerUtil;

/**
 * Tests for {@link InputSpecUtil}.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
class InputSpecUtilTest {

    @Test
    void testGetInputSpecsExcludingVariablePortWithInactiveBranchPortObjectSpecs() throws IOException {
        var wfm = WorkflowManagerUtil.createEmptyWorkflow();
        var nc = WorkflowManagerUtil.createAndAddNode(wfm, new TestNodeFactory(new PortObjectSpec[0],
            new PortObjectSpec[]{new DataTableSpec("test"), InactiveBranchPortObjectSpec.INSTANCE}));
        var nc2 = WorkflowManagerUtil.createAndAddNode(wfm,
            new TestNodeFactory(new PortObjectSpec[]{new DataTableSpec(), new DataTableSpec()}, new PortObjectSpec[0]));
        wfm.addConnection(nc.getID(), 1, nc2.getID(), 1);
        wfm.addConnection(nc.getID(), 2, nc2.getID(), 2);
        var specs = InputSpecUtil.getInputSpecsExcludingVariablePort(nc2);
        assertThat(specs).isEqualTo(new PortObjectSpec[]{new DataTableSpec("test"), null});
    }

    class TestNodeFactory extends NodeFactory<NodeModel> {

        private final PortObjectSpec[] m_inSpecs;

        private final PortObjectSpec[] m_outSpecs;

        TestNodeFactory(final PortObjectSpec[] inSpecs, final PortObjectSpec[] outSpecs) {
            m_inSpecs = inSpecs;
            m_outSpecs = outSpecs;
        }

        @Override
        public NodeModel createNodeModel() {
            return new NodeModel(m_inSpecs.length, m_outSpecs.length) {

                @Override
                protected PortObjectSpec[] configure(final PortObjectSpec[] inSpecs) throws InvalidSettingsException {
                    return m_outSpecs;
                }

                @Override
                protected BufferedDataTable[] execute(final BufferedDataTable[] inData, final ExecutionContext exec)
                    throws Exception {
                    return new BufferedDataTable[m_outSpecs.length];
                }

                @Override
                protected void validateSettings(final NodeSettingsRO settings) throws InvalidSettingsException {
                    //
                }

                @Override
                protected void saveSettingsTo(final NodeSettingsWO settings) {
                    //
                }

                @Override
                protected void saveInternals(final File nodeInternDir, final ExecutionMonitor exec)
                    throws IOException, CanceledExecutionException {
                    //
                }

                @Override
                protected void reset() {
                    //
                }

                @Override
                protected void loadValidatedSettingsFrom(final NodeSettingsRO settings)
                    throws InvalidSettingsException {
                    //
                }

                @Override
                protected void loadInternals(final File nodeInternDir, final ExecutionMonitor exec)
                    throws IOException, CanceledExecutionException {
                    //
                }
            };
        }

        @Override
        protected int getNrNodeViews() {
            return 0;
        }

        @Override
        public NodeView<NodeModel> createNodeView(final int viewIndex, final NodeModel nodeModel) {
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

    }

}
