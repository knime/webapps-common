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
 *  NodeDialog, and NodeDialog) and that only interoperate with KNIME through
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
 *   Oct 15, 2021 (hornm): created
 */
package org.knime.core.webui.node.dialog;

import java.util.Optional;
import java.util.Set;

import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.workflow.NativeNodeContainer;
import org.knime.core.webui.UIExtension;
import org.knime.core.webui.data.RpcDataService;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;

/**
 * Represents a dialog of a node.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 *
 * @since 4.5
 */
public interface NodeDialog extends UIExtension {

    /**
     * @return settingsTypes the list of {@link SettingsType}s the {@link NodeSettingsService} is able to deal with;
     *         must not be empty
     */
    Set<SettingsType> getSettingsTypes();

    /**
     * @return a {@link NodeSettingsService}-instance
     */
    NodeSettingsService getNodeSettingsService();

    /**
     * @return optional service generally providing data to the node view, port view or node dialog.
     */
    Optional<RpcDataService> createRpcDataService();

    /**
     * @return a {@link VariableSettingsService}-instance
     */
    default Optional<VariableSettingsService> getVariableSettingsService() {
        return Optional.empty();
    }

    /**
     * @return see {@link OnApplyNodeModifier}
     */
    default Optional<OnApplyNodeModifier> getOnApplyNodeModifier() {
        return Optional.empty();
    }

    /**
     * Can be implemented and provided to the NodeDialog upon creation. Provides a method that is called when settings
     * are applied. May optionally modify the node based on the difference between previous and updated model
     * and view {@link DefaultNodeSettings settings}.
     */
    @FunctionalInterface
    interface OnApplyNodeModifier {
        /**
         * Called when the dialog is closed. May optionally modify the node based on the difference difference between
         * previous and updated model and view {@link DefaultNodeSettings settings}. Note that for any settings
         * controlled via flow variables, the "updated" value is always equal to the "previous" value, i.e., settings
         * are not updated if controlled via a flow variable.
         *
         * @param nnc the native node container which should undergo modifications based on provided settings
         * @param previousModelSettings the previous model {@link DefaultNodeSettings settings}, i.e., the model
         *            settings prior to the apply call
         * @param updatedModelSettings the final, updated model {@link DefaultNodeSettings settings}, i.e., the model
         *            settings after the apply call
         * @param previousViewSettings the previous view {@link DefaultNodeSettings settings}, i.e., the view settings
         *            prior to the apply call
         * @param updatedViewSettings the final, updated view {@link DefaultNodeSettings settings}, i.e., the view
         *            settings after the apply call
         */
        void onApply(final NativeNodeContainer nnc, NodeSettingsRO previousModelSettings,
            NodeSettingsRO updatedModelSettings, NodeSettingsRO previousViewSettings,
            NodeSettingsRO updatedViewSettings);
    }

}
