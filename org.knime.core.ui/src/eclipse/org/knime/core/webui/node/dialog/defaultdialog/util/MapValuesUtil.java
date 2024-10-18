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
 *   Aug 30, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.util;

import static java.util.stream.Collectors.toMap;

import java.util.Comparator;
import java.util.Map;
import java.util.function.BiFunction;
import java.util.function.Function;

/**
 * A utility class existing because it is tedious in java to perform even simple operations on the values of maps.
 *
 * @author Paul Bärnreuther
 */
public final class MapValuesUtil {

    private MapValuesUtil() {
        // Utility class
    }

    /**
     * Utility method for mapping the values of a {@link Map}.
     *
     * @param <K> keys
     * @param <V1> values before mapping
     * @param <V2> values after mapping
     * @param map the map the mapping should be applied to
     * @param mapping to be applied to the values
     * @return a new map with the same keys and mapped values
     */
    public static <K, V1, V2> Map<K, V2> mapValues(final Map<K, V1> map, final Function<V1, V2> mapping) {
        return mapValuesWithKeys(map, (key, value) -> mapping.apply(value));
    }

    /**
     * Utility method for mapping the values of a {@link Map} and sorting the keys.
     *
     * @param <K> keys
     * @param <V1> values before mapping
     * @param <V2> values after mapping
     * @param map the map the mapping should be applied to
     * @param mapping to be applied to the values
     * @param keyComparator the comparator to sort the keys
     * @return a new map with the same keys and mapped values
     */
    public static <K, V1, V2> Map<K, V2> mapValues(final Map<K, V1> map, final Function<V1, V2> mapping,
        final Comparator<K> keyComparator) {
        return mapValuesWithKeys(map, (key, value) -> mapping.apply(value), keyComparator);
    }

    /**
     * Utility method for restricting the type of values of a {@link Map}.
     *
     * @param <K> keys
     * @param <V1> values before restriction
     * @param <V2> values after restriction
     * @param map the map the mapping should be applied to
     * @return a new map with the same keys and values of the required extending type
     */
    public static <K, V1 extends V2, V2> Map<K, V2> restrictValues(final Map<K, V1> map) {
        return mapValues(map, v -> v);
    }

    /**
     * Utility method for mapping the values of a {@link Map}.
     *
     * @param <K> keys
     * @param <V1> values before mapping
     * @param <V2> values after mapping
     * @param map the map the mapping should be applied to
     * @param mapping defining the new values from key and old value
     * @return a new map with the same keys and mapped values
     */
    public static <K, V1, V2> Map<K, V2> mapValuesWithKeys(final Map<K, V1> map, final BiFunction<K, V1, V2> mapping) {
        return map.entrySet().stream()//
            .collect(toMap(Map.Entry::getKey, e -> mapping.apply(e.getKey(), e.getValue())));
    }

    /**
     * Utility method for mapping the values of a {@link Map} and sorting the keys.
     *
     * @param <K> keys
     * @param <V1> values before mapping
     * @param <V2> values after mapping
     * @param map the map the mapping should be applied to
     * @param mapping defining the new values from key and old value
     * @param keyComparator the comparator to sort the keys
     * @return a new map with the same keys and mapped values
     */
    public static <K, V1, V2> Map<K, V2> mapValuesWithKeys(final Map<K, V1> map, final BiFunction<K, V1, V2> mapping,
        final Comparator<K> keyComparator) {
        return map.entrySet().stream()//
            .sorted(Map.Entry.comparingByKey(keyComparator))
            .collect(toMap(Map.Entry::getKey, e -> mapping.apply(e.getKey(), e.getValue())));
    }

}
