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
 *   Feb 22, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema;

import static net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.function.Supplier;
import java.util.stream.Collectors;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.knime.core.data.DataColumnSpec;
import org.knime.core.data.DataColumnSpecCreator;
import org.knime.core.data.def.StringCell;
import org.knime.core.node.BufferedDataTable;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.node.port.PortType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeDialogTest;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnselection.ColumnSelection;
import org.knime.core.webui.node.dialog.defaultdialog.setting.filechooser.FileChooser;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ColumnChoicesStateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.FileExtensionProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.FileWriterWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.LocalFileWriterWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.StringChoicesStateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.SimpleButtonWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ButtonRef;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.StateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueRef;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 *
 * @author Paul Bärnreuther
 */
@SuppressWarnings("java:S2698") // we accept assertions without messages
class UpdatesUtilTest {

    private static DefaultNodeSettingsContext createDefaultNodeSettingsContext() {
        return DefaultNodeDialogTest.createDefaultNodeSettingsContext(new PortType[]{BufferedDataTable.TYPE},
            new PortObjectSpec[]{null}, null, null);
    }

    static ObjectNode buildUpdates(final Map<String, WidgetGroup> settings) {
        final var objectNode = new ObjectMapper().createObjectNode();
        final Map<String, Class<? extends WidgetGroup>> settingsClasses =
            settings.entrySet().stream().collect(Collectors.toMap(Entry::getKey, e -> e.getValue().getClass()));

        UpdatesUtil.addUpdates(objectNode, settingsClasses, settings, createDefaultNodeSettingsContext());
        return objectNode;
    }

    @Test
    void testValueUpdates() {

        @SuppressWarnings("unused")
        class TestSettings implements DefaultNodeSettings {

            public TestSettings() {

            }

            class Dependency implements ValueRef<String> {

            }

            @Widget(title = "", description = "", valueRef = Dependency.class)
            String dependency;

            class AnotherDependency implements ValueRef<String> {

            }

            @Widget(title = "", description = "", valueRef = AnotherDependency.class)
            String anotherDependency;

            static final class TestStateProvider implements StateProvider<String> {

                @Override
                public void init(final StateProviderInitializer initializer) {
                    initializer.computeFromValueSupplier(Dependency.class);
                }

                @Override
                public String computeState(final DefaultNodeSettingsContext context) {
                    throw new RuntimeException("Should not be called in this test");
                }

            }

            @Widget(title = "", description = "", valueProvider = TestStateProvider.class)
            String target;

            static final class AnotherTestStateProvider implements StateProvider<String> {

                @Override
                public void init(final StateProviderInitializer initializer) {
                    initializer.getValueSupplier(Dependency.class);
                    initializer.computeOnValueChange(AnotherDependency.class);
                }

                @Override
                public String computeState(final DefaultNodeSettingsContext context) {
                    throw new RuntimeException("Should not be called in this test");

                }
            }

            @Widget(title = "", description = "", valueProvider = AnotherTestStateProvider.class)
            String anotherTarget;
        }

        final Map<String, WidgetGroup> settings = Map.of("test", new TestSettings());

        final var response = buildUpdates(settings);

        assertThatJson(response).inPath("$.globalUpdates").isArray().hasSize(2);
        assertThatJson(response).inPath("$.globalUpdates").isArray().anySatisfy(globalUpdate -> {
            assertThatJson(globalUpdate).inPath("$.trigger.id").isString()
                .isEqualTo(TestSettings.Dependency.class.getName());
            assertThatJson(globalUpdate).inPath("$.trigger.scope").isString()
                .isEqualTo("#/properties/test/properties/dependency");
            assertThatJson(globalUpdate).inPath("$.dependencies").isArray().hasSize(1);
            assertThatJson(globalUpdate).inPath("$.dependencies[0].scope").isString()
                .isEqualTo("#/properties/test/properties/dependency");
            assertThatJson(globalUpdate).inPath("$.dependencies[0].id").isString()
                .isEqualTo(TestSettings.Dependency.class.getName());
        });

        assertThatJson(response).inPath("$.globalUpdates").isArray().anySatisfy(globalUpdate -> {
            assertThatJson(globalUpdate).inPath("$.trigger.id").isString()
                .isEqualTo(TestSettings.AnotherDependency.class.getName());
            assertThatJson(globalUpdate).inPath("$.trigger.scope").isString()
                .isEqualTo("#/properties/test/properties/anotherDependency");
            assertThatJson(globalUpdate).inPath("$.dependencies").isArray().hasSize(1);
            assertThatJson(globalUpdate).inPath("$.dependencies[0].scope").isString()
                .isEqualTo("#/properties/test/properties/dependency");
            assertThatJson(globalUpdate).inPath("$.dependencies[0].id").isString()
                .isEqualTo(TestSettings.Dependency.class.getName());
        });

    }

