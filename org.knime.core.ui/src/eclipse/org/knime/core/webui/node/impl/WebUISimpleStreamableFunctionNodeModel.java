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
 *   23 Jan 2024 (albrecht): created
 */
package org.knime.core.webui.node.impl;

import java.io.File;
import java.io.IOException;

import org.knime.core.data.DataTableSpec;
import org.knime.core.data.container.ColumnRearranger;
import org.knime.core.node.CanceledExecutionException;
import org.knime.core.node.ExecutionMonitor;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeModel;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.node.streamable.simple.SimpleStreamableFunctionNodeModel;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;

/**
 * The {@link NodeModel} for simple streamable WebUI nodes, see {@link WebUINodeFactory} and
 * {@link SimpleStreamableFunctionNodeModel}.
 *
 * @param <S> the type of model settings
 *
 * @author Christian Albrecht, KNIME GmbH, Konstanz
 * @since 5.3
 */
public abstract class WebUISimpleStreamableFunctionNodeModel<S extends DefaultNodeSettings>
    extends SimpleStreamableFunctionNodeModel {

    private S m_modelSettings;

    private final Class<S> m_modelSettingsClass;

    /**
     * @param configuration the {@link WebUINodeConfiguration} for this factory
     * @param modelSettingsClass the type of the model settings for this node
     */
    protected WebUISimpleStreamableFunctionNodeModel(final WebUINodeConfiguration configuration,
        final Class<S> modelSettingsClass) {
        super();
        m_modelSettingsClass = modelSettingsClass;
    }

    /**
     * @param configuration the {@link WebUINodeConfiguration} for this factory
     * @param modelSettingsClass the type of the model settings for this node
     * @param streamableInPortIdx the index of the port that is streamable. All the others are assumed as neither
     *            streamable nor distributable.
     * @param streamableOutPortIdx the index of the port that is streamable. All the others are assumed as neither
     *            streamable nor distributable.
     */
    protected WebUISimpleStreamableFunctionNodeModel(final WebUINodeConfiguration configuration,
        final Class<S> modelSettingsClass, final int streamableInPortIdx, final int streamableOutPortIdx) {
        super(configuration.getInputPortTypes(), configuration.getOutputPortTypes(), streamableInPortIdx,
            streamableOutPortIdx);
        m_modelSettingsClass = modelSettingsClass;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    protected ColumnRearranger createColumnRearranger(final DataTableSpec spec) throws InvalidSettingsException {
        if (m_modelSettings == null) {
            m_modelSettings = DefaultNodeSettings.createSettings(m_modelSettingsClass, new PortObjectSpec[]{spec});
        }
        return createColumnRearranger(spec, m_modelSettings);
    }

    /**
     * Creates a column rearranger that describes the changes to the input table. Sub classes will check the consistency
     * of the input table with their settings (fail with {@link InvalidSettingsException} if necessary) and then return
     * a customized {@link ColumnRearranger}.
     *
     * @param spec The spec of the input table.
     * @param modelSettings the current model settings
     * @return A column rearranger describing the changes, never null.
     * @throws InvalidSettingsException If the settings or the input are invalid.
     */
    protected abstract ColumnRearranger createColumnRearranger(final DataTableSpec spec, final S modelSettings)
        throws InvalidSettingsException;

    @Override
    protected void loadInternals(final File nodeInternDir, final ExecutionMonitor exec)
        throws IOException, CanceledExecutionException {
        //
    }


    @Override
    protected void saveInternals(final File nodeInternDir, final ExecutionMonitor exec)
        throws IOException, CanceledExecutionException {
        //
    }

    @Override
    protected final void saveSettingsTo(final NodeSettingsWO settings) {
        if (m_modelSettings != null) {
            DefaultNodeSettings.saveSettings(m_modelSettingsClass, m_modelSettings, settings);
        }
    }

    @Override
    protected final void validateSettings(final NodeSettingsRO settings) throws InvalidSettingsException {
        validateSettings(DefaultNodeSettings.loadSettings(settings, m_modelSettingsClass));
    }

    /**
     * Allows extending classes to validate the settings before they are loaded into the NodeModel.
     *
     * @param settings to validate
     * @throws InvalidSettingsException if the settings are invalid
     */
    protected void validateSettings(final S settings) throws InvalidSettingsException {
        // hook that can be overwritten by extending classes
    }

    @Override
    protected final void loadValidatedSettingsFrom(final NodeSettingsRO settings) throws InvalidSettingsException {
        m_modelSettings = DefaultNodeSettings.loadSettings(settings, m_modelSettingsClass);
    }

    @Override
    protected void reset() {
        //
    }

}
