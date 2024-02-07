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
 *   Jan 23, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema;

import java.util.Collection;
import java.util.List;
import java.util.Map;

import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsScopeUtil;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.DependencyVertex;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.SettingsClassesToValueIdsAndUpdates;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.TriggerToDependencies;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.TriggerVertex;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.ValueIdsAndUpdatesToDependencyTree;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Update;

import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * Utility class to resolve {@link Update} annotations
 *
 * @author Paul Bärnreuther
 */
final class UpdateActionsUtil {

    private UpdateActionsUtil() {
        // Utility
    }

    record Dependency(String scope, String valueId) {
    }

    record TriggerAndDependencies(TriggerVertex trigger, Collection<DependencyVertex> dependencies) {

        String getTriggerId() {
            return trigger().getId();
        }

        String getTriggerPath() {
            final var settingsKey = trigger().getSettingsKey();
            final var path = trigger().getPath();
            return JsonFormsScopeUtil.toScope(path, settingsKey);
        }

        List<Dependency> getDependencyPaths() {
            return dependencies().stream().map(dep -> {
                final var scope = JsonFormsScopeUtil.toScope(dep.getPath(), dep.getSettingsKey());
                final var valueId = dep.getValueId().getName();
                return new Dependency(scope, valueId);
            }).toList();
        }
    }

    /**
     * Adds an array with one element for each {@link Update} annotation to the rootNode if any are present.
     */
    static void addUpdateHandlers(final ObjectNode rootNode,
        final Map<String, Class<? extends WidgetGroup>> settingsClasses) {
        final var triggersWithDependencies = getTriggersWithDependencies(settingsClasses);
        if (triggersWithDependencies.isEmpty()) {
            return;
        }
        addToUiSchema(rootNode, triggersWithDependencies);
    }

    private static void addToUiSchema(final ObjectNode rootNode,
        final List<TriggerAndDependencies> triggersWithDependencies) {
        final var globalUpdates = rootNode.putArray("globalUpdates");
        triggersWithDependencies.forEach(triggerWithDependencies -> {
            final var updateObjectNode = globalUpdates.addObject();
            final var triggerNode = updateObjectNode.putObject("trigger");
            triggerNode.put("id", triggerWithDependencies.getTriggerId());
            triggerNode.put("scope", triggerWithDependencies.getTriggerPath());
            final var dependenciesArrayNode = updateObjectNode.putArray("dependencies");
            triggerWithDependencies.getDependencyPaths().forEach(dep -> {
                final var newDependency = dependenciesArrayNode.addObject();
                newDependency.put("scope", dep.scope());
                newDependency.put("id", dep.valueId());
            });
        });
    }

    private static List<TriggerAndDependencies>
        getTriggersWithDependencies(final Map<String, Class<? extends WidgetGroup>> settingsClasses) {
        final var valueIdsAndUpdates =
            SettingsClassesToValueIdsAndUpdates.settingsClassesToValueIdsAndUpdates(settingsClasses);

        final var triggers = ValueIdsAndUpdatesToDependencyTree.valueIdsAndUpdatesToDependencyTree(valueIdsAndUpdates);
        final var triggerToDependencies = new TriggerToDependencies();
        final var triggersWithDependencies = triggers.stream()
            .map(trigger -> new TriggerAndDependencies(trigger, triggerToDependencies.triggerToDependencies(trigger)))
            .toList();
        return triggersWithDependencies;
    }

}
