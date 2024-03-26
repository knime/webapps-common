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

import static org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.AuthenticationSettings.SettingsModelAuthenticationPersistor.SETTINGS_MODEL_KEY_CREDENTIAL;
import static org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.AuthenticationSettings.SettingsModelAuthenticationPersistor.SETTINGS_MODEL_KEY_PASSWORD;
import static org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.AuthenticationSettings.SettingsModelAuthenticationPersistor.SETTINGS_MODEL_KEY_TYPE;
import static org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.AuthenticationSettings.SettingsModelAuthenticationPersistor.SETTINGS_MODEL_KEY_USERNAME;

import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.defaultnodesettings.SettingsModelAuthentication;
import org.knime.core.node.workflow.CredentialsProvider;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.NodeSettingsPersistorWithConfigKey;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.DeprecatedConfigs;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.DeprecatedConfigs.DeprecatedConfigsBuilder;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.FieldNodeSettingsPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.Persist;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Effect;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Effect.EffectType;
import org.knime.core.webui.node.dialog.defaultdialog.rule.Signal;
import org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.AuthenticationSettings.AuthenticationType;
import org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.AuthenticationSettings.AuthenticationType.RequiresCredentialsCondition;
import org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.AuthenticationSettings.AuthenticationTypeRef;
import org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.AuthenticationSettings.RequiresPasswordProvider;
import org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.AuthenticationSettings.RequiresUsernameProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.RadioButtonsWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.credentials.CredentialsWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueReference;

/**
 * Similarly to {@link AuthenticationSettings}, but additionally supports the
 * {@link org.knime.core.node.defaultnodesettings.SettingsModelAuthentication.AuthenticationType#CREDENTIALS
 * "Credentials"} authentication type in legacy dialogs by setting the respective flow variable once the dialog is
 * opened.
 *
 * To use it, one of the three following {@link Persist#customPersistor custom persistors} has to be used:
 * <li>{@link AuthTypeCredentialsToPasswordPersistor}</li>
 * <li>{@link AuthTypeCredentialsToUsernamePersistor}</li>
 * <li>{@link AuthTypeCredentialsToUsernameAndPasswordPersistor}</li>
 *
 * @author Paul Bärnreuther
 */
public final class LegacyAuthenticationSettings implements WidgetGroup {

    @Widget(title = "Authentication type", description = "The type of the used authentication.")
    @ValueReference(AuthenticationTypeRef.class)
    @RadioButtonsWidget(horizontal = true)
    @Signal(condition = AuthenticationType.RequiresCredentialsCondition.class)
    final AuthenticationType m_type;

    @Widget(title = "Credentials", description = "The credentials used for the authentication.")
    @Effect(signals = RequiresCredentialsCondition.class, type = EffectType.SHOW)
    @CredentialsWidget(hasPasswordProvider = RequiresPasswordProvider.class,
        hasUsernameProvider = RequiresUsernameProvider.class)
    final LegacyCredentials m_legacyCredentials;

    /**
     * @param authenticationSettings
     */
    public LegacyAuthenticationSettings(final AuthenticationSettings authenticationSettings) {
        this(authenticationSettings.m_type, new LegacyCredentials(authenticationSettings.m_credentials));
    }

    /**
     * package scope for test purposes
     */
    LegacyAuthenticationSettings(final AuthenticationType type, final LegacyCredentials legacyCredentials) {
        m_type = type;
        m_legacyCredentials = legacyCredentials;
    }

    /**
     * @param provider that is used when
     *            {@link org.knime.core.node.defaultnodesettings.SettingsModelAuthentication.AuthenticationType#CREDENTIALS
     *            "Credentials"} has been set as authentication type and the dialog was not applied since then
     * @return the {@link AuthenticationSettings} equivalent
     */
    public AuthenticationSettings toAuthenticationSettings(final CredentialsProvider provider) {
        return new AuthenticationSettings(m_type, m_legacyCredentials.toCredentials(provider));
    }

    /**
     * package scope for test purposes
     */
    AuthenticationSettings toAuthenticationSettings() {
        return new AuthenticationSettings(m_type, m_legacyCredentials.toCredentials());
    }

