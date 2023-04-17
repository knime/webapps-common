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
 */
package org.knime.core.webui.node.port;

import org.knime.core.node.port.PortObject;
import org.knime.core.node.port.PortObjectSpec;

/**
 * Ties together two port views: One based on the {@link PortObjectSpec} and one based on the corresponding
 * {@link PortObject}.
 *
 * @param specViewLabel The display label of the port object spec view
 * @param specViewFactory A factory supplying the port object spec view instance
 * @param viewLabel The display label of the port object view
 * @param viewFactory A factory supplying the port object view
 * @param <T> The concrete type of the port object
 * @param <S> The concrete type of the port object spec
 */
public record PortViewGroup<T extends PortObject, S extends PortObjectSpec>(String specViewLabel,
    PortObjectSpecViewFactory<S> specViewFactory, String viewLabel, PortObjectViewFactory<T> viewFactory) {

    public static <P extends PortObject, Q extends PortObjectSpec> PortViewGroupBuilder<P, Q> builder() {
        return new PortViewGroupBuilder<>();
    }

    public static <P extends PortObject> PortViewGroup<P, ?> of(PortObjectViewFactory<P> viewFac) {
        return new PortViewGroup<>(null, null, null, viewFac);
    }

    public static class PortViewGroupBuilder<T extends PortObject, S extends PortObjectSpec> {
        private String specViewLabel;

        private PortObjectSpecViewFactory<S> specViewFactory;

        private String dataViewLabel;

        private PortObjectViewFactory<T> dataViewFactory;

        public PortViewGroupBuilder<T, S> setSpecViewLabel(String specViewLabel) {
            this.specViewLabel = specViewLabel;
            var x = new PortViewGroup<>(null, null, null, null);
            return this;
        }

        public PortViewGroupBuilder<T, S> setSpecViewFactory(PortObjectSpecViewFactory<S> specViewFactory) {
            this.specViewFactory = specViewFactory;
            return this;
        }

        public PortViewGroupBuilder<T, S> setViewLabel(String dataViewLabel) {
            this.dataViewLabel = dataViewLabel;
            return this;
        }

        public PortViewGroupBuilder<T, S> setViewFactory(PortObjectViewFactory<T> dataViewFactory) {
            this.dataViewFactory = dataViewFactory;
            return this;
        }

        public PortViewGroup<T, S> build() {
            return new PortViewGroup<>(specViewLabel, specViewFactory, dataViewLabel, dataViewFactory);
        }
    }
}
