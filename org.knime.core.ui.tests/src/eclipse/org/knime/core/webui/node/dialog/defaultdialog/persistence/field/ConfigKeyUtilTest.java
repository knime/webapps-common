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
 *   Feb 9, 2023 (benjamin): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.persistence.field;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;

import java.lang.reflect.Field;

import org.junit.jupiter.api.Test;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.defaultnodesettings.SettingsModelAuthentication;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.DeprecatedConfigs.DeprecatedConfigsBuilder;
import org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.AuthenticationSettings;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;

/**
 * Contains unit tests for the {@link ConfigKeyUtil}.
 *
 * @author Benjamin Wilhelm, KNIME GmbH, Berlin, Germany
 */
class ConfigKeyUtilTest {

    private static class CustomPersistor implements FieldNodeSettingsPersistor<Integer> {

        @Override
        public Integer load(final NodeSettingsRO settings) throws InvalidSettingsException {
            throw new UnsupportedOperationException("not used by the tests");
        }

        @Override
        public void save(final Integer obj, final NodeSettingsWO settings) {
            throw new UnsupportedOperationException("not used by the tests");
        }

        @Override
        public String[] getConfigKeys() {
            return new String[]{"custom_key0", "custom_key1"};
        }

        @Override
        public DeprecatedConfigs[] getDeprecatedConfigs() {
            return new DeprecatedConfigs[]{new DeprecatedConfigsBuilder().forNewConfigPath("custom_key0")
                .forDeprecatedConfigPath("old_config_key").build()};
        }

    }

    private static class Settings {

        @Widget
        int setting0;

        @Widget
        int m_setting1;

        @Persist
        @Widget
        int setting2;

        @Persist(configKey = "foo")
        @Widget
        int setting3;

        @Persist(hidden = true)
        @Widget
        int setting4;

        @Persist(customPersistor = CustomPersistor.class)
        @Widget
        int setting5;

        @Persist(settingsModel = SettingsModelAuthentication.class)
        AuthenticationSettings setting6;
    }

    @Test
    void testConfigKeyFromFieldName() throws NoSuchFieldException, SecurityException {
        assertEquals("setting0", configKeyFor("setting0"), "should use field name for config key");
    }

    @Test
    void testConfigKeyFromFieldNameRemovePrefix() throws NoSuchFieldException, SecurityException {
        assertEquals("setting1", configKeyFor("m_setting1"),
            "should remove 'm_' prefix from field name for config key");
    }

    @Test
    void testConfigKeyFromFieldNameWithPersist() throws NoSuchFieldException, SecurityException {
        assertEquals("setting2", configKeyFor("setting2"), "should use field name for config key");
    }

    @Test
    void testConfigKeyFromPersistAnnotation() throws NoSuchFieldException, SecurityException {
        assertEquals("foo", configKeyFor("setting3"), "should extract custom configKey from annotation");
    }

    @Test
    void testConfigKeyForHidden() throws NoSuchFieldException, SecurityException {
        assertEquals("setting4_Internals", configKeyFor("setting4"),
            "should append '_Internals' to hidden settings config keys");
    }

    private static String configKeyFor(final String fieldName) throws NoSuchFieldException {
        return ConfigKeyUtil.getConfigKey(getField(fieldName));
    }

    @Test
    void testConfigKeysUsedWithoutPersist() throws NoSuchFieldException {
        assertArrayEquals(new String[]{}, usedConfigKeysFor("setting0"),
            "configKeys should be emtpy for settings without annotation");
    }

    @Test
    void testConfigKeysUsedWithOnlyPersist() throws NoSuchFieldException {
        assertArrayEquals(new String[]{"setting2"}, usedConfigKeysFor("setting2"),
            "configKeys should be field name for settings without custom key or persistor");
    }

    @Test
    void testConfigKeysUsedWithCustomKey() throws NoSuchFieldException {
        assertArrayEquals(new String[]{"foo"}, usedConfigKeysFor("setting3"),
            "configKeys should contain the custom key from the annotation");
    }

    @Test
    void testConfigKeysUsedWithCustomPersistor() throws NoSuchFieldException {
        assertArrayEquals(new String[]{"custom_key0", "custom_key1"}, usedConfigKeysFor("setting5"),
            "configKeys should come from the custom persistor");
    }

    @Test
    void testDeprecatedConfigKeysFromCustomPersistor() throws NoSuchFieldException {
        final var deprecatedConfigKeys = deprecatedConfigKeysFor("setting5");
        assertArrayEquals(new String[] {"custom_key0"}, deprecatedConfigKeys[0].getNewConfigPaths()[0], "newConfigPaths of deprecatedConfigs should be set from custom persistor");
        assertArrayEquals(new String[] {"old_config_key"}, deprecatedConfigKeys[0].getDeprecatedConfigPaths()[0], "deprecatedConfigPaths of deprecatedConfigs should be set from custom persistor");
    }

    @Test
    void testDeprecatedConfigKeysFromSettingsModelPersistor() throws NoSuchFieldException {
        final var deprecatedConfigKeys = deprecatedConfigKeysFor("setting6");
        assertThat(deprecatedConfigKeys).hasSize(2);
    }

    private static String[] usedConfigKeysFor(final String fieldName) throws NoSuchFieldException {
        return ConfigKeyUtil.getConfigKeysUsedByField(getField(fieldName));
    }

    private static DeprecatedConfigs[] deprecatedConfigKeysFor(final String fieldName) throws NoSuchFieldException {
        return ConfigKeyUtil.getDeprecatedConfigsUsedByField(getField(fieldName));
    }

    private static Field getField(final String fieldName) throws NoSuchFieldException {
        return Settings.class.getDeclaredField(fieldName);
    }
}
