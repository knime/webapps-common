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
 *   Dec 1, 2022 (Adrian Nembach, KNIME GmbH, Konstanz, Germany): created
 */
package org.knime.core.webui.node.dialog.serialization.field;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Arrays;
import java.util.Objects;

import org.apache.commons.lang3.NotImplementedException;
import org.junit.jupiter.api.Test;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.defaultnodesettings.SettingsModelBoolean;
import org.knime.core.node.defaultnodesettings.SettingsModelColumnFilter2;
import org.knime.core.node.defaultnodesettings.SettingsModelDouble;
import org.knime.core.node.defaultnodesettings.SettingsModelInteger;
import org.knime.core.node.defaultnodesettings.SettingsModelLong;
import org.knime.core.node.defaultnodesettings.SettingsModelString;
import org.knime.core.node.util.filter.NameFilterConfiguration;
import org.knime.core.node.util.filter.NameFilterConfiguration.EnforceOption;
import org.knime.core.webui.node.dialog.impl.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.serialization.CustomNodeSettingsSerializer;


/**
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 */
public class FieldBasedNodeSettingsSerializerTest {

    private static final String ROOT_KEY = "Test";

    @Test
    void testFlatDefaultSerialization() throws InvalidSettingsException {
        var obj = new FlatNodeSettingsObject();
        obj.m_intSetting = 4;
        obj.m_doubleSetting = 3.4;
        obj.m_stringSetting = "foo";
        testSaveLoad(obj);
    }

    @Test
    void testFlatCustomKeysSerialization() throws InvalidSettingsException {
        var obj = new FlatCustomKeysNodeSettingsObject();
        obj.m_intSetting = 42;
        obj.m_longSetting = 32;
        obj.m_doubleSetting = 13.37;
        obj.m_stringSetting = "bar";

        testSaveLoad(obj);
    }

    @Test
    void testFlatSettingsModelSerialization() throws InvalidSettingsException {
        var obj = new FlatSettingsModelSettingsObject();
        obj.m_booleanSetting = true;
        obj.m_stringSetting = "baz";
        obj.m_enumSetting = TestEnum.BAZ;
        obj.m_includedColumnsSetting = new String[]{"foo", "bar"};
        obj.m_intSetting = 42;
        obj.m_doubleSetting = 13.37;

        testSaveLoad(obj);
    }

    @Test
    void testCustomFieldSerializer() throws InvalidSettingsException {
        var obj = new SettingsWithCustomFieldSerializer();
        obj.m_foo = "fuchs";
        testSaveLoad(obj);
    }

    /**
     * Simulates package-private fields that are defined in a client package that is different from the package of
     * {@link FieldBasedNodeSettingsSerializer} (which will be virtually all implementations that are production
     * relevant).
     *
     * @throws InvalidSettingsException not thrown here
     */
    @Test
    void testAccessingInaccessibleFields() throws InvalidSettingsException {
        var settings = new InaccessibleSettings();
        settings.m_intSetting = 42;
        testSaveLoad(settings);
    }

    private static <S extends TestNodeSettings> void testSaveLoad(final S obj)
        throws InvalidSettingsException {
        @SuppressWarnings("unchecked")
        Class<S> objClass = (Class<S>)obj.getClass();
        var serializer = new FieldBasedNodeSettingsSerializer<>(objClass);
        var expected = new NodeSettings(ROOT_KEY);
        obj.saveExpected(expected);

        var actual = new NodeSettings(ROOT_KEY);
        serializer.save(obj, actual);

        assertEquals(expected, actual);

        var loaded = serializer.load(expected);

        assertEquals(obj, loaded);
    }

    @Test
    void testCustomSerializerWithoutEmptyConstructor() {
        assertThrows(IllegalStateException.class,
            () -> new FieldBasedNodeSettingsSerializer<>(NoEmptyConstuctorFieldSerializerSetings.class));
    }

    @Test
    void testCustomSerializerWithFailingConstructor() {
        assertThrows(IllegalStateException.class,
            () -> new FieldBasedNodeSettingsSerializer<>(FailingConstructorFieldSerializerSettings.class));
    }

