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
 *   Oct 24, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.dataservice;

import java.util.Collection;
import java.util.LinkedList;
import java.util.Map;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.webui.node.dialog.internal.VariableSettings;

import com.fasterxml.jackson.core.JsonProcessingException;

/**
 * An instance of this interface is used as a named RPCDataService for calls regarding flow variables.
 *
 * @author Paul Bärnreuther
 */
interface FlowVariableDataService {

    /**
     * @param name the name of the flow variable
     * @param value an abbreviated string representation of the variables value
     * @param abbreviated whether the value is the actual value or was abbreviated
     */
    record PossibleFlowVariable(String name, String value, boolean abbreviated) {
    }

    /**
     * @param textSettings the state of the settings in JSON format for which the available flow variables are to be
     *            fetched
     * @param persistPath the path leading to the setting as it is stored in the node settings, i.e. including its
     *            settings type ("view" or "model") and its (possibly custom) config key
     * @return a map from the possible types of the specified setting to the present flow variables.
     * @throws InvalidSettingsException if the path does not start with "model" or "view"
     */
    Map<String, Collection<PossibleFlowVariable>> getAvailableFlowVariables(final String textSettings,
        final LinkedList<String> persistPath) throws InvalidSettingsException;

    /**
     *
     * This method first transforms the given text settings to {@link NodeSettings} and {@link VariableSettings} only to
     * then overwrite the node settings with the variables and transform them back to JSON. Hereby only those setting
     * (model or view) are transformed which are necessary as defined by the first entry of the dataPath.
     *
     * @param textSettings the front-end representation of the current settings in JSON format containing data and flow
     *            variable settings.
     * @param dataPath the path of the setting as it is stored in the data within the front-end JSON representation. In
     *            particular this has to start with its settings type ("view" or "model").
     * @return the flow variable value
     * @throws InvalidSettingsException
     * @throws JsonProcessingException
     */
    Object getFlowVariableOverrideValue(final String textSettings, final LinkedList<String> dataPath)
        throws InvalidSettingsException, JsonProcessingException;

}
