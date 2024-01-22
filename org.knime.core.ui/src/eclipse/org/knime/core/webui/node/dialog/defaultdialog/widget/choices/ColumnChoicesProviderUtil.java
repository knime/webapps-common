/*
 * ------------------------------------------------------------------------
 *
r *  Copyright by KNIME AG, Zurich, Switzerland
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
 */

package org.knime.core.webui.node.dialog.defaultdialog.widget.choices;

import java.util.List;
import java.util.stream.Stream;

import org.knime.core.data.DataColumnSpec;
import org.knime.core.data.DataTableSpec;
import org.knime.core.data.DataValue;
import org.knime.core.data.DoubleValue;
import org.knime.core.data.StringValue;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ColumnChoicesProvider;

/**
 * A utility class to be used for creating {@link ChoicesProvider} implementations where the choices are all columns of
 * a certain {@link DataValue} class
 *
 * @author Paul Bärnreuther
 */
public final class ColumnChoicesProviderUtil {

    private ColumnChoicesProviderUtil() {
        throw new IllegalStateException("Utility class");
    }

    /**
     * Offers all column from the first input table as options.
     *
     * @author Carl Witt, KNIME AG, Zurich, Switzerland
     */
    public static final class AllColumnChoicesProvider implements ColumnChoicesProvider {
        @Override
        public DataColumnSpec[] columnChoices(final DefaultNodeSettingsContext context) {
            return context.getDataTableSpec(0) //
                .map(DataTableSpec::stream) //
                .orElseGet(Stream::empty) //
                .toArray(DataColumnSpec[]::new);
        }
    }

    /**
     * ChoicesProvider providing all columns which are compatible with {@link StringValue}
     *
     * @author Paul Bärnreuther
     */
    public static final class StringColumnChoicesProvider extends CompatibleColumnChoicesProvider {

        StringColumnChoicesProvider() {
            super(StringValue.class);
        }

    }

    /**
     * ChoicesProvider providing all columns which are compatible with {@link DoubleValue}
     *
     * @author Paul Bärnreuther
     */
    public static final class DoubleColumnChoicesProvider extends CompatibleColumnChoicesProvider {

        DoubleColumnChoicesProvider() {
            super(DoubleValue.class);
        }

    }

    /**
     * A {@link ChoicesProvider} which can be given one or multiple classes extending {@link DataValue} and provides the
     * compatible columns of a given spec
     *
     * @author Paul Bärnreuther
     */
    public static class CompatibleColumnChoicesProvider implements ColumnChoicesProvider {

        private final List<Class<? extends DataValue>> m_valueClasses;

        /**
         * @param valueClass the class for which compatible columns should be provided
         */
        protected CompatibleColumnChoicesProvider(final Class<? extends DataValue> valueClass) {
            m_valueClasses = List.of(valueClass);
        }

        /**
         * @param valueClasses a list of classes for which compatible columns should be provided
         */
        protected CompatibleColumnChoicesProvider(final List<Class<? extends DataValue>> valueClasses) {
            m_valueClasses = valueClasses;
        }

        /**
         * {@inheritDoc}
         */
        @Override
        public DataColumnSpec[] columnChoices(final DefaultNodeSettingsContext context) {
            final var spec = context.getDataTableSpec(0);
            if (spec.isEmpty()) {
                return new DataColumnSpec[0];
            } else {
                return spec.get().stream()
                    .filter(s -> m_valueClasses.stream().anyMatch(valueClass -> s.getType().isCompatible(valueClass)))
                    .toArray(DataColumnSpec[]::new);
            }
        }
    }

    /**
     * A {@link ChoicesProvider} yielding those columns in the given input table spec which have a color handler
     * appended.
     *
     * @author Paul Bärnreuther
     */
    public static final class ColorColumnsProvider implements ColumnChoicesProvider {

        @Override
        public DataColumnSpec[] columnChoices(final DefaultNodeSettingsContext context) {
            return context.getDataTableSpec(0).map(spec -> getColumnsWithColorHandler(spec))
                .orElse(new DataColumnSpec[0]);
        }

        private static DataColumnSpec[] getColumnsWithColorHandler(final DataTableSpec spec) {
            return spec.stream().filter(col -> col.getColorHandler() != null).toArray(DataColumnSpec[]::new);
        }

    }
}
