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
 *   Aug 28, 2023 (hornm): created
 */
package org.knime.core.webui.node.dialog;

import org.knime.core.node.InvalidSettingsException;

/**
 * Gives access to the variable settings tree. Infos on the settings which are exposed as or controlled by flow
 * variables.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
public interface VariableSettingsRO {

    /**
     * @return an iterable over all the settings keys at this level
     */
    Iterable<String> getVariableSettingsIterable();

    /**
     * Whether the setting for the given key is a 'leaf' in the variable settings tree. I.e.
     * {@link #getUsedVariable(String)} and {@link #getExposedVariable(String)} can be called without them throwing an
     * {@link InvalidSettingsException} .
     *
     * If {@code false} {@link #getVariableSettings(String)} can be used to further traverse the variable settings tree.
     *
     * @param key
     * @return {@code true} if the setting for the key is a variable setting
     */
    boolean isVariableSetting(String key);

    /**
     * @param key
     * @return the variable settings subtree for the given key
     * @throws InvalidSettingsException if there is no variable settings subtree for the given key
     */
    VariableSettingsRO getVariableSettings(String key) throws InvalidSettingsException;

    /**
     * @param key
     * @return the name of the variable used or {@code null} if none is set
     *
     * @throws InvalidSettingsException if there no variable setting for the given key
     */
    String getUsedVariable(String key) throws InvalidSettingsException;

    /**
     * @param key
     * @return the name of the variable exposed or {@code null} if none is set
     *
     * @throws InvalidSettingsException if there no variable setting for the given key
     */
    String getExposedVariable(String key) throws InvalidSettingsException;

}
