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
 *   Feb 21, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms;

import java.util.List;
import java.util.function.UnaryOperator;
import java.util.stream.Stream;

import org.apache.commons.lang3.StringUtils;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.IndexedValue;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.TriggerInvocationHandler;
import org.knime.core.webui.node.dialog.defaultdialog.util.updates.TriggerInvocationHandler.TriggerResult;

/**
 * Containing a utility method for converting the result of a {@link TriggerInvocationHandler} to something
 * interpretable by the DefaultNodeDialog frontend
 *
 * @author Paul Bärnreuther
 */
public final class UpdateResultsUtil {

    private UpdateResultsUtil() {
        // Utility
    }

    /**
     * An instruction for an update. Either a value update defined by a path or a ui state update defined by an id
     *
     * @param <I> the type of the keys of the resulting values in case of nested scopes (either by index or by indexId)
     *
     * @param scopes to the field in case of a value update
     * @param id of the state provider in other cases
     * @param values the list of to be updated values. Usually this is a one-element list with an element with empty
     *            indices. Other cases only occur when this update yields different results in each element of an array
     *            widget.
     */
    public record UpdateResult<I>(List<String> scopes, String id, List<IndexedValue<I>> values)
        implements Comparable<UpdateResult<I>> {

        private static <I> UpdateResult<I> forScopes(final List<String> path, final List<IndexedValue<I>> values) {
            UnaryOperator<Object> serialize = v -> JsonFormsDataUtil.getMapper().valueToTree(v);
            return new UpdateResult<>(path, null, sortByIndices(serializeValues(values, serialize)));
        }

        private static <I> UpdateResult<I> forId(final String id, final List<IndexedValue<I>> values) {
            // value can be a record here, leading to a failure, since the JsonFormsDataUtil mapper does not serialize
            // getters, leading to empty serialized records
            UnaryOperator<Object> serialize =
                v -> v instanceof WidgetGroup ? JsonFormsDataUtil.getMapper().valueToTree(v) : v;
            return new UpdateResult<>(null, id, sortByIndices(serializeValues(values, serialize)));
        }

        private static <I> List<IndexedValue<I>> sortByIndices(final List<IndexedValue<I>> serializeValues) {
            return serializeValues.stream().sorted((v1, v2) -> toIndicesString(v1).compareTo(toIndicesString(v2)))
                .toList();
        }

        private static <I> String toIndicesString(final IndexedValue<I> v1) {
            return String.join(",", v1.indices().stream().map(Object::toString).toArray(String[]::new));
        }

        private static <I> List<IndexedValue<I>> serializeValues(final List<IndexedValue<I>> values,
            final UnaryOperator<Object> serialize) {
            return values.stream().map(value -> new IndexedValue<I>(value.indices(), serialize.apply(value.value())))
                .toList();
        }

        @Override
        public int compareTo(final UpdateResult<I> other) {
            return internalId().compareTo(other.internalId());
        }

        private String internalId() {
            if (scopes != null) {
                return "0" + StringUtils.join(scopes);
            }
            return "1" + id;
        }

    }

    /**
     * @param triggerResult
     * @return the list of resulting instructions
     */
    public static <I> List<UpdateResult<I>> toUpdateResults(final TriggerResult<I> triggerResult) {
        final var valueUpdates =
            triggerResult
                .valueUpdates().entrySet().stream().map(entry -> UpdateResult
                    .forScopes(JsonFormsScopeUtil.resolveFieldLocationToScope(entry.getKey()), entry.getValue()))
                .sorted();
        final var otherUpdates = triggerResult.otherUpdates().entrySet().stream()
            .map(entry -> UpdateResult.forId(entry.getKey(), entry.getValue())).sorted();
        return Stream.concat(valueUpdates, otherUpdates).toList();
    }

}
