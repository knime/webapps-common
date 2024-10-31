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
 *   Dec 5, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.setting.interval;

import java.util.regex.Pattern;

final class StringToIntervalUtil {

    private StringToIntervalUtil() {
        // static methods only
    }

    // These are the regexes used to parse human-readable intervals and durations.
    private static final String HR_YEARS_PART = "(\\d+)\\s*y(?:ears?)?";

    private static final String HR_MONTHS_PART = "(\\d+)\\s*m(?:o(?:nths?)?)?";

    private static final String HR_WEEKS_PART = "(\\d+)\\s*w(?:eeks?)?";

    private static final String HR_DAYS_PART = "(\\d+)\\s*d(?:ays?)?";

    private static final String HR_HOURS_PART = "(\\d+)\\s*h(?:ours?)?";

    private static final String HR_MINUTES_PART = "(\\d+)\\s*m(?:in(?:s|utes?)?)?";

    private static final String HR_SECONDS_PART = "(\\d+)(?:[,.](\\d{1,3}))?\\s*s(?:ec(?:s|onds?)?)?";

    /**
     * Match the period part of an ISO8601 duration. Here we allow a negative sign in front of the whole thing, but each
     * individual unit must be positive.
     */
    private static final Pattern ISO_PERIOD_REGEX =
        Pattern.compile("^(-?)P(?:(\\d+)Y)?(?:(\\d+)M)?(?:(\\d+)W)?(?:(\\d+)D)?$");

    /**
     * Match the duration part of an ISO8601 duration. Here individual units can be negative, but the whole thing must
     * be positive.
     */
    private static final Pattern ISO_DURATION_REGEX =
        Pattern.compile("^(-?)PT(?:(\\d+)H)?(?:(\\d+)M)?(?:(\\d+)(?:[,.](\\d{1,3}))?S)?$");

    /**
     * Match a human-readable period, e.g. "1 year 2 months 3 weeks 4 days". Letter case is unimportant, and each unit
     * can be singular or plural. Short forms are also allowed, so e.g. "1y" is equivalent to "1 yEaR". Whitespace is
     * unimportant too, so "1year2w" is also valid. Additionally, months can be abbreviated to "mo".
     */
    private static final Pattern HUMAN_READABLE_PERIOD_REGEX = Pattern.compile( //
        "^(?:%s)?\\s*(?:%s)?\\s*(?:%s)?\\s*(?:%s)?$".formatted( //
            HR_YEARS_PART, HR_MONTHS_PART, HR_WEEKS_PART, HR_DAYS_PART //
        ), //
        Pattern.CASE_INSENSITIVE //
    );

    /**
     * Match a human-readable duration, e.g. "4 hours 5 minutes 6.789 seconds". Letter case is unimportant, and each
     * unit can be singular or plural. Short forms are also allowed, so e.g. "4h" is equivalent to "4 hOuRs". Whitespace
     * is unimportant too, so "4hours5m" is also valid. Additionally, seconds can be abbreviated to "secs" or "sec",
     * minutes can be abbreviated to "min" or "mins".
     *
     * Fractional seconds are also allowed, but only up to 3 decimal places.
     */
    private static final Pattern HUMAN_READABLE_DURATION_REGEX = Pattern.compile( //
        "^(?:%s)?\\s*(?:%s)?\\s*(?:%s)?$".formatted(HR_HOURS_PART, HR_MINUTES_PART, HR_SECONDS_PART), //
        Pattern.CASE_INSENSITIVE //
    );

    /**
     * Parse the given string to either a {@link DateInterval} or a {@link TimeInterval}. It will first try to parse it
     * as an ISO8601 string, and if that fails, it will try to parse it as a human-readable string.
     *
     * @param input a string representing EITHER a period OR a duration.
     * @return either a {@link DateInterval} or a {@link TimeInterval}.
     */
    static Interval parseHumanReadableOrIso(final String input) {
        try {
            return parseISO(input);
        } catch (IllegalArgumentException eIso) { // NOSONAR
            try {
                return parseHumanReadable(input);
            } catch (IllegalArgumentException eHumanReadable) { // NOSONAR
                throw new IllegalArgumentException("""
                        '%s' is neither a human-readable duration/period nor an ISO duration/period.
                        Parsing as ISO gave the following error: '%s'
                        Parsing as human-readable gave the following error: '%s'
                        """.formatted(input, eIso.getMessage(), eHumanReadable.getMessage()));
            }
        }
    }

