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
 *   Feb 13, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.util.updates;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueRef;

/**
 * @author Paul Bärnreuther
 */
public class TriggerInvocationHandler {

    private final Collection<TriggerVertex> m_triggers;

    /**
     * @param settingsClasses the settings classes to collect annotations from
     */
    public TriggerInvocationHandler(final Map<String, Class<? extends WidgetGroup>> settingsClasses) {
        m_triggers = SettingsClassesToDependencyTreeUtil.settingsToDependencyTree(settingsClasses);
    }

    /**
     * The resulting updates of a trigger invocation
     *
     * @param valueUpdates keys here are the path locations of fields whose value is updated
     * @param otherUpdates keys here are the ids (the names) of the state providers
     */
    public record TriggerResult(Map<PathWithSettingsKey, Object> valueUpdates, Map<String, Object> otherUpdates) {

    }

    /**
     *
     * @param triggerId matching an id of the triggers in the provided settingsClasses
     * @param dependencyProvider providing values for dependencies of this trigger (see {@link TriggerAndDependencies})
     * @param context provided to the triggered state providers
     * @return a mapping from identifiers of fields to their updated value
     */
    public TriggerResult invokeTrigger(final String triggerId,
        final Function<Class<? extends ValueRef>, Object> dependencyProvider, final DefaultNodeSettingsContext context) {
        final var trigger = m_triggers.stream().filter(t -> t.getId().equals(triggerId)).findAny().orElseThrow();
        final var resultPerUpdateHandler = new InvokeTrigger(dependencyProvider, context).invokeTrigger(trigger);
        final var partitionedResult = resultPerUpdateHandler.entrySet().stream()
            .collect(Collectors.partitioningBy(e -> e.getKey().getFieldLocation().isPresent()));

        final Map<PathWithSettingsKey, Object> valueUpdates = new HashMap<>();
        for (var entry : partitionedResult.get(true)) {
            valueUpdates.put(entry.getKey().getFieldLocation().get(), entry.getValue());
        }

        final Map<String, Object> otherUpdates = new HashMap<>();
        for (var entry : partitionedResult.get(false)) {
            otherUpdates.put(entry.getKey().getStateProviderClass().getName(), entry.getValue());
        }

        return new TriggerResult(valueUpdates, otherUpdates);
    }

}
