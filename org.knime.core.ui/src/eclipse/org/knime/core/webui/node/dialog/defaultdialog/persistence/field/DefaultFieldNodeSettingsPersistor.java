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
 *   Dec 5, 2022 (Adrian Nembach, KNIME GmbH, Konstanz, Germany): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.persistence.field;

import java.util.Arrays;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.webui.node.dialog.configmapping.ConfigsDeprecation;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.NodeSettingsPersistor;

/**
 * {@link NodeSettingsPersistor} for fields that composes the config key with the implementation of the persistor.
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 */
final class DefaultFieldNodeSettingsPersistor<T> implements FieldNodeSettingsPersistor<T> {
    private final String m_configKey;

    private final String[][] m_subConfigKeys;

    private final FieldPersistor<T> m_impl;

    private final String[] m_subConfigKeysWithoutJsonEquivalent;

    DefaultFieldNodeSettingsPersistor(final String configKey, final FieldPersistor<T> impl) {
        this(configKey, null, null, impl);
    }

    DefaultFieldNodeSettingsPersistor(final String configKey, final String[] subConfigKeysWithoutJsonEquivalent,
        final String[][] subConfigKeys, final FieldPersistor<T> impl) {
        m_configKey = configKey;
        m_subConfigKeys = subConfigKeys;
        m_subConfigKeysWithoutJsonEquivalent = subConfigKeysWithoutJsonEquivalent;
        m_impl = impl;
    }

    @Override
    public void save(final T obj, final NodeSettingsWO settings) {
        m_impl.save(obj, settings, m_configKey);
    }

    @Override
    public T load(final NodeSettingsRO settings) throws InvalidSettingsException {
        return m_impl.load(settings, m_configKey);
    }

    @Override
    public String[] getConfigKeys() {
        if (m_subConfigKeysWithoutJsonEquivalent == null) {
            return new String[]{m_configKey};
        }
        /**
         * TODO: UIEXT-2127 Remove this workaround again.
         */
        return Arrays.stream(m_subConfigKeysWithoutJsonEquivalent)
            .map(subKey -> String.format("%s.%s", m_configKey, subKey)).toArray(String[]::new);
    }

    @Override
    public String[][] getSubConfigKeys() {
        return m_subConfigKeys;
    }

    @Override
    public ConfigsDeprecation[] getConfigsDeprecations() {
        return m_impl.getDeprecatedConfigs(m_configKey);
    }

}
