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

import static org.knime.core.webui.node.dialog.defaultdialog.util.SettingsTypeMapUtil.map;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.schema.JsonFormsSchemaUtil;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.JsonFormsUiSchemaUtil;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.tree.Tree;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.impl.AsyncChoicesHolder;
import org.knime.core.webui.node.dialog.defaultdialog.widgettree.WidgetTreeFactory;

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

    private final DefaultNodeSettingsContext m_context;

    private final Map<SettingsType, Tree<WidgetGroup>> m_widgetTrees;

    private Map<SettingsType, DefaultNodeSettings> m_settings;

    /**
     * @param settings the POJOs from which to derive the schema, data and uiSchema
     * @param context the current {@link DefaultNodeSettingsContext} with access to input ports
     * @param widgetTrees of the settings
     */
    public JsonFormsSettingsImpl(final Map<SettingsType, DefaultNodeSettings> settings,
        final DefaultNodeSettingsContext context, final Map<SettingsType, Tree<WidgetGroup>> widgetTrees) {
        m_settings = settings;
        m_context = context;
        m_widgetTrees = widgetTrees;
    }

    /**
     * @param settings the POJOs from which to derive the schema, data and uiSchema
     * @param context the current {@link DefaultNodeSettingsContext} with access to input ports
     */
    public JsonFormsSettingsImpl(final Map<SettingsType, DefaultNodeSettings> settings,
        final DefaultNodeSettingsContext context) {
        this(settings, context, map(settings, (type, s) -> new WidgetTreeFactory().createTree(s.getClass(), type)));
    }

    @Override
    public JsonNode getSchema() {
        return JsonFormsSchemaUtil.buildCombinedSchema(map(m_settings, DefaultNodeSettings::getClass), m_widgetTrees,
            m_context, JsonFormsDataUtil.getMapper());
    }

    @Override
    public RawValue getUiSchema(final AsyncChoicesHolder asyncChoicesHolder) {
        final var clazz = m_settings.containsKey(SettingsType.VIEW) ? m_settings.get(SettingsType.VIEW).getClass()
            : m_settings.get(SettingsType.MODEL).getClass();
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
        final var uiSchema = JsonFormsUiSchemaUtil.buildUISchema(m_widgetTrees.values(), m_context, asyncChoicesHolder);
        return new RawValue(uiSchema.toString());
    }

    @Override
    public JsonNode getData() {
        return JsonFormsDataUtil.toCombinedJsonData(map(m_settings));
    }

}
