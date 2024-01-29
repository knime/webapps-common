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
 *   Jan 25, 2024 (hornm): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.persistence;

import java.util.HashMap;
import java.util.Map;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.Persist;

/**
 * Use this as a custom persistor ({@link Persist#customPersistor()}) in case an entire {@link NodeSettings}-trees are
 * to be preserved (i.e. not get lost when loading and saving {@link DefaultNodeSettings}) even though the respective
 * settings can't be changed by the user (yet!) because they aren't visible in the dialog.
 *
 * Since this persistor doesn't really load anything (i.e. {@link #load(NodeSettingsRO)} always returns {@code null}),
 * it only works with fields of type {@link Void}.
 *
 * Not intended to be released. To be removed asap.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
public class NodeSettingsPreserverPersistor extends NodeSettingsPersistorWithConfigKey<Void> {

    private static final Map<String, NodeSettings> NODE_SETTINGS_CACHE = new HashMap<>();

    /**
     * {@inheritDoc}
     */
    @Override
    public Void load(final NodeSettingsRO settings) throws InvalidSettingsException {
        var configKey = getConfigKey();
        if (settings.containsKey(configKey)) {
            var cachedNodeSettings = new NodeSettings(configKey);
            settings.getNodeSettings(configKey).copyTo(cachedNodeSettings);
            NODE_SETTINGS_CACHE.put(configKey, cachedNodeSettings);
        }
        return null;
    }

    /**
     * {@inheritDoc}
     */
    @Override
    public void save(final Void unused, final NodeSettingsWO settings) {
        var cachedNodeSettings = NODE_SETTINGS_CACHE.get(getConfigKey());
        if (cachedNodeSettings != null) {
            cachedNodeSettings.copyTo(settings);
        }
    }

}
