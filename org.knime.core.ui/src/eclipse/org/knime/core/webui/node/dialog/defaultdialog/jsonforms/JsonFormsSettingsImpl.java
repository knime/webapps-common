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
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.SettingsCreationContext;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.schema.JsonFormsSchemaUtil;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.JsonFormsUiSchemaUtil;

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

    private final SettingsCreationContext m_context;

    /**
     * @param settings the POJOs from which to derive the schema, data and uiSchema
     * @param context the current {@link SettingsCreatingContext} with access to input ports
     */
    public JsonFormsSettingsImpl(final Map<SettingsType, DefaultNodeSettings> settings,
        final SettingsCreationContext context) {
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
    public RawValue getUiSchema() {
        final var clazz = m_viewSettingsClass != null ? m_viewSettingsClass : m_modelSettingsClass;
        try (final var inputStream = clazz.getResourceAsStream("uischema.json")) {
            if (inputStream == null) {
                return generateUiSchema();
            }
            return new RawValue(IOUtils.toString(inputStream, StandardCharsets.UTF_8));
        } catch (IOException ex) {
            throw new IllegalStateException("Error when parsing uischema.json.", ex);
        }

    }

    private RawValue generateUiSchema() {
        final var settings = new LinkedHashMap<String, Class<?>>();
        if (m_modelSettingsClass != null) {
            settings.put(SettingsType.MODEL.getConfigKey(), m_modelSettingsClass);
        }
        if (m_viewSettingsClass != null) {
            settings.put(SettingsType.VIEW.getConfigKey(), m_viewSettingsClass);
        }
        return new RawValue(
            JsonFormsUiSchemaUtil.buildUISchema(settings, JsonFormsDataUtil.getMapper(), m_context).toString());
    }

    @Override
    public JsonNode getData() {
        var settings = createSettingsTypeMap(m_modelSettings, m_viewSettings);
        return JsonFormsDataUtil.toCombinedJsonData(settings);
    }

    private static <T> Map<String, T> createSettingsTypeMap(final T modelSettingsObj, final T viewSettingsObj) {
        if (modelSettingsObj != null && viewSettingsObj != null) {
            return Map.of(SettingsType.MODEL.getConfigKey(), modelSettingsObj, SettingsType.VIEW.getConfigKey(),
                viewSettingsObj);
        } else if (modelSettingsObj != null) {
            return Collections.singletonMap(SettingsType.MODEL.getConfigKey(), modelSettingsObj);
        } else {
            return Collections.singletonMap(SettingsType.VIEW.getConfigKey(), viewSettingsObj);
        }
    }

}