    @Test
    void testThrowsRuntimeExceptionOnWrongTypeForValueRef() {

        @SuppressWarnings("unused")
        class WrongTypeReferenceSettings implements DefaultNodeSettings {
            WrongTypeReferenceSettings() {

            }

            class IntegerReference implements ValueRef<Integer> {

            }

            @Widget(title = "", description = "", valueRef = IntegerReference.class)
            String dependency;

            static final class TestStateProvider implements StateProvider<String> {

                @Override
                public void init(final StateProviderInitializer initializer) {
                    initializer.computeFromValueSupplier(IntegerReference.class);
                }

                @Override
                public String computeState(final DefaultNodeSettingsContext context) {
                    throw new RuntimeException("Should not be called in this test");
                }

            }

            @Widget(title = "", description = "", valueProvider = TestStateProvider.class)
            String target;
        }

        final Map<String, WidgetGroup> settings = Map.of("test", new WrongTypeReferenceSettings());

        assertThat(assertThrows(UiSchemaGenerationException.class, () -> buildUpdates(settings)).getMessage())
            .isEqualTo(
                "The generic type \"Integer\" of the ValueRef \"IntegerReference\" does not match the type \"String\" of the annotated field");

    }

    @Test
    void testThrowsRuntimeExceptionOnWrongTypeForValueProvider() {

        @SuppressWarnings("unused")
        class WrongTypeReferenceSettings implements DefaultNodeSettings {
            WrongTypeReferenceSettings() {

            }

            class MyReference implements ValueRef<String> {

            }

            @Widget(title = "", description = "", valueRef = MyReference.class)
            String dependency;

            static final class IntegerStateProvider implements StateProvider<Integer> {

                @Override
                public void init(final StateProviderInitializer initializer) {
                    initializer.computeFromValueSupplier(MyReference.class);
                }

                @Override
                public Integer computeState(final DefaultNodeSettingsContext context) {
                    throw new RuntimeException("Should not be called in this test");
                }

            }

            @Widget(title = "", description = "", valueProvider = IntegerStateProvider.class)
            String target;
        }

        final Map<String, WidgetGroup> settings = Map.of("test", new WrongTypeReferenceSettings());

        assertThat(assertThrows(UiSchemaGenerationException.class, () -> buildUpdates(settings)).getMessage())
            .isEqualTo(
                "The generic type \"Integer\" of the StateProvider \"IntegerStateProvider\" does not match the type \"String\" of the annotated field");

    }

    @Test
    void testThrowsRuntimeExceptionOnDanglingReference() {

        @SuppressWarnings("unused")
        class DanglingReferenceSettings implements DefaultNodeSettings {

            DanglingReferenceSettings() {

            }

            class DanglingReference implements ValueRef<Integer> {

            }

            static final class TestStateProvider implements StateProvider<String> {

                @Override
                public void init(final StateProviderInitializer initializer) {
                    initializer.computeFromValueSupplier(DanglingReference.class);
                }

                @Override
                public String computeState(final DefaultNodeSettingsContext context) {
                    throw new RuntimeException("Should not be called in this test");
                }

            }

            @Widget(title = "", description = "", valueProvider = TestStateProvider.class)
            String target;
        }

        final Map<String, WidgetGroup> settings = Map.of("test", new DanglingReferenceSettings());

        assertThat(assertThrows(RuntimeException.class, () -> buildUpdates(settings)).getMessage())
            .isEqualTo("The value reference DanglingReference is used in a state provider but could not be found. "
                + "It should used as valueRef for a widget.");

    }

