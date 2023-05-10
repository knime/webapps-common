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
 *   22 Mar 2023 (Marc Bux, KNIME GmbH, Berlin, Germany): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.rule;

import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;

import org.knime.core.webui.node.dialog.defaultdialog.layout.HorizontalLayout;
import org.knime.core.webui.node.dialog.defaultdialog.layout.Section;

/**
 * With this annotation a field or a whole layout part (i.e. {@link Section} or {@link HorizontalLayout}) can be
 * disabled or hidden depending on the values of other fields which are annotated by {@link Signal} themselves.
 *
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
@Retention(RetentionPolicy.RUNTIME)
public @interface Effect {

    /**
     * This enum represents the effect that a rule has on a setting.
     */
    public enum EffectType {
            /**
             * Disable the setting per default and only enable it when the rule applies.
             */
            ENABLE, //
            /**
             * Disable the setting if the rule applies.
             */
            DISABLE, //
            /**
             * Hide the setting per default and only show it when the rule applies.
             */
            SHOW, //
            /**
             * Hide the setting if the rule applies.
             */
            HIDE
    }

    /**
     * @return the array of ids used in {@link Signal} annotations within the same settings context which should be used
     *         as building blocks for the rule. If a {@link Signal} does not define an id, it is also possible to
     *         reference it by condition, but this should only be used when the condition is a custom and unique one in
     *         the present settings context. There either has to be exactly one id if no operation is provided or the
     *         number of ids has to fit a suitable constructor of the given operation.
     */
    Class<?>[] signals();

    /**
     * @return the effect that the rule has on the targeted setting
     */
    EffectType type();

    /**
     * Multiple rule sources can be combined using logical operations.
     *
     * @return the logical operation that should be applied to the sources. This class has to have a suitable
     *         constructor for the given number of sources, i.e. either a constructor taking an array of classes
     *         assignable from {@link Condition} as its sole parameter or a constructor having the given number of
     *         parameters which are all assignable from {@link Condition}.
     */
    @SuppressWarnings("rawtypes")
    Class<? extends Operator> operation() default IdentityOperation.class;

}