    @Test
    void testAbstractCustomFieldSerializer() {
        assertThrows(IllegalStateException.class,
            () -> new FieldBasedNodeSettingsSerializer<>(AbstractCustomFieldSerializerSettings.class));
    }

    @Test
    void testPrivateConstructorCustomFieldSerializer() throws InvalidSettingsException {
        var obj = new PrivateConstructorSerializerSettings();
        obj.m_foo = "bar";
        testSaveLoad(obj);
    }

    @Test
    void testNestedSettingsNotSupported() {
        assertThrows(UnsupportedOperationException.class,
            () -> new FieldBasedNodeSettingsSerializer<>(OuterNodeSettings.class));
    }

    private interface TestNodeSettings extends DefaultNodeSettings {

        void saveExpected(final NodeSettingsWO settings);

        @Override
        boolean equals(Object obj);

        @Override
        int hashCode();
    }

    private abstract static class AbstractTestNodeSettings<S extends AbstractTestNodeSettings<S>>
        implements TestNodeSettings {

        @SuppressWarnings("unchecked")
        @Override
        public final boolean equals(final Object obj) {
            if (obj == this) {
                return true;
            } else if (obj == null) {
                return false;
            } else if (getClass().equals(obj.getClass())) {
                return equalSettings((S)obj);
            } else {
                return false;
            }
        }

        @Override
        public final int hashCode() {
            return computeHashCode();
        }

        protected abstract int computeHashCode();

        protected abstract boolean equalSettings(final S settings);
    }

    static final class FlatNodeSettingsObject extends AbstractTestNodeSettings<FlatNodeSettingsObject> {

        int m_intSetting;

        double m_doubleSetting;

        long m_longSetting;

        String m_stringSetting;

        // omit the m_ to test if settings without m_ prefix also work
        boolean booleanSetting;

        @Override
        public void saveExpected(final NodeSettingsWO settings) {
            settings.addInt("intSetting", m_intSetting);
            settings.addDouble("doubleSetting", m_doubleSetting);
            settings.addLong("longSetting", m_longSetting);
            settings.addString("stringSetting", m_stringSetting);
            settings.addBoolean("booleanSetting", booleanSetting);
        }

        @Override
        protected boolean equalSettings(final FlatNodeSettingsObject settings) {
            return m_intSetting == settings.m_intSetting//
                && m_doubleSetting == settings.m_doubleSetting//
                && m_longSetting == settings.m_longSetting//
                && Objects.equals(m_stringSetting, settings.m_stringSetting)//
                && booleanSetting == settings.booleanSetting;
        }

        @Override
        public int computeHashCode() {
            return Objects.hash(m_intSetting, m_longSetting, m_doubleSetting, m_stringSetting, booleanSetting);
        }

    }

    static final class FlatCustomKeysNodeSettingsObject
        extends AbstractTestNodeSettings<FlatCustomKeysNodeSettingsObject> {

        @FieldSerialization(configKey = "my_int_setting")
        int m_intSetting;

        @FieldSerialization(configKey = "my_double_setting")
        double m_doubleSetting;

        @FieldSerialization(configKey = "my_long_setting")
        long m_longSetting;

        @FieldSerialization(configKey = "my_string_setting")
        String m_stringSetting;

        @FieldSerialization(configKey = "my_boolean_setting")
        boolean m_booleanSetting;

        @Override
        public void saveExpected(final NodeSettingsWO settings) {
            settings.addInt("my_int_setting", m_intSetting);
            settings.addDouble("my_double_setting", m_doubleSetting);
            settings.addLong("my_long_setting", m_longSetting);
            settings.addString("my_string_setting", m_stringSetting);
            settings.addBoolean("my_boolean_setting", m_booleanSetting);
        }

        @Override
        protected boolean equalSettings(final FlatCustomKeysNodeSettingsObject settings) {
            return m_intSetting == settings.m_intSetting//
                && m_doubleSetting == settings.m_doubleSetting//
                && m_longSetting == settings.m_longSetting//
                && Objects.equals(m_stringSetting, settings.m_stringSetting)//
                && m_booleanSetting == settings.m_booleanSetting;
        }

        @Override
        public int computeHashCode() {
            return Objects.hash(m_intSetting, m_longSetting, m_doubleSetting, m_stringSetting, m_booleanSetting);
        }

    }

