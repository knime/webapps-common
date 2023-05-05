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
package org.knime.core.webui.node.dialog.defaultdialog.persistence.field;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.Objects;

import org.apache.commons.lang3.NotImplementedException;
import org.junit.jupiter.api.Test;
import org.knime.core.node.InvalidSettingsException;
import org.knime.core.node.NodeSettings;
import org.knime.core.node.NodeSettingsRO;
import org.knime.core.node.NodeSettingsWO;
import org.knime.core.node.defaultnodesettings.SettingsModelBoolean;
import org.knime.core.node.defaultnodesettings.SettingsModelDouble;
import org.knime.core.node.defaultnodesettings.SettingsModelInteger;
import org.knime.core.node.defaultnodesettings.SettingsModelLong;
import org.knime.core.node.defaultnodesettings.SettingsModelString;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.NodeSettingsPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.Persistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.DefaultProvider;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.FieldBasedNodeSettingsPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.FieldNodeSettingsPersistor;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.field.Persist;

/**
 * Tests for the {@link FieldBasedNodeSettingsPersistor}.
 *
 * @author Adrian Nembach, KNIME GmbH, Konstanz, Germany
 */
class FieldBasedNodeSettingsPersistorTest {

    private static final String ROOT_KEY = "Test";

    @Test
    void testFlatDefaultPersistance() throws InvalidSettingsException {
        var obj = new FlatNodeSettingsObject();
        obj.m_intSetting = 4;
        obj.m_doubleSetting = 3.4;
        obj.m_stringSetting = "foo";
        testSaveLoad(obj);
    }

    @Test
    void testFlatCustomKeysPersistance() throws InvalidSettingsException {
        var obj = new FlatCustomKeysNodeSettingsObject();
        obj.m_intSetting = 42;
        obj.m_longSetting = 32;
        obj.m_doubleSetting = 13.37;
        obj.m_stringSetting = "bar";

        testSaveLoad(obj);
    }

    @Test
    void testFlatSettingsModelPersistance() throws InvalidSettingsException {
        var obj = new FlatSettingsModelSettingsObject();
        obj.m_booleanSetting = true;
        obj.m_stringSetting = "baz";
        obj.m_enumSetting = TestEnum.BAZ;
        obj.m_intSetting = 42;
        obj.m_doubleSetting = 13.37;

        testSaveLoad(obj);
    }

    @Test
    void testCustomFieldPersistor() throws InvalidSettingsException {
        var obj = new SettingsWithCustomFieldPersistor();
        obj.m_foo = "fuchs";
        testSaveLoad(obj);
    }

    private static <S extends TestNodeSettings> void testSaveLoad(final S obj) throws InvalidSettingsException {
        @SuppressWarnings("unchecked")
        Class<S> objClass = (Class<S>)obj.getClass();
        var persistor = new FieldBasedNodeSettingsPersistor<>(objClass);
        var expected = new NodeSettings(ROOT_KEY);
        obj.saveExpected(expected);

        var actual = new NodeSettings(ROOT_KEY);
        persistor.save(obj, actual);

        assertEquals(expected, actual, "The settings saved by the persistor are not as expected.");

        var loaded = persistor.load(expected);

        assertEquals(obj, loaded, "The loaded settings are not as expected");
    }

    @Test
    void testCustomPersistorWithoutEmptyConstructor() {
        assertThrows(IllegalArgumentException.class,
            () -> new FieldBasedNodeSettingsPersistor<>(NoEmptyConstuctorFieldPersistorSetings.class),
            "Custom persistor without empty constructor was not detected.");
    }

    @Test
    void testCustomPersistorWithFailingConstructor() {
        assertThrows(IllegalStateException.class,
            () -> new FieldBasedNodeSettingsPersistor<>(FailingConstructorFieldPersistorSettings.class),
            "Custom persistor whose constructor fails was not detected.");
    }

