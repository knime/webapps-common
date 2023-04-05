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
 *   Mar 30, 2023 (hornm): created
 */
package org.knime.core.webui.node.port;

import java.util.ArrayDeque;
import java.util.Deque;

import org.knime.core.node.NodeLogger;
import org.knime.core.node.util.CheckUtils;
import org.knime.core.node.workflow.NodeContext;
import org.knime.core.node.workflow.NodePort;

/**
 * Similar to the {@link NodeContext}, but holds contextual information about a {@link NodePort} for operations carried
 * out for a port (e.g. accessing port data for the port view). This is used for internal purposes, node implementors
 * should not use this class.
 *
 * One must absolutely make sure that if a new context is pushed it also is removed afterwards. Therefore the common
 * usage pattern is a follows:
 *
 * <pre>
 * PortContext.pushContext(nodePort);
 * try {
 *     doSomething();
 * } finally {
 *     PortContext.removeLastContext():
 * }
 * </pre>
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
public final class PortContext {

    private static final ThreadLocal<Deque<PortContext>> CONTEXT_STACK = new ThreadLocal<>();

    private final NodePort m_nodePort;

    /**
     * @return the port context or {@code null} if there is none
     */
    public static PortContext getContext() {
        var stack = getContextStack();
        if (stack.isEmpty()) {
            return null;
        } else {
            return stack.peek();
        }
    }

    /**
     * Pushes a new context on the context stack for the current thread given the node port.
     *
     * @param nodePort the node port
     */
    public static void pushContext(final NodePort nodePort) {
        CheckUtils.checkNotNull(nodePort);
        getContextStack().push(new PortContext(nodePort));
    }

    private static Deque<PortContext> getContextStack() {
        var stack = CONTEXT_STACK.get();
        if (stack == null) {
            stack = new ArrayDeque<>(2);
            CONTEXT_STACK.set(stack);
        } else if (stack.size() > 3) {
            NodeLogger.getLogger(NodeContext.class).codingWithoutContext("Port context stack has more than 3 elements ("
                + stack.size() + "), looks like we are leaking contexts somewhere");
        }
        return stack;
    }

    /**
     * Removes the top-most context from the context stack.
     *
     * @throws IllegalStateException if no context is available / if the context stack is empty
     */
    public static void removeLastContext() {
        var stack = getContextStack();
        if (stack.isEmpty()) {
            throw new IllegalStateException("No port context registered for the current thread");
        }
        stack.pop();
        if (stack.isEmpty()) {
            CONTEXT_STACK.remove();
        }
    }

    private PortContext(final NodePort nodePort) {
        m_nodePort = nodePort;
    }

    /**
     * @return the node port associated with the current context
     */
    public NodePort getNodePort() {
        return m_nodePort;
    }

}
