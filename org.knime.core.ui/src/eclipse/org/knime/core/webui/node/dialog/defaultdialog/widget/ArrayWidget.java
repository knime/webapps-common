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
 *   May 8, 2023 (benjamin): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.widget;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import org.knime.core.webui.node.dialog.defaultdialog.examples.ArrayWidgetExample;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ButtonReference;

/**
 * An annotation to set the button text and element title of array or collection settings.
 *
 * See {@link ArrayWidgetExample} for an example on how to use the annotation.
 *
 * @author Benjamin Wilhelm, KNIME GmbH, Berlin, Germany
 * @author Paul Bärnreuther
 */
@Retention(RUNTIME)
@Target(FIELD)
public @interface ArrayWidget {

    /**
     * @return the label of the add button which adds new elements to the settings
     */
    String addButtonText() default "";

    /**
     * @return a title that is shown above each element of the array
     */
    String elementTitle() default "";

    /**
     * @return whether sort buttons should be shown that allow to change the order of the array elements
     */
    boolean showSortButtons() default false;

    /**
     * @return whether add and delete buttons should be hidden such that the size of the array cannot be changed
     */
    boolean hasFixedSize() default false;


    @ButtonReference.Id("ElementResetButton")
    interface ElementResetButton extends ButtonReference {
    }

    // TODO: UIEXT-1956 Make this a Condition
    interface ElementIsEditedSignal {
    }


}
