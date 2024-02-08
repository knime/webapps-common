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
 *   Dec 14, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.examples;

import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.examples.ArrayWidgetExample.ElementClass.ArrayWidgetElementLayout.HorizontalLayout1;
import org.knime.core.webui.node.dialog.defaultdialog.examples.ArrayWidgetExample.ElementClass.ArrayWidgetElementLayout.HorizontalLayout2;
import org.knime.core.webui.node.dialog.defaultdialog.examples.ArrayWidgetExample.OuterSection;
import org.knime.core.webui.node.dialog.defaultdialog.layout.After;
import org.knime.core.webui.node.dialog.defaultdialog.layout.HorizontalLayout;
import org.knime.core.webui.node.dialog.defaultdialog.layout.Layout;
import org.knime.core.webui.node.dialog.defaultdialog.layout.Section;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ArrayWidget;

/**
 * This class specifies two array widgets within one section
 *
 * @author Paul Bärnreuther
 */
@Layout(OuterSection.class)
public final class ArrayWidgetExample implements DefaultNodeSettings {

    @Section
    interface OuterSection {

    }

    ElementClass[] m_arraySetting1;

    /**
     * Optionally specify annotation to configure the UI.
     */
    @ArrayWidget(addButtonText = "Next", elementTitle = "Element", showSortButtons = false, hasFixedSize = false)
    ElementClass[] m_arraySetting2;

    /**
     * The class defining the settings structure of an element in the array widget. It does not have to be a nested
     * class but if it is it has to be static.
     */
    @Layout(HorizontalLayout1.class)
    static final class ElementClass implements DefaultNodeSettings {

        /**
         * The layout of an element inside the array widget. It is independent from the layout of the parent default
         * node settings. Element settings and layout parts should not reference the parent layout.
         */
        interface ArrayWidgetElementLayout {
            @HorizontalLayout
            interface HorizontalLayout1 {
            }

            @HorizontalLayout
            @After(HorizontalLayout1.class)
            interface HorizontalLayout2 {
            }
        }

        String m_el1;

        int m_el2;

        @Layout(HorizontalLayout2.class)
        boolean m_el3;

        @Layout(HorizontalLayout2.class)
        double m_el4;

    }

}