    private abstract static class SettingsModelAuthenticationPersistor
        extends NodeSettingsPersistorWithConfigKey<LegacyAuthenticationSettings> {

        /**
         * The name of a field in {@link LegacyAuthenticationSettings}
         */
        private static final String KEY_TYPE = "type";

        /**
         * The name of a field in {@link LegacyAuthenticationSettings}
         */
        private static final String KEY_LEGACY_CREDENTIALS = "legacyCredentials";

        private AuthenticationSettings.SettingsModelAuthenticationPersistor m_authenticationSettingsPersistor;

        /**
         * @return the an authentication type with true {@link AuthenticationType#requiresCredentials()} here to set
         *         this as the new selected option whenever
         *         {@link SettingsModelAuthentication.AuthenticationType#CREDENTIALS} was selected in the old dialog.
         */
        abstract AuthenticationType getAuthenticationTypeForCredentials();

        @Override
        public void setConfigKey(final String configKey) {
            super.setConfigKey(configKey);
            m_authenticationSettingsPersistor = FieldNodeSettingsPersistor.createInstance(
                AuthenticationSettings.SettingsModelAuthenticationPersistor.class, AuthenticationSettings.class,
                configKey);
            m_authenticationSettingsPersistor.setConfigKey(configKey);
        }

        @Override
        public LegacyAuthenticationSettings load(final NodeSettingsRO settings) throws InvalidSettingsException {
            if (m_authenticationSettingsPersistor.isSavedWithNewConfigKeys(settings)) {
                return new LegacyAuthenticationSettings(
                    m_authenticationSettingsPersistor.loadFromNewConfigKeys(settings));
            }
            return loadFromSettingsModelSettings(settings);
        }

        private LegacyAuthenticationSettings loadFromSettingsModelSettings(final NodeSettingsRO settings)
            throws InvalidSettingsException {
            final var model = m_authenticationSettingsPersistor.loadModelFromSettings(settings);
            if (model.getAuthenticationType() == SettingsModelAuthentication.AuthenticationType.CREDENTIALS) {
                return loadFromCredentialsSettingsModel(model);
            }
            return new LegacyAuthenticationSettings(
                AuthenticationSettings.SettingsModelAuthenticationPersistor.loadFromModel(model));
        }

        private LegacyAuthenticationSettings loadFromCredentialsSettingsModel(final SettingsModelAuthentication model) {
            final var credentials = AuthenticationSettings.SettingsModelAuthenticationPersistor.toCredentials(model);
            final var flowVariableName = model.getCredential();
            return new LegacyAuthenticationSettings(getAuthenticationTypeForCredentials(),
                new LegacyCredentials(credentials, flowVariableName));
        }

        @Override
        public void save(final LegacyAuthenticationSettings obj, final NodeSettingsWO settings) {
            m_authenticationSettingsPersistor.save(obj.toAuthenticationSettings(), settings);
        }

        @Override
        public DeprecatedConfigs[] getDeprecatedConfigs() {
            return new DeprecatedConfigs[]{//
                new DeprecatedConfigsBuilder()//
                    .forNewConfigPath(getConfigKey(), KEY_LEGACY_CREDENTIALS) //
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

    /**
     * Use as {@link Persist#customPersistor custom persistor} to load the authentication type
     * {@link org.knime.core.node.defaultnodesettings.SettingsModelAuthentication.AuthenticationType#CREDENTIALS
     * "Credentials"} as {@link AuthenticationType#PWD "Password"} setting the previously selected flow variable as
     * controlling flow variable for the associated password input.
     */
    public static final class AuthTypeCredentialsToPasswordPersistor extends SettingsModelAuthenticationPersistor {

        @Override
        AuthenticationType getAuthenticationTypeForCredentials() {
            return AuthenticationType.PWD;
        }

    }

    /**
     * Use as {@link Persist#customPersistor custom persistor} to load the authentication type
     * {@link org.knime.core.node.defaultnodesettings.SettingsModelAuthentication.AuthenticationType#CREDENTIALS
     * "Credentials"} as {@link AuthenticationType#USER "Username"} setting the previously selected flow variable as
     * controlling flow variable for the associated username input.
     */
    public static final class AuthTypeCredentialsToUsernamePersistor extends SettingsModelAuthenticationPersistor {

        @Override
        AuthenticationType getAuthenticationTypeForCredentials() {
            return AuthenticationType.USER;
        }

    }

    /**
     * Use as {@link Persist#customPersistor custom persistor} to load the authentication type
     * {@link org.knime.core.node.defaultnodesettings.SettingsModelAuthentication.AuthenticationType#CREDENTIALS
     * "Credentials"} as {@link AuthenticationType#USER_PWD "Username & Password"} setting the previously selected flow
     * variable as controlling flow variable for the associated credentials input.
     */
    public static final class AuthTypeCredentialsToUsernameAndPasswordPersistor
        extends SettingsModelAuthenticationPersistor {

        @Override
        AuthenticationType getAuthenticationTypeForCredentials() {
            return AuthenticationType.USER_PWD;
        }

    }

}
