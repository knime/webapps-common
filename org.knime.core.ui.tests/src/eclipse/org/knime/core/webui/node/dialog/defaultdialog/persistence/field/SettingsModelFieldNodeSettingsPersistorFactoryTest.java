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
 *   Dec 9, 2022 (Adrian Nembach, KNIME GmbH, Konstanz, Germany): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.persistence.field;

import static org.junit.jupiter.api.Assertions.assertEquals;

import java.util.function.BiConsumer;
import java.util.stream.Stream;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.defaultnodesettings.SettingsModelAuthentication;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.settingsmodel.EnumSettingsModelStringPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.settingsmodel.SettingsModelBooleanPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.settingsmodel.SettingsModelDoublePersistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.settingsmodel.SettingsModelIntegerPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.settingsmodel.SettingsModelLongPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.settingsmodel.SettingsModelStringPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.AuthenticationSettings;
import org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.AuthenticationSettings.AuthenticationType;
import org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.AuthenticationSettings.SettingsModelAuthenticationPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.Credentials;

/**
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 */
@SuppressWarnings("java:S2698") // We allow assertions without messages
class SettingsModelPersistorTest {

    private static final String CFG_KEY = "test";

    static final class TestEnumSettingsModelStringPersistor extends EnumSettingsModelStringPersistor<TestEnum> {

        @Override
        protected Class<TestEnum> enumType() {
            return TestEnum.class;
        }
    }

    @Test
    void testEnumSettingsModelString() throws Exception {
        testSaveLoad(TestEnum.class, TestEnumSettingsModelStringPersistor.class, TestEnum.B);
        testSaveLoad(TestEnum.class, TestEnumSettingsModelStringPersistor.class, null);
    }

    private static final FieldNodeSettingsPersistor<AuthenticationSettings> createAuthenticationSettingsPersistor() {
        return new DefaultPersistorWithDeprecationsWrapper<AuthenticationSettings>(
            FieldNodeSettingsPersistor.createInstance(SettingsModelAuthenticationPersistor.class,
                AuthenticationSettings.class, CFG_KEY),
            new DefaultFieldNodeSettingsPersistorFactory.NestedPersistor<>(CFG_KEY,
                new FieldBasedNodeSettingsPersistor<AuthenticationSettings>(AuthenticationSettings.class)));
    }

    @Test
    void testSettingsModelAuthenticationSaveLoad() throws Exception {
        final var persistor = createAuthenticationSettingsPersistor();

        testSaveLoad(new AuthenticationSettings(), persistor);
        testSaveLoad(new AuthenticationSettings(AuthenticationSettings.AuthenticationType.USER_PWD,
            new Credentials("myUsername", "myPassword")), persistor);
    }

    static Stream<Arguments> settingsModelAuthenticationLoadSource() {
        return Stream.of( //
            Arguments.of(SettingsModelAuthentication.AuthenticationType.PWD, AuthenticationType.PWD, "password", ""), //
            Arguments.of(SettingsModelAuthentication.AuthenticationType.USER_PWD, AuthenticationType.USER_PWD,
                "password", "username"), //
            Arguments.of(SettingsModelAuthentication.AuthenticationType.USER, AuthenticationType.USER, "", "username"), //
            Arguments.of(SettingsModelAuthentication.AuthenticationType.NONE, AuthenticationType.NONE, "", ""), //
            Arguments.of(SettingsModelAuthentication.AuthenticationType.KERBEROS, AuthenticationType.KERBEROS, "", ""));
    }

    @ParameterizedTest
    @MethodSource("settingsModelAuthenticationLoadSource")
    void testSettingsModelAuthenticationLoadLegacy(final SettingsModelAuthentication.AuthenticationType oldType,
        final AuthenticationType newType, final String password, final String username)
        throws InvalidSettingsException {
        final var persistor = new DefaultPersistorWithDeprecationsWrapper<AuthenticationSettings>(
            FieldNodeSettingsPersistor.createInstance(SettingsModelAuthenticationPersistor.class,
                AuthenticationSettings.class, CFG_KEY),
            new DefaultFieldNodeSettingsPersistorFactory.NestedPersistor<>(CFG_KEY,
                new FieldBasedNodeSettingsPersistor<AuthenticationSettings>(AuthenticationSettings.class)));
        final var savedSettings = new NodeSettings("node_settings");
        new SettingsModelAuthentication(CFG_KEY, oldType, username, password, null).saveSettingsTo(savedSettings);
        final var loaded = FieldBasedNodeSettingsPersistor.loadFromFieldPersistor(persistor, savedSettings);
        final var expected = new AuthenticationSettings(newType, new Credentials(username, password));
        assertEquals(expected, loaded);
    }

    @Test
    void testSettingsModelInteger() throws Exception {
        testSaveLoad(int.class, SettingsModelIntegerPersistor.class, 42);
    }

    @Test
    void testSettingsModelString() throws InvalidSettingsException {
        testSaveLoad(String.class, SettingsModelStringPersistor.class, "foobar");
        testSaveLoad(String.class, SettingsModelStringPersistor.class, null);
    }

    @Test
    void testSettingsModelLong() throws Exception {
        testSaveLoad(long.class, SettingsModelLongPersistor.class, Long.MAX_VALUE);
    }

    @Test
    void testSettingsModelDouble() throws Exception {
        testSaveLoad(double.class, SettingsModelDoublePersistor.class, 13.37);
    }

    @Test
    void testSettingsModelBoolean() throws Exception {
        testSaveLoad(boolean.class, SettingsModelBooleanPersistor.class, true);
        testSaveLoad(boolean.class, SettingsModelBooleanPersistor.class, false);
    }

    private static <T> void testSaveLoad(final Class<T> fieldType,
        final Class<? extends FieldNodeSettingsPersistor<T>> persistorClass, final T value)
        throws InvalidSettingsException {
        final var persistor = FieldNodeSettingsPersistor.createInstance(persistorClass, fieldType, CFG_KEY);
        testSaveLoad(persistor, value, Assertions::assertEquals);
    }

    private static <T> void testSaveLoad(final T value, final FieldNodeSettingsPersistor<T> persistor)
        throws InvalidSettingsException {
        testSaveLoad(persistor, value, Assertions::assertEquals);
    }

    private static <T> void testSaveLoad(final FieldNodeSettingsPersistor<T> persistor, final T value,
        final BiConsumer<T, T> assertFn) throws InvalidSettingsException {
        var nodeSettings = new NodeSettings(CFG_KEY);
        persistor.save(value, nodeSettings);
        assertFn.accept(value, persistor.load(nodeSettings));
    }

    private enum TestEnum {
            A, B, C;
    }
}
