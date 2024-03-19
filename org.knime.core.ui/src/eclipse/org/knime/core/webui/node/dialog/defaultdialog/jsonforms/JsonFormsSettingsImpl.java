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
 *   25 Oct 2021 (Marc Bux, KNIME GmbH, Berlin, Germany): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.TreeMap;

import org.apache.commons.io.IOUtils;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.schema.JsonFormsSchemaUtil;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.JsonFormsUiSchemaUtil;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.UpdatesUtil;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.impl.AsyncChoicesHolder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.util.RawValue;

/**
 * Abstract implementation of JsonFormsSettings, where
 * <ul>
 * <li>the schema content is created from the types, names, and annotations of the fields in model and view
 * {@link DefaultNodeSettings settings} (see {@link JsonFormsSchemaUtil})
 * <li>the data content is created from the values in these fields (see {@link JsonFormsDataUtil})
 * <li>the UI schema content is created either from a uischema.json file that resides in the same folder as the model
 * and view settings classes or, if no such file exists, it is generated from settings annotations (see
 * {@link JsonFormsUiSchemaUtil})
 * </ul>
 *
 *
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
public final class JsonFormsSettingsImpl implements JsonFormsSettings {

    private final Class<? extends DefaultNodeSettings> m_modelSettingsClass;

    private final Class<? extends DefaultNodeSettings> m_viewSettingsClass;

    private final DefaultNodeSettings m_modelSettings;

    private final DefaultNodeSettings m_viewSettings;

    private final DefaultNodeSettingsContext m_context;

    /**
     * @param settings the POJOs from which to derive the schema, data and uiSchema
     * @param context the current {@link SettingsCreatingContext} with access to input ports
     */
    public JsonFormsSettingsImpl(final Map<SettingsType, DefaultNodeSettings> settings,
        final DefaultNodeSettingsContext context) {
        m_modelSettings = settings.get(SettingsType.MODEL);
        m_modelSettingsClass = m_modelSettings == null ? null : m_modelSettings.getClass();
        m_viewSettings = settings.get(SettingsType.VIEW);
        m_viewSettingsClass = m_viewSettings == null ? null : m_viewSettings.getClass();
        m_context = context;
    }

    @Override
    public JsonNode getSchema() {
        var settingsClasses = createSettingsTypeMap(m_modelSettingsClass, m_viewSettingsClass);
        return JsonFormsSchemaUtil.buildCombinedSchema(settingsClasses, m_context, JsonFormsDataUtil.getMapper());
    }

    @Override
    public RawValue getUiSchema(final AsyncChoicesHolder asyncChoicesHolder) {
        final var clazz = m_viewSettingsClass != null ? m_viewSettingsClass : m_modelSettingsClass;
        try (final var inputStream = clazz.getResourceAsStream("uischema.json")) {
            if (inputStream == null) {
                return generateUiSchema(asyncChoicesHolder == null ? new AsyncChoicesHolder() : asyncChoicesHolder);
            }
            return new RawValue(IOUtils.toString(inputStream, StandardCharsets.UTF_8));
        } catch (IOException ex) {
            throw new IllegalStateException("Error when parsing uischema.json.", ex);
        }

    }

    private RawValue generateUiSchema(final AsyncChoicesHolder asyncChoicesHolder) {
        final var settingsClasses = JsonFormsSettingsImpl
            .<Class<? extends WidgetGroup>> createSettingsTypeMap(m_modelSettingsClass, m_viewSettingsClass);
        final var settings = JsonFormsSettingsImpl.<WidgetGroup> createSettingsTypeMap(m_modelSettings, m_viewSettings);

        final var uiSchema = JsonFormsUiSchemaUtil.buildUISchema(settingsClasses, m_context, asyncChoicesHolder);
        UpdatesUtil.addUpdates(uiSchema, settingsClasses, settings, m_context);
        return new RawValue(uiSchema.toString());
    }

    @Override
    public JsonNode getData() {
        var settings = createSettingsTypeMap(m_modelSettings, m_viewSettings);
        return JsonFormsDataUtil.toCombinedJsonData(settings);
    }

    private static <T> Map<String, T> createSettingsTypeMap(final T modelSettingsObj, final T viewSettingsObj) {
        /**
         * Some nodes rely on view settings within the same section as model settings appear beneath those.
         */
        final Map<String, T> sortedMap = new TreeMap<>();
        if (modelSettingsObj != null) {
            sortedMap.put(SettingsType.MODEL.getConfigKey(), modelSettingsObj);
        }
        if (viewSettingsObj != null) {
            sortedMap.put(SettingsType.VIEW.getConfigKey(), viewSettingsObj);
        }
        return sortedMap;
    }

}
