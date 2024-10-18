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
 *   Oct 25, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog;

import java.util.Map;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.dataservice.DefaultDialogDataConverter;
import org.knime.core.webui.node.dialog.defaultdialog.dataservice.FlowVariableDataServiceImpl;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsSettingsImpl;
import org.knime.core.webui.node.dialog.defaultdialog.settingsconversion.JsonDataToDefaultNodeSettingsUtil;
import org.knime.core.webui.node.dialog.defaultdialog.settingsconversion.NodeSettingsToDefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.settingsconversion.ToNodeSettingsUtil;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * The converter used in the {@link FlowVariableDataServiceImpl} of the {@link DefaultNodeDialog}.
 *
 * @noreference because it leaks implementation details (jackson)
 *
 * @author Paul Bärnreuther
 */
public final class DefaultDialogDataConverterImpl implements DefaultDialogDataConverter {

    private final Map<SettingsType, Class<? extends DefaultNodeSettings>> m_settingsClasses;

    /**
     * @param settingsClasses the classes of the {@link DefaultNodeSettings} associated to the settings types (model
     *            and/or view).
     */
    public DefaultDialogDataConverterImpl(
        final Map<SettingsType, Class<? extends DefaultNodeSettings>> settingsClasses) {
        m_settingsClasses = settingsClasses;
    }

    /**
     * Converter for only converting one type of settings. Note that some of its conversion methods might fail when they
     * are used with a different type.
     *
     * @param type the type of the settings
     * @param settingsClass the default node setting of this type
     */
    public DefaultDialogDataConverterImpl(final SettingsType type,
        final Class<? extends DefaultNodeSettings> settingsClass) {
        this(Map.of(type, settingsClass));
    }

    @Override
    public NodeSettings dataJsonToNodeSettings(final JsonNode root, final SettingsType type) {
        final var defaultNodeSettings =
            JsonDataToDefaultNodeSettingsUtil.toDefaultNodeSettings(m_settingsClasses.get(type), root, type);
        return ToNodeSettingsUtil.toNodeSettings(type, defaultNodeSettings);
    }

    @Override
    public JsonNode nodeSettingsToDataJson(final SettingsType type, final NodeSettingsRO nodeSettings,
        final DefaultNodeSettingsContext context) throws InvalidSettingsException {
        return new JsonFormsSettingsImpl(new NodeSettingsToDefaultNodeSettings(context, m_settingsClasses)
            .nodeSettingsToDefaultNodeSettings(Map.of(type, nodeSettings)), context).getData();
    }

}
