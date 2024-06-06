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
 */
package org.knime.core.webui.node.dialog.internal;

import static org.knime.core.webui.node.dialog.internal.VariableSettings.addExposedVariableTo;
import static org.knime.core.webui.node.dialog.internal.VariableSettings.addUsedVariableTo;
import static org.knime.core.webui.node.dialog.internal.VariableSettings.getExposedVariableFrom;
import static org.knime.core.webui.node.dialog.internal.VariableSettings.getOrCreateSubSettings;
import static org.knime.core.webui.node.dialog.internal.VariableSettings.getUsedVariableFrom;
import static org.knime.core.webui.node.dialog.internal.VariableSettings.isVariableSettings;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.webui.node.dialog.VariableSettingsRO;
import org.knime.core.webui.node.dialog.VariableSettingsWO;

/**
 * Allows for creating a variables tree without an underlying settings tree. This is used when saving settings from the
 * dialog.
 *
 * @author Paul Bärnreuther
 */
public final class InternalVariableSettings implements VariableSettingsWO, VariableSettingsRO {

    private final NodeSettings m_variableSettings;

    /**
     * Internal use only
     */
    public InternalVariableSettings() {
        this(new NodeSettings("root"));
    }

    private InternalVariableSettings(final NodeSettings variableSettings) {
        m_variableSettings = variableSettings;
    }

    @Override
    public Iterable<String> getVariableSettingsIterable() {
        return m_variableSettings::iterator;
    }

    @Override
    public boolean isVariableSetting(final String key) {
        return isVariableSettings(m_variableSettings, key);
    }

    @Override
    public VariableSettingsRO getVariableSettings(final String key) throws InvalidSettingsException {
        return new InternalVariableSettings(m_variableSettings.getNodeSettings(key));
    }

    @Override
    public VariableSettingsWO getOrCreateVariableSettings(final String key) throws InvalidSettingsException {
        return new InternalVariableSettings(getOrCreate(key));
    }

    @Override
    public String getUsedVariable(final String key) throws InvalidSettingsException {
        return getUsedVariableFrom(key, m_variableSettings);
    }

    @Override
    public void addUsedVariable(final String settingsKey, final String usedVariable,
        final boolean isControllingFlowVariableFlawed) throws InvalidSettingsException {
        addUsedVariableTo(usedVariable, isControllingFlowVariableFlawed, getOrCreate(settingsKey));
    }

    @Override
    public String getExposedVariable(final String key) throws InvalidSettingsException {
        return getExposedVariableFrom(m_variableSettings, key);
    }

    @Override
    public void addExposedVariable(final String settingsKey, final String exposedVariable)
        throws InvalidSettingsException {
        addExposedVariableTo(exposedVariable, getOrCreate(settingsKey));
    }

    private NodeSettings getOrCreate(final String key) {
        return getOrCreateSubSettings(m_variableSettings, key);
    }

}