    /**
     * Parse the given human-readable string to either a {@link DateInterval} or a {@link TimeInterval}.
     *
     * @param humanReadable a human-readable string representing EITHER a period (e.g. 1 year 2 months 3 weeks 4 days)
     *            or a duration (e.g. '4h 5m 6.789secs')
     * @return either a {@link DateInterval} or a {@link TimeInterval}.
     */
    static Interval parseHumanReadable(String humanReadable) {
        humanReadable = humanReadable.trim();

        var periodMatcher = HUMAN_READABLE_PERIOD_REGEX.matcher(humanReadable);
        var durationMatcher = HUMAN_READABLE_DURATION_REGEX.matcher(humanReadable);

        var periodMatches = periodMatcher.matches();
        var durationMatches = durationMatcher.matches();

        if (periodMatches && durationMatches) {
            throw new IllegalArgumentException(
                "'%s' is ambiguous - is it supposed to be a a human-readable duration or a human-readable period?"
                    .formatted(humanReadable));
        }

        if (periodMatches) {
            return DateInterval.of( //
                tryParseInt(periodMatcher.group(1), 0), //
                tryParseInt(periodMatcher.group(2), 0), //
                tryParseInt(periodMatcher.group(3), 0), //
                tryParseInt(periodMatcher.group(4), 0) //
            );
        } else if (durationMatches) {
            return TimeInterval.of( //
                tryParseLong(durationMatcher.group(1), 0), //
                tryParseLong(durationMatcher.group(2), 0), //
                tryParseLong(durationMatcher.group(3), 0), //
                tryParseLong(durationMatcher.group(4), 0) //
            );
        } else {
            throw new IllegalArgumentException(
                "'%s' is neither a human-readable duration nor a human-readable period".formatted(humanReadable));
        }
    }

    /**
     * Parse the given ISO string to either a {@link DateInterval} or a {@link TimeInterval}.
     *
     * @param iso an iso string representing EITHER a period (P1Y2M3D) or a duration (PT4H5M6.789S)
     * @return either a {@link DateInterval} or a {@link TimeInterval}.
     */
    static Interval parseISO(String iso) {
        iso = iso.trim();

        var periodMatcher = ISO_PERIOD_REGEX.matcher(iso);
        var durationMatcher = ISO_DURATION_REGEX.matcher(iso);

        if (periodMatcher.matches()) {
            return DateInterval.of( //
                "-".equals(periodMatcher.group(1)), //
                tryParseInt(periodMatcher.group(2), 0), //
                tryParseInt(periodMatcher.group(3), 0), //
                tryParseInt(periodMatcher.group(4), 0), //
                tryParseInt(periodMatcher.group(5), 0) //
            );
        } else if (durationMatcher.matches()) {
            return TimeInterval.of( //
                "-".equals(durationMatcher.group(1)), //
                tryParseLong(durationMatcher.group(2), 0), //
                tryParseLong(durationMatcher.group(3), 0), //
                tryParseLong(durationMatcher.group(4), 0), //
                tryParseLong(durationMatcher.group(5), 0) //
            );
        } else {
            throw new IllegalArgumentException("'%s' is neither an ISO duration nor an ISO period".formatted(iso));
        }
    }

    /**
     * Parse the int if it is not null, otherwise return the default value. Useful for succinct handling of regex
     * groups.
     */
    private static int tryParseInt(final String str, final int def) {
        if (str == null) {
            return def;
        } else {
            return Integer.parseInt(str);
        }
    }

    /**
     * Parse the long if it is not null, otherwise return the default value. Useful for succinct handling of regex
     * groups.
     */
    private static long tryParseLong(final String str, final long def) {
        if (str == null) {
            return def;
        } else {
            return Long.parseLong(str);
        }
    }

}
