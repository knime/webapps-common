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
 *   Feb 7, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.dataservice;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.function.Function;

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsScopeUtil;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.InvokeTrigger;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.SettingsClassesToValueIdsAndUpdates;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.TriggerVertex;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.UpdateVertex;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.ValueIdsAndUpdatesToDependencyTree;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueId;

/**
 * Used to convert triggers to a list of resulting updates given a map of dependencies.
 *
 * @author Paul Bärnreuther
 */
public class TriggerInvocationHandler {

    private final Collection<TriggerVertex> m_triggers;

    TriggerInvocationHandler(final Map<String, Class<? extends WidgetGroup>> settingsClasses) {
        final var valueIdsAndUpdates =
            SettingsClassesToValueIdsAndUpdates.settingsClassesToValueIdsAndUpdates(settingsClasses);
        m_triggers = ValueIdsAndUpdatesToDependencyTree.valueIdsAndUpdatesToDependencyTree(valueIdsAndUpdates);
    }

    record PathAndValue(String path, Object value) {
    }

    List<PathAndValue> trigger(final String triggerId, final Map<String, Object> rawDependencies,
        final DefaultNodeSettingsContext context) {
        final Function<Class<? extends ValueId>, Object> dependencyProvider = valueId -> {
            final var rawDependencyObject = rawDependencies.get(valueId.getName());
            return ConvertValueUtil.convertValueId(rawDependencyObject, valueId, context);
        };
        final var trigger = m_triggers.stream().filter(t -> t.getId().equals(triggerId)).findAny().orElseThrow();
        final var resultPerUpdateHandler = new InvokeTrigger(dependencyProvider).invokeTrigger(trigger);
        return resultPerUpdateHandler.entrySet().stream()
            .map(entry -> new PathAndValue(getScope(entry.getKey()), entry.getValue())).toList();
    }

    private static String getScope(final UpdateVertex updateVertex) {
        final var path = updateVertex.getScope().path();
        final var settingsKey = updateVertex.getScope().settingsKey();
        return JsonFormsScopeUtil.toScope(path, settingsKey);
    }
}