    enum TestEnum {
            FOO, BAR, BAZ;
    }

    static final class FlatSettingsModelSettingsObject
        extends AbstractTestNodeSettings<FlatSettingsModelSettingsObject> {

        // no config key provided to test correct extraction of the settings name
        @FieldSerialization(settingsModel = SettingsModelBoolean.class)
        boolean m_booleanSetting;

        @FieldSerialization(configKey = "my_string_setting", settingsModel = SettingsModelString.class)
        String m_stringSetting;

        @FieldSerialization(configKey = "my_enum_setting", settingsModel = SettingsModelString.class)
        TestEnum m_enumSetting;

        @FieldSerialization(configKey = "my_included_columns", settingsModel = SettingsModelColumnFilter2.class)
        String[] m_includedColumnsSetting;

        @FieldSerialization(configKey = "my_int_setting", settingsModel = SettingsModelInteger.class)
        int m_intSetting;

        @FieldSerialization(configKey = "my_double_setting", settingsModel = SettingsModelDouble.class)
        double m_doubleSetting;

        @FieldSerialization(configKey = "my_long_setting", settingsModel = SettingsModelLong.class)
        long m_longSetting;

        @Override
        public void saveExpected(final NodeSettingsWO settings) {
            new SettingsModelBoolean("booleanSetting", m_booleanSetting).saveSettingsTo(settings);
            new SettingsModelString("my_string_setting", m_stringSetting).saveSettingsTo(settings);
            new SettingsModelString("my_enum_setting", m_enumSetting.name()).saveSettingsTo(settings);
            var nameFilterConfig = new NameFilterConfiguration("my_included_columns");
            nameFilterConfig.loadDefaults(m_includedColumnsSetting, null, EnforceOption.EnforceInclusion);
            nameFilterConfig.saveConfiguration(settings);
            new SettingsModelInteger("my_int_setting", m_intSetting).saveSettingsTo(settings);
            new SettingsModelDouble("my_double_setting", m_doubleSetting).saveSettingsTo(settings);
            new SettingsModelLong("my_long_setting", m_longSetting).saveSettingsTo(settings);
        }

        @Override
        protected int computeHashCode() {
            return Objects.hash(m_booleanSetting, m_stringSetting, m_enumSetting, m_includedColumnsSetting,
                m_intSetting, m_doubleSetting, m_longSetting);
        }

        @Override
        protected boolean equalSettings(final FlatSettingsModelSettingsObject settings) {
            return m_booleanSetting == settings.m_booleanSetting
                && Objects.equals(m_stringSetting, settings.m_stringSetting)
                && Objects.equals(m_enumSetting, settings.m_enumSetting)
                && Arrays.equals(m_includedColumnsSetting, settings.m_includedColumnsSetting)
                && m_intSetting == settings.m_intSetting//
                && m_doubleSetting == settings.m_doubleSetting//
                && m_longSetting == settings.m_longSetting;
        }

    }

    private static final class SettingsWithCustomFieldSerializer
        extends AbstractTestNodeSettings<SettingsWithCustomFieldSerializer> {

        @FieldSerialization(customSerializer = CustomFieldSerializer.class)
        String m_foo;

        @Override
        public void saveExpected(final NodeSettingsWO settings) {
            settings.addString("foo", m_foo);
        }

        @Override
        protected int computeHashCode() {
            return Objects.hashCode(m_foo);
        }

        @Override
        protected boolean equalSettings(final SettingsWithCustomFieldSerializer settings) {
            return Objects.equals(m_foo, settings.m_foo);
        }
    }

    private static final class CustomFieldSerializer implements CustomNodeSettingsSerializer<String> {

