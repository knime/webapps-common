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
 *   Feb 6, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.util.updates;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Map;

import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.util.DefaultNodeSettingsFieldTraverser;
import org.knime.core.webui.node.dialog.defaultdialog.util.DefaultNodeSettingsFieldTraverser.TraversedField;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Action;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Update;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueId;

/**
 *
 * @author Paul Bärnreuther
 */
public class SettingsClassesToValueIdsAndUpdates {

    record ValueIdWrapper(Class<? extends ValueId> valueId, PathWithSettingsKey scope) {
    }

    record UpdateWrapper(Class<? extends Action> action, PathWithSettingsKey scope) {
    }

    record ValueIdsAndUpdates(Collection<ValueIdWrapper> valueIds, Collection<UpdateWrapper> updates) {
    }

    public static ValueIdsAndUpdates
        settingsClassesToValueIdsAndUpdates(final Map<String, Class<? extends WidgetGroup>> settingsClasses) {

        final Collection<ValueIdWrapper> valueIds = new ArrayList<>();
        final Collection<UpdateWrapper> updates = new ArrayList<>();

        settingsClasses.entrySet().forEach(entry -> {
            final var traverser = new DefaultNodeSettingsFieldTraverser(entry.getValue());
            final var fields = traverser.getAllFields();

            fields.stream().forEach(field -> {
                addValueId(valueIds, field, entry.getKey());
                addUpdate(updates, field, entry.getKey());
            });

        });

        return new ValueIdsAndUpdates(valueIds, updates);

    }

    private static void addValueId(final Collection<ValueIdWrapper> valueIds, final TraversedField field,
        final String settingsKey) {
        final var widgetAnnotation = field.propertyWriter().getAnnotation(Widget.class);
        if (widgetAnnotation != null && !widgetAnnotation.id().equals(ValueId.class)) {
            valueIds.add(new ValueIdWrapper(widgetAnnotation.id(), new PathWithSettingsKey(field.path(), settingsKey)));
        }
    }

    private static void addUpdate(final Collection<UpdateWrapper> updates, final TraversedField field,
        final String settingsKey) {
        final var updateAnnotation = field.propertyWriter().getAnnotation(Update.class);
        if (updateAnnotation != null) {
            updates.add(new UpdateWrapper(updateAnnotation.updateHandler(),
                new PathWithSettingsKey(field.path(), settingsKey)));
        }
    }

}
