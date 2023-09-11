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
 *   Jan 5, 2022 (hornm): created
 */
package org.knime.core.webui.node.dialog.defaultdialog;

import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.FIELD_NAME_DATA;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.FIELD_NAME_SCHEMA;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.FIELD_NAME_UI_SCHEMA;
import static org.knime.core.webui.node.dialog.defaultdialog.util.MapValuesUtil.mapValues;

import java.util.Map;

import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.webui.node.dialog.NodeAndVariableSettingsRO;
import org.knime.core.webui.node.dialog.NodeAndVariableSettingsWO;
import org.knime.core.webui.node.dialog.NodeSettingsService;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsDataUtil;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsSettings;
import org.knime.core.webui.node.dialog.defaultdialog.settingsconversion.SettingsConverter;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.impl.AsyncChoicesHolder;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * A {@link NodeSettingsService} that translates {@link DefaultNodeSettings}-implementations into
 * {@link NodeSettings}-objects (on data apply) and vice-versa (initial data).
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
final class DefaultNodeSettingsService implements NodeSettingsService {

    private final SettingsConverter m_converter;
    private final AsyncChoicesHolder m_asyncChoicesHolder;

    /**
     * @param converter map that associates a {@link DefaultNodeSettings} class-with a {@link SettingsType}
     * @param asyncChoicesHolder used to start asynchronous computations of choices during the ui-schema generation.
     */
    public DefaultNodeSettingsService(final SettingsConverter converter, final AsyncChoicesHolder asyncChoicesHolder) {
        m_converter = converter;
        m_asyncChoicesHolder = asyncChoicesHolder;
    }

    @Override
    public void toNodeSettings(final String textSettings, final Map<SettingsType, NodeAndVariableSettingsWO> settings) {
        m_converter.textSettingsToNodeAndVariableSettings(textSettings, settings);
    }

    @Override
    public String fromNodeSettings(final Map<SettingsType, NodeAndVariableSettingsRO> settings,
        final PortObjectSpec[] specs) {
        var context = DefaultNodeSettings.createDefaultNodeSettingsContext(specs);
        final var jsonFormsSettings = m_converter.nodeSettingsToJsonFormsSettings(mapValues(settings, v -> v), context);
        final var flowVariablesMapJsonObject =
            SettingsConverter.variableSettingsToJsonObject(mapValues(settings, v -> v), context);
        return toString(jsonFormsSettings, flowVariablesMapJsonObject);
    }

    private String toString(final JsonFormsSettings jsonFormsSettings,
        final ObjectNode flowVariablesMapJsonObject) {
        final var mapper = JsonFormsDataUtil.getMapper();
        final var root = mapper.createObjectNode();
        root.set(FIELD_NAME_DATA, jsonFormsSettings.getData());
        root.set(FIELD_NAME_SCHEMA, jsonFormsSettings.getSchema());
        root.putRawValue(FIELD_NAME_UI_SCHEMA, jsonFormsSettings.getUiSchema(m_asyncChoicesHolder));
        root.setAll(flowVariablesMapJsonObject);
        try {
            return mapper.writeValueAsString(root);
        } catch (JsonProcessingException e) {
            throw new IllegalStateException(
                String.format("Exception when reading data from node settings: %s", e.getMessage()), e);
        }
    }

    @Override
    public void getDefaultNodeSettings(final Map<SettingsType, NodeSettingsWO> settings, final PortObjectSpec[] specs) {
        var context = DefaultNodeSettings.createDefaultNodeSettingsContext(specs);
        m_converter.saveDefaultNodeSettings(settings, context);
    }

}
