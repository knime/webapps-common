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
 *   Aug 30, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.settingsconversion;

import static org.knime.core.webui.node.dialog.defaultdialog.util.MapValuesUtil.mapValuesWithKeys;

import java.util.Map;

import org.knime.core.node.NodeLogger;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsDataUtil;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;

/**
 * Used to de-serialize JSON data to {@link DefaultNodeSettings}.
 *
 * @author Paul Bärnreuther
 */
public final class JsonDataToDefaultNodeSettingsUtil {

    private JsonDataToDefaultNodeSettingsUtil() {
        // Utility
    }

    private static final NodeLogger LOGGER = NodeLogger.getLogger(JsonDataToDefaultNodeSettingsUtil.class);

    /**
     * @param settingsClasses a map associating settings types with {@link DefaultNodeSettings}
     * @param data containing keys "model" and/or "view" which are the keys of the map of settingsClasses
     *
     * @return a map of the extracted default node settings. The keys are the same as the ones in the given map of
     *         classes.
     */
    public static Map<SettingsType, DefaultNodeSettings> toDefaultNodeSettings(
        final Map<SettingsType, Class<? extends DefaultNodeSettings>> settingsClasses, final JsonNode data) {
        return mapValuesWithKeys(settingsClasses,
            (type, settingsClass) -> toDefaultNodeSettings(settingsClass, data, type));
    }

    /**
     * @param settingsClass
     * @param type "model" or "view"
     * @param data containing the given type as key
     * @return the extracted DefaultNodeSettings
     */
    public static DefaultNodeSettings toDefaultNodeSettings(final Class<? extends DefaultNodeSettings> settingsClass,
        final JsonNode data, final SettingsType type) {
        return toDefaultNodeSettings(getJsonNodeForType(data, type), settingsClass);
    }

    private static JsonNode getJsonNodeForType(final JsonNode data, final SettingsType type) {
        return data.get(type.getConfigKey());
    }

    private static DefaultNodeSettings toDefaultNodeSettings(final JsonNode node,
        final Class<? extends DefaultNodeSettings> settingsClass) {
        try {
            return JsonFormsDataUtil.toDefaultNodeSettings(node, settingsClass);
        } catch (JsonProcessingException e) {
            LOGGER.error(String.format("Error when creating class %s from settings. Error message is: %s.",
                settingsClass.getName(), e.getMessage()), e);
            return null;

        }

    }

}