    void testSimpleButtonWidgetUpdate() {

        @SuppressWarnings("unused")
        class TestSettings implements DefaultNodeSettings {

            TestSettings() {

            }

            class MyButtonRef implements ButtonRef {

            }

            @Widget(title = "", description = "")
            @SimpleButtonWidget(ref = MyButtonRef.class)
            Void m_button;

            class MyButtonStateProvider implements StateProvider<String> {

                @Override
                public void init(final StateProviderInitializer initializer) {
                    initializer.computeOnButtonClick(MyButtonRef.class);
                }

                @Override
                public String computeState(final DefaultNodeSettingsContext context) {
                    throw new RuntimeException("Should not be called in this test");
                }

            }

            @Widget(title = "", description = "", valueProvider = MyButtonStateProvider.class)
            String m_updated;
        }

        final Map<String, WidgetGroup> settings = Map.of("test", new TestSettings());

        final var response = buildUpdates(settings);

        assertThatJson(response).inPath("$.globalUpdates").isArray().hasSize(2);
        assertThatJson(response).inPath("$.globalUpdates[0].trigger").isObject().doesNotContainKey("scope");
        assertThatJson(response).inPath("$.globalUpdates[0].trigger.id").isString()
            .isEqualTo(TestSettings.MyButtonRef.class.getName());
        assertThatJson(response).inPath("$.globalUpdates[0].dependencies").isArray().hasSize(0);
    }

    @Test
    void testUpdateBeforeOpenDialog() {
        @SuppressWarnings("unused")
        class TestSettings implements DefaultNodeSettings {

            TestSettings() {

            }

            static final class MySetting {

                final String m_value;

                MySetting(final String value) {
                    m_value = value;
                }

            }

            static final class MyInitialFileExtensionProvider implements FileExtensionProvider {

                @Override
                public void init(final StateProviderInitializer initializer) {
                    initializer.computeBeforeOpenDiaog();
                }

                public static final String RESULT = "txt";

                @Override
                public String computeState(final DefaultNodeSettingsContext context) {
                    return RESULT;
                }

            }

            @Widget(title = "", description = "")
            @LocalFileWriterWidget(fileExtensionProvider = MyInitialFileExtensionProvider.class)
            String m_localFileWriter;

            static final class MyValueProvider implements StateProvider<MySetting> {

                @Override
                public void init(final StateProviderInitializer initializer) {
                    initializer.computeBeforeOpenDiaog();
                }

                public static final String RESULT = "updated string";

                @Override
                public MySetting computeState(final DefaultNodeSettingsContext context) {
                    return new MySetting(RESULT);
                }

            }

            @Widget(title = "", description = "", valueProvider = MyValueProvider.class)
            MySetting m_valueUpdateSetting;

        }
        final Map<String, WidgetGroup> settings = Map.of("test", new TestSettings());

        final var response = buildUpdates(settings);

        assertThatJson(response).inPath("$").isObject().doesNotContainKey("globalUpdates");
        assertThatJson(response).inPath("$.initialUpdates").isArray().hasSize(2);

        assertThatJson(response).inPath("$.initialUpdates").isArray().anySatisfy(initialUpdate -> {
            assertThatJson(initialUpdate).inPath("$.path").isString()
                .isEqualTo("#/properties/test/properties/valueUpdateSetting");
            assertThatJson(initialUpdate).inPath("$.value").isObject().containsEntry("value", TestSettings.MyValueProvider.RESULT);
        });

        assertThatJson(response).inPath("$.initialUpdates").isArray().anySatisfy(initialUpdate -> {
            assertThatJson(initialUpdate).inPath("$.id").isString()
                .isEqualTo(TestSettings.MyInitialFileExtensionProvider.class.getName());
            assertThatJson(initialUpdate).inPath("$.value").isString()
                .isEqualTo(TestSettings.MyInitialFileExtensionProvider.RESULT);
        });
    }

