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
 *   17 Oct 2023 (Marc Bux, KNIME GmbH, Berlin, Germany): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.setting.credentials;

import static net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.knime.core.node.workflow.NodeContainer;
import org.knime.core.node.workflow.NodeContext;
import org.knime.core.node.workflow.NodeID;

import com.fasterxml.jackson.annotation.JsonAutoDetect.Visibility;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.datatype.jdk8.Jdk8Module;

import nl.jqno.equalsverifier.EqualsVerifier;
import nl.jqno.equalsverifier.Warning;

/**
 * @author Marc Bux, KNIME GmbH, Berlin, Germany
 */
public class CredentialsTest {

    @Test
    void testEqualsHashCodeContracts() {
        EqualsVerifier.forClass(Credentials.class).suppress(Warning.NONFINAL_FIELDS).verify();
    }

    @Nested
    @SuppressWarnings("unused")
    class CredentialsSerialization {

        ObjectMapper objectMapper;

        ThreadLocal<NodeContainer> nodeContainer = new ThreadLocal<>();

        @BeforeEach
        void createObjectMapper() {
            objectMapper = new ObjectMapper();
            objectMapper.registerModule(new Jdk8Module());
            objectMapper.setSerializationInclusion(Include.NON_NULL);
            objectMapper.setVisibility(PropertyAccessor.ALL, Visibility.NON_PRIVATE);
            final var module = new SimpleModule();
            Credentials.addSerializerAndDeserializer(module);
            objectMapper.registerModule(module);
        }

        @BeforeEach
        void provideNodeContainer() {
            final var nodeContainerMock = mock(NodeContainer.class);
            when(nodeContainerMock.getID()).thenReturn(new NodeID(getCurrentId()));
            nodeContainer.set(nodeContainerMock);
        }

        private int getCurrentId() {
            return (int)Thread.currentThread().getId() * 2;
        }

        @AfterEach
        void clearNodeContainerAndPasswords() {
            PasswordHolder.removeAllPasswordsOfDialog(nodeContainer.get().getID());
            nodeContainer.remove();
        }

        @Test
        void testSerialize() {
            class CredentialsTestSettings {
                Credentials credentials = new Credentials("username", "password");
            }
            final var result = serialize(new CredentialsTestSettings());
            assertThatJson(result)//
                .inPath("credentials").isObject()//
                .containsEntry("username", "username")//
                .containsEntry("isHiddenPassword", true) //
                .containsOnlyKeys("username", "isHiddenPassword");
            assertThat(PasswordHolder.get(String.format("%s.credentials", CredentialsTestSettings.class.getName())))
                .isEqualTo("password");
        }

        @Test
        void testSerializeEmptyPassword() {
            class CredentialsTestSettings {
                Credentials credentials = new Credentials("username", "");
            }
            final var result = serialize(new CredentialsTestSettings());
            assertThatJson(result)//
                .inPath("credentials").isObject()//
                .containsEntry("username", "username")//
                .containsEntry("isHiddenPassword", false) //
                .containsOnlyKeys("username", "isHiddenPassword");
            assertThat(PasswordHolder.get(String.format("%s.credentials", CredentialsTestSettings.class.getName())))
                .isNull();
        }

        @Test
        void throwsIfMultipleNodeIdsUseTheSameCredentialsField() {
            class CredentialsTestSettings {
                Credentials credentials = new Credentials("username", "password");
            }
            serialize(new CredentialsTestSettings());
            assertDoesNotThrow(() -> serialize(new CredentialsTestSettings()));

            final var secondNodeContainerMock = mock(NodeContainer.class);
            when(secondNodeContainerMock.getID()).thenReturn(new NodeID(getCurrentId() + 1));
            assertThrows(IllegalArgumentException.class,
                () -> serialize(new CredentialsTestSettings(), secondNodeContainerMock));
        }

        private JsonNode serialize(final Object settings) {

            return serialize(settings, nodeContainer.get());
        }

        private JsonNode serialize(final Object settings, final NodeContainer nc) {

            NodeContext.pushContext(nc);
            try {
                return objectMapper.valueToTree(settings);
            } finally {
                NodeContext.removeLastContext();
            }
        }

        static class DeserializeTestSettings {
            Credentials credentials = new Credentials("username", "password");
        }

        @Test
        void testDeserialize() throws JsonProcessingException, IllegalArgumentException {
            final var result = serialize(new DeserializeTestSettings());
            final DeserializeTestSettings settings = objectMapper.treeToValue(result, DeserializeTestSettings.class);
            assertThat(settings.credentials.getPassword()).isEqualTo("password");
            assertThat(settings.credentials.getUsername()).isEqualTo("username");
        }

        static class DeserializeEmptyPasswordTestSettings {
            Credentials credentials = new Credentials("username", "");
        }

        @Test
        void testDeserializeEmptyPassword() throws JsonProcessingException, IllegalArgumentException {
            final var result = serialize(new DeserializeEmptyPasswordTestSettings());
            final DeserializeEmptyPasswordTestSettings settings =
                objectMapper.treeToValue(result, DeserializeEmptyPasswordTestSettings.class);
            assertThat(settings.credentials.getPassword()).isEqualTo("");
            assertThat(settings.credentials.getUsername()).isEqualTo("username");
        }

        static class DeserializeNonEmptyManualPasswordTestSettings {
            Credentials credentials = new Credentials("username", "password");
        }

        @Test
        void testDeserializeNonEmptyManualPassword() throws JsonProcessingException, IllegalArgumentException {
            final var result = serialize(new DeserializeEmptyPasswordTestSettings());
            final var credentialsJson = (ObjectNode)result.get("credentials");
            credentialsJson.put("isHiddenPassword", false);
            final var newPassword = "newPassword";
            credentialsJson.put("password", newPassword);
            final DeserializeEmptyPasswordTestSettings settings =
                objectMapper.treeToValue(result, DeserializeEmptyPasswordTestSettings.class);
            assertThat(settings.credentials.getPassword()).isEqualTo(newPassword);
            assertThat(settings.credentials.getUsername()).isEqualTo("username");
        }

    }

}
