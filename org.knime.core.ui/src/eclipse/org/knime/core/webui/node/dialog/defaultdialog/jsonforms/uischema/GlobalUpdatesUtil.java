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

import java.util.List;
import java.util.Map;

import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsScopeUtil;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.PathWithSettingsKey;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.SettingsClassesToDependencyTreeUtil;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.TriggerAndDependencies;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.StateProvider;

import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * Utility class to resolve updates given by {@link StateProvider}s
 *
 * @author Paul Bärnreuther
 */
final class GlobalUpdatesUtil {

    private GlobalUpdatesUtil() {
        // Utility
    }

    /**
     * Adds an array with one element for each trigger of an update defined by {@link StateProviders} to the rootNode if
     * any are present.
     */
    static void addGlobalUpdates(final ObjectNode rootNode,
        final Map<String, Class<? extends WidgetGroup>> settingsClasses) {
        final var triggersWithDependencies =
            SettingsClassesToDependencyTreeUtil.getTriggersWithDependencies(settingsClasses);
        if (triggersWithDependencies.isEmpty()) {
            return;
        }
        addToUiSchema(rootNode, triggersWithDependencies);
    }

    private static void addToUiSchema(final ObjectNode rootNode,
        final List<TriggerAndDependencies> triggersWithDependencies) {
        final var globalUpdates = rootNode.putArray("globalUpdates");
        triggersWithDependencies
            .forEach(triggerWithDependencies -> addGlobalUpdate(globalUpdates, triggerWithDependencies));
    }

    private static void addGlobalUpdate(final ArrayNode globalUpdates,
        final TriggerAndDependencies triggerWithDependencies) {
        final var updateObjectNode = globalUpdates.addObject();
        final var triggerNode = updateObjectNode.putObject("trigger");
        triggerNode.put("id", triggerWithDependencies.getTriggerId());
        triggerWithDependencies.getTriggerFieldLocation()
            .ifPresent(fieldLocation -> triggerNode.put("scope", resolveFiledLocationToScope(fieldLocation)));
        final var dependenciesArrayNode = updateObjectNode.putArray("dependencies");
        triggerWithDependencies.getDependencies().forEach(dep -> {
            final var newDependency = dependenciesArrayNode.addObject();
            newDependency.put("scope", resolveFiledLocationToScope(dep.fieldLocation()));
            newDependency.put("id", dep.valueRef());
        });
    }

    private static String resolveFiledLocationToScope(final PathWithSettingsKey fieldLocation) {
        return JsonFormsScopeUtil.toScope(fieldLocation.path(), fieldLocation.settingsKey());
    }
}
