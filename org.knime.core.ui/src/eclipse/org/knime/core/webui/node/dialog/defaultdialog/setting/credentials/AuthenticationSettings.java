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
 *   Feb 26, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.setting.credentials;

import java.util.Objects;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.defaultnodesettings.SettingsModelAuthentication;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.NodeSettingsPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.NodeSettingsPersistorWithConfigKey;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.PersistableSettings;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.DeprecatedConfigs;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.DeprecatedConfigs.DeprecatedConfigsBuilder;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.FieldBasedNodeSettingsPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.Persist;

/**
 * A switch on the type of authentication that is to be used plus a {@link Credentials} widget that is shown
 * appropriately configured whenever an authentication type requires additional user input.
 *
 * @author Paul Bärnreuther
 */
public class AuthenticationSettings implements WidgetGroup, PersistableSettings {

    /**
     * The types of authentications
     *
     * @author Paul Bärnreuther
     */
    public enum AuthenticationType {
            /** No authentication required. */
            NONE,
            /** Authentication with username. */
            USER,
            /** Authentication with username and password. */
            USER_PWD,
            /** Authentication with password. */
            PWD,
            /** Authentication with kerberos. */
            KERBEROS;

        private final boolean m_requiresCredentials;

        AuthenticationType() {
            this(false);
        }

        AuthenticationType(final boolean requiredCredentials) {
            m_requiresCredentials = requiredCredentials;
        }

        boolean requiresCredentials() {
            return m_requiresCredentials;
        }
    }

    final AuthenticationType m_type;

    final Credentials m_credentials;

    /**
     * NONE selected and empty credentials
     */
    public AuthenticationSettings() {
        this(AuthenticationType.NONE, new Credentials());
    }

    /**
     * @param type the selected type of authentication
     * @param credentials the initial credentials
     */
    public AuthenticationSettings(final AuthenticationType type, final Credentials credentials) {
        m_type = type;
        m_credentials = credentials;
    }

    /**
     * Used to make the {@link AuthenticationSettings} backwards-compatible with respect to the
     * {@link SettingsModelAuthentication} if used in the {@link Persist#settingsModel} parameter.
     *
     * @author Paul Bärnreuther
     */
    public static final class SettingsModelAuthenticationPersistor
        extends NodeSettingsPersistorWithConfigKey<AuthenticationSettings> {

        private static final String KEY_TYPE = "type";

        private static final String KEY_CREDENTIALS = "credentials";

        private static final String SETTINGS_MODEL_KEY_TYPE = "settingsType";

        private static final String SETTINGS_MODEL_KEY_CREDENTIAL = "credentials";

        private static final String SETTINGS_MODEL_KEY_PASSWORD = "password";

        private static final String SETTINGS_MODEL_KEY_USERNAME = "username";

        /**
         * This method should never be called with {@link SettingsModelAuthentication.AuthenticationType#CREDENTIALS}.
         *
         * If it is, this probably means that {@link TODO: UIEXT-1712} are to be used here instead of
         * {@link AuthenticationSettings}.
         *
         * @throws InvalidSettingsException
         */
        static AuthenticationType toAuthenticationType(
            final SettingsModelAuthentication.AuthenticationType legacySettingsType) throws InvalidSettingsException {
            return switch (legacySettingsType) {
                case NONE -> AuthenticationType.NONE;
                case PWD -> AuthenticationType.PWD;
                case USER -> AuthenticationType.USER;
                case USER_PWD -> AuthenticationType.USER_PWD;
                case KERBEROS -> AuthenticationType.KERBEROS;
                default -> throw new InvalidSettingsException(
                    "Unexpected settings model authentication type value: " + legacySettingsType);
            };
        }

        private final NodeSettingsPersistor<AuthenticationSettings> m_defaultPersistor;

        /**
         *
         */
        public SettingsModelAuthenticationPersistor() {
            m_defaultPersistor = new FieldBasedNodeSettingsPersistor<>(AuthenticationSettings.class);
        }

        @Override
        public AuthenticationSettings load(final NodeSettingsRO settings) throws InvalidSettingsException {
            if (settings.getNodeSettings(getConfigKey()).containsKey(KEY_TYPE)) {
                return m_defaultPersistor.load(settings.getNodeSettings(getConfigKey()));
            }
            return loadFromModel(loadModelFromSettings(settings));
        }

        SettingsModelAuthentication loadModelFromSettings(final NodeSettingsRO settings)
            throws InvalidSettingsException {
            final var model =
                new SettingsModelAuthentication(getConfigKey(), SettingsModelAuthentication.AuthenticationType.NONE);
            model.loadSettingsFrom(settings);
            return model;
        }

        static AuthenticationSettings loadFromModel(final SettingsModelAuthentication model)
            throws InvalidSettingsException {
            final var type = toAuthenticationType(model.getAuthenticationType());
            return new AuthenticationSettings(type, toCredentials(model));
        }

        private static Credentials toCredentials(final SettingsModelAuthentication model) {
            return new Credentials(model.getUsername(), model.getPassword());
        }

        @Override
        public void save(final AuthenticationSettings auth, final NodeSettingsWO settings) {
            m_defaultPersistor.save(auth, settings.addNodeSettings(getConfigKey()));
        }

        @Override
        public DeprecatedConfigs[] getDeprecatedConfigs() {
            return new DeprecatedConfigs[]{//
                new DeprecatedConfigsBuilder()//
                    .forNewConfigPath(getConfigKey(), KEY_CREDENTIALS) //
                    .forDeprecatedConfigPath(getConfigKey(), SETTINGS_MODEL_KEY_CREDENTIAL)//
                    .forDeprecatedConfigPath(getConfigKey(), SETTINGS_MODEL_KEY_PASSWORD)//
                    .forDeprecatedConfigPath(getConfigKey(), SETTINGS_MODEL_KEY_USERNAME)//
                    .build(), //
                new DeprecatedConfigsBuilder()//
                    .forNewConfigPath(getConfigKey(), KEY_TYPE) //
                    .forDeprecatedConfigPath(getConfigKey(), SETTINGS_MODEL_KEY_TYPE)//
                    .build()};
        }

    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj instanceof AuthenticationSettings other) {
            return Objects.equals(m_credentials, other.m_credentials) && Objects.equals(m_type, other.m_type);
        }
        return false;
    }

    @Override
    public int hashCode() {
        return Objects.hash(m_credentials, m_type);
    }

}
