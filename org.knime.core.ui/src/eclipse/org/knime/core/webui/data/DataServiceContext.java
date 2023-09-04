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
 *   22 Mar 2022 (marcbux): created
 */
package org.knime.core.webui.data;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Supplier;

import org.apache.commons.lang3.concurrent.ConcurrentException;
import org.apache.commons.lang3.concurrent.LazyInitializer;
import org.knime.core.node.BufferedDataTable;
import org.knime.core.node.ExecutionContext;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.node.workflow.NodeContainer;
import org.knime.core.node.workflow.SingleNodeContainer;

/**
 * A {@link DataServiceContext} allows to report warning messages during a data service invocation or assembly of
 * initial data. These warning messages can then be obtained by the {@link RpcDataService} or {@link InitialDataService}
 * and passed to the frontend for display along a valid result.
 *
 * Furthermore, it allows one to created {@link BufferedDataTable BufferedDataTables} within the context of the
 * underlying node.
 *
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
public final class DataServiceContext {

    private static final ThreadLocal<DataServiceContext> CONTEXT = new ThreadLocal<>();

    /**
     * @return the {@link DataServiceContext} for the current thread, potentially creating a new one in the process.
     */
    public static DataServiceContext get() {
        var context = CONTEXT.get();
        if (context == null) {
            init(null, null);
            return CONTEXT.get();
        } else {
            return context;
        }
    }

    static void init(final NodeContainer nc) {
        final var inputSpecsSupplier = new InputSpecsSupplier(nc);
        if (nc instanceof SingleNodeContainer snc) {
            init(snc::createExecutionContext, inputSpecsSupplier);
        } else {
            init((Supplier<ExecutionContext>)null, inputSpecsSupplier);
        }
    }

    static void init(final Supplier<ExecutionContext> execSupplier,
        final LazyInitializer<PortObjectSpec[]> specsSupplier) {
        CONTEXT.set(new DataServiceContext(execSupplier, specsSupplier));
    }

    private final List<String> m_warningMessages = new ArrayList<>();

    private final Supplier<ExecutionContext> m_execSupplier;

    private ExecutionContext m_exec;

    private final LazyInitializer<PortObjectSpec[]> m_specsSupplier;

    private DataServiceContext(final Supplier<ExecutionContext> execSupplier,
        final LazyInitializer<PortObjectSpec[]> specsSupplier) {
        m_execSupplier = execSupplier;
        m_specsSupplier = specsSupplier;
    }

    /**
     * Adds another warning message to the list of warning messages.
     *
     * @param warningMessage a warning message
     */
    public synchronized void addWarningMessage(final String warningMessage) {
        m_warningMessages.add(warningMessage);
    }

    /**
     * @return a list of warnings that occurred while invoking the data service
     */
    public synchronized String[] getWarningMessages() {
        return m_warningMessages.toArray(new String[0]);
    }

    /**
     * Removes all the previously set warning message.
     */
    public synchronized void clearWarningMessages() {
        m_warningMessages.clear();
    }

    /**
     * @return the execution context
     * @throws IllegalStateException if there is no execution context available
     */
    public synchronized ExecutionContext getExecutionContext() {
        if (m_exec != null) {
            return m_exec;
        }
        if (m_execSupplier != null) {
            m_exec = m_execSupplier.get();
            return m_exec;
        }
        throw new IllegalStateException("No execution context available");
    }

    /**
     * @return the input specs excluding the flow variable port
     */
    public PortObjectSpec[] getInputSpecs() {
        if (m_specsSupplier == null) {
            throw new IllegalStateException("No spec supplier has been initialized within the data service context.");
        }
        try {
            return m_specsSupplier.get();
        } catch (ConcurrentException ex) {
            throw new IllegalStateException("An error occurred while receiving the input specs.", ex);
        }
    }

    /**
     * Removes the entire context for the current thread.
     */
    static void remove() {
        CONTEXT.remove();
    }

}
