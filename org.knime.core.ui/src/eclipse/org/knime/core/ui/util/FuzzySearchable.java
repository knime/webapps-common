/*
 * ------------------------------------------------------------------------
 *
 *  Copyright by KNIME AG, Zurich, Switzerland
 *  Website: http://www.knime.org; Email: contact@knime.org
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
 *   Mar 17, 2021 (hornm): created
 */
package org.knime.core.ui.util;

import java.util.Arrays;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Stream;

import org.apache.commons.lang3.ArrayUtils;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.knime.core.node.util.CheckUtils;

import com.google.common.collect.Sets;

/**
 * A utility class to calculate the tanimoto bi-gram similarity, originally copied from the Tanimoto BiGram distance
 * from the distmatrix package. (Searching the web for bi-gram and jaccard will give plenty of hits.)
 *
 * @author Marcel Hanser, KNIME AG, Zurich, Switzerland
 * @since 5.0
 */
public final class FuzzySearchable {

    private final String m_name;
    private final String[] m_keywords;

    /**
     * New instance whereby the arguments will be upper-cased by this constructor.
     *
     * @param name non-null name
     * @param keywords keywords (or null)
     */
    public FuzzySearchable(final String name, final String[] keywords) {
        String capsName = CheckUtils.checkArgumentNotNull(name).toUpperCase(Locale.ROOT);
        String[] capsKeywords = Stream.of(ArrayUtils.nullToEmpty(keywords)) //
            .map(CheckUtils::checkArgumentNotNull) //
            .map(s -> s.toUpperCase(Locale.ROOT)) //
            .toArray(String[]::new);
        m_name = capsName;
        m_keywords = capsKeywords;
    }

    /**
     * @param uppercaseString querystring - all caps (required here since otherwise the case conversion would be done
     *            for _all_ instances of "FuzzySearchable" (aka nodes))
     * @return If either the name or any of the keywords contain the query
     */
    public boolean contains(final String uppercaseString) {
        return m_name.contains(uppercaseString)
            || Stream.of(m_keywords).anyMatch(key -> key.contains(uppercaseString));
    }

    /**
     * For the given query, determine the "tanimoto bigram similarity"
     * @param uppercaseQuery
     * @return The similarity [0, 1]
     */
    public double computeSimilarity(final String uppercaseQuery) {
        double nameSimilarity = computeTanimotoBiGramSimilarity(m_name, uppercaseQuery);
        if (nameSimilarity >= 1.0) {
            return 1.0;
        }
        double keywordSimilarity = Stream.of(m_keywords) //
            .mapToDouble(term -> computeTanimotoBiGramSimilarity(term, uppercaseQuery)) //
            .max().orElse(0.0);
        // reduce confusion about search results by making it more likely that name matches win against keyword matches
        return Math.max(nameSimilarity, keywordSimilarity);
    }

    /**
     * Computes the "tanimoto bigram similarity" between given query and searchable name.
     * @param uppercaseQuery query
     * @return a similarity value between the given query and the searchable name in [0, 1]
     */
    public double computeNameSimilarity(final String uppercaseQuery) {
        return computeTanimotoBiGramSimilarity(m_name, uppercaseQuery);
    }

    /**
     * Computes the "tanimoto bigram similarity" between given query and the searchable keywords.
     * @param uppercaseQuery query
     * @return a similarity value between the given query and the searchable keywords in [0, 1]
     */
    public double computeKeywordSimilarity(final String uppercaseQuery) {
        return Arrays.stream(m_keywords).mapToDouble(term -> computeTanimotoBiGramSimilarity(term, uppercaseQuery))//
                .max().orElse(0.0);
    }

    @Override
    public String toString() {
        return new ToStringBuilder(this).append("name", m_name).append("keywords", m_keywords).build();
    }

    /**
     * Copied from the Tanimoto BiGram distance.
     *
     * @param textA Query A
     * @param textB Query B
     * @return the distance value [0, 1]
     */
    public static double computeTanimotoBiGramDistance(final String textA, final String textB) {
        return 1.0 - computeTanimotoBiGramSimilarity(textA.toUpperCase(Locale.ROOT), textB.toUpperCase(Locale.ROOT));
    }

    /**
     * Compute similarity between two elements, assuming both have the same case.
     */
    private static double computeTanimotoBiGramSimilarity(final String textAUpper, final String textBUpper) {

        Set<String> gramsA = split(textAUpper, 2);
        Set<String> gramsB = split(textBUpper, 2);

        int nominator = cardinalityOfIntersection(gramsA, gramsB);
        int inAButNotInB = cardinalityOfRelativeComplement(gramsA, gramsB);
        int inBButNotInA = cardinalityOfRelativeComplement(gramsB, gramsA);

        int denominator = nominator + inAButNotInB + inBButNotInA;

        if (denominator > 0) {
            return nominator / (double)denominator;
        } else {
            return 0.0;
        }
    }

    private static int cardinalityOfIntersection(final Set<String> a, final Set<String> b) {
        int toReturn = 0;
        for (String gram : a) {
            if (b.contains(gram)) {
                toReturn++;
            }
        }
        return toReturn;
    }

    private static int cardinalityOfRelativeComplement(final Set<String> a, final Set<String> b) {
        int toReturn = 0;
        for (String gram : a) {
            if (!b.contains(gram)) {
                toReturn++;
            }
        }
        return toReturn;
    }

    private static Set<String> split(final String a, final int count) {
        Set<String> toReturn = Sets.newHashSetWithExpectedSize(a.length());

        for (int i = 0; i < a.length() - count + 1; i++) {
            toReturn.add(a.substring(i, i + count));
        }
        return toReturn;
    }

}
