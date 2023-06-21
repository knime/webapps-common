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
 *   Jun 15, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.widget.button;

import static java.lang.annotation.ElementType.FIELD;
import static java.lang.annotation.RetentionPolicy.RUNTIME;

import java.lang.annotation.Retention;
import java.lang.annotation.Target;

/**
 *
 * This annotation can be applied to a field of any serializable type, in order to display a button widget which, on
 * click, invokes an action specified by the given actionHandler. The returned value is set to the setting on a
 * successful response.
 *
 * @author Paul Bärnreuther
 */
@Retention(RUNTIME)
@Target(FIELD)
public @interface ButtonWidget {

    /**
     * @return the action handler that is to be triggered on click. A successful result should be of the same type as
     *         the setting that is implemented.
     */
    Class<? extends ActionHandler<?>> actionHandler();

    /**
     * @return the initial text shown on the button that should describe the invoked action.
     */
    String invokeButtonText() default "";

    /**
     * @return the text that appears on the button during a request for asynchronous actions. Should indicate that the
     *         current request will be cancelled if the button is triggered.
     */
    String cancelButtonText() default "";

    /**
     * @return the text that appears on a single-use button after the invoked action has succeeded.
     */
    String succeededButtonText() default "";

    /**
     * @return if set to true, error messages are displayed besides the button.
     */
    boolean displayErrorMessage() default true;

    /**
     * @return if set to true, the button can be triggered multiple times. Otherwise it will deactivate after a single
     *         successful invocation.
     */
    boolean isMultipleUse() default false;

    /**
     * @return if set to true, title and description will be shown above the ButtonWidget
     */
    boolean showTitleAndDescription() default true;

}