    @Test
    void testUpdateBeforeOpenDialogWithDependency() {

        class TestSettings implements DefaultNodeSettings {

            TestSettings() {
            }

            static final class MyValueRef implements ValueRef<String> {

            }

            static final class MyOtherValueRef implements ValueRef<String> {

            }

            @Widget(title = "", description = "", valueRef = MyOtherValueRef.class)
            String m_otherSetting = "foo";

            static final class MyValueProvider implements StateProvider<String> {

                Supplier<String> m_valueSupplier;

                Supplier<String> m_otherValueSupplier;

                @Override
                public void init(final StateProviderInitializer initializer) {
                    m_valueSupplier = initializer.getValueSupplier(MyValueRef.class);
                    m_otherValueSupplier = initializer.computeFromValueSupplier(MyOtherValueRef.class);
                    initializer.computeBeforeOpenDiaog();
                }

                @Override
                public String computeState(final DefaultNodeSettingsContext context) {
                    return String.format("{self:%s,other:%s}", m_valueSupplier.get(), m_otherValueSupplier.get());
                }

            }

            @Widget(title = "", description = "", valueProvider = MyValueProvider.class, valueRef = MyValueRef.class)
            String m_valueUpdateSetting;

        }
        final Map<String, WidgetGroup> settings = Map.of("test", new TestSettings());
        final var response = buildUpdates(settings);
        assertThatJson(response).inPath("$.initialUpdates").isArray().hasSize(1);
        assertThatJson(response).inPath("$.initialUpdates[0].path").isString()
            .isEqualTo("#/properties/test/properties/valueUpdateSetting");
        assertThatJson(response).inPath("$.initialUpdates[0].value").isString().isEqualTo("{self:null,other:foo}");

    }

    @Test
    void testUpdateAfterOpenDialog() {
        class TestSettings implements DefaultNodeSettings {

            TestSettings() {
            }

            static final class MyInitialFileExtensionProvider implements FileExtensionProvider {

                @Override
                public void init(final StateProviderInitializer initializer) {
                    initializer.computeAfterOpenDialog();
                }

                public static final String RESULT = "txt";

                @Override
                public String computeState(final DefaultNodeSettingsContext context) {
                    return RESULT;
                }

            }

            @Widget(title = "", description = "")
            @LocalFileWriterWidget(fileExtensionProvider = MyInitialFileExtensionProvider.class)
            String m_localFileWriter;

            static final class MyValueProvider implements StateProvider<String> {

                @Override
                public void init(final StateProviderInitializer initializer) {
                    initializer.computeAfterOpenDialog();
                }

                public static final String RESULT = "updated string";

                @Override
                public String computeState(final DefaultNodeSettingsContext context) {
                    return RESULT;
                }

            }

            @Widget(title = "", description = "", valueProvider = MyValueProvider.class)
            String m_valueUpdateSetting;

        }
        final Map<String, WidgetGroup> settings = Map.of("test", new TestSettings());

        final var response = buildUpdates(settings);

        assertThatJson(response).inPath("$").isObject().doesNotContainKey("initialUpdates");
        assertThatJson(response).inPath("$.globalUpdates").isArray().hasSize(1);

        assertThatJson(response).inPath("$.globalUpdates[0].trigger").isObject().doesNotContainKey("scope");
        assertThatJson(response).inPath("$.globalUpdates[0].trigger.triggerInitially").isBoolean().isTrue();
        assertThatJson(response).inPath("$.globalUpdates[0].trigger.id").isString().isEqualTo("after-open-dialog");
        assertThatJson(response).inPath("$.globalUpdates[0].dependencies").isArray().hasSize(0);
    }

    @Nested
    class UIStateUpdateTest {

        static final class MyExtensionProvider implements FileExtensionProvider {

            @Override
            public void init(final StateProviderInitializer initializer) {
                initializer.computeAfterOpenDialog();
            }

            @Override
            public String computeState(final DefaultNodeSettingsContext context) {
                throw new IllegalStateException("Should not be called within this test");
            }

        }

