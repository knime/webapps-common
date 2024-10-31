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
 * A class representing an interval consisting of variable-length units, like days, months, weeks and years. This is
 * very similar to a {@link Period} except that it has a concept of weeks. See {@link Interval} for more details.
 *
 * @author David Hickey, TNG Technology Consulting GmbH
 */
@JsonTypeName("dateInterval")
@JsonSerialize(using = DateInterval.Serializer.class)
@JsonDeserialize(using = DateInterval.Deserializer.class)
public final class DateInterval implements Interval {

    private final boolean m_negative;

    private final int m_years;

    private final int m_months;

    private final int m_weeks;

    private final int m_days;

    private DateInterval(final boolean negative, final int years, final int months, final int weeks, final int days) {

        this.m_negative = negative;
        this.m_years = requireNonNegative(years);
        this.m_months = requireNonNegative(months);
        this.m_weeks = requireNonNegative(weeks);
        this.m_days = requireNonNegative(days);
    }

    DateInterval() {
        this(false, 0, 0, 0, 0);
    }

    @Override
    public long get(final TemporalUnit unit) {
        var cunit = (ChronoUnit)unit;

        return switch (cunit) {
            case YEARS -> getYears();
            case MONTHS -> getMonths();
            case WEEKS -> getWeeks();
            case DAYS -> getDays();
            default -> throw new IllegalArgumentException("Unexpected unit: " + unit);
        };
    }

    @Override
    public List<TemporalUnit> getUnits() {
        return List.of(ChronoUnit.YEARS, ChronoUnit.MONTHS, ChronoUnit.WEEKS, ChronoUnit.DAYS);
    }

    @Override
    public Temporal addTo(final Temporal temporal) {
        return asPeriod().addTo(temporal);
    }

    @Override
    public Temporal subtractFrom(final Temporal temporal) {
        return asPeriod().subtractFrom(temporal);
    }

    @Override
    public String toISOString() {
        return "%sP%sY%sM%sW%sD".formatted(signAsSymbol(), m_years, m_months, m_weeks, m_days);
    }

    /**
     * @return the days
     */
    public int getDays() {
        return signMultiplier() * m_days;
    }

    /**
     * @return the months
     */
    public int getMonths() {
        return signMultiplier() * m_months;
    }

    /**
     * @return the weeks
     */
    public int getWeeks() {
        return signMultiplier() * m_weeks;
    }

    /**
     * @return the years
     */
    public int getYears() {
        return signMultiplier() * m_years;
    }

    @Override
    public boolean isStrictlyNegative() {
        return m_negative && !isZero();
    }

    @Override
    public boolean isZero() {
        return m_years == 0 && m_months == 0 && m_weeks == 0 && m_days == 0;
    }

    /**
     * Convert this to a {@link Period}. Note that since a {@link Period} has no concept of weeks, this will be a
     * {@link Period} with the same number of years and months as this, but with a day count equal to:
     *
     * {@link DateInterval#getDays()} + 7*{@link DateInterval#getWeeks()}
     *
     * @return a {@link Period} with the same length as this.
     */
    public Period asPeriod() {
        return Period.of(getYears(), getMonths(), getDays()).plus(Period.ofWeeks(getWeeks()));
    }

    @Override
    public boolean equals(final Object obj) {
        if (!(obj instanceof DateInterval)) {
            return false;
        }

        var other = (DateInterval)obj;
        return m_negative == other.m_negative && m_years == other.m_years && m_months == other.m_months
            && m_weeks == other.m_weeks && m_days == other.m_days;
    }

    @Override
    public int hashCode() {
        return Objects.hash(m_negative, m_years, m_months, m_weeks, m_days);
    }

    @Override
    public String toString() {
        return "DateInterval[%s]".formatted(toISOString());
    }

    private int signMultiplier() {
        return m_negative ? -1 : 1;
    }

    private String signAsSymbol() {
        return m_negative ? "-" : "";
    }

    /**
     * Create a positive {@link DateInterval} from the given fields.
     *
     * @param years
     * @param months
     * @param weeks
     * @param days
     * @return a {@link DateInterval} that keeps track of the values used to create it, but can be used like a normal
     *         {@link TemporalAmount} and easily converted to a {@link Period}.
     */
    public static DateInterval of(final int years, final int months, final int weeks, final int days) {
        return of(false, years, months, weeks, days);
    }

    /**
     * Create a {@link DateInterval} from the given fields.
     *
     * @param negative is true, this interval will be negative.
     * @param years
     * @param months
     * @param weeks
     * @param days
     * @return a {@link DateInterval} that keeps track of the values used to create it, but can be used like a normal
     *         {@link TemporalAmount} and easily converted to a {@link Period}.
     */
    public static DateInterval of(final boolean negative, final int years, final int months, final int weeks,
        final int days) {

        return new DateInterval(negative, years, months, weeks, days);
    }

    private static int requireNonNegative(final int value) {
        Preconditions.checkArgument(value >= 0, "Value must be positive");
        return value;
    }

    /**
     * A deserializer for {@link Interval}s. It will convert an ISO8601 string representing either a {@link Period} or a
     * {@link Duration} to an {@link Interval} of the appropriate type (at the time of writing, either a
     * {@link TimeInterval} or a {@link DateInterval}).
     */
    static final class Deserializer extends JsonDeserializer<DateInterval> {

        @Override
        public DateInterval deserialize(final JsonParser p, final DeserializationContext ctxt) throws IOException {
            Interval parsed;
            try {
                parsed = Interval.parseISO(p.getValueAsString());
            } catch (IllegalArgumentException e) {
                throw new IOException("Could not parse interval '%s'".formatted(p.getValueAsString()), e);
            }

            if (!(parsed instanceof DateInterval)) {
                throw new IOException(
                    "Expected a DateInterval, but got a %s".formatted(parsed.getClass().getSimpleName()));
            }

            return (DateInterval)parsed;
        }
    }

    /**
     * A serializer for {@link Interval}s. It will convert an {@link Interval} to an ISO8601 string representing either
     * a {@link Period} or a {@link Duration}, e.g. P1Y2M3W4D or PT1H2M3.456S.
     */
    static final class Serializer extends JsonSerializer<DateInterval> {

        @Override
        public void serialize(final DateInterval value, final JsonGenerator gen, final SerializerProvider serializers)
            throws IOException {
            gen.writeString(value.toISOString());
        }
    }
}