    @Test
    void testAbstractCustomFieldPersistor() {
        assertThrows(IllegalStateException.class,
            () -> new FieldBasedNodeSettingsPersistor<>(AbstractCustomFieldPersistorSettings.class),
            "Abstract custom persistor was not detected.");
    }

    @Test
    void testPrivateConstructorCustomFieldPersistor() throws InvalidSettingsException {
        var obj = new PrivateConstructorPersistorSettings();
        obj.m_foo = "bar";
        testSaveLoad(obj);
    }

    @Test
    void testNestedSettings() throws InvalidSettingsException {
        var obj = new OuterNodeSettings();
        obj.m_bar = "baz";
        obj.m_inner.m_foo = "bal";
        testSaveLoad(obj);
    }

    @Test
    void testNestedSettignsWithCustomInnerPersistor() throws InvalidSettingsException {
        var obj = new OuterSettingsWithCustomPersistorInnerSettings();
        obj.m_bar = "bimms";
        obj.m_inner.m_foo = "bamms";
        testSaveLoad(obj);
    }

    @Test
    void testStaticFieldsAreIgnored() throws InvalidSettingsException {
        testSaveLoad(new SettingsWithStaticField());
    }

    @Test
    void testStaticFinalFieldsAreIgnored() throws InvalidSettingsException {
        testSaveLoad(new SettingsWithStaticFinalField());
    }

    @Test
    void testArraySettings() throws InvalidSettingsException {
        var arraySettings = new ArraySettings();
        arraySettings.m_bar = new ElementSettings[3];
        for (int i = 0; i < 3; i++) {
            var element = new ElementSettings();
            element.m_foo = "baz" + i;
            arraySettings.m_bar[i] = element;
        }
        testSaveLoad(arraySettings);
    }

    @Test
    void testArraySettingsWithInvalidKeys() throws InvalidSettingsException {
        var persistor = new FieldBasedNodeSettingsPersistor<>(ArraySettings.class);
        var saved = new NodeSettings(ROOT_KEY);
        saved.addNodeSettings("bar").addBoolean("null_Internal", true);
        var loaded = persistor.load(saved);
        assertArrayEquals(new ElementSettings[0], loaded.m_bar);
    }

    @Test
    void testSaveNullArraySettings() throws InvalidSettingsException {
        var persistor = new FieldBasedNodeSettingsPersistor<>(ArraySettings.class);
        var root = new NodeSettings(ROOT_KEY);
        assertThrows(NullPointerException.class, () -> persistor.save(null, root));
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
        boolean booleanSetting; //NOSONAR

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

        @Persist(configKey = "my_int_setting")
        int m_intSetting;

        @Persist(configKey = "my_double_setting")
        double m_doubleSetting;

        @Persist(configKey = "my_long_setting")
        long m_longSetting;

        @Persist(configKey = "my_string_setting")
        String m_stringSetting;

        @Persist(configKey = "my_boolean_setting")
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
        @Persist(settingsModel = SettingsModelBoolean.class)
        boolean m_booleanSetting;

        @Persist(configKey = "my_string_setting", settingsModel = SettingsModelString.class)
        String m_stringSetting;

        @Persist(configKey = "my_enum_setting", settingsModel = SettingsModelString.class)
        TestEnum m_enumSetting;

        @Persist(configKey = "my_int_setting", settingsModel = SettingsModelInteger.class)
        int m_intSetting;

        @Persist(configKey = "my_double_setting", settingsModel = SettingsModelDouble.class)
        double m_doubleSetting;

        @Persist(configKey = "my_long_setting", settingsModel = SettingsModelLong.class)
        long m_longSetting;

        @Override
        public void saveExpected(final NodeSettingsWO settings) {
            new SettingsModelBoolean("booleanSetting", m_booleanSetting).saveSettingsTo(settings);
            new SettingsModelString("my_string_setting", m_stringSetting).saveSettingsTo(settings);
            new SettingsModelString("my_enum_setting", m_enumSetting.name()).saveSettingsTo(settings);
            new SettingsModelInteger("my_int_setting", m_intSetting).saveSettingsTo(settings);
            new SettingsModelDouble("my_double_setting", m_doubleSetting).saveSettingsTo(settings);
            new SettingsModelLong("my_long_setting", m_longSetting).saveSettingsTo(settings);
        }

        @Override
        protected int computeHashCode() {
            return Objects.hash(m_booleanSetting, m_stringSetting, m_enumSetting, m_intSetting, m_doubleSetting,
                m_longSetting);
        }

        @Override
        protected boolean equalSettings(final FlatSettingsModelSettingsObject settings) {
            return m_booleanSetting == settings.m_booleanSetting
                && Objects.equals(m_stringSetting, settings.m_stringSetting)
                && Objects.equals(m_enumSetting, settings.m_enumSetting) && m_intSetting == settings.m_intSetting//
                && m_doubleSetting == settings.m_doubleSetting//
                && m_longSetting == settings.m_longSetting;
        }

    }

