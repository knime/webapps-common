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
 *   Oct 9, 2023 (hornm): created
 */
package org.knime.core.webui.node.impl;

import java.util.HashMap;
import java.util.Map;
import java.util.function.Consumer;

import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsDataUtil;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.JsonFormsUiSchemaUtil;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.LayoutTreeNode;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.UiSchemaDefaultNodeSettingsTraverser.JsonFormsControl;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.w3c.dom.Element;

import com.fasterxml.jackson.databind.ser.PropertyWriter;

/**
 * Helps to add options to a tab. The logic resides in a separate non-public class because it uses jackson-logic
 * ({@link PropertyWriter}) to extract the option-title and -description. Otherwise consumers of the
 * {@link WebUINodeFactory}-class would need to import the respective jackson-library, too (even though the
 * {@link PropertyWriter} is not exposed at a public method, anyway).
 *
 * @author Paul Bärnreuther
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
final class OptionsAdder {

    private OptionsAdder() {
        // utility
    }

    static void addOptionsToTab(final Element tab, final Class<? extends DefaultNodeSettings> modelSettingsClass,
        final Class<? extends DefaultNodeSettings> viewSettingsClass, final OptionCreator optionCreator) {
        addOptions(modelSettingsClass, viewSettingsClass, field -> createOption(field, tab, optionCreator));
    }

    private static void addOptions(final Class<?> modelSettingsClass, final Class<?> viewSettingsClass,
        final Consumer<PropertyWriter> addField) {
        final Map<String, Class<?>> settings = new HashMap<>();
        if (modelSettingsClass != null) {
            settings.put(SettingsType.MODEL.getConfigKey(), modelSettingsClass);
        }
        if (viewSettingsClass != null) {
            settings.put(SettingsType.VIEW.getConfigKey(), viewSettingsClass);
        }
        final var layoutTree =
            JsonFormsUiSchemaUtil.resolveLayout(settings, JsonFormsDataUtil.getMapper()).layoutTreeRoot();
        applyToAllLeaves(layoutTree, addField);
    }

    private static void applyToAllLeaves(final LayoutTreeNode layoutTree, final Consumer<PropertyWriter> addField) {
        layoutTree.getControls().stream().map(JsonFormsControl::field).forEach(addField);
        layoutTree.getChildren().forEach(childNode -> applyToAllLeaves(childNode, addField));
    }

    private static final void createOption(final PropertyWriter field, final Element tab,
        final OptionCreator optionCreator) {
        final var widget = field.getAnnotation(Widget.class);
        if (widget != null) {
            var option = optionCreator.createOption(widget.title(), widget.description());
            tab.appendChild(option);
        }
    }

    @FunctionalInterface
    interface OptionCreator {
        Element createOption(String title, String description);
    }
}
