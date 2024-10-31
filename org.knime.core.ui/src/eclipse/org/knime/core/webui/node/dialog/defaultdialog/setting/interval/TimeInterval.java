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
 *   Dec 4, 2024 (david): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.setting.interval;

import java.io.IOException;
import java.time.Duration;
import java.time.Period;
import java.time.temporal.ChronoUnit;
import java.time.temporal.Temporal;
import java.time.temporal.TemporalAmount;
import java.time.temporal.TemporalUnit;
import java.util.List;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonTypeName;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.annotation.JsonDeserialize;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.google.common.base.Preconditions;

/**
 * A class representing an interval made of fixed-length units like hours, minutes, seconds, and milliseconds. It's
 * almost the same as a {@link Duration} except that a {@link Duration} doesn't know anything except its length in
 * seconds (so e.g. a {@link Duration} doesn't know if it was created with 1H, or 3600S), which is bad if we want to be
 * able to reconstruct the user input later. See {@link Interval} for more details.
 *
 * @author David Hickey, TNG Technology Consulting GmbH
 */
@JsonTypeName("timeInterval")
@JsonSerialize(using = TimeInterval.Serializer.class)
@JsonDeserialize(using = TimeInterval.Deserializer.class)
public final class TimeInterval implements Interval {

    private final boolean m_negative;

    private final long m_hours;

    private final long m_minutes;

    private final long m_seconds;

    private final long m_milliseconds;

    private TimeInterval(final boolean negative, final long hours, final long minutes, final long seconds,
        final long milliseconds) {

        this.m_negative = negative;
        this.m_hours = requireNonNegative(hours);
        this.m_minutes = requireNonNegative(minutes);
        this.m_seconds = requireNonNegative(seconds);
        this.m_milliseconds = requireNonNegative(milliseconds);
    }

    TimeInterval() {
        this(false, 0, 0, 0, 0);
    }

    @Override
    public long get(final TemporalUnit unit) {
        if (!(unit instanceof ChronoUnit)) {
            throw new IllegalArgumentException("Only Chronounits are supported");
        }

        var cunit = (ChronoUnit)unit;

        return switch (cunit) {
            case HOURS -> getHours();
            case MINUTES -> getMinutes();
            case SECONDS -> getSeconds();
            case MILLIS -> getMilliseconds();
            default -> throw new IllegalArgumentException("Unexpected unit: " + unit);
        };
    }

    @Override
    public List<TemporalUnit> getUnits() {
        return List.of(ChronoUnit.HOURS, ChronoUnit.MINUTES, ChronoUnit.SECONDS, ChronoUnit.MILLIS);
    }

    @Override
    public Temporal addTo(final Temporal temporal) {
        return asDuration().addTo(temporal);
    }

    @Override
    public Temporal subtractFrom(final Temporal temporal) {
        return asDuration().subtractFrom(temporal);
    }

    /**
     * @return the hours
     */
    public long getHours() {
        return signMultiplier() * m_hours;
    }

    /**
     * @return the minutes
     */
    public long getMinutes() {
        return signMultiplier() * m_minutes;
    }

    /**
     * @return the seconds
     */
    public long getSeconds() {
        return signMultiplier() * m_seconds;
    }

    /**
     * @return the milliseconds
     */
    public long getMilliseconds() {
        return signMultiplier() * m_milliseconds;
    }

    /**
     * @return the total length of this duration in milliseconds.
     */
    public long getTotalMilliseconds() {
        return asDuration().toMillis();
    }

    /**
     * Convert this to a {@link Duration}.
     *
     * @return a duration with the same length as this.
     */
    public Duration asDuration() {
        return Duration.from(this);
    }

    @Override
    public String toISOString() {
        return "%sPT%sH%sM%s.%03dS".formatted(signAsSymbol(), m_hours, m_minutes, m_seconds, m_milliseconds);
    }

    /**
     * Create a {@link TimeInterval} from the given fields.
     *
     * @param hours
     * @param minutes
     * @param seconds
     * @param milliseconds
     * @return a {@link TimeInterval} that keeps track of the values used to create it, but can be used like a normal
     *         {@link TemporalAmount} and easily converted to a {@link Duration}.
     */
    public static TimeInterval of(final long hours, final long minutes, final long seconds, final long milliseconds) {

        return of(false, hours, minutes, seconds, milliseconds);
    }

    /**
     * Create a {@link TimeInterval} from the given fields.
     *
     * @param negative is true, this interval will be negative.
     * @param hours
     * @param minutes
     * @param seconds
     * @param milliseconds
     * @return a {@link TimeInterval} that keeps track of the values used to create it, but can be used like a normal
     *         {@link TemporalAmount} and easily converted to a {@link Duration}.
     */
    public static TimeInterval of(final boolean negative, final long hours, final long minutes, final long seconds,
        final long milliseconds) {

        return new TimeInterval(negative, hours, minutes, seconds, milliseconds);
    }

    @Override
    public boolean isStrictlyNegative() {
        return asDuration().isNegative();
    }

    @Override
    public boolean isZero() {
        return asDuration().isZero();
    }

    @Override
    public boolean equals(final Object obj) {
        if (!(obj instanceof TimeInterval)) {
            return false;
        }

        var other = (TimeInterval)obj;
        return m_negative == other.m_negative && m_hours == other.m_hours && m_minutes == other.m_minutes
            && m_seconds == other.m_seconds && m_milliseconds == other.m_milliseconds;
    }

    @Override
    public int hashCode() {
        return Objects.hash(m_negative, m_hours, m_minutes, m_seconds, m_milliseconds);
    }

    @Override
    public String toString() {
        return "TimeInterval[%s]".formatted(toISOString());
    }

    private int signMultiplier() {
        return m_negative ? -1 : 1;
    }

    private String signAsSymbol() {
        return m_negative ? "-" : "";
    }

    private static long requireNonNegative(final long value) {
        Preconditions.checkArgument(value >= 0, "Value must be positive");
        return value;
    }

    /**
     * A deserializer for {@link Interval}s. It will convert an ISO8601 string representing either a {@link Period} or a
     * {@link Duration} to an {@link Interval} of the appropriate type (at the time of writing, either a
     * {@link TimeInterval} or a {@link DateInterval}).
     */
    static final class Deserializer extends JsonDeserializer<TimeInterval> {

        @Override
        public TimeInterval deserialize(final JsonParser p, final DeserializationContext ctxt) throws IOException {
            Interval parsed;
            try {
                parsed = Interval.parseISO(p.getValueAsString());
            } catch (IllegalArgumentException e) {
                throw new IOException("Could not parse interval '%s'".formatted(p.getValueAsString()), e);
            }

            if (!(parsed instanceof TimeInterval)) {
                throw new IOException("Expected a TimeInterval, got a " + parsed.getClass().getSimpleName());
            }

            return (TimeInterval)parsed;
        }
    }

    /**
     * A serializer for {@link Interval}s. It will convert an {@link Interval} to an ISO8601 string representing either
     * a {@link Period} or a {@link Duration}, e.g. P1Y2M3W4D or PT1H2M3.456S.
     */
    static final class Serializer extends JsonSerializer<TimeInterval> {

        @Override
        public void serialize(final TimeInterval value, final JsonGenerator gen, final SerializerProvider serializers)
            throws IOException {
            gen.writeString(value.toISOString());
        }
    }
}
