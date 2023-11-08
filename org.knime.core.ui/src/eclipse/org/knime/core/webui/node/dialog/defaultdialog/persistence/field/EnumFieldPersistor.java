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
 *   Oct 9, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.persistence.field;

import java.util.Arrays;
import java.util.stream.Collectors;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.NodeSettingsPersistor;

/**
 * This field persistor transforms {@link String} node settings to enum values and vice versa by matching the enum
 * constant.
 *
 * @author Paul Bärnreuther
 * @param <E> The enum that should be persisted
 */
public final class EnumFieldPersistor<E extends Enum<E>> implements NodeSettingsPersistor<E> {

    private final String m_configKey;

    private final Class<E> m_enumClass;

    /**
     * @param configKey under which the string is to be stored
     * @param enumClass the class of the to be persisted enum
     */
    public EnumFieldPersistor(final String configKey, final Class<E> enumClass) {
        m_enumClass = enumClass;
        m_configKey = configKey;
    }

    @Override
    public E load(final NodeSettingsRO settings) throws InvalidSettingsException {
        var name = settings.getString(m_configKey);
        try {
            return name == null ? null : Enum.valueOf(m_enumClass, name);
        } catch (IllegalArgumentException ex) {
            var values =
                Arrays.stream(m_enumClass.getEnumConstants()).map(Enum::name).collect(Collectors.joining(", "));
            throw new InvalidSettingsException(
                String.format("Invalid value '%s'. Possible values: %s", name, values), ex);
        }
    }

    @Override
    public void save(final E obj, final NodeSettingsWO settings) {
        settings.addString(m_configKey, obj == null ? null : obj.name());
    }

}