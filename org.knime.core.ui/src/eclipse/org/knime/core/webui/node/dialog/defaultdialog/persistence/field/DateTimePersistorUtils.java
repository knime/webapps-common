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
 *   Nov 19, 2024 (Tobias Kampmann): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.persistence.field;

import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoField;
import java.time.temporal.Temporal;
import java.util.List;
import java.util.function.Function;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.webui.node.dialog.defaultdialog.setting.interval.DateInterval;
import org.knime.core.webui.node.dialog.defaultdialog.setting.interval.Interval;
import org.knime.core.webui.node.dialog.defaultdialog.setting.interval.TimeInterval;

/**
 * @author Tobias Kampmann
 */
final class DateTimePersistorUtils {

    private DateTimePersistorUtils() {
        // utility class
    }

    static final class LocalDatePersistor extends NodeSettingsPersistorWithConfigKey<LocalDate> {

        static final DateTimeFormatter DATE_FMT = DateTimeFormatter.ISO_LOCAL_DATE;

        @Override
        public LocalDate load(final NodeSettingsRO settings) throws InvalidSettingsException {
            final var value = settings.getString(getConfigKey());

            var temporal = parseDateTemporal(value);
            return LocalDate.from(temporal);
        }

        @Override
        public void save(final LocalDate date, final NodeSettingsWO settings) {
            settings.addString(getConfigKey(), date.format(DATE_FMT));
        }

        private static Temporal parseDateTemporal(final String s) throws InvalidSettingsException {
            // flow variables can have any format including the date for convenience
            return parseTemporal(s, List.of(ZonedDateTime::parse, LocalDateTime::parse, LocalDate::parse), "date");
        }
    }

    static final class LocalTimePersistor extends NodeSettingsPersistorWithConfigKey<LocalTime> {

        @Override
        public LocalTime load(final NodeSettingsRO settings) throws InvalidSettingsException {
            var value = settings.getString(getConfigKey());

            var temporal = parseTimeTemporal(value);

            return LocalTime.of( //
                temporal.get(ChronoField.HOUR_OF_DAY), //
                temporal.get(ChronoField.MINUTE_OF_HOUR), //
                temporal.isSupported(ChronoField.SECOND_OF_MINUTE) //
                    ? temporal.get(ChronoField.SECOND_OF_MINUTE) //
                    : 0, //
                temporal.isSupported(ChronoField.NANO_OF_SECOND) //
                    ? temporal.get(ChronoField.NANO_OF_SECOND) //
                    : 0 //
            );
        }

        @Override
        public void save(final LocalTime obj, final NodeSettingsWO settings) {
            var timeToSave = obj.format(DateTimeFormatter.ISO_LOCAL_TIME);
            settings.addString(getConfigKey(), timeToSave);
        }

        private static Temporal parseTimeTemporal(final String s) throws InvalidSettingsException {
            // flow variables can have any format including the time for convenience
            return parseTemporal(s, List.of(ZonedDateTime::parse, LocalDateTime::parse, LocalTime::parse), "time");
        }
    }

    static final class TimeZonePersistor extends NodeSettingsPersistorWithConfigKey<ZoneId> {

        private static ZoneId extractFromString(final String str) throws InvalidSettingsException {
            try {
                return ZoneId.of(str);
            } catch (DateTimeException ex) { // NOSONAR this exception is used as control flow
                ZonedDateTime parsedZonedDateTime = parseTemporal(str, List.of(ZonedDateTime::parse), "time zone");
                return parsedZonedDateTime.getZone();
            }
        }

        @Override
        public ZoneId load(final NodeSettingsRO settings) throws InvalidSettingsException {
            if (settings.getString(getConfigKey()) == null) {
                return null;
            } else {
                return TimeZonePersistor.extractFromString(settings.getString(getConfigKey()));
            }
        }

        @Override
        public void save(final ZoneId obj, final NodeSettingsWO settings) {
            if (obj != null) {
                settings.addString(getConfigKey(), obj.getId());
            } else {
                settings.addString(getConfigKey(), null);
            }
        }
    }

    static final class IntervalPersistor extends NodeSettingsPersistorWithConfigKey<Interval> {

        @Override
        public Interval load(final NodeSettingsRO settings) throws InvalidSettingsException {
            final var value = settings.getString(getConfigKey());

            try {
                return Interval.parseHumanReadableOrIso(value);
            } catch (IllegalArgumentException ex) {
                throw new InvalidSettingsException("Failed to parse '%s' as Interval".formatted(value), ex);
            }
        }

        @Override
        public void save(final Interval interval, final NodeSettingsWO settings) {
            settings.addString(getConfigKey(), interval.toISOString());
        }
    }

    static final class DateIntervalPersistor extends NodeSettingsPersistorWithConfigKey<DateInterval> {

        @Override
        public DateInterval load(final NodeSettingsRO settings) throws InvalidSettingsException {
            final var value = settings.getString(getConfigKey());

            Interval parsed;
            try {
                parsed = Interval.parseHumanReadableOrIso(value);
            } catch (IllegalArgumentException ex) {
                throw new InvalidSettingsException("Failed to parse '%s' as DateInterval".formatted(value), ex);
            }

            if (!(parsed instanceof DateInterval)) {
                throw new InvalidSettingsException("Loaded Interval '%s' is not a DateInterval.".formatted(value));
            }

            return (DateInterval)parsed;
        }

        @Override
        public void save(final DateInterval interval, final NodeSettingsWO settings) {
            settings.addString(getConfigKey(), interval.toISOString());
        }
    }

    static final class TimeIntervalPersistor extends NodeSettingsPersistorWithConfigKey<TimeInterval> {

        @Override
        public TimeInterval load(final NodeSettingsRO settings) throws InvalidSettingsException {
            final var value = settings.getString(getConfigKey());

            Interval parsed;
            try {
                parsed = Interval.parseHumanReadableOrIso(value);
            } catch (IllegalArgumentException ex) {
                throw new InvalidSettingsException("Failed to parse '%s' as TimeInterval".formatted(value), ex);
            }

            if (!(parsed instanceof TimeInterval)) {
                throw new InvalidSettingsException("Loaded Interval '%s' is not a TimeInterval.".formatted(value));
            }

            return (TimeInterval)parsed;
        }

        @Override
        public void save(final TimeInterval interval, final NodeSettingsWO settings) {
            settings.addString(getConfigKey(), interval.toISOString());
        }
    }

    private static <T extends Temporal> T parseTemporal(final String s, final List<Function<String, T>> parsers,
        final String typeDescription) throws InvalidSettingsException {
        for (var parser : parsers) {
            try {
                return parser.apply(s);
            } catch (DateTimeParseException ignored) { // NOSONAR
            }
        }
        throw new InvalidSettingsException(
            String.format("String '%s' could not be parsed as a %s.", s, typeDescription));
    }
}
