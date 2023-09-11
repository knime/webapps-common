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
 *   Sep 5, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.widget.choices.impl;

import java.util.Map;
import java.util.concurrent.Callable;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Future;
import java.util.concurrent.RunnableFuture;

import org.knime.core.node.KNIMEConstants;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesWidget;

/**
 * This class is used to trigger computations of the choices of a {@link ChoicesWidget} when computing the initial data
 * for receiving the result (as a {@link Future} in the data service) to enable asynchronous fetching of the choices
 * while still starting the computation as early as possible.
 *
 * @author Paul Bärnreuther
 */
public final class AsyncChoicesHolder {

    /**
     * A map from the class name of a choices provider to its choices.
     */
    private final Map<String, ChoicesFutureHolder> m_choicesMap;

    /**
     * Instantiates a new holder
     */
    public AsyncChoicesHolder() {
        m_choicesMap = new ConcurrentHashMap<>();
    }

    private static class ChoicesFutureHolder {
        private final Future<Object[]> m_future;

        private final CompletableFuture<Void> m_futureCompleted;

        private int m_numberOfExpectedCalls;

        public ChoicesFutureHolder(final Callable<Object[]> choicesCallable) {
            m_futureCompleted = new CompletableFuture<>();
            final Callable<Object[]> getChoicesAndComplete = () -> {
                final var result = choicesCallable.call();
                m_futureCompleted.complete(null);
                return result;
            };
            m_future = KNIMEConstants.GLOBAL_THREAD_POOL.enqueue(getChoicesAndComplete);
            m_numberOfExpectedCalls = 1;
        }

        void incrementExpectedCalls() {
            m_numberOfExpectedCalls += 1;
        }

        Future<Object[]> get() {
            m_numberOfExpectedCalls -= 1;
            return m_future;
        }

        int getNumberOfExpectedCalls() {
            return m_numberOfExpectedCalls;
        }

        /**
         * @return A future that is completed when m_future is completed. It can be used to run code after the
         *         completion of the future even if the future is awaited elsewhere.
         */
        CompletableFuture<Void> getCompleted() {
            return m_futureCompleted;
        }

        void cancel() {
            m_future.cancel(true);
        }

    }

    /**
     * Clears all held choices.
     */
    public void clear() {
        m_choicesMap.values().forEach(ChoicesFutureHolder::cancel);
        m_choicesMap.clear();
    }

    /**
     * Starts the computation of choices
     *
     * @param choicesProviderClassName the string under which these choices are stored. If this method was already
     *            called with the same string since the last initialization, the choices will not be computed again but
     *            instead the existing entry is informed that one more get call is to be expected.
     * @param choicesCallable the computation of the choices that is triggered with the computation of the initial data.
     */
    public synchronized void addChoices(final String choicesProviderClassName,
        final Callable<Object[]> choicesCallable) {
        if (m_choicesMap.containsKey(choicesProviderClassName)) {
            m_choicesMap.get(choicesProviderClassName).incrementExpectedCalls();
        } else {
            m_choicesMap.put(choicesProviderClassName, new ChoicesFutureHolder(choicesCallable));
        }

    }

    /**
     * Retrieves the choices whose computation has been started with {@link AsyncChoicesHolder#addChoices}. It also
     * frees the respective entry in the global map (or decreases the number of expected get calls if it has been added
     * multiple times).
     *
     * @param choicesProviderClassName the string under which these choices have been stored with
     *            {@link AsyncChoicesHolder#addChoices}.
     * @return the future holding the result of the started computation.
     */
    public synchronized Future<Object[]> getChoices(final String choicesProviderClassName) {
        final var choices = m_choicesMap.get(choicesProviderClassName);
        final RunnableFuture<Object[]> future = (RunnableFuture<Object[]>)choices.get();
        if (choices.getNumberOfExpectedCalls() == 0) {
            choices.getCompleted().thenRun(() -> m_choicesMap.remove(choicesProviderClassName));
        }
        return future;
    }

}
