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
 *   Oct 19, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.setting.credentials;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.knime.core.node.workflow.CredentialsProvider;
import org.knime.core.node.workflow.NodeID;

/**
 * Since we do not want to send passwords to the frontend when serializing {@link Credentials}, we need to store them
 * temporarily in order to receive passwords again when deserializing. When passwords are no longer needed, because the
 * associated node dialog has been deactivated, they should be removed from the map here again. This is why we also
 * remember the node id for every stored password.
 *
 * @author Paul Bärnreuther
 */
public final class PasswordHolder {

    private static final ThreadLocal<NodeID> currentNodeID = new ThreadLocal<NodeID>();

    private static final ThreadLocal<CredentialsProvider> credentialsProvider = new ThreadLocal<CredentialsProvider>();

    private PasswordHolder() {
        // Cannot be instantiated
    }

    private static final Map<String, String> PASSWORDS = new HashMap<>();

    private static final Map<NodeID, Set<String>> PASSWORD_IDS_PER_NODE_ID = new HashMap<>();

    /**
     * Call this method in order to allow writing passwords to the password holder. The passwords are associated with
     * the given nodeID to be removed later using {@link #removeAllPasswordsOfDialog}.
     *
     * @param nodeID
     */
    public static final void activate(final NodeID nodeID) {
        final var current = currentNodeID.get();
        if (current != null && !nodeID.equals(current)) {
            throw new IllegalStateException(
                "PasswordHolder is activated for two different nodes within the same thread.");
        }
        currentNodeID.set(nodeID);
    }

    /**
     * Deactivate writing new passwords to the password holder
     */
    public static final void deactivate() {
        currentNodeID.remove();
    }

    /**
     * Tear down method to remove all passwords from the global map when they are not necessary anymore.
     *
     * @param nodeId the id of node container associated to the dialog.
     */
    public static synchronized void removeAllPasswordsOfDialog(final NodeID nodeId) {
        final var passwordIds = PASSWORD_IDS_PER_NODE_ID.remove(nodeId);
        if (passwordIds == null) {
            return;
        }
        passwordIds.stream().forEach(PasswordHolder::remove);
    }

    /**
     * This method throws an exception if {@link #activate} has not been called.
     */
    static synchronized void addPassword(final String passwordId, final String password) {
        final var nodeID = currentNodeID.get();
        if (nodeID == null) {
            return;
        }
        validateAgainstKnownLimitations(passwordId, password, nodeID);
        accociatePasswordIdToNode(passwordId, nodeID);
        PASSWORDS.put(passwordId, password);
    }

    /**
     * Currently, it is a known limitation, that we cannot associate the nodeId with the saved passwords, as this is not
     * known during deserialization. Thus, only one active node dialog is allowed to hold passwords with the same
     * passwordId at a time. TODO: UIEXT-1375 resolve this limitation
     *
     * @param passwordId associated to the field. It entails only the name of the field and the full name of its
     *            containing class.
     * @param password
     * @param nodeId
     */
    private static void validateAgainstKnownLimitations(final String passwordId, final String password,
        final NodeID nodeId) {
        if (isAlreadySet(passwordId) && isNotAlreadySetForNode(passwordId, nodeId)) {
            throw new IllegalStateException(
                "Multiple active node dialogs containing credentials at the same time are not supported yet.");
        }
    }

    private static boolean isAlreadySet(final String passwordId) {
        return get(passwordId) != null;
    }

    private static boolean isNotAlreadySetForNode(final String passwordId, final NodeID nodeId) {
        final var alreadySetIdsForNode = PASSWORD_IDS_PER_NODE_ID.get(nodeId);
        return alreadySetIdsForNode == null || !alreadySetIdsForNode.contains(passwordId);
    }

    static synchronized String get(final String passwordId) {
        return PASSWORDS.get(passwordId);
    }

    private static void remove(final String passwordId) {
        PASSWORDS.remove(passwordId);
    }

    private static void accociatePasswordIdToNode(final String passwordId, final NodeID nodeId) {
        PASSWORD_IDS_PER_NODE_ID.compute(nodeId, (k, v) -> {
            if (v == null) {
                v = new HashSet<>();
            }
            v.add(passwordId);
            return v;
        });
    }

    /**
     * Set a credentials provider temporarily in order to enable deserializing credential input fields overwritten by
     * flow variables.
     *
     * @param cp a credentialsProvider accessible vie {@link #getSuppliedCredentialsProvider}
     */
    public static void setCredentialsProvider(final CredentialsProvider cp) {
        credentialsProvider.set(cp);
    }

    /**
     * Remove the temporarily set credentials provider set with {@link #setCredentialsProvider(CredentialsProvider)}
     */
    public static void removeCredentialsProvider() {
        credentialsProvider.remove();
    }

    static boolean hasCredentialsProvider() {
        return credentialsProvider.get() != null;
    }

    static CredentialsProvider getSuppliedCredentialsProvider() {
        return credentialsProvider.get();
    }

}