    private static final class SettingsWithCustomFieldPersistor
        extends AbstractTestNodeSettings<SettingsWithCustomFieldPersistor> {

        @Persist(customPersistor = CustomFieldPersistor.class)
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
        protected boolean equalSettings(final SettingsWithCustomFieldPersistor settings) {
            return Objects.equals(m_foo, settings.m_foo);
        }
    }

    private static final class CustomFieldPersistor implements FieldNodeSettingsPersistor<String> {

        @Override
        public String load(final NodeSettingsRO settings) throws InvalidSettingsException {
            return settings.getString("foo");
        }

        @Override
        public void save(final String value, final NodeSettingsWO settings) {
            settings.addString("foo", value);
        }

        @Override
        public String[] getConfigKeys() {
            return new String[]{"foo"};
        }
    }

    private static final class NoEmptyConstructorFieldPersistor implements FieldNodeSettingsPersistor<String> {
        @SuppressWarnings("unused")
        NoEmptyConstructorFieldPersistor(final String arg) {
            // the argument is just there to test that the framework reacts appropriately
        }

        @Override
        public String load(final NodeSettingsRO settings) throws InvalidSettingsException {
            throw new NotImplementedException("This method should not be called.");
        }

        @Override
        public void save(final String obj, final NodeSettingsWO settings) {
            throw new NotImplementedException("This method should not be called.");
        }

        @Override
        public String[] getConfigKeys() {
            return new String[0];
        }
    }

    private static final class NoEmptyConstuctorFieldPersistorSetings implements DefaultNodeSettings {
        @Persist(customPersistor = NoEmptyConstructorFieldPersistor.class)
        String m_foo;
    }

    private static final class FailingConstructorFieldPersistor implements FieldNodeSettingsPersistor<String> {
        @SuppressWarnings("unused")
        public FailingConstructorFieldPersistor() {
            throw new IllegalArgumentException("Failing constructor.");
        }

        @Override
        public String load(final NodeSettingsRO settings) throws InvalidSettingsException {
            throw new NotImplementedException("This method should not be called.");
        }

        @Override
        public void save(final String obj, final NodeSettingsWO settings) {
            throw new NotImplementedException("This method should not be called.");
        }

        @Override
        public String[] getConfigKeys() {
            return new String[0];
        }
    }

    private static final class FailingConstructorFieldPersistorSettings implements DefaultNodeSettings {
        @Persist(customPersistor = FailingConstructorFieldPersistor.class)
        String m_foo;
    }

    private abstract static class AbstractCustomFieldPersistor implements FieldNodeSettingsPersistor<String> {//NOSONAR

    }

    private static final class AbstractCustomFieldPersistorSettings implements DefaultNodeSettings {
        @Persist(customPersistor = AbstractCustomFieldPersistor.class)
        String m_foo;
    }

    private static final class PrivateConstructorPersistor implements FieldNodeSettingsPersistor<String> {
        private PrivateConstructorPersistor() {
            // make private to provoke an access exception
        }

