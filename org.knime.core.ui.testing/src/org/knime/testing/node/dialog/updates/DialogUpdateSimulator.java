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
 *   Sep 26, 2024 (Paul Bärnreuther): created
 */
package org.knime.testing.node.dialog.updates;

import static org.knime.core.webui.node.dialog.defaultdialog.util.updates.WidgetTreesToDependencyTreeUtil.settingsToTriggersAndInvocationHandler;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.stream.Collectors;

import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.IndexedValue;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.PathsWithSettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.TriggerAndDependencies;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.TriggerInvocationHandler;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.TriggerInvocationHandler.TriggerResult;
import org.knime.core.webui.node.dialog.defaultdialog.widget.internal.InternalButtonReferenceId;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ButtonReference;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Reference;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.StateProvider;

/**
 * Use this simulator to simulate the updates that are defined by {@link StateProvider}s within
 * {@link DefaultNodeSettings}
 *
 * @author Paul Bärnreuther
 */
@SuppressWarnings("restriction")
public class DialogUpdateSimulator implements UpdateSimulator {

    Map<SettingsType, WidgetGroup> m_settings;

    TriggerInvocationHandler<Integer> m_triggerInvocationHandler;

    List<TriggerAndDependencies> m_listOfTriggers;

    private DefaultNodeSettingsContext m_context;

    /**
     * @param settings - The classes of these settigns are used to extract the dependency tree. The settings themselves
     *            are used to extract dependencies during invocation.
     * @param context - Used during invocation
     */
    public DialogUpdateSimulator(final Map<SettingsType, WidgetGroup> settings,
        final DefaultNodeSettingsContext context) {
        final var pair = settingsToTriggersAndInvocationHandler(
            settings.entrySet().stream().collect(Collectors.toMap(Entry::getKey, e -> e.getValue().getClass())));
        m_listOfTriggers = pair.getFirst();
        m_triggerInvocationHandler = pair.getSecond();
        m_settings = settings;
        m_context = context;
    }

    /**
     * @param modelSettings - The class of these settigns are used to extract the dependency tree. The settings
     *            themselves are used to extract dependencies during invocation.
     * @param context - Used during invocation
     */
    public DialogUpdateSimulator(final WidgetGroup modelSettings, final DefaultNodeSettingsContext context) {
        this(Map.of(SettingsType.MODEL, modelSettings), context);
    }

    private TriggerResult<Integer> getTriggerResult(final String triggerId, final int... indices) {
        final var trigger = m_listOfTriggers.stream().filter(t -> t.getTriggerId().equals(triggerId)).findFirst().get();
        final var dependencyValues = trigger.extractDependencyValues(m_settings, m_context, indices);
        return m_triggerInvocationHandler.invokeTrigger(trigger.getTriggerId(), dependencyValues::get, m_context);
    }

    private UpdateSimulatorResult simulateTrigger(final String triggerId, final int... indices) {
        final var triggerResult = getTriggerResult(triggerId, indices);

        return new UpdateSimulatorResult() {

            @Override
            public List<IndexedValue<Integer>> getMultiValueUpdatesInArrayAt(final SettingsType settingsType,
                final List<List<String>> paths) {
                return triggerResult.valueUpdates().get(new PathsWithSettingsType(paths, settingsType));
            }

            @Override
            public List<IndexedValue<Integer>>
                getMultiUiStateUpdateAt(final Class<? extends StateProvider<?>> stateProviderClass) {
                return triggerResult.otherUpdates().get(stateProviderClass.getName());
            }
        };
    }

    @Override
    public UpdateSimulatorResult simulateValueChange(final Class<? extends Reference<?>> trigger,
        final int... indices) {
        return simulateTrigger(trigger.getName(), indices);
    }

    @Override
    public UpdateSimulatorResult simulateButtonClick(final Class<? extends ButtonReference> trigger,
        final int... indices) {
        final var internalReferenceId = trigger.getAnnotation(InternalButtonReferenceId.class);
        if (internalReferenceId != null) {
            return simulateTrigger(internalReferenceId.value(), indices);
        }
        return simulateTrigger(trigger.getName(), indices);
    }

    @Override
    public UpdateSimulatorResult simulateBeforeOpenDialog() {
        return simulateTrigger("before-open-dialog");
    }

    @Override
    public UpdateSimulatorResult simulateAfterOpenDialog() {
        return simulateTrigger("after-open-dialog");
    }

}
