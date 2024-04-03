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
 *   Dec 7, 2022 (Adrian Nembach, KNIME GmbH, Konstanz, Germany): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.persistence.field;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.time.LocalDate;

import org.junit.jupiter.api.Test;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.NodeSettingsPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.setting.credentials.Credentials;
import org.knime.filehandling.core.connections.FSCategory;
import org.knime.filehandling.core.connections.FSLocation;

/**
 * Contains unit tests for the {@link DefaultFieldNodeSettingsPersistorFactory}.
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 */
@SuppressWarnings("java:S2698")
class DefaultFieldNodeSettingsPersistorFactoryTest {

    private static final String KEY = "test";

    @Test
    void testFailsOnUnsupportedType() throws Exception {
        assertThrows(IllegalArgumentException.class, () -> createPersistor(UnsupportedType.class));
    }

    @Test
    void testVoid() throws InvalidSettingsException {
        testSaveLoad(Void.class, null);
    }

    @Test
    void testInt() throws InvalidSettingsException {
        var persistor = createPersistor(int.class);
        var nodeSettings = new NodeSettings(KEY);
        persistor.save(3, nodeSettings);
        assertEquals(3, persistor.load(nodeSettings));
    }

    @Test
    void testDouble() throws InvalidSettingsException {
        testSaveLoad(double.class, 13.37);
    }

    @Test
    void testLong() throws Exception {
        testSaveLoad(long.class, Long.MAX_VALUE);
    }

    @Test
    void testString() throws InvalidSettingsException {
        testSaveLoadNullable(String.class, "foo");
    }

    @Test
    void testBoolean() throws Exception {
        testSaveLoad(boolean.class, true);
    }

    @Test
    void testFloat() throws InvalidSettingsException {
        testSaveLoad(float.class, 3.5f);
    }

    @Test
    void testChar() throws InvalidSettingsException {
        testSaveLoad(char.class, (char)2);
    }

    @Test
    void testByte() throws InvalidSettingsException {
        testSaveLoad(byte.class, (byte)15);
    }

    @Test
    void testEnum() throws InvalidSettingsException {
        testSaveLoad(TestEnum.class, TestEnum.BAR);
        testSaveLoad(TestEnum.class, null);
    }

    @Test
    void testInvalidEnumConstant() throws InvalidSettingsException {
        var persistor = createPersistor(TestEnum.class);
        var nodeSettings = new NodeSettings(KEY);
        nodeSettings.addString(KEY, "BAZ");
        assertThrows(InvalidSettingsException.class, () -> persistor.load(nodeSettings));
    }

    private enum TestEnum {
            FOO, BAR;
    }

    @Test
    void testLocalDate() throws InvalidSettingsException {
        final var date = LocalDate.of(2000, 1, 1);
        testSaveLoadNullable(LocalDate.class, date);
    }


    @Test
    void testInvalidLocalDate() throws InvalidSettingsException {
        var nodeSettings = new NodeSettings(KEY);
        nodeSettings.addString(KEY, "not-a-valid-date-time");
        var persistor = createPersistor(LocalDate.class);

        assertThrows(InvalidSettingsException.class, () -> persistor.load(nodeSettings));
    }

    @Test
    void testIntArray() throws InvalidSettingsException {
        var array = new int[]{-4, 9};
        assertArrayEquals(array, saveLoad(int[].class, array));
    }

    @Test
    void testDoubleArray() throws InvalidSettingsException {
        var array = new double[]{3.5, 7.6};
        assertArrayEquals(array, saveLoad(double[].class, array));
    }

    @Test
    void testLongArray() throws InvalidSettingsException {
        var array = new long[]{3, 5, 27};
        assertArrayEquals(array, saveLoad(long[].class, array));
    }

    @Test
    void testStringArray() throws InvalidSettingsException {
        var array = new String[]{"foo", "bar", "baz"};
        assertArrayEquals(array, saveLoad(String[].class, array));
    }

    @Test
    void testBooleanArray() throws InvalidSettingsException {
        var array = new boolean[]{true, false};
        assertArrayEquals(array, saveLoad(boolean[].class, array));
    }

    @Test
    void testFloatArray() throws InvalidSettingsException {
        var array = new float[]{3.5f, 7.4f, -100};
        assertArrayEquals(array, saveLoad(float[].class, array));
    }

    @Test
    void testCharArray() throws InvalidSettingsException {
        var array = new char[]{(char)4};
        assertArrayEquals(array, saveLoad(char[].class, array));
    }

    @Test
    void testByteArray() throws InvalidSettingsException {
        var array = new byte[]{3, 4, 5};
        assertArrayEquals(array, saveLoad(byte[].class, array));
    }

    @Test
    void testCredentials() throws InvalidSettingsException {
        testSaveLoad(Credentials.class, new Credentials());
        testSaveLoad(Credentials.class, new Credentials("foo", "bar"));
        testSaveLoad(Credentials.class, new Credentials("foo", "bar", "baz"));
        assertEquals(new Credentials(), saveLoad(Credentials.class, null));
    }

    @Test
    void testFSLocation() throws InvalidSettingsException {
        testSaveLoad(FSLocation.class, new FSLocation(FSCategory.CUSTOM_URL, "1000", "path"));
        testSaveLoad(FSLocation.class, new FSLocation(FSCategory.LOCAL, "path"));
    }

    private static <T> void testSaveLoadNullable(final Class<T> type, final T value) throws InvalidSettingsException {
        testSaveLoad(type, value);
        testSaveLoad(type, null);
    }

    private static <T> void testSaveLoad(final Class<T> type, final T value) throws InvalidSettingsException {
        assertEquals(value, saveLoad(type, value));
    }

    private static <T> T saveLoad(final Class<T> type, final T value) throws InvalidSettingsException {
        var persistor = createPersistor(type);
        var nodeSettings = new NodeSettings(KEY);
        persistor.save(value, nodeSettings);
        T loaded = persistor.load(nodeSettings);
        return loaded;
    }

    private static <T> NodeSettingsPersistor<T> createPersistor(final Class<T> type) {
        return DefaultFieldNodeSettingsPersistorFactory.createDefaultPersistor(type, KEY);
    }

    private static final class UnsupportedType {

    }
}
