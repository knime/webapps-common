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
package org.knime.core.webui.node.dialog.serialization.field;

import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.function.BiConsumer;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.defaultnodesettings.SettingsModel;
import org.knime.core.node.defaultnodesettings.SettingsModelBoolean;
import org.knime.core.node.defaultnodesettings.SettingsModelColumnFilter2;
import org.knime.core.node.defaultnodesettings.SettingsModelDouble;
import org.knime.core.node.defaultnodesettings.SettingsModelInteger;
import org.knime.core.node.defaultnodesettings.SettingsModelLong;
import org.knime.core.node.defaultnodesettings.SettingsModelString;
import org.knime.core.webui.node.dialog.serialization.NodeSettingsSerializer;

/**
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 */
public class SettingsModelFieldNodeSettingsSerializerFactoryTest {

    private static final String CFG_KEY = "test";

    @Test
    void testUnsupportedFieldSettingsModelTypeCombination() throws Exception {
        assertThrows(IllegalArgumentException.class, () -> SettingsModelFieldNodeSettingsSerializerFactory
            .createSerializer(TestEnum.class, SettingsModelInteger.class, CFG_KEY));
    }

    @Test
    void testEnumSettingsModelString() throws Exception {
        testSaveLoad(TestEnum.class, SettingsModelString.class, TestEnum.B);
        testSaveLoad(TestEnum.class, SettingsModelString.class, null);
    }

    @Test
    void testSettingsModelInteger() throws Exception {
        testSaveLoad(int.class, SettingsModelInteger.class, 42);
    }

    @Test
    void testSettingsModelString() throws InvalidSettingsException {
        testSaveLoad(String.class, SettingsModelString.class, "foobar");
        testSaveLoad(String.class, SettingsModelString.class, null);
    }

    @Test
    void testSettingsModelLong() throws Exception {
        testSaveLoad(long.class, SettingsModelLong.class, Long.MAX_VALUE);
    }

    @Test
    void testSettingsModelDouble() throws Exception {
        testSaveLoad(double.class, SettingsModelDouble.class, 13.37);
    }

    @Test
    void testSettingsModelBoolean() throws Exception {
        testSaveLoad(boolean.class, SettingsModelBoolean.class, true);
        testSaveLoad(boolean.class, SettingsModelBoolean.class, false);
    }

    @Test
    void testSettingsModelColumnFilter2() throws Exception {
        testSaveLoad(String[].class, SettingsModelColumnFilter2.class, new String[]{"foo", "bar", "bla"},
            Assertions::assertArrayEquals);
    }

    private static <T> void testSaveLoad(final Class<T> fieldType,
        final Class<? extends SettingsModel> settingsModelType, final T value) throws InvalidSettingsException {
        testSaveLoad(fieldType, settingsModelType, value, Assertions::assertEquals);
    }

    private static <T> void testSaveLoad(final Class<T> fieldType,
        final Class<? extends SettingsModel> settingsModelType, final T value, final BiConsumer<T, T> assertFn)
        throws InvalidSettingsException {
        var serializer = createSerializer(fieldType, settingsModelType);
        var nodeSettings = new NodeSettings(CFG_KEY);
        serializer.save(value, nodeSettings);
        assertFn.accept(value, serializer.load(nodeSettings));
    }

    private static <T> NodeSettingsSerializer<T> createSerializer(final Class<T> fieldType,
        final Class<? extends SettingsModel> settingsModelType) {
        return SettingsModelFieldNodeSettingsSerializerFactory.createSerializer(fieldType, settingsModelType, CFG_KEY);
    }

    private enum TestEnum {
            A, B, C;
    }
}
