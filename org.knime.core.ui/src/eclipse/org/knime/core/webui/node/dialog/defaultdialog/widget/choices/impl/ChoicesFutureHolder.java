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
 *   Sep 25, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.widget.choices.impl;

import java.util.concurrent.Callable;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.Future;

import org.knime.core.node.KNIMEConstants;

/**
 * An intermediate representation of choices whose computation is started as early as possible and retrieved at a later
 * point in the node life-cycle.
 *
 * @author Paul Bärnreuther
 */
final class ChoicesFutureHolder {
    private final Future<Object[]> m_future;

    private final CompletableFuture<Void> m_futureCompleted;

    private ChoicesFutureHolder.ExpectedCallsManager m_expectedCallsManager;

    public ChoicesFutureHolder(final Callable<Object[]> choicesCallable) {
        m_futureCompleted = new CompletableFuture<>();
        final Callable<Object[]> getChoicesAndComplete = () -> {
            final var result = choicesCallable.call();
            m_futureCompleted.complete(null);
            return result;
        };
        m_future = KNIMEConstants.GLOBAL_THREAD_POOL.enqueue(getChoicesAndComplete);
        m_expectedCallsManager = new ExpectedCallsCounter();
    }

    Future<Object[]> get() {
        m_expectedCallsManager.onGet();
        return m_future;
    }

    /**
     * @return A future that is completed when m_future is completed. It can be used to run code after the completion of
     *         the future even if the future is awaited elsewhere.
     */
    CompletableFuture<Void> getCompleted() {
        return m_futureCompleted;
    }

    void cancel() {
        m_future.cancel(true);
    }

    void addAnother() {
        m_expectedCallsManager.onAdd();
    }

    boolean expectsGet() {
        return m_expectedCallsManager.expectsGet();
    }

    void setToAlwaysExpectGet() {
        m_expectedCallsManager = new AlwaysExpectingCalls();
    }

    private interface ExpectedCallsManager {
        void onAdd();

        void onGet();

        boolean expectsGet();
    }

    private static final class AlwaysExpectingCalls implements ExpectedCallsManager {

        @Override
        public void onAdd() {
            // do nothing
        }

        @Override
        public void onGet() {
            // do nothing
        }

        @Override
        public boolean expectsGet() {
            return true;
        }

    }

    private static final class ExpectedCallsCounter implements ExpectedCallsManager {

        private int m_numberOfExpectedCalls = 1;

        @Override
        public void onAdd() {
            m_numberOfExpectedCalls += 1;

        }

        @Override
        public void onGet() {
            m_numberOfExpectedCalls -= 1;

        }

        @Override
        public boolean expectsGet() {
            return m_numberOfExpectedCalls > 0;
        }

    }

}