        @Override
        public String load(final NodeSettingsRO settings) throws InvalidSettingsException {
            return settings.getString("foo");
        }

        @Override
        public void save(final String obj, final NodeSettingsWO settings) {
            settings.addString("foo", obj);
        }

        @Override
        public String[] getConfigKeys() {
            return new String[]{"foo"};
        }
    }

    private static final class PrivateConstructorPersistorSettings
        extends AbstractTestNodeSettings<PrivateConstructorPersistorSettings> {
        @Persist(customPersistor = PrivateConstructorPersistor.class)
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
        protected boolean equalSettings(final PrivateConstructorPersistorSettings settings) {
            return Objects.equals(m_foo, settings.m_foo);
        }
    }

    private static final class InnerNodeSettings extends AbstractTestNodeSettings<InnerNodeSettings> {

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
        protected boolean equalSettings(final InnerNodeSettings settings) {
            return Objects.equals(m_foo, settings.m_foo);
        }
    }

    private static final class OuterNodeSettings extends AbstractTestNodeSettings<OuterNodeSettings> {

        InnerNodeSettings m_inner = new InnerNodeSettings();

        String m_bar;

        @Override
        public void saveExpected(final NodeSettingsWO settings) {
            m_inner.saveExpected(settings.addNodeSettings("inner"));
            settings.addString("bar", m_bar);
        }

        @Override
        protected int computeHashCode() {
            return Objects.hash(m_inner, m_bar);
        }

        @Override
        protected boolean equalSettings(final OuterNodeSettings settings) {
            return Objects.equals(m_inner, settings.m_inner) && Objects.equals(m_bar, settings.m_bar);
        }
    }

    private static final class SettingsWithStaticField extends AbstractTestNodeSettings<SettingsWithStaticField> {

        @SuppressWarnings("unused")
        private static String STATIC_FIELD = "foo"; //NOSONAR

        @Override
        public void saveExpected(final NodeSettingsWO settings) {
            // no settings
        }

        @Override
        protected int computeHashCode() {
            return 0;
        }

        @Override
        protected boolean equalSettings(final SettingsWithStaticField settings) {
            return true;
        }

    }

    @Persistor(InnerSettingsWithCustomPersistor.CustomPersistor.class)
    private static final class InnerSettingsWithCustomPersistor
        extends AbstractTestNodeSettings<InnerSettingsWithCustomPersistor> {

        String m_foo;

        @Override
        public void saveExpected(final NodeSettingsWO settings) {
            settings.addString("custom_foo", m_foo);
        }

        @Override
        protected int computeHashCode() {
            return Objects.hashCode(m_foo);
        }

        @Override
        protected boolean equalSettings(final InnerSettingsWithCustomPersistor settings) {
            return Objects.equals(m_foo, settings.m_foo);
        }

        private static final class CustomPersistor implements NodeSettingsPersistor<InnerSettingsWithCustomPersistor> {

            @Override
            public InnerSettingsWithCustomPersistor load(final NodeSettingsRO settings)
                throws InvalidSettingsException {
                var loaded = new InnerSettingsWithCustomPersistor();
                loaded.m_foo = settings.getString("custom_foo");
                return loaded;
            }

            @Override
            public void save(final InnerSettingsWithCustomPersistor obj, final NodeSettingsWO settings) {
                settings.addString("custom_foo", obj.m_foo);
            }

        }

    }

    private static final class SettingsWithStaticFinalField
        extends AbstractTestNodeSettings<SettingsWithStaticFinalField> {

        @SuppressWarnings("unused")
        private static final String STATIC_FINAL_FIELD = "bar";

        @Override
        public void saveExpected(final NodeSettingsWO settings) {
            // no settings
        }

        @Override
        protected int computeHashCode() {
            return 0;
        }

        @Override
        protected boolean equalSettings(final SettingsWithStaticFinalField settings) {
            return true;
        }

    }

