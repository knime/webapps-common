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
 *   Feb 28, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.setting.credentials;

import org.knime.core.node.util.CheckUtils;
import org.knime.core.node.workflow.CredentialsProvider;

/**
 * Wrapper around {@link Credentials} to help support
 * {@link org.knime.core.node.defaultnodesettings.SettingsModelAuthentication.AuthenticationType#CREDENTIALS legacy
 * "Credentials" option}
 *
 * @author Paul Bärnreuther
 */
public final class LegacyCredentials {

    private final Credentials m_credentials;

    private final String m_flowVarName;

    LegacyCredentials(final Credentials credentials) {
        this(credentials, null);
    }

    LegacyCredentials(final Credentials credentials, final String flowVarName) {
        m_credentials = credentials;
        m_flowVarName = flowVarName;
    }

    Credentials toCredentials(final CredentialsProvider provider) {
        if (m_flowVarName != null) {
            final var flowVarValue = provider.get(m_flowVarName);
            final var secondFactor = flowVarValue.getSecondAuthenticationFactor();
            return secondFactor.isPresent()
                ? new Credentials(flowVarValue.getLogin(), flowVarValue.getPassword(), secondFactor.get())
                : new Credentials(flowVarValue.getLogin(), flowVarValue.getPassword());
        }
        return m_credentials;
    }

    Credentials toCredentials() {
        CheckUtils.check(m_flowVarName == null, IllegalStateException::new,
            () -> "Loading credentials from legacy credentials is only permitted if no flow variable is set.");
        return m_credentials;
    }
}
