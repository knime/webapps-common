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
 *   Sep 14, 2021 (hornm): created
 */
package org.knime.core.webui.data;

import java.io.IOException;
import java.util.Optional;
import java.util.function.Function;

import org.knime.core.node.NodeModel;
import org.knime.core.node.interactive.ReExecutable;
import org.knime.core.node.workflow.NodeContext;
import org.knime.core.node.workflow.NodeID;
import org.knime.core.node.workflow.WorkflowManager;
import org.knime.core.webui.data.rpc.json.impl.ObjectMapperUtil;

/**
 * A data service that applies the data to the underlying model (usually the {@link NodeModel}). Applying the data often
 * implies persisting it.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 * @param <D>
 *
 * @since 4.5
 */
public final class ApplyDataService<D> extends AbstractDataService {

    private final Applier<D> m_dataApplier;

    private final ReExecutable<D> m_reExecutable;

    private final Function<D, String> m_dataValidator;

    private WorkflowManager m_wfm;

    private NodeID m_nodeId;

    private final Deserializer<D> m_deserializer;

    private ApplyDataService(final ApplyDataServiceBuilder<D> builder) {
        super(builder);
        m_dataApplier = builder.m_dataApplier;
        m_reExecutable = builder.m_reExecutable;
        m_dataValidator = builder.m_validator;
        if (builder.m_deserializer == null) {
            var mapper = ObjectMapperUtil.getInstance().getObjectMapper();
            m_deserializer = s -> {
                if (builder.m_dataType.equals(String.class)) {
                    return (D) s;
                }
                return mapper.readValue(s, builder.m_dataType);
            };
        } else {
            m_deserializer = builder.m_deserializer;
        }
        if (m_reExecutable != null) {
            var nc = NodeContext.getContext().getNodeContainer();
            m_wfm = nc.getParent();
            m_nodeId = nc.getID();
        }
    }

    /**
     * Checks whether the data in the input stream is valid.
     *
     * @param data the data to validate
     * @return an empty optional if the validation was successful otherwise a validation error string
     * @throws IOException
     */
    public Optional<String> validateData(final String data) throws IOException {
        if (m_dataValidator != null) {
            return Optional.ofNullable(m_dataValidator.apply(m_deserializer.deserialize(data)));
        } else {
            return Optional.empty();
        }
    }

    /**
     * Applies the data from a string.
     *
     * @param dataString the data to apply
     * @throws IOException
     */
    public void applyData(final String dataString) throws IOException {
        var data = m_deserializer.deserialize(dataString);
        if (m_dataApplier != null) {
            m_dataApplier.apply(data);
        } else if (m_reExecutable != null) {
            m_reExecutable.preReExecute(data, false);
        }
    }

    /**
     * @return whether a re-execution of the respective node is required on apply
     */
    public boolean shallReExecute() {
        return m_reExecutable != null;
    }

    /**
     * Re-executes the underlying node in order to apply new data.
     *
     * @param data the data to execute the node with
     * @throws IOException
     */
    public void reExecute(final String data) throws IOException {
        if (m_reExecutable != null) {
            m_wfm.reExecuteNode(m_nodeId, m_deserializer.deserialize(data), false);
        }
    }

    /**
     * @param dataApplier
     * @return the builder for this data service
     */
    public static ApplyDataServiceBuilder<String> builder(final Applier<String> dataApplier) {
        return new ApplyDataServiceBuilder<>(String.class, dataApplier);
    }

    /**
     * @param reExecutable
     * @return the builder for this data service
     */
    public static ApplyDataServiceBuilder<String> builder(final ReExecutable<String> reExecutable) {
        return new ApplyDataServiceBuilder<>(String.class, reExecutable);
    }

    @SuppressWarnings("javadoc")
    @FunctionalInterface
    public interface Deserializer<D> {
        D deserialize(String data) throws IOException;
    }

    @SuppressWarnings("javadoc")
    @FunctionalInterface
    public interface Applier<D> {
        void apply(D data) throws IOException;
    }

    /**
     * The builder.
     * @param <D>
     */
    public static final class ApplyDataServiceBuilder<D> extends AbstractDataServiceBuilder {

        private Applier<D> m_dataApplier;

        private Function<D, String> m_validator;

        private ReExecutable<D> m_reExecutable;

        private Deserializer<D> m_deserializer;

        private final Class<D> m_dataType;

        private ApplyDataServiceBuilder(final Class<D> dataType, final Applier<D> dataApplier) {
            m_dataApplier = dataApplier;
            m_dataType = dataType;
        }

        private ApplyDataServiceBuilder(final Class<D> dataType, final ReExecutable<D> reExecutable) {
            m_dataType = dataType;
            m_reExecutable = reExecutable;
        }

        @Override
        public ApplyDataServiceBuilder<D> onDispose(final Runnable dispose) {
            super.onDispose(dispose);
            return this;
        }

        @Override
        public ApplyDataServiceBuilder<D> onDeactivate(final Runnable deactivate) {
            super.onDeactivate(deactivate);
            return this;
        }

        /**
         * @param validator logic that carries out the validation before apply
         * @return this builder
         */
        public ApplyDataServiceBuilder<D> validator(final Function<D, String> validator) {
            m_validator = validator;
            return this;
        }

        /**
         * @param deserializer a custom deserializer to create the data object from a string
         * @return this builder
         */
        public ApplyDataServiceBuilder<D> deserializer(final Deserializer<D> deserializer) {
            m_deserializer = deserializer;
            return this;
        }

        /**
         * @return a new instance
         */
        public ApplyDataService<D> build() {
            return new ApplyDataService<>(this);
        }
    }

}
