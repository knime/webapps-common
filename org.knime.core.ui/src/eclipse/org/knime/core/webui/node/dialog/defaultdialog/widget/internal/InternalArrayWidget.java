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
 *   Jul 30, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.widget.internal;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

import org.knime.core.webui.node.dialog.defaultdialog.rule.Effect;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ArrayWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ButtonReference;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.NoopStringProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.StateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueProvider;

/**
 * In addition to {@link ArrayWidget} this annotation provides UI parts of array layouts.
 *
 * @author Paul Bärnreuther
 */
@Retention(RUNTIME)
@Target(FIELD)
public @interface InternalArrayWidget {

    /**
     * When set to true, a button flipping between an edit button and a reset button appears in the array layout
     * elemnents controls.
     *
     * <ul>
     * <li><b>Edit:</b> For showing widgets only when the edit button was clicked, use the {@link ElementIsEditedSignal}
     * like you would use any other signal in an {@link Effect} annotation.</li>
     * <li><b>Reset:</b> The {@link ElementResetButton} has to be referenced in one ore multiple state providers used
     * within {@link ValueProvider} annotations on fields inside the element settings.</li>
     * </ul>
     *
     *
     * @return whether an edit and reset behavior should be added to array layout elements
     */
    boolean withEditAndReset() default false;

    /**
     * Use this button as you would use any other button reference within a {@link StateProvider} (i.e. via
     * {@link StateProvider.StateProviderInitializer#computeOnButtonClick}) to reset the values of widgets inside the
     * element using {@link ValueProvider}. Note that this even has to be done in case the default value is static.
     *
     * @author Paul Bärnreuther
     */
    @InternalButtonReferenceId("ElementResetButton")
    final class ElementResetButton implements ButtonReference {
    }

    /**
     * Use this when having {@link InternalArrayWidget#withEditAndReset} activated to show widgets inside an array
     * layout element only when it is in edit mode.
     *
     * @author Paul Bärnreuther
     */
    interface ElementIsEditedSignal {
    }

    /**
     * When set to true, put the {@link ElementCheckboxWidget} on exactly one boolean field within the element settings
     * class in order to not show it as a regular checkbox but instead a title-less checkbox next to the header of the
     * element.
     *
     * @return whether to display a checkbox left of each array layout elements header
     */
    boolean withElementCheckboxes() default false;

    /**
     * See {@link InternalArrayWidget#withElementCheckboxes}.
     *
     * @author Paul Bärnreuther
     */
    @Retention(RUNTIME)
    @Target(FIELD)
    @interface ElementCheckboxWidget {

    }

    /**
     * @return the provider for the title of the array layout elements
     */
    Class<? extends StateProvider<String>> titleProvider() default NoopStringProvider.class;

}
