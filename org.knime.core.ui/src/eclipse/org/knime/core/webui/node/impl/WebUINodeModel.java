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

import java.io.File;
import java.io.IOException;
import java.util.stream.Stream;

import org.apache.commons.lang3.NotImplementedException;
import org.knime.core.data.DataTableSpec;
import org.knime.core.node.BufferedDataTable;
import org.knime.core.node.CanceledExecutionException;
import org.knime.core.node.ExecutionContext;
import org.knime.core.node.ExecutionMonitor;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeModel;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.port.PortObject;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;

/**
 * The {@link NodeModel} for simple WebUI nodes, see {@link WebUINodeFactory}.
 *
 * @param <S> the type of model settings
 *
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
public abstract class WebUINodeModel<S extends DefaultNodeSettings> extends NodeModel {

    private S m_modelSettings;

    private final Class<S> m_modelSettingsClass;

    /**
     * @param configuration the {@link WebUINodeConfiguration} for this factory
     * @param modelSettingsClass the type of the model settings for this node
     */
    protected WebUINodeModel(final WebUINodeConfiguration configuration, final Class<S> modelSettingsClass) {
        super(configuration.getInputPortTypes(), configuration.getOutputPortTypes());
        m_modelSettingsClass = modelSettingsClass;
    }

    @Override
    protected final PortObjectSpec[] configure(final PortObjectSpec[] inSpecs) throws InvalidSettingsException {
        if (m_modelSettings == null) {
            m_modelSettings = DefaultNodeSettings.createSettings(m_modelSettingsClass, inSpecs);
        }
        return configure(inSpecs, m_modelSettings);
    }

    @Override
    protected final DataTableSpec[] configure(final DataTableSpec[] inSpecs) throws InvalidSettingsException {
        if (m_modelSettings == null) {
            m_modelSettings = DefaultNodeSettings.createSettings(m_modelSettingsClass, inSpecs);
        }
        return configure(inSpecs, m_modelSettings);
    }

    /**
     * @param inSpecs the input {@link PortObjectSpec PortObjectSpecs}
     * @param modelSettings the current model settings
     * @return the output {@link PortObjectSpec PortObjectSpecs}
     * @throws InvalidSettingsException if the settings are inconsistent with the input specs
     * @see NodeModel#configure(PortObjectSpec[])
     */
    protected PortObjectSpec[] configure(final PortObjectSpec[] inSpecs, final S modelSettings)
        throws InvalidSettingsException {
        var tableSpecs = Stream.of(inSpecs).map(DataTableSpec.class::cast).toArray(DataTableSpec[]::new);
        return configure(tableSpecs, modelSettings);
    }

    /**
     * @param inSpecs the input {@link DataTableSpec DataTableSpecs}
     * @param modelSettings the current model settings
     * @return the output {@link DataTableSpec DataTableSpecs}
     * @throws InvalidSettingsException if the settings are inconsistent with the input specs
     * @see NodeModel#configure(DataTableSpec[])
     */
    protected DataTableSpec[] configure(final DataTableSpec[] inSpecs, final S modelSettings)
        throws InvalidSettingsException {
        throw new NotImplementedException("NodeModel.configure() implementation missing!");
    }

    @Override
    protected PortObject[] execute(final PortObject[] inObjects, final ExecutionContext exec) throws Exception {
        return execute(inObjects, exec, m_modelSettings);
    }

    @Override
    protected BufferedDataTable[] execute(final BufferedDataTable[] inObjects, final ExecutionContext exec)
        throws Exception {
        return execute(inObjects, exec, m_modelSettings);
    }

    /**
     * @param inObjects the input {@link PortObject PortObjects}
     * @param exec the current {@link ExecutionContext}
     * @param modelSettings the current model settings
     * @return the output {@link PortObject PortObjects}
     * @throws Exception if anything goes wrong during the execution
     * @see NodeModel#execute(PortObject[], ExecutionContext)
     */
    protected PortObject[] execute(final PortObject[] inObjects, final ExecutionContext exec, final S modelSettings)
        throws Exception {
        var tables = Stream.of(inObjects).map(BufferedDataTable.class::cast).toArray(BufferedDataTable[]::new);
        return execute(tables, exec, modelSettings);
    }

    /**
     * @param inData the input {@link BufferedDataTable BufferedDataTables}
     * @param exec the current {@link ExecutionContext}
     * @param modelSettings the current model settings
     * @return the output {@link BufferedDataTable BufferedDataTables}
     * @throws Exception if anything goes wrong during the execution
     * @see NodeModel#execute(BufferedDataTable[], ExecutionContext)
     */
    protected BufferedDataTable[] execute(final BufferedDataTable[] inData, final ExecutionContext exec,
        final S modelSettings) throws Exception {//NOSONAR
        throw new NotImplementedException("NodeModel.execute() implementation missing!");
    }

    @Override
    protected final void loadInternals(final File nodeInternDir, final ExecutionMonitor exec)
        throws IOException, CanceledExecutionException {

        onLoadInternals(nodeInternDir, exec);
    }

    /**
     * Allows extending classes to implement custom behavior during {@link #loadInternals(File, ExecutionMonitor)}o
     *
     * @param nodeInternDir
     * @param exec
     * @throws IOException
     * @throws CanceledExecutionException
     */
    protected void onLoadInternals(final File nodeInternDir, final ExecutionMonitor exec)
        throws IOException, CanceledExecutionException {
    }

    @Override
    protected final void saveInternals(final File nodeInternDir, final ExecutionMonitor exec)
        throws IOException, CanceledExecutionException {

        onSaveInternals(nodeInternDir, exec);
    }

    /**
     * Allows extending classes to implement custom behavior during {@link #saveInternals(File, ExecutionMonitor)}o
     *
     * @param nodeInternDir
     * @param exec
     * @throws IOException
     * @throws CanceledExecutionException
     */
    protected void onSaveInternals(final File nodeInternDir, final ExecutionMonitor exec)
        throws IOException, CanceledExecutionException {
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
    protected final void reset() {
        onReset();
    }

    /**
     * Allows extending classes to implement custom behavior during {@link #reset()}.
     */
    protected void onReset() {
    }
}
