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
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Future;

import org.knime.core.node.KNIMEConstants;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesWidget;

/**
 * This class is used to trigger computations of the choices of a {@link ChoicesWidget} when computing the initial data
 * for receiving the result (as a {@link Future} in the data service) to enable asynchronous fetching of the choices
 * while still starting the computation as early as possible.
 *
 * @author Paul Bärnreuther
 */
public class AsyncChoicesHolder {

    private AsyncChoicesHolder() {
        // Should not be initialized
    }

    private static class ChoicesFutureWitchCounter {
        final Future<Object[]> m_future;

        Integer m_numberOfExpectedCalls;

        public ChoicesFutureWitchCounter(final Callable<Object[]> choicesCallable) {
            m_future = KNIMEConstants.GLOBAL_THREAD_POOL.enqueue(choicesCallable);
            m_numberOfExpectedCalls = 1;
        }

        void incrementExpectedCalls() {
            m_numberOfExpectedCalls += 1;
        }

        Future<Object[]> get() {
            m_numberOfExpectedCalls -= 1;
            return m_future;
        }

        Integer getNumberOfExpectedCalls() {
            return m_numberOfExpectedCalls;
        }

    }

    /**
     * A map from the class name of a choices provider to its choices.
     */
    private static final Map<String, ChoicesFutureWitchCounter> m_choicesMap = new ConcurrentHashMap<>();

    /**
     * Clears all held choices.
     */
    public static void clear() {
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
    public static void addChoices(final String choicesProviderClassName, final Callable<Object[]> choicesCallable) {
        if (m_choicesMap.containsKey(choicesProviderClassName)) {
            m_choicesMap.get(choicesProviderClassName).incrementExpectedCalls();
        } else {
            m_choicesMap.put(choicesProviderClassName, new ChoicesFutureWitchCounter(choicesCallable));
        }

    }

    /**
     * Starts the computation of choices
     *
     * @param choicesProviderClassName the string under which these choices are stored. If this method was already
     *            called with the same string since the last initialization, the choices will not be computed again but
     *            instead the existing entry is informed that one more get call is to be expected.
     * @return the choices provided by this choicesProvider
     */
    public static Future<Object[]> getChoices(final String choicesProviderClassName) {
        final var choices = m_choicesMap.get(choicesProviderClassName);
        final var future = choices.get();
        if (choices.getNumberOfExpectedCalls().equals(0)) {
            m_choicesMap.remove(choicesProviderClassName);
        }
        return future;

    }

}
