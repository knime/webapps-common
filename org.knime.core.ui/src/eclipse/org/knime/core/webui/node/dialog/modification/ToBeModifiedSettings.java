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
 *   May 29, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.modification;

import java.util.Optional;

import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.webui.node.dialog.VariableSettingsRO;

/**
 * This record entails provisionally yet to be corrected node settings as well as previous settings from which parts can
 * be used to correct the provisional settings and variable settings telling which parts need to be adapted (in addition
 * to the information given by a {@link Modification}.
 *
 * All of the fields might be empty since we traverse to each config of the provisional settings and there might not be
 * any variable settings set of previous settings present (e.g. in an array layout when a new element has been added)
 *
 * @param provisionalSettings the settings that have been applied by the dialog and that need to be adjusted if they
 *            differ from the applied variable settings
 * @param previousSettings the settings as they were persisted before the dialog was opened.
 * @param appliedVariableSettings the applied variable settings which could possibly not yet be in sync with the
 *            settings.
 * @author Paul Bärnreuther
 */
record ToBeModifiedSettings(Optional<NodeSettings> provisionalSettings, Optional<NodeSettingsRO> previousSettings,
    Optional<VariableSettingsRO> appliedVariableSettings) {

    /**
     * @param appliedSettings
     * @param previousSettings
     * @param appliedVariableSettings
     * @return to be modified settings
     */
    public static ToBeModifiedSettings of(final NodeSettings appliedSettings, final NodeSettingsRO previousSettings,
        final VariableSettingsRO appliedVariableSettings) {
        return new ToBeModifiedSettings(Optional.of(appliedSettings), Optional.of(previousSettings),
            Optional.of(appliedVariableSettings));
    }
}
