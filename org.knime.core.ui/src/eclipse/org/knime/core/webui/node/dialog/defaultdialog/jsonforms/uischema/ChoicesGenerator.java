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

import org.knime.core.data.DataColumnSpec;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ColumnChoicesProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.IdAndText;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.PossibleColumnValue;

/**
 * This generator can be used to get the representation of the choices in a {@link ChoicesWidget} which we send via the
 * uischema to the front-end. It is also used in data service requests when fetching the choices asynchronously.
 *
 * @author Paul Bärnreuther
 */
public final class ChoicesGenerator {

    private final DefaultNodeSettingsContext m_settingsContext;

    /**
     * @param settingsContext supplied to the choices providers
     */
    public ChoicesGenerator(final DefaultNodeSettingsContext settingsContext) {
        m_settingsContext = settingsContext;
    }

    /**
     * @param choicesProvider
     * @return an array of possible values (either an array of {@link IdAndText} or of {@link PossibleColumnValue}).
     */
    public Object[] getChoices(final ChoicesProvider choicesProvider) {
        if (choicesProvider instanceof ColumnChoicesProvider columnChoicesProvider) {
            return getChoicesFromColumnChoicesProvider(columnChoicesProvider);
        } else {
            return getChoicesFromChoicesProvider(choicesProvider);
        }

    }

    private PossibleColumnValue[] getChoicesFromColumnChoicesProvider(final ColumnChoicesProvider choicesProvider) {
        DataColumnSpec[] columnChoices = choicesProvider == null || m_settingsContext == null ? new DataColumnSpec[0]
            : choicesProvider.columnChoices(m_settingsContext);
        return Arrays.asList(columnChoices).stream().map(PossibleColumnValue::fromColSpec)
            .toArray(PossibleColumnValue[]::new);
    }

    private IdAndText[] getChoicesFromChoicesProvider(final ChoicesProvider choicesProvider) {
        return choicesProvider == null || m_settingsContext == null //
            ? new IdAndText[0] //
            : choicesProvider.choicesWithIdAndText(m_settingsContext);
    }
}
