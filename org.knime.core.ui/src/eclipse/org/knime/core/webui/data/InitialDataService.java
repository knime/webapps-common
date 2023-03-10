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
import java.util.function.Supplier;

import org.knime.core.webui.data.rpc.json.impl.ObjectMapperUtil;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Service to provide the data required to initialize an UI extension.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 *
 * @param <D> the data type this initial data service returns
 *
 * @since 4.5
 */
public final class InitialDataService<D> {

    private final Supplier<D> m_dataSupplier;

    private final ObjectMapper m_mapper = ObjectMapperUtil.getInstance().getObjectMapper();

    private Serializer<D> m_serializer;

    private Runnable m_cleanUp;

    /**
     * @param dataSupplier
     */
    private InitialDataService(final InitialDataServiceBuilder<D> builder) {
        m_dataSupplier = builder.m_dataSupplier;
        if (builder.m_serializer == null) {
            m_serializer = obj -> {
                if (obj instanceof String s) {
                    return s;
                } else {
                    return m_mapper.writeValueAsString(obj);
                }
            };
        } else {
            m_serializer = builder.m_serializer;
        }
        m_cleanUp = builder.m_cleanUp;
    }

    /**
     * @return the initial data serialized into a string
     */
    public String getInitialData() {
        try {
            final var root = m_mapper.createObjectNode();
            // Since the DataServiceContext is public API, warning messages could have been wrongfully added to it.
            // We clear the context here to make sure there are no "stale" warning messages.
            DataServiceContext.getContext().clear();
            var dataString = m_serializer.serialize(m_dataSupplier.get());
            try { // NOSONAR
                root.set("result", m_mapper.readTree(dataString));
            } catch (JsonProcessingException ex) { // NOSONAR
                // if it couldn't be parsed as a json, just return the string itself
                root.put("result", dataString);
            }
            // We have to get the DataServiceContext again here, since the context may have changed since (or as a
            // consequence of) clearing it
            final var warningMessages = DataServiceContext.getContext().getWarningMessages();
            if (warningMessages != null && warningMessages.length > 0) {
                root.set("warningMessages", m_mapper.valueToTree(warningMessages));
            }
            return root.toString();
        } catch (DataServiceException e) {
            return m_mapper.createObjectNode().set("userError", m_mapper.valueToTree(new InitialDataUserError(e)))
                .toString();
        } catch (Throwable t) { // NOSONAR
            return m_mapper.createObjectNode()
                .set("internalError", m_mapper.valueToTree(new InitialDataInternalError(t))).toString();
        } finally {
            DataServiceContext.getContext().clear();
        }
    }

    /**
     * Called whenever the data service can free-up resources. E.g. clearing caches or shutting down external processes
     * etc. Though, it does <b>not</b> necessarily mean, that the data service instance is not used anymore some time
     * later.
     *
     * TODO: this could also be turned into two suspend/resume life-cycle methods?
     */
    public void cleanUp() {
        if (m_cleanUp != null) {
            m_cleanUp.run();
        }
    }

    /**
     * @param <D>
     * @param dataSupplier
     * @return the builder to create an {@link InitialDataService}-instance
     */
    public static <D> InitialDataServiceBuilder<D> builder(final Supplier<D> dataSupplier) {
        return new InitialDataServiceBuilder<>(dataSupplier);
    }

    /**
     * The builder.
     *
     * @param <D>
     */
    public static final class InitialDataServiceBuilder<D> {

        private Supplier<D> m_dataSupplier;

        private Serializer<D> m_serializer;

        private Runnable m_cleanUp;

        private InitialDataServiceBuilder(final Supplier<D> dataSupplier) {
            m_dataSupplier = dataSupplier;
        }

        /**
         * @param cleanUp the logic to execute on clean-up, see {@link InitialDataService#cleanUp()}
         * @return this builder
         */
        public InitialDataServiceBuilder<D> onCleanUp(final Runnable cleanUp) {
            m_cleanUp = cleanUp;
            return this;
        }

        /**
         * @param serializer a custom serializer to turn the data object into a string
         * @return this builder
         */
        public InitialDataServiceBuilder<D> serializer(final Serializer<D> serializer) {
            m_serializer = serializer;
            return this;
        }

        /**
         * @return a new instance
         */
        public InitialDataService<D> build() {
            return new InitialDataService<>(this);
        }

    }

    @SuppressWarnings("javadoc")
    public interface Serializer<D> {
        String serialize(D obj) throws IOException;
    }

}
