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
 *   Dec 4, 2022 (Adrian Nembach, KNIME GmbH, Konstanz, Germany): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.persistence;

import java.util.List;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.webui.node.dialog.configmapping.ConfigMappings;

/**
 * Implementing classes save objects to and load objects from NodeSettings.</br>
 * Custom implementations must be immutable and provide either an empty or a constructor that accepts the {@link Class}
 * of the persisted object as input.
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 * @param <T> type of object loaded by the persistor
 */
public interface NodeSettingsPersistor<T> {

    /**
     * Loads the object from the provided settings.
     *
     * @param settings to load from
     * @return the loaded object
     * @throws InvalidSettingsException if the settings are invalid
     */
    T load(NodeSettingsRO settings) throws InvalidSettingsException;

    /**
     * Saves the provided object into the settings.
     *
     * @param obj to save
     * @param settings to save into
     */
    void save(T obj, NodeSettingsWO settings);

    /**
     * Allows one to optionally provide config mappings (e.g. old config key(s) to new config key(s)) in case configs
     * are deprecated. It is required to be able to maintain backwards compatibility.
     *
     * @param obj to save, necessary in some persistors, because the used config keys depend on the object (e.g. in
     *            dynamic arrays)
     * @return a new {@link ConfigMappings}-instance. It is used to bring settings and flow variables back in sync when
     *         the tree structure differs after saving (e.g. because of set deprecated flow variables) and to revert
     *         applied settings to previous settings when overwritten by a flow variable.
     */
    default ConfigMappings getConfigMappings(final T obj) {
        return new ConfigMappings(List.of());
    }

    /**
     * Creates a new instance from the provided NodeSettingsPersistor class by calling its empty constructor.
     *
     * @param <S> the type of object to persist
     * @param <P> the type of persistor to instantiate
     * @param persistorClass the class of NodeSettingsPersistor
     * @param persistedObjectClass
     * @return a new instance of the provided class
     * @throws IllegalStateException if the class does not have an empty constructor, is abstract, or the constructor
     *             raises an exception
     */
    static <S, P extends NodeSettingsPersistor<S>> P createInstance(final Class<P> persistorClass,
        final Class<S> persistedObjectClass) {

        return ReflectionUtil.createInstance(persistorClass, persistedObjectClass)
            .orElseGet(() -> ReflectionUtil.createInstance(persistorClass)
                .orElseThrow(() -> new IllegalArgumentException(String.format(
                    "The provided persistor class '%s' provides neither a constructor accepting the persisted object "
                        + "class nor an empty constructor.",
                    persistorClass.getCanonicalName()))));
    }
}