        @Override
        public String load(final NodeSettingsRO settings)
            throws InvalidSettingsException {
            return settings.getString("foo");
        }

        @Override
        public void save(final String value, final NodeSettingsWO settings) {
            settings.addString("foo", value);
        }

    }

    private static final class InaccessibleSettings extends AbstractTestNodeSettings<InaccessibleSettings> {

        // works here but not for actual production code because Jackson does not allow to access private fields
        private int m_intSetting;

        @Override
        public void saveExpected(final NodeSettingsWO settings) {
            settings.addInt("intSetting", m_intSetting);
        }

        @Override
        protected int computeHashCode() {
            return m_intSetting;
        }

        @Override
        protected boolean equalSettings(final InaccessibleSettings settings) {
            return m_intSetting == settings.m_intSetting;
        }
    }

    private static final class NoEmptyConstructorFieldSerializer implements CustomNodeSettingsSerializer<String> {
        @SuppressWarnings("unused")
        NoEmptyConstructorFieldSerializer(final String arg) {
            // the argument is just there to test that the framework reacts appropriately
        }

        @Override
        public String load(final NodeSettingsRO settings)
            throws InvalidSettingsException {
            throw new NotImplementedException("This method should not be called.");
        }

        @Override
        public void save(final String obj, final NodeSettingsWO settings) {
            throw new NotImplementedException("This method should not be called.");
        }
    }

    private static final class NoEmptyConstuctorFieldSerializerSetings implements DefaultNodeSettings {
        @FieldSerialization(customSerializer = NoEmptyConstructorFieldSerializer.class)
        String m_foo;
    }

    private static final class FailingConstructorFieldSerializer implements CustomNodeSettingsSerializer<String> {
        @SuppressWarnings("unused")
        public FailingConstructorFieldSerializer() {
            throw new IllegalArgumentException("Failing constructor.");
        }

        @Override
        public String load(final NodeSettingsRO settings)
            throws InvalidSettingsException {
            throw new NotImplementedException("This method should not be called.");
        }

        @Override
        public void save(final String obj, final NodeSettingsWO settings) {
            throw new NotImplementedException("This method should not be called.");
        }
    }

    private static final class FailingConstructorFieldSerializerSettings implements DefaultNodeSettings {
        @FieldSerialization(customSerializer = FailingConstructorFieldSerializer.class)
        String m_foo;
    }

    private abstract static class AbstractCustomFieldSerializer implements CustomNodeSettingsSerializer<String> {

    }

    private static final class AbstractCustomFieldSerializerSettings implements DefaultNodeSettings {
        @FieldSerialization(customSerializer = AbstractCustomFieldSerializer.class)
        String m_foo;
    }

    private static final class PrivateConstructorSerializer implements CustomNodeSettingsSerializer<String> {
        private PrivateConstructorSerializer() {
            // make private to provoke an access exception
        }

        @Override
        public String load(final NodeSettingsRO settings)
            throws InvalidSettingsException {
            return settings.getString("foo");
        }

        @Override
        public void save(final String obj, final NodeSettingsWO settings) {
            settings.addString("foo", obj);
        }
    }

    private static final class PrivateConstructorSerializerSettings
        extends AbstractTestNodeSettings<PrivateConstructorSerializerSettings> {
        @FieldSerialization(customSerializer = PrivateConstructorSerializer.class)
        String m_foo;

        @Override
        public void saveExpected(final NodeSettingsWO settings) {
            settings.addString("foo", m_foo);
        }

        @Override
        protected int computeHashCode() {
            return Objects.hashCode(m_foo);
        }

        @Override
        protected boolean equalSettings(final PrivateConstructorSerializerSettings settings) {
            return Objects.equals(m_foo, settings.m_foo);
        }
    }

    private static final class InnerNodeSettings implements DefaultNodeSettings {
    }

    private static final class OuterNodeSettings implements DefaultNodeSettings {
        @SuppressWarnings("unused")
        InnerNodeSettings m_inner;
    }
}
