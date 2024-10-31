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
 *   Nov 4, 2024 (david): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.setting.interval;

import java.time.Duration;
import java.time.Period;
import java.time.temporal.TemporalAmount;

/**
 * An abstract class representing some kind of abstract date&time based interval, complete with serialisers for Jackson.
 *
 * <p>
 * Why not use the built-in Java types? Both {@link Duration} and {@link Period} are missing a couple of features we
 * want. For example, {@link Duration} doesn't remember the values used to create it, so you can't figure out if some
 * hypothetical {@link Duration} was created with 1H or 3600S, which means you can't reconstruct the user input.
 * {@link Period} doesn't have a concept of weeks, and we want to be able to handle those.
 * </p>
 * <p>
 * So we created this class to handle both fixed-length intervals (like hours, minutes, seconds, and milliseconds -
 * these are called 'fixed length' because for example one second is always one second, and a minute always has 60 of
 * them, and so on) and variable-length intervals (like years, months, weeks, and days, which are not always the same
 * length - for example, days are not always 24h, because of daylight savings, and months all have different numbers of
 * days).
 * </p>
 * <p>
 * Note that fixed-length intervals are 'time-based', i.e. they use units like hours, minutes, seconds, and
 * milliseconds, whereas variable-length intervals are 'date-based', i.e. they use units like years, months, weeks, and
 * days.
 * </p>
 *
 * @author David Hickey, TNG Technology Consulting GmbH
 */
public sealed interface Interval extends TemporalAmount permits TimeInterval, DateInterval {

    /**
     * Convert this interval to an ISO8601 string.
     *
     * @return the ISO string representing this interval.
     */
    String toISOString();

    /**
     * @return whether this interval is negative. This will return false for zero intervals. If you need to check if an
     *         interval is non-strictly negative, use {@link #isStrictlyNegative()} || {@link #isZero()}.
     */
    boolean isStrictlyNegative();

    /**
     * @return whether this interval is positive. This will return false for zero intervals. If you need to check if an
     *         interval is non-strictly positive, use {@link #isStrictlyPositive()} || {@link #isZero()}.
     */
    default boolean isStrictlyPositive() {
        return !isStrictlyNegative() && !isZero();
    }

    /**
     * @return whether this interval is zero.
     */
    boolean isZero();

    /**
     * Parse the given string to either a {@link DateInterval} or a {@link TimeInterval}. It will first try to parse it
     * as an ISO8601 string, and if that fails, it will try to parse it as a human-readable string.
     *
     * @param input a string representing EITHER a period OR a duration.
     * @return either a {@link DateInterval} or a {@link TimeInterval}.
     */
    static Interval parseHumanReadableOrIso(final String input) {
        return StringToIntervalUtil.parseHumanReadableOrIso(input);
    }

    /**
     * Parse the given ISO string to either a {@link DateInterval} or a {@link TimeInterval}.
     *
     * @param iso an iso string representing EITHER a period (P1Y2M3D) or a duration (PT4H5M6.789S)
     * @return either a {@link DateInterval} or a {@link TimeInterval}.
     */
    static Interval parseISO(final String iso) {
        return StringToIntervalUtil.parseISO(iso);
    }

    /**
     * Parse the given human-readable string to either a {@link DateInterval} or a {@link TimeInterval}.
     *
     * @param humanReadable a human-readable string representing EITHER a period (e.g. 1 year 2 months 3 weeks 4 days)
     *            or a duration (e.g. '4h 5m 6.789secs')
     * @return either a {@link DateInterval} or a {@link TimeInterval}.
     */
    static Interval parseHumanReadable(final String humanReadable) {
        return StringToIntervalUtil.parseHumanReadable(humanReadable);
    }
}
