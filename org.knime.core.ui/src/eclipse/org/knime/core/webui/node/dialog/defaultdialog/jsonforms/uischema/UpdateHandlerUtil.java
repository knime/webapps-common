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

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Update;
import org.knime.core.webui.node.dialog.defaultdialog.util.DefaultNodeSettingsFieldTraverser;
import org.knime.core.webui.node.dialog.defaultdialog.util.DefaultNodeSettingsFieldTraverser.TraversedField;
import org.knime.core.webui.node.dialog.defaultdialog.widget.UpdateHandler;

import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * Utility class to resolve {@link Update} annotations
 *
 * @author Paul Bärnreuther
 */
final class UpdateHandlerUtil {

    private UpdateHandlerUtil() {
        // Utility
    }

    record UpdateHandlerParams(String updateHandlerName, List<String> dependencies) {
    }

    /**
     * Adds an array with one element for each {@link Update} annotation to the rootNode if any are present.
     */
    static void addUpdateHandlers(final ObjectNode rootNode,
        final Map<String, Class<? extends WidgetGroup>> settingsClasses, final Collection<JsonFormsControl> fields) {
        final var updateParams = getUpdateHandlersParams(fields, settingsClasses);
        if (updateParams.isEmpty()) {
            return;
        }
        final var globalUpdates = rootNode.putArray("globalUpdates");
        updateParams.forEach(updateParam -> {
            final var updateObjectNode = globalUpdates.addObject();
            updateObjectNode.put("updateHandler", updateParam.updateHandlerName());
            final var dependenciesArrayNode = updateObjectNode.putArray("dependencies");
            updateParam.dependencies().forEach(dependenciesArrayNode::add);
        });

    }

    private static Collection<UpdateHandlerParams> getUpdateHandlersParams(final Collection<JsonFormsControl> fields,
        final Map<String, Class<? extends WidgetGroup>> settingsClasses) {
        final var traversedFields = settingsClasses.values().stream()
            .flatMap((settingsClass) -> new DefaultNodeSettingsFieldTraverser(settingsClass).getAllFields().stream());
        final var updateHandlers = traversedFields.map(UpdateHandlerUtil::getUpdateAnnotation)
            .filter(Optional::isPresent).map(Optional::get).map(Update::updateHandler).collect(Collectors.toSet());
        return updateHandlers.stream().map(handler -> toUpdateParams(handler, fields)).toList();
    }

    private static Optional<Update> getUpdateAnnotation(final TraversedField field) {
        return Optional.ofNullable(field.propertyWriter().getAnnotation(Update.class));
    }

    private static UpdateHandlerParams toUpdateParams(final Class<? extends UpdateHandler<?, ?>> updateHandler,
        final Collection<JsonFormsControl> fields) {
        final List<String> dependencies = new ArrayList<>();
        new DependencyResolver(fields).addDependencyScopes(updateHandler, dependencies::add);
        return new UpdateHandlerParams(updateHandler.getName(), dependencies);
    }

}
