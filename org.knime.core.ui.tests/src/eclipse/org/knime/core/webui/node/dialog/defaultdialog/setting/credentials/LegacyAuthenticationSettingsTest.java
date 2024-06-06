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

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Optional;
import java.util.stream.Stream;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.defaultnodesettings.SettingsModelAuthentication;
import org.knime.core.node.workflow.CredentialsProvider;
import org.knime.core.node.workflow.ICredentials;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.FieldNodeSettingsPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.AuthenticationSettings.AuthenticationType;
import org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.LegacyAuthenticationSettings.AuthTypeCredentialsToPasswordPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.LegacyAuthenticationSettings.AuthTypeCredentialsToUsernameAndPasswordPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.LegacyAuthenticationSettings.AuthTypeCredentialsToUsernamePersistor;

/**
 *
 * @author Paul Bärnreuther
 */
@SuppressWarnings("java:S2698") // We allow assertions without messages
class LegacyAuthenticationSettingsTest {

    final static String PASSWORD = "myPassword";

    final static String USERNAME = "myUsername";

    final static String SECOND_FACTOR = "mySecondFactor";

    final static Credentials CREDENTIALS = new Credentials(USERNAME, PASSWORD, SECOND_FACTOR);

    final static String FLOW_VAR_NAME = "myFlowVarName";

    private static CredentialsProvider m_credentialsProvider;

    @BeforeAll
    static void mockCredentialsProvider() {
        m_credentialsProvider = mock(CredentialsProvider.class);
        when(m_credentialsProvider.get(FLOW_VAR_NAME)).thenReturn(new ICredentials() {

            @Override
            public String getPassword() {
                return PASSWORD;
            }

            @Override
            public Optional<String> getSecondAuthenticationFactor() {
                return Optional.of(SECOND_FACTOR);
            }

            @Override
            public String getName() {
                return null;
            }

            @Override
            public String getLogin() {
                return USERNAME;
            }
        });
    }

    @Test
    void testToAuthenticationSettings() {
        final var authenticationSettings =
            new AuthenticationSettings(AuthenticationType.PWD, new Credentials("username", "password"));
        final var legacyAuthenticationSettings = new LegacyAuthenticationSettings(authenticationSettings);
        assertEquals(authenticationSettings, legacyAuthenticationSettings.toAuthenticationSettings());
    }

    @Test
    void testThrowsOnToAuthenticationSettingsOnLegacyFlowVariable() {
        final var legacyAuthenticationSettings = new LegacyAuthenticationSettings(AuthenticationType.PWD,
            new LegacyCredentials(new Credentials(), "flowVarName"));
        assertThrows(IllegalStateException.class, () -> legacyAuthenticationSettings.toAuthenticationSettings());
    }

    @Test
    void testToAuthenticationSettingsWithCredentialsProvider() {

        final var expected = new AuthenticationSettings(AuthenticationType.PWD, CREDENTIALS);
        final var legacyAuthenticationSettings = new LegacyAuthenticationSettings(AuthenticationType.PWD,
            new LegacyCredentials(new Credentials(), FLOW_VAR_NAME));
        assertEquals(expected, legacyAuthenticationSettings.toAuthenticationSettings(m_credentialsProvider));
    }

    @Nested
    class SettingsModelAuthenticationPersistorTest {

        final static String CFG_KEY = "authenticationSettings";

        static Stream<Arguments> persistorsWithTypes() {
            return Stream.of( //
                Arguments.of(AuthTypeCredentialsToPasswordPersistor.class, AuthenticationType.PWD), //
                Arguments.of(AuthTypeCredentialsToUsernamePersistor.class, AuthenticationType.USER), //
                Arguments.of(AuthTypeCredentialsToUsernameAndPasswordPersistor.class, AuthenticationType.USER_PWD));
        }

        static Stream<Arguments> persistors() {
            return Stream.of( //
                Arguments.of(AuthTypeCredentialsToPasswordPersistor.class), //
                Arguments.of(AuthTypeCredentialsToUsernamePersistor.class), //
                Arguments.of(AuthTypeCredentialsToUsernameAndPasswordPersistor.class));
        }

        @ParameterizedTest
        @MethodSource("persistorsWithTypes")
        void testLoadWithLegacyCredentialsType(
            final Class<? extends FieldNodeSettingsPersistor<LegacyAuthenticationSettings>> persistorClass,
            final AuthenticationType expectedType) throws InvalidSettingsException {
            final var model = new SettingsModelAuthentication(CFG_KEY,
                SettingsModelAuthentication.AuthenticationType.CREDENTIALS, null, null, FLOW_VAR_NAME);
            final var nodeSettings = createLegacyNodeSettings(model);
            final var persistor = createPersistor(persistorClass);
            final var loadedSettings = persistor.load(nodeSettings);
            final var expected = new AuthenticationSettings(expectedType, CREDENTIALS);
            assertEquals(expected, loadedSettings.toAuthenticationSettings(m_credentialsProvider));
        }

        @ParameterizedTest
        @MethodSource("persistors")
        void testLoadWithNonCredentialsLegacyType(
            final Class<? extends FieldNodeSettingsPersistor<LegacyAuthenticationSettings>> persistorClass)
            throws InvalidSettingsException {
            final var model = new SettingsModelAuthentication(CFG_KEY,
                SettingsModelAuthentication.AuthenticationType.USER_PWD, USERNAME, PASSWORD, null);
            final var nodeSettings = createLegacyNodeSettings(model);
            final var persistor = createPersistor(persistorClass);
            final var loadedSettings = persistor.load(nodeSettings);
            final var expected =
                new AuthenticationSettings(AuthenticationType.USER_PWD, new Credentials(USERNAME, PASSWORD));
            assertEquals(expected, loadedSettings.toAuthenticationSettings(m_credentialsProvider));
        }

        @ParameterizedTest
        @MethodSource("persistors")
        void testSaveLoad(
            final Class<? extends FieldNodeSettingsPersistor<LegacyAuthenticationSettings>> persistorClass)
            throws InvalidSettingsException {
            final var authenticationSettings =
                new AuthenticationSettings(AuthenticationType.USER_PWD, new Credentials(USERNAME, PASSWORD));
            final var legacyAuthenticationSettings = new LegacyAuthenticationSettings(authenticationSettings);
            final var persistor = createPersistor(persistorClass);
            final var nodeSettings = new NodeSettings("root");
            persistor.save(legacyAuthenticationSettings, nodeSettings);
            final var savedAndLoaded = persistor.load(nodeSettings);
            assertEquals(authenticationSettings, savedAndLoaded.toAuthenticationSettings(m_credentialsProvider));
        }

        @ParameterizedTest
        @MethodSource("persistors")
        void testDeprecatedConfigs(
            final Class<? extends FieldNodeSettingsPersistor<LegacyAuthenticationSettings>> persistorClass) {
            final var persistor = createPersistor(persistorClass);
            assertThat(persistor.getConfigsDeprecations()).hasSize(2);
        }

        private static FieldNodeSettingsPersistor<LegacyAuthenticationSettings> createPersistor(
            final Class<? extends FieldNodeSettingsPersistor<LegacyAuthenticationSettings>> persistorClass) {
            final var persistor =
                FieldNodeSettingsPersistor.createInstance(persistorClass, LegacyAuthenticationSettings.class, CFG_KEY);
            return persistor;
        }

        private static NodeSettings createLegacyNodeSettings(final SettingsModelAuthentication model) {
            final var nodeSettings = new NodeSettings("root");
            model.saveSettingsTo(nodeSettings);
            return nodeSettings;
        }

    }
}