    private static final class OuterSettingsWithCustomPersistorInnerSettings
        extends AbstractTestNodeSettings<OuterSettingsWithCustomPersistorInnerSettings> {

        @Persist(configKey = "my-inner")
        InnerSettingsWithCustomPersistor m_inner = new InnerSettingsWithCustomPersistor();

        String m_bar;

        @Override
        public void saveExpected(final NodeSettingsWO settings) {
            m_inner.saveExpected(settings.addNodeSettings("my-inner"));
            settings.addString("bar", m_bar);
        }

        @Override
        protected int computeHashCode() {
            return Objects.hash(m_inner, m_bar);
        }

        @Override
        protected boolean equalSettings(final OuterSettingsWithCustomPersistorInnerSettings settings) {
            return Objects.equals(m_bar, settings.m_bar) && Objects.equals(m_inner, settings.m_inner);
        }
    }

    private static final class ElementSettings extends AbstractTestNodeSettings<ElementSettings> {

        String m_foo;

        @Override
        public void saveExpected(final NodeSettingsWO settings) {
            settings.addString("foo", m_foo);
        }

        @Override
        protected int computeHashCode() {
            return Objects.hash(m_foo);
        }

        @Override
        protected boolean equalSettings(final ElementSettings settings) {
            return Objects.equals(m_foo, settings.m_foo);
        }

    }

    private static final class ArraySettings extends AbstractTestNodeSettings<ArraySettings> {

        ElementSettings[] m_bar;

        @Override
        public void saveExpected(final NodeSettingsWO settings) {
            var arraySettings = settings.addNodeSettings("bar");
            for (int i = 0; i < m_bar.length; i++) {
                m_bar[i].saveExpected(arraySettings.addNodeSettings(Integer.toString(i)));
            }
        }

        @Override
        protected int computeHashCode() {
            return Objects.hash(m_bar);
        }

        @Override
        protected boolean equalSettings(final ArraySettings settings) {
            return Objects.deepEquals(m_bar, settings.m_bar);
        }


    }

    @Test
    void testOptionalSettings() throws InvalidSettingsException {
        var optionalSettings = new OptionalSettings();
        optionalSettings.m_foo = 13;
        testSaveLoad(optionalSettings);

        var persistor = new FieldBasedNodeSettingsPersistor<>(OptionalSettings.class);
        var nodeSettings = new NodeSettings(ROOT_KEY);
        var loadedSettings = persistor.load(nodeSettings);
        assertEquals(new OptionalSettings(), loadedSettings);
    }

    private static final class OptionalSettings extends AbstractTestNodeSettings<OptionalSettings> {

        @Persist(optional = true)
        int m_foo = 42;

        @Override
        public void saveExpected(final NodeSettingsWO settings) {
            settings.addInt("foo", m_foo);
        }

        @Override
        protected int computeHashCode() {
            return m_foo;
        }

        @Override
        protected boolean equalSettings(final OptionalSettings settings) {
            return m_foo == settings.m_foo;
        }

    }

    @Test
    void testSettingsWithDefaultProvider() throws InvalidSettingsException {
        var nodeSettings = new NodeSettings(ROOT_KEY);
        var persistor = new FieldBasedNodeSettingsPersistor<>(DefaultProviderSettings.class);
        var loaded = persistor.load(nodeSettings);
        assertEquals(1337, loaded.m_foo);
    }

    private static final class DefaultProviderSettings extends AbstractTestNodeSettings<DefaultProviderSettings> {

        @Persist(defaultProvider = FooDefaultProvider.class, optional = true)
        int m_foo = 42;


        private static final class FooDefaultProvider implements DefaultProvider<Integer> {

            @Override
            public Integer getDefault() {
                return 1337;
            }

        }

        @Override
        public void saveExpected(final NodeSettingsWO settings) {
            settings.addInt("foo", m_foo);
        }

        @Override
        protected int computeHashCode() {
            return m_foo;
        }

        @Override
        protected boolean equalSettings(final DefaultProviderSettings settings) {
            return m_foo == settings.m_foo;
        }

    }

}
