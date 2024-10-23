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
 * History
 *   Jan 14, 2021 (hornm): created
 */
package org.knime.core.webui.node.view.flowvariable;

import org.knime.core.node.workflow.CredentialsStore;
import org.knime.core.node.workflow.NodeID;

/**
 * Represents a flow variable to be displayed as port of the flow variable port view.
 *
 * @author Martin Horn, KNIME GmbH, Konstanz, Germany
 */
public interface FlowVariable {

    /**
     * @return the flow variable name
     */
    String getName();

    /**
     * @return the flow var type
     */
    String getType();

    /**
     * @return the actual value
     */
    String getValue();

    /**
     * @return the id of the node that created the flow variable (can be <code>null</code>)
     */
    String getOwnerNodeId();

    /**
     * Helper to create a flow variable on the fly.
     *
     * @param v
     * @return the new flow variable which retrieves the values from the passed 'core'-flow variable representation on
     *         demand
     */
    static FlowVariable create(final org.knime.core.node.workflow.FlowVariable v) {
        return new FlowVariable() { // NOSONAR, this is not an excessively big inner class

            @Override
            public String getValue() {
                // AP-21680: Flow variable view should show the login instead of the flow variable name again
                final var optCredentialProperties = CredentialsStore.CredentialsProperties.of(v);
                if (optCredentialProperties.isPresent()) {
                    final var credentials = optCredentialProperties.get();
                    return "Username: \"%s\", Password: %s".formatted(credentials.login(),
                        credentials.isPasswordSet() ? "******" : "not provided");
                }
                return v.getValueAsString();
            }

            @Override
            public String getType() {
                return v.getVariableType().getClass().getSimpleName();
            }

            @Override
            public String getOwnerNodeId() {
                NodeID owner = v.getOwner();
                return owner != null && !owner.isRoot() ? owner.toString() : "";
            }

            @Override
            public String getName() {
                return v.getName();
            }
        };
    }

}
