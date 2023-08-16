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
 *   Jun 27, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.widget.button;

/**
 * This class exists in order to communicate what changes should be made to a button component after a call to a
 * {@link ButtonActionHandler} or a {@link ButtonUpdateHandler}.
 *
 * @param buttonState The next state of the button
 * @param settingValue The next value the setting should be set to if {@link ButtonChange#setSettingValue} is true
 * @param setSettingValue Whether the next value of the setting should be set or ignored
 * @param <R> the type of the annotated setting
 * @param <M> the state machine of the button
 *
 * @author Paul Bärnreuther
 */
public record ButtonChange<R, M extends Enum<M>>(M buttonState, R settingValue, boolean setSettingValue) {


    /**
     * Use this constructor to change the buttonState but keep the setting value untouched.
     *
     * @param newButtonState the new state of the button.
     */
    public ButtonChange(final M newButtonState) {
        this(newButtonState, null, false);
    }

    /**
     * Use this constructor to change the buttonState and the setting value.
     *
     * @param newSettingValue the new value of the setting.
     * @param newButtonState the new state of the button.
     */
    public ButtonChange(final R newSettingValue, final M newButtonState) {
        this(newButtonState, newSettingValue, true);
    }

}
