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

import java.io.IOException;
import java.util.Objects;

import com.fasterxml.jackson.core.JacksonException;
import com.fasterxml.jackson.core.JsonGenerator;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.BeanProperty;
import com.fasterxml.jackson.databind.DeserializationContext;
import com.fasterxml.jackson.databind.JsonDeserializer;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.JsonSerializer;
import com.fasterxml.jackson.databind.SerializerProvider;
import com.fasterxml.jackson.databind.deser.ContextualDeserializer;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.ContextualSerializer;

/**
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
public final class Credentials {

    private static final String IS_HIDDEN_PASSWORD_KEY = "isHiddenPassword";

    private static final String PASSWORD_KEY = "password";

    private static final String USERNAME_KEY = "username";

    String m_username;

    String m_password;

    /**
     * Default constructor
     */
    public Credentials() {
        this("", "");
    }

    /**
     * @param username
     * @param password
     */
    public Credentials(final String username, final String password) {
        m_username = username;
        m_password = password;
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
        return Objects.equals(m_username, other.m_username) && Objects.equals(m_password, other.m_password);
    }

    @Override
    public int hashCode() {
        return Objects.hash(m_username, m_password);
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

    static final class CredentialsSerializer extends JsonSerializer<Credentials> implements ContextualSerializer {

        private String m_fieldId;

        @Override
        public void serialize(final Credentials value, final JsonGenerator gen, final SerializerProvider serializers)
            throws IOException {
            gen.writeStartObject();
            final var password = value.getPassword();
            addPassword(gen, password);
            serializers.defaultSerializeField(USERNAME_KEY, value.getUsername(), gen);
            gen.writeEndObject();
        }

        private void addPassword(final JsonGenerator gen, final String password) throws IOException {
            if (password.isEmpty()) {
                gen.writeBooleanField(IS_HIDDEN_PASSWORD_KEY, false);
            } else {
                PasswordHolder.addPassword(m_fieldId, password);
                gen.writeBooleanField(IS_HIDDEN_PASSWORD_KEY, true);
            }
        }

        @Override
        public JsonSerializer<?> createContextual(final SerializerProvider prov, final BeanProperty property)
            throws JsonMappingException {
            m_fieldId = getFieldId(property);
            return this;
        }

        private static String getFieldId(final BeanProperty property) {
            if (property == null) {
                return null;
            }
            return property.getMember().getFullName();
        }
    }

    static final class CredentialsDeserializer extends JsonDeserializer<Credentials> implements ContextualDeserializer {

        private String m_fieldPath;

        /**
         * {@inheritDoc}
         */
        @Override
        public Credentials deserialize(final JsonParser p, final DeserializationContext ctxt)
            throws IOException, JacksonException {
            final var node = (JsonNode)p.getCodec().readTree(p);
            final var username = node.get(USERNAME_KEY).asText();
            final var password = getPassword(node);
            return new Credentials(username, password);
        }

        private String getPassword(final JsonNode node) {
            final var isHiddenPassword = node.get(IS_HIDDEN_PASSWORD_KEY);
            if (isHiddenPassword != null && !isHiddenPassword.asBoolean()) {
                final var password = node.get(PASSWORD_KEY);
                if (password == null || password.isNull()) {
                    return "";
                }
                return password.asText();
            }
            return PasswordHolder.get(m_fieldPath);
        }

        @Override
        public JsonDeserializer<?> createContextual(final DeserializationContext ctxt, final BeanProperty property)
            throws JsonMappingException {
            m_fieldPath = CredentialsSerializer.getFieldId(property);
            return this;
        }
    }

}
