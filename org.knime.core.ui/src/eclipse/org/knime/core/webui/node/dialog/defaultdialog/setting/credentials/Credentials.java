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
 *   12 Oct 2023 (Marc Bux, KNIME GmbH, Berlin, Germany): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.setting.credentials;

import static org.knime.core.node.workflow.VariableType.CredentialsType.CFG_NAME;
import static org.knime.core.node.workflow.VariableType.CredentialsType.CFG_PASSWORD;
import static org.knime.core.node.workflow.VariableType.CredentialsType.CFG_SECOND_FACTOR;
import static org.knime.core.node.workflow.VariableType.CredentialsType.CFG_USERNAME;
import static org.knime.core.node.workflow.VariableType.CredentialsType.PASSWORD_SECRET;
import static org.knime.core.node.workflow.VariableType.CredentialsType.SECOND_FACTOR_SECRET;

import java.io.IOException;
import java.util.Objects;
import java.util.Optional;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.NodeSettingsPersistor;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.core.JsonStreamContext;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.module.SimpleModule;

/**
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
public final class Credentials {

    private static final String IS_HIDDEN_PASSWORD_KEY = "isHiddenPassword";

    private static final String IS_HIDDEN_SECOND_FACTOR_KEY = "isHiddenSecondFactor";

    private static final String FLOW_VAR_NAME_KEY = "flowVariableName";

    private static final String PASSWORD_KEY = "password";

    private static final String SECOND_FACTOR_KEY = "secondFactor";

    private static final String USERNAME_KEY = "username";

    String m_username;

    String m_password;

    String m_secondFactor;

    /**
     * Default constructor
     */
    public Credentials() {
        this("", "", "");
    }

    /**
     * @param username
     * @param password
     */
    public Credentials(final String username, final String password) {
        this(username, password, "");
    }

    /**
     * @param username
     * @param password
     * @param secondFactor
     */
    public Credentials(final String username, final String password, final String secondFactor) {
        m_username = username;
        m_password = password;
        m_secondFactor = secondFactor;
    }

    /**
     * @return the username
     */
    public String getUsername() {
        return m_username;
    }

    /**
     * @return the password
     */
    public String getPassword() {
        return m_password;
    }

    /**
     * @return the secondFactor
     */
    public String getSecondFactor() {
        return m_secondFactor;
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final var other = (Credentials)obj;
        return Objects.equals(m_username, other.m_username) && Objects.equals(m_password, other.m_password)
            && Objects.equals(m_secondFactor, other.m_secondFactor);
    }

    @Override
    public int hashCode() {
        return Objects.hash(m_username, m_password, m_secondFactor);
    }

    /**
     * Adds custom serialization logic to not send any passwords to the frontend
     *
     * @param module
     */
    public static void addSerializerAndDeserializer(final SimpleModule module) {
        module.addSerializer(Credentials.class, new Credentials.CredentialsSerializer());
        module.addDeserializer(Credentials.class, new Credentials.CredentialsDeserializer());
    }

    static final class CredentialsSerializer extends JsonSerializer<Credentials> {

        @Override
        public void serialize(final Credentials value, final JsonGenerator gen, final SerializerProvider serializers)
            throws IOException {
            final var fieldId = toFieldId(gen.getOutputContext());
            gen.writeStartObject();
            final var password = value.getPassword();
            addPassword(gen, IS_HIDDEN_PASSWORD_KEY, password, fieldId + "." + PASSWORD_KEY);
            final var secondFactor = value.getSecondFactor();
            addPassword(gen, IS_HIDDEN_SECOND_FACTOR_KEY, secondFactor, fieldId + "." + SECOND_FACTOR_KEY);
            serializers.defaultSerializeField(USERNAME_KEY, value.getUsername(), gen);
            gen.writeEndObject();
        }

        private static String toFieldId(final JsonStreamContext context) {
            final var parent = context.getParent();
            String parentFieldId;
            if (parent.inRoot()) {
                parentFieldId = context.getCurrentValue().getClass().getName();
            } else {
                parentFieldId = toFieldId(parent);
            }
            if (context.hasCurrentName()) {
                return parentFieldId + "." + context.getCurrentName();
            }
            return parentFieldId;
        }

        private static void addPassword(final JsonGenerator gen, final String hiddenPasswordKey, final String password,
            final String passwordId) throws IOException {
            if (password == null || password.isEmpty()) {
                gen.writeBooleanField(hiddenPasswordKey, false);
            } else {
                PasswordHolder.addPassword(passwordId, password);
                gen.writeBooleanField(hiddenPasswordKey, true);
            }
        }
    }

    static final class CredentialsDeserializer extends JsonDeserializer<Credentials> {

        @Override
        public Credentials deserialize(final JsonParser p, final DeserializationContext ctxt)
            throws IOException, JacksonException {
            final var fieldId = CredentialsSerializer.toFieldId(p.getParsingContext());
            final var node = (JsonNode)p.getCodec().readTree(p);
            final var username = extractString(node, USERNAME_KEY);
            final String password;
            final String secondFactor;
            final var flowVariableName = extractString(node, FLOW_VAR_NAME_KEY);
            if (!flowVariableName.isEmpty() && PasswordHolder.hasCredentialsProvider()) {
                final var credentials = PasswordHolder.getSuppliedCredentialsProvider().get(flowVariableName);
                password = credentials.getPassword();
                secondFactor = credentials.getSecondAuthenticationFactor().orElse("");
            } else {
                password = getPassword(node, IS_HIDDEN_PASSWORD_KEY, PASSWORD_KEY, fieldId + "." + PASSWORD_KEY);
                secondFactor = getPassword(node, IS_HIDDEN_SECOND_FACTOR_KEY, SECOND_FACTOR_KEY,
                    fieldId + "." + SECOND_FACTOR_KEY);
            }
            return new Credentials(username, password, secondFactor);
        }

        private static String getPassword(final JsonNode node, final String hiddenPasswordKey, final String passwordKey,
            final String passwordId) {
            final var isHiddenPassword = node.get(hiddenPasswordKey);
            if (isHiddenPassword != null && !isHiddenPassword.asBoolean()) {
                return extractString(node, passwordKey);
            }
            return Optional.ofNullable(PasswordHolder.get(passwordId)).orElse("");
        }

        private static String extractString(final JsonNode node, final String key) {
            final var value = node.get(key);
            if (value == null || value.isNull()) {
                return "";
            }
            return value.asText();
        }
    }

    /**
     * A {@link NodeSettingsPersistor} for {@link Credentials} objects.
     *
     * @author Marc Bux, KNIME GmbH, Berlin, Germany
     */
    public static final class CredentialsPersistor implements NodeSettingsPersistor<Credentials> {

        private final String m_configKey;

        /**
         * @param configKey the configuration key for these credentials
         */
        public CredentialsPersistor(final String configKey) {
            m_configKey = configKey;
        }

        @Override
        public Credentials load(final NodeSettingsRO settings) throws InvalidSettingsException {
            final var credentialsConfig = settings.getNodeSettings(m_configKey);
            final var username = credentialsConfig.getString(CFG_USERNAME);
            final var password = credentialsConfig.getPassword(CFG_PASSWORD, PASSWORD_SECRET);
            final var secondFactor = credentialsConfig.getPassword(CFG_SECOND_FACTOR, SECOND_FACTOR_SECRET);
            return new Credentials(username, password, secondFactor);
        }

        @Override
        public void save(final Credentials credentials, final NodeSettingsWO settings) {
            final var credentialsConfig = settings.addNodeSettings(m_configKey);
            credentialsConfig.addString(CFG_NAME, "");
            if (credentials != null) {
                persistCredentials(credentials, credentialsConfig);
            } else {
                persistCredentials(new Credentials(), credentialsConfig);
            }
        }

        private static void persistCredentials(final Credentials credentials, final NodeSettingsWO credentialsConfig) {
            credentialsConfig.addString(CFG_USERNAME, credentials.getUsername());
            credentialsConfig.addPassword(CFG_PASSWORD, PASSWORD_SECRET, credentials.getPassword());
            credentialsConfig.addPassword(CFG_SECOND_FACTOR, SECOND_FACTOR_SECRET, credentials.getSecondFactor());
        }
    }

}
