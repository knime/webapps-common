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
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema;

import java.util.Arrays;
import java.util.List;

import org.knime.core.data.DataColumnSpec;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.SettingsCreationContext;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnselection.ColumnSelection;
import org.knime.core.webui.node.dialog.defaultdialog.util.InstantiationUtil;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ColumnChoicesProvider;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.TextNode;

/**
 * @author Paul Bärnreuther
 */
final class ChoicesArrayNodeGenerator {

    private final SettingsCreationContext m_settingsContext;

    private ArrayNode m_arrayNode;

    private final ObjectMapper m_mapper;

    ChoicesArrayNodeGenerator(final ObjectMapper mapper, final SettingsCreationContext settingsContext) {
        m_settingsContext = settingsContext;
        m_mapper = mapper;
    }

    ArrayNode createChoicesNode(final Class<? extends ChoicesProvider> choicesProviderClass) {
        m_arrayNode = m_mapper.createArrayNode();
        final ChoicesProvider choicesProvider = InstantiationUtil.createInstance(choicesProviderClass);
        if (isColumnChoicesProvider(choicesProviderClass)) {
            addColumnsFromColumnChoicesProvider((ColumnChoicesProvider)choicesProvider);
        } else {
            addStringsFromChoicesProvider(choicesProvider);
        }

        return m_arrayNode;
    }

    private static boolean isColumnChoicesProvider(final Class<? extends ChoicesProvider> choicesProviderClass) {
        return ColumnChoicesProvider.class.isAssignableFrom(choicesProviderClass);
    }

    private void addColumnsFromColumnChoicesProvider(final ColumnChoicesProvider choicesProvider) {
        DataColumnSpec[] columnChoices = choicesProvider == null || m_settingsContext == null ? new DataColumnSpec[0]
            : choicesProvider.columnChoices(m_settingsContext);
        addColumnChoices(columnChoices);
    }

    private void addColumnChoices(final DataColumnSpec[] colChoices) {
        for (DataColumnSpec colChoice : colChoices) {
            final var colName = colChoice.getName();
            final var colType = colChoice.getType();
            final var typeIdentifier = colType.getPreferredValueClass().getName();
            final var displayedType = colType.getName();
            final var compatibleTypes = Arrays.asList(ColumnSelection.getCompatibleTypes(colType));
            addChoiceWithTypeInformation(colName, colName, typeIdentifier, displayedType, compatibleTypes);
        }
    }

    private void addStringsFromChoicesProvider(final ChoicesProvider choicesProvider) {
        String[] choices = choicesProvider == null || m_settingsContext == null //
            ? new String[0] //
            : choicesProvider.choices(m_settingsContext);
        addStringChoices(choices);
    }

    private void addStringChoices(final String[] choices) {
        for (var choice : choices) {
            addChoice(choice, choice);
        }
    }

    private void addChoice(final String id, final String text) {
        final var entry = getBaseEntry(id, text);
        m_arrayNode.add(entry);
    }

    private void addChoiceWithTypeInformation(final String id, final String text, final String type,
        final String displayedType, final List<String> compatibleTypes) {
        final var entry = getBaseEntry(id, text);
        entry.putObject("type").put("id", type).put("text", displayedType);
        final var compatibleTypesArrayNode = entry.putArray("compatibleTypes");
        compatibleTypes.stream().map(TextNode::new).forEach(compatibleTypesArrayNode::add);
        m_arrayNode.add(entry);
    }

    private ObjectNode getBaseEntry(final String id, final String text) {
        return m_mapper.createObjectNode().put("id", id).put("text", text);
    }
}
