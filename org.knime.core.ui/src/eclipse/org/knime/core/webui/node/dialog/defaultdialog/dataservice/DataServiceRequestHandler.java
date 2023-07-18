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
 *   Jul 18, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.dataservice;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.Callable;
import java.util.concurrent.CancellationException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.Future;

import org.knime.core.node.KNIMEConstants;
import org.knime.core.node.NodeLogger;

/**
 * This class is responsible for handling the threads of the dialogs data service. Every widget should use one thread so
 * that pending requests are canceled by subsequent requests. Furthermore this class wraps the results returned from the
 * various callables in a {@link Result}.
 *
 * @author Paul Bärnreuther
 */
public class DataServiceRequestHandler {
    private final Map<String, Future<?>> m_pendingRequests = new HashMap<>();

    private static final NodeLogger LOGGER = NodeLogger.getLogger(DefaultNodeDialogDataServiceImpl.class);

    <T> Result<T> handleRequest(final String widgetId, final Callable<T> callback)
        throws InterruptedException, ExecutionException {
        final var future = KNIMEConstants.GLOBAL_THREAD_POOL.enqueue(callback);
        getPendingRequest(widgetId).ifPresent(pendingFuture -> pendingFuture.cancel(true));
        m_pendingRequests.put(widgetId, future);
        try {
            final var result = future.get();
            m_pendingRequests.remove(widgetId);
            return Result.succeed(result);
        } catch (CancellationException ex) {
            LOGGER.info(ex);
            return Result.cancel();
        } catch (ExecutionException ex) {
            final var cause = ex.getCause();
            if (cause instanceof RequestFailureException) {
                return Result.fail(cause.getMessage());
            }
            throw ex;
        }
    }

    /**
     * package scoped for test purposes
     */
    Optional<Future<?>> getPendingRequest(final String widgetId) {
        return Optional.ofNullable(m_pendingRequests.get(widgetId));
    }
}
