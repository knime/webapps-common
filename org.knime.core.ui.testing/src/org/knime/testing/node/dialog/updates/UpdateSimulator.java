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
 *   Sep 26, 2024 (Paul Bärnreuther): created
 */
package org.knime.testing.node.dialog.updates;

import java.util.List;

import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.IndexedValue;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ButtonReference;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Reference;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.StateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.StateProvider.StateProviderInitializer;

/**
 *
 * @author Paul Bärnreuther
 */
@SuppressWarnings("restriction")
public interface UpdateSimulator {

    /**
     * The result of a simulation. One can access value updates by path and other updates (ui state updates) by state
     * provider. Value updates will have to be cast to the values type manually.
     *
     * @author Paul Bärnreuther
     */
    interface UpdateSimulatorResult {

        /**
         * Use only for model settings. For view settings, use {@link #getValueUpdateAt(SettingsType, String...)}.
         *
         * @param path to the field
         * @return the updated value
         */
        default Object getValueUpdateAt(final String... path) {
            return getValueUpdateAt(SettingsType.MODEL, path);
        }

        /**
         * @param settingsType
         * @param path to the field
         * @return the updated value
         */
        default Object getValueUpdateAt(final SettingsType settingsType, final String... path) {
            return getValueUpdatesInArrayAt(settingsType, List.of(List.of(path)));
        }

        /**
         * Use only for model settings. For view settings, use {@link #getValueUpdatesInArrayAt(SettingsType, List)}.
         *
         * @param paths to the field
         * @return the updated value
         */
        default Object getValueUpdatesInArrayAt(final List<List<String>> paths) {
            return getValueUpdatesInArrayAt(SettingsType.MODEL, paths);
        }

        /**
         * Only to be used when the value of one field in multiple array layout elements is updated simultaneously.
         *
         * @param settingsType
         * @param paths to the field
         * @return the updated value
         */
        default Object getValueUpdatesInArrayAt(final SettingsType settingsType, final List<List<String>> paths) {
            return getMultiValueUpdatesInArrayAt(settingsType, paths).get(0).value();
        }

        /**
         * Use only for model settings. For view settings, use
         * {@link #getMultiValueUpdatesInArrayAt(SettingsType, List)}. Only to be used when the value of one field in
         * multiple array layout elements is updated simultaneously.
         *
         * @param paths to the field
         * @return a list of this field of all simultaneous in all array layout elements
         */
        default List<IndexedValue<Integer>> getMultiValueUpdatesInArrayAt(final List<List<String>> paths) {
            return getMultiValueUpdatesInArrayAt(SettingsType.MODEL, paths);
        }

        /**
         * @param settingsType
         * @param paths to the field
         * @return a list of this field of all simultaneous in all array layout elements
         */
        List<IndexedValue<Integer>> getMultiValueUpdatesInArrayAt(SettingsType settingsType, List<List<String>> paths);

        /**
         * To be used when all ui states of the same field are updated simultaneously per array layout element.
         *
         * @param stateProviderClass triggered by the update
         * @return the updated values
         */
        List<IndexedValue<Integer>> getMultiUiStateUpdateAt(Class<? extends StateProvider<?>> stateProviderClass);

        /**
         * @param <T> the type of the state
         * @param stateProviderClass triggered by the update
         * @return the updated value
         */
        @SuppressWarnings("unchecked")
        default <T> T getUiStateUpdateAt(final Class<? extends StateProvider<T>> stateProviderClass) {
            return (T)getMultiUiStateUpdateAt(stateProviderClass).get(0).value();
        }

    }

    /**
     * @param valueReference
     * @param indices to be provided when the value is nested within an array layout (e.g. 1,2 means that it is the
     *            second element of the first element of an array layout within an array layout)
     * @return the resulting updates
     */
    UpdateSimulatorResult simulateValueChange(Class<? extends Reference<?>> valueReference, int... indices);

    /**
     *
     * @param buttonReference
     * @param indices to be provided when the value is nested within an array layout (e.g. 1,2 means that it is the
     *            second element of the first element of an array layout within an array layout)
     * @return the resulting updates
     */
    UpdateSimulatorResult simulateButtonClick(Class<? extends ButtonReference> buttonReference, int... indices);

    /**
     * @return triggers all state providers using {@link StateProviderInitializer#computeBeforeOpenDialog()
     *         computeBeforeOpenDialog}
     */
    UpdateSimulatorResult simulateBeforeOpenDialog();

    /**
     * @return triggers all state providers using {@link StateProviderInitializer#computeAfterOpenDialog()
     *         computeAfterOpenDialog}
     */
    UpdateSimulatorResult simulateAfterOpenDialog();

}