        @Test
        void testFileWriterWidgetFileExtensionProvider() {

            class TestSettings implements DefaultNodeSettings {

                @FileWriterWidget(fileExtensionProvider = MyExtensionProvider.class)
                FileChooser m_fileChooser;

            }

            final Map<String, WidgetGroup> settings = Map.of("test", new TestSettings());

            final var response = buildUpdates(settings);

            assertThatJson(response).inPath("$.globalUpdates").isArray().hasSize(1);

        }

        @Test
        void testLocalFileWriterWidgetFileExtensionProvider() {

            class TestSettings implements DefaultNodeSettings {

                @LocalFileWriterWidget(fileExtensionProvider = MyExtensionProvider.class)
                String m_fileChooser;

            }

            final Map<String, WidgetGroup> settings = Map.of("test", new TestSettings());

            final var response = buildUpdates(settings);

            assertThatJson(response).inPath("$.globalUpdates").isArray().hasSize(1);

        }

        static final class TestStringChoicesProvider implements StringChoicesStateProvider {

            static final String[] RESULT = new String[]{"A", "B", "C"};

            @Override
            public String[] choices(final DefaultNodeSettingsContext context) {
                return RESULT;
            }

        }

        @Test
        void testChoicesWidgetStringChoicesStateProvider() {
            class TestSettings implements DefaultNodeSettings {

                @ChoicesWidget(choicesProvider = TestStringChoicesProvider.class)
                String m_string;

            }
            final Map<String, WidgetGroup> settings = Map.of("test", new TestSettings());

            final var response = buildUpdates(settings);

            assertThatJson(response).inPath("$.initialUpdates").isArray().hasSize(1);
            assertThatJson(response).inPath("$.initialUpdates[0].id").isString()
                .isEqualTo(TestStringChoicesProvider.class.getName());
            assertThatJson(response).inPath("$.initialUpdates[0].value").isArray().hasSize(3);
            List.of(0, 1, 2).forEach(i -> {
                assertThatJson(response).inPath(String.format("$.initialUpdates[0].value[%s].id", i)).isString()
                    .isEqualTo(TestStringChoicesProvider.RESULT[i]);
                assertThatJson(response).inPath(String.format("$.initialUpdates[0].value[%s].text", i)).isString()
                    .isEqualTo(TestStringChoicesProvider.RESULT[i]);
            });

        }

        static final class TestColumnChoicesProvider implements ColumnChoicesStateProvider {

            @Override
            public DataColumnSpec[] columnChoices(final DefaultNodeSettingsContext context) {
                return new DataColumnSpec[]{new DataColumnSpecCreator("A", StringCell.TYPE).createSpec()};
            }

        }

        @Test
        void testChoicesWidgetColumnChoicesStateProvider() {
            class TestSettings implements DefaultNodeSettings {

                @ChoicesWidget(choicesProvider = TestColumnChoicesProvider.class)
                ColumnSelection m_columnSelection;

            }
            final Map<String, WidgetGroup> settings = Map.of("test", new TestSettings());

            final var response = buildUpdates(settings);

            assertThatJson(response).inPath("$.initialUpdates").isArray().hasSize(1);
            assertThatJson(response).inPath("$.initialUpdates[0].id").isString()
                .isEqualTo(TestColumnChoicesProvider.class.getName());
            assertThatJson(response).inPath("$.initialUpdates[0].value").isArray().hasSize(1);
            assertThatJson(response).inPath("$.initialUpdates[0].value[0].id").isString().isEqualTo("A");
            assertThatJson(response).inPath("$.initialUpdates[0].value[0].text").isString().isEqualTo("A");
            assertThatJson(response).inPath("$.initialUpdates[0].value[0].type.id").isString()
                .isEqualTo(StringCell.TYPE.getPreferredValueClass().getName());
            assertThatJson(response).inPath("$.initialUpdates[0].value[0].type.text").isString()
                .isEqualTo(StringCell.TYPE.getName());
            assertThatJson(response).inPath("$.initialUpdates[0].value[0].compatibleTypes").isArray().hasSize(3);
        }
    }
}
