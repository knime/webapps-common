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
 *   Jan 22, 2023 (wiswedel): created
 */
package org.knime.core.ui.util;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.InstanceOfAssertFactories.DOUBLE;
import static org.assertj.core.data.Offset.offset;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;

/**
 * Tests {@link FuzzySearchable}.
 */
@SuppressWarnings("java:S2698") // we accept assertions without messages
class FuzzySearchableTest {

    /**
     * Standard tests, non-static methods.
     */
    @SuppressWarnings("static-method")
    @Test
    final void testObjectMethods() {
        final var searchable1 = new FuzzySearchable("foo", new String[]{"bar"});
        final var assertable1 = assertThat(searchable1);
        assertable1 //
            .returns(false, s -> s.contains("foo")) //
            .returns(true, s -> s.contains("FOO")) //
            .returns(false, s -> s.contains("bar")) //
            .returns(true, s -> s.contains("BAR")) //
            .returns(true, s -> s.contains(""));
        assertable1.extracting(s -> s.computeSimilarity("FOO")).asInstanceOf(DOUBLE).isCloseTo(1.0, offset(0.01));
        assertable1.extracting(s -> s.computeSimilarity("FO")).asInstanceOf(DOUBLE).isCloseTo(0.5, offset(0.01));
        assertable1.extracting(s -> s.computeSimilarity("fo")).asInstanceOf(DOUBLE).isCloseTo(0.0, offset(0.01));
        assertable1.extracting(s -> s.computeSimilarity("AR")).asInstanceOf(DOUBLE).isCloseTo(0.5, offset(0.01));
        assertable1.extracting(s -> s.computeSimilarity("NIX")).asInstanceOf(DOUBLE).isCloseTo(0.0, offset(0.01));
        assertable1.extracting(s -> s.computeSimilarity("")).asInstanceOf(DOUBLE).isCloseTo(0.0, offset(0.01));

        // name- and keyword-only similarities
        assertable1.extracting(s -> s.computeNameSimilarity("FOO")).asInstanceOf(DOUBLE).isCloseTo(1.0, offset(0.01));
        assertable1.extracting(s -> s.computeNameSimilarity("FO")).asInstanceOf(DOUBLE).isCloseTo(.5, offset(0.01));
        assertable1.extracting(s -> s.computeNameSimilarity("BAR")).asInstanceOf(DOUBLE).isCloseTo(0, offset(0.01));

        assertable1.extracting(s -> s.computeKeywordSimilarity("BAR")).asInstanceOf(DOUBLE).isCloseTo(1.0, offset(0.01));
        assertable1.extracting(s -> s.computeKeywordSimilarity("AR")).asInstanceOf(DOUBLE).isCloseTo(.5, offset(0.01));
        assertable1.extracting(s -> s.computeKeywordSimilarity("FOO")).asInstanceOf(DOUBLE).isCloseTo(0, offset(0.01));

        assertDoesNotThrow(() -> searchable1.toString()); // for code coverage

        var searchable2 = new FuzzySearchable("foo", null);
        assertThat(searchable2) //
            .returns(false, s -> s.contains("foo")) //
            .returns(true, s -> s.contains("FOO")) //
            .returns(false, s -> s.contains("BAR"));

        var searchable3 = new FuzzySearchable("", null);
        assertThat(searchable3) //
            .returns(false, s -> s.contains("foo")) //
            .returns(true, s -> s.contains("")) // technically correct but not a very useful query
            .extracting(s -> s.computeSimilarity("")).asInstanceOf(DOUBLE).isCloseTo(0.0, offset(0.01));

        var searchable4 = new FuzzySearchable("ABCDE", null);
        assertThat(searchable4) // "internet validated"... https://planetcalc.com/1664/ (Jan '23)
            .extracting(s -> s.computeSimilarity("ABCD")).asInstanceOf(DOUBLE).isCloseTo(0.75, offset(0.01));
    }

    /** Null checks in factory methods. */
    @SuppressWarnings("static-method")
    @Test
    final void testInvalidConstructor() {
        assertThrows(IllegalArgumentException.class, () -> new FuzzySearchable(null, null));
        assertThrows(IllegalArgumentException.class, () -> new FuzzySearchable("foo", new String[] {null}));
    }

    /**
     * Test method for {@link FuzzySearchable#computeTanimotoBiGramDistance(java.lang.String, java.lang.String)}. Used
     * in old workbench code.
     */
    @SuppressWarnings("static-method")
    @Test
    final void testComputeTanimotoBiGramDistance() {
        assertThat(FuzzySearchable.computeTanimotoBiGramDistance("FOO", "FOO")).isCloseTo(0.0, offset(0.01));
        assertThat(FuzzySearchable.computeTanimotoBiGramDistance("FOO", "foo")).isCloseTo(0.0, offset(0.01));
        assertThat(FuzzySearchable.computeTanimotoBiGramDistance("FOO", "fo")).isCloseTo(0.5, offset(0.01));
        assertThat(FuzzySearchable.computeTanimotoBiGramDistance("ABCDE", "ABCD")).isCloseTo(0.25, offset(0.01));
    }

}
