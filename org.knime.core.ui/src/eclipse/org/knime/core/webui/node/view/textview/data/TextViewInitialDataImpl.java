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
 *   28 Jun 2023 (Rupert Ettrich): created
 */
package org.knime.core.webui.node.view.textview.data;

import java.util.HashMap;
import java.util.Map;
import java.util.Map.Entry;

import org.apache.commons.text.StringEscapeUtils;
import org.knime.core.node.workflow.FlowObjectStack;
import org.knime.core.node.workflow.FlowVariable;
import org.knime.core.webui.node.view.textview.TextViewViewSettings;

/**
 * Implementation of TextViewInitialData. Returns the initial rich text content and the escaped flow variable
 * mappings.
 *
 * @author Rupert Ettrich
 */
public final class TextViewInitialDataImpl implements TextViewInitialData {
    private final TextViewViewSettings m_settings;

    private final FlowObjectStack m_flowObjectStack;

    /**
     * @param settings the {@link TextViewViewSettings} that contain the rich text content
     * @param flowObjectStack the {@link FlowObjectStack} containing the available flow variables
     */
    public TextViewInitialDataImpl(final TextViewViewSettings settings, final FlowObjectStack flowObjectStack) {
        m_settings = settings;
        m_flowObjectStack = flowObjectStack;
    }

    private static Map<String, String> escapeFlowVariables(final FlowObjectStack flowObjectStack) {
        if (flowObjectStack == null || flowObjectStack.getAllAvailableFlowVariables().isEmpty()) {
            return Map.of();
        }
        final var resultMap = new HashMap<String, String>();
        final var flowVarsMap = flowObjectStack.getAllAvailableFlowVariables();
        for (Entry<String, FlowVariable> flowVar : flowVarsMap.entrySet()) {
            var flowValue = flowVar.getValue().getStringValue();
            if (flowValue == null) {
                continue;
            }
            resultMap.put(flowVar.getKey(), StringEscapeUtils.escapeHtml4(flowValue));
        }
        return resultMap;
    }

    @Override
    public String getContent() {
        return m_settings.m_richTextContent;
    }

    @Override
    public Map<String, String> getFlowVariablesMap() {
        return escapeFlowVariables(m_flowObjectStack);
    }
}
