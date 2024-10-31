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
 *   Oct 31, 2024 (david): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.widget;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import org.knime.core.webui.node.dialog.defaultdialog.setting.interval.DateInterval;
import org.knime.core.webui.node.dialog.defaultdialog.setting.interval.Interval;
import org.knime.core.webui.node.dialog.defaultdialog.setting.interval.TimeInterval;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.StateProvider;

/**
 * <p>
 * A widget representing an interval of time, that can annotate a setting of type {@link Interval}. See that class for
 * more information.
 * </p>
 * <p>
 * Note that if you do not specify this annotation, the type of an {@link Interval} settings field will be inferred from
 * the declared java type of the field. So, if you don't need any dynamic control of whether an interval is time- or
 * date-based, you can leave this annotation off, in which case:
 * <ul>
 * <li>Fields with declared type {@link TimeInterval} will have type {@link IntervalType#TIME}.</li>
 * <li>Fields with declared type {@link DateInterval} will have type {@link IntervalType#DATE}.</li>
 * <li>Fields with declared type {@link Interval} will have type {@link IntervalType#DATE_OR_TIME}.</li>
 * </ul>
 * </p>
 *
 * @author David Hickey, TNG Technology Consulting GmbH
 */
@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.FIELD)
public @interface IntervalWidget {

    /**
     * A {@link StateProvider} which can provide the {@link IntervalType} of this {@link IntervalWidget}.
     *
     * @return the type provider
     */
    Class<? extends StateProvider<IntervalType>> typeProvider();

    /**
     * The type of the duration for the {@link IntervalWidget}.
     */
    public enum IntervalType {
            /**
             * A time duration, which consists only of hours, minutes, seconds, and subseconds.
             */
            TIME,
            /**
             * A date duration, which consists of years, months, weeks, and days.
             */
            DATE,
            /**
             * A date-time duration, which consists of EITHER date OR time components, but not both.
             */
            DATE_OR_TIME;
    }
}
