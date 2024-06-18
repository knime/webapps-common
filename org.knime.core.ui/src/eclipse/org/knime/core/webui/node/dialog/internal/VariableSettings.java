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
 */
package org.knime.core.webui.node.dialog.internal;

import java.util.List;
import java.util.Optional;
import java.util.function.Supplier;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.VariableSettingsRO;
import org.knime.core.webui.node.dialog.VariableSettingsWO;

/**
 * An implementation of {@link VariableSettingsWO} that only adds the settings for the variables to the node settings if
 * necessary.
 *
 * @author Benjamin Wilhelm, KNIME GmbH, Konstanz, Germany
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
public final class VariableSettings implements VariableSettingsWO, VariableSettingsRO {

    // See org.knime.core.node.config.ConfigEditTreeModel#CURRENT_VERSION
    private static final String CURRENT_VERSION = "V_2019_09_13";

    private static final String VERSION_CFG_KEY = "version";

    /**
     * Config key for the exposed variable.
     */
    public static final String EXPOSED_VARIABLE_CFG_KEY = "exposed_variable";

    /**
     * Config key for the used variable.
     */
    public static final String USED_VARIABLE_CFG_KEY = "used_variable";

    /**
     * Config key for a boolean indicating whether the used variable is flawed in the sense that overriding the
     * corresponding node setting with it will lead to an error.
     */
    public static final String USED_VARIABLE_FLAWED_CFG_KEY = "used_variable_flawed";

    private final Supplier<NodeSettings> m_variableSettingsCreator;

    private final Supplier<NodeSettings> m_variableSettingsGetter;

    private NodeSettings m_cachedVariableSettings;

    private final NodeSettings m_nodeSettings;

    /**
     * Internal use only
     *
     * @param nodeSettings
     * @param type
     */
    public VariableSettings(final NodeSettings nodeSettings, final SettingsType type) {
        m_nodeSettings = getNodeSettingsForType(type, nodeSettings);

        m_variableSettingsCreator = () -> {
            var variableSettings = getOrCreateSubSettings(nodeSettings, type.getVariablesConfigKey());
            addStringIfNotPresent(variableSettings, VERSION_CFG_KEY, CURRENT_VERSION);
            return getOrCreateSubSettings(variableSettings, "tree");
        };

        m_variableSettingsGetter = () -> {
            NodeSettings variableSettings;
            try {
                variableSettings = nodeSettings.getNodeSettings(type.getVariablesConfigKey());
                return variableSettings.getNodeSettings("tree");
            } catch (InvalidSettingsException ex) { // NOSONAR
                return null;
            }
        };
    }

    private static NodeSettings getNodeSettingsForType(final SettingsType type, final NodeSettings nodeSettings) {
        try {
            return nodeSettings.getNodeSettings(type.getConfigKey());
        } catch (InvalidSettingsException ex) { // NOSONAR
            return new NodeSettings("empty");
        }
    }

    /**
     * Internal use only
     *
     * @param variableSettings
     * @param nodeSettings
     */
    public VariableSettings(final NodeSettings variableSettings, final NodeSettings nodeSettings) {
        m_nodeSettings = nodeSettings;
        m_variableSettingsCreator = null;
        m_variableSettingsGetter = () -> variableSettings;
        m_cachedVariableSettings = variableSettings;
    }

    public Optional<NodeSettings> getVariableSettings() {
        return Optional.ofNullable(m_variableSettingsGetter.get());
    }

    private NodeSettings getVariableSettingsOrThrow() throws InvalidSettingsException {
        var ns = m_variableSettingsGetter.get();
        if (ns == null) {
            throw new InvalidSettingsException("No variable settings given");
        }
        return ns;
    }

    private NodeSettings getOrCreateVariableSettings() {
        if (m_cachedVariableSettings == null) {
            m_cachedVariableSettings = m_variableSettingsCreator.get();
        }
        return m_cachedVariableSettings;
    }

    @Override
    public Iterable<String> getVariableSettingsIterable() {
        return () -> getVariableSettings().map(NodeSettings::iterator).orElse(List.<String> of().iterator());
    }

    @Override
    public boolean isVariableSetting(final String key) {
        NodeSettings ns = getVariableSettings().orElse(null);
        if (ns == null) {
            return false;
        }

        return isVariableSettings(ns, key);
    }

    static boolean isVariableSettings(final NodeSettings s, final String key) {
        try {
            final var ns = s.getNodeSettings(key);
            ns.getString(USED_VARIABLE_CFG_KEY);
            ns.getString(EXPOSED_VARIABLE_CFG_KEY);
            return true;
        } catch (InvalidSettingsException ex) { // NOSONAR
            return false;
        }
    }

    @Override
    public VariableSettingsRO getVariableSettings(final String key) throws InvalidSettingsException {
        return new VariableSettings(getVariableSettingsOrThrow().getNodeSettings(key),
            m_nodeSettings.getNodeSettings(key));
    }

    @Override
    public VariableSettingsWO getOrCreateVariableSettings(final String key) throws InvalidSettingsException {
        // NB: m_settings.getNodeSettings throws an exception if the object does not exist - we want this - ?? TODO
        return new VariableSettings(getOrCreateSubSettings(getOrCreateVariableSettings(), key),
            m_nodeSettings.getNodeSettings(key));
    }

    @Override
    public String getUsedVariable(final String key) throws InvalidSettingsException {
        return getUsedVariableFrom(key, getVariableSettingsOrThrow());
    }

    static String getUsedVariableFrom(final String key, final NodeSettings s) throws InvalidSettingsException {
        return s.getNodeSettings(key).getString(USED_VARIABLE_CFG_KEY);
    }

    @Override
    public void addUsedVariable(final String settingsKey, final String usedVariable,
        final boolean isControllingFlowVariableFlawed) throws InvalidSettingsException {
        if (!m_nodeSettings.containsKey(settingsKey)) {
            throw new InvalidSettingsException("Cannot overwrite the setting '" + settingsKey
                + "' with the flow variable '" + usedVariable + "' because the setting does not exist.");
        }

        final var s = getOrCreateSubSettings(getOrCreateVariableSettings(), settingsKey);
        addUsedVariableTo(usedVariable, isControllingFlowVariableFlawed, s);
    }

    static void addUsedVariableTo(final String usedVariable, final boolean isControllingFlowVariableFlawed,
        final NodeSettings s) {
        s.addString(USED_VARIABLE_CFG_KEY, usedVariable);
        s.addBoolean(USED_VARIABLE_FLAWED_CFG_KEY, isControllingFlowVariableFlawed);
        addStringIfNotPresent(s, EXPOSED_VARIABLE_CFG_KEY, null);
    }

    @Override
    public String getExposedVariable(final String key) throws InvalidSettingsException {
        return getExposedVariableFrom(getVariableSettingsOrThrow(), key);
    }

    static String getExposedVariableFrom(final NodeSettings s, final String key) throws InvalidSettingsException {
        return s.getNodeSettings(key).getString(EXPOSED_VARIABLE_CFG_KEY);
    }

    @Override
    public void addExposedVariable(final String settingsKey, final String exposedVariable)
        throws InvalidSettingsException {
        if (!m_nodeSettings.containsKey(settingsKey)) {
            throw new InvalidSettingsException("Cannot expose the setting '" + settingsKey
                + "' with the flow variable '" + exposedVariable + "' because the setting does not exist.");
        }

        final var s = getOrCreateSubSettings(getOrCreateVariableSettings(), settingsKey);
        addExposedVariableTo(exposedVariable, s);
    }

    static void addExposedVariableTo(final String exposedVariable, final NodeSettings s) {
        s.addString(EXPOSED_VARIABLE_CFG_KEY, exposedVariable);
        addStringIfNotPresent(s, USED_VARIABLE_CFG_KEY, null);
    }

    static NodeSettings getOrCreateSubSettings(final NodeSettings settings, final String key) {
        NodeSettings subSettings;
        if (settings.containsKey(key)) {
            try {
                subSettings = settings.getNodeSettings(key);
            } catch (InvalidSettingsException ex) {
                // should never happen
                throw new IllegalStateException(ex);
            }
        } else {
            subSettings = new NodeSettings(key);
            settings.addNodeSettings(subSettings);
        }
        return subSettings;
    }

    private static void addStringIfNotPresent(final NodeSettings settings, final String key, final String value) {
        if (!settings.containsKey(key)) {
            settings.addString(key, value);
        }
    }

}
