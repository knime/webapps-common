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
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.JsonFormsUiSchemaUtilTest.buildUiSchema;

import java.util.Map;
import java.util.function.Supplier;

import org.junit.jupiter.api.Test;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.widget.FileExtensionProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.LocalFileWriterWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.SimpleButtonWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ButtonRef;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.StateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueRef;

/**
 *
 * @author Paul Bärnreuther
 */
public class UiSchemaUpdatesTest {

    @Test
    void testValueUpdates() {

        @SuppressWarnings("unused")
        class TestSettings implements DefaultNodeSettings {

            class Dependency implements ValueRef<String> {

            }

            @Widget(valueRef = Dependency.class)
            String dependency;

            class AnotherDependency implements ValueRef<String> {

            }

            @Widget(valueRef = AnotherDependency.class)
            String anotherDependency;

            static final class TestStateProvider implements StateProvider<String> {

                @Override
                public void init(final StateProviderInitializer initializer) {
                    initializer.computeFromValueSupplier(Dependency.class);
                }

                @Override
                public String computeState() {
                    throw new RuntimeException("Should not be called in this test");
                }

            }

            @Widget(valueProvider = TestStateProvider.class)
            String target;

            static final class AnotherTestStateProvider implements StateProvider<String> {

                @Override
                public void init(final StateProviderInitializer initializer) {
                    initializer.getValueSupplier(Dependency.class);
                    initializer.computeOnValueChange(AnotherDependency.class);
                }

                @Override
                public String computeState() {
                    throw new RuntimeException("Should not be called in this test");

                }
            }

            @Widget(valueProvider = AnotherTestStateProvider.class)
            String anotherTarget;
        }

        final Map<String, Class<? extends WidgetGroup>> settings = Map.of("test", TestSettings.class);

        final var response = buildUiSchema(settings);

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

            class IntegerReference implements ValueRef<Integer> {

            }

            @Widget(valueRef = IntegerReference.class)
            String dependency;

            static final class TestStateProvider implements StateProvider<String> {

                @Override
                public void init(final StateProviderInitializer initializer) {
                    initializer.computeFromValueSupplier(IntegerReference.class);
                }

                @Override
                public String computeState() {
                    throw new RuntimeException("Should not be called in this test");
                }

            }

            @Widget(valueProvider = TestStateProvider.class)
            String target;
        }

        final Map<String, Class<? extends WidgetGroup>> settings = Map.of("test", WrongTypeReferenceSettings.class);

        assertThat(assertThrows(UiSchemaGenerationException.class, () -> buildUiSchema(settings)).getMessage())
            .isEqualTo(
                "The generic type \"Integer\" of the ValueRef \"IntegerReference\" does not match the type \"String\" of the annotated field");

    }

    @Test
    void testThrowsRuntimeExceptionOnWrongTypeForValueProvider() {

        @SuppressWarnings("unused")
        class WrongTypeReferenceSettings implements DefaultNodeSettings {

            class MyReference implements ValueRef<String> {

            }

            @Widget(valueRef = MyReference.class)
            String dependency;

            static final class IntegerStateProvider implements StateProvider<Integer> {

                @Override
                public void init(final StateProviderInitializer initializer) {
                    initializer.computeFromValueSupplier(MyReference.class);
                }

                @Override
                public Integer computeState() {
                    throw new RuntimeException("Should not be called in this test");
                }

            }

            @Widget(valueProvider = IntegerStateProvider.class)
            String target;
        }

        final Map<String, Class<? extends WidgetGroup>> settings = Map.of("test", WrongTypeReferenceSettings.class);

        assertThat(assertThrows(UiSchemaGenerationException.class, () -> buildUiSchema(settings)).getMessage())
            .isEqualTo(
                "The generic type \"Integer\" of the StateProvider \"IntegerStateProvider\" does not match the type \"String\" of the annotated field");

    }

    @Test
    void testThrowsRuntimeExceptionOnDanglingReference() {

        @SuppressWarnings("unused")
        class DanglingReferenceSettings implements DefaultNodeSettings {

            class DanglingReference implements ValueRef<Integer> {

            }

            static final class TestStateProvider implements StateProvider<String> {

                @Override
                public void init(final StateProviderInitializer initializer) {
                    initializer.computeFromValueSupplier(DanglingReference.class);
                }

                @Override
                public String computeState() {
                    throw new RuntimeException("Should not be called in this test");
                }

            }

            @Widget(valueProvider = TestStateProvider.class)
            String target;
        }

        final Map<String, Class<? extends WidgetGroup>> settings = Map.of("test", DanglingReferenceSettings.class);

        assertThat(assertThrows(RuntimeException.class, () -> buildUiSchema(settings)).getMessage())
            .isEqualTo("The value reference DanglingReference is used in a state provider but could not be found. "
                + "It should used as valueRef for a widget.");

    }

    void testSimpleButtonWidgetUpdate() {

        class TestSettings implements DefaultNodeSettings {

            class MyButtonRef implements ButtonRef {

            }

            @Widget
            @SimpleButtonWidget(ref = MyButtonRef.class)
            Void m_button;

            class MyButtonStateProvider implements StateProvider<String> {

                @Override
                public void init(final StateProviderInitializer initializer) {
                    initializer.computeOnButtonClick(MyButtonRef.class);
                }

                @Override
                public String computeState() {
                    throw new RuntimeException("Should not be called in this test");
                }

            }

            @Widget(valueProvider = MyButtonStateProvider.class)
            String m_updated;
        }

        final Map<String, Class<? extends WidgetGroup>> settings = Map.of("test", TestSettings.class);

        final var response = buildUiSchema(settings);

        assertThatJson(response).inPath("$.globalUpdates").isArray().hasSize(2);
        assertThatJson(response).inPath("$.globalUpdates[0].trigger").isObject().doesNotContainKey("scope");
        assertThatJson(response).inPath("$.globalUpdates[0].trigger.id").isString()
            .isEqualTo(TestSettings.MyButtonRef.class.getName());
        assertThatJson(response).inPath("$.globalUpdates[0].dependencies").isArray().hasSize(0);
    }

    @Test
    void testUpdateBeforeOpenDialog() {
        class TestSettings implements DefaultNodeSettings {

            static final class MyInitialFileExtensionProvider implements FileExtensionProvider {

                @Override
                public void init(final StateProviderInitializer initializer) {
                    initializer.computeBeforeOpenDiaog();
                }

                public static final String RESULT = "txt";

                @Override
                public String computeState() {
                    return RESULT;
                }

            }

            @Widget
            @LocalFileWriterWidget(fileExtensionProvider = MyInitialFileExtensionProvider.class)
            String m_localFileWriter;

            static final class MyValueProvider implements StateProvider<String> {

                @Override
                public void init(final StateProviderInitializer initializer) {
                    initializer.computeBeforeOpenDiaog();
                }

                public static final String RESULT = "updated string";

                @Override
                public String computeState() {
                    return RESULT;
                }

            }

            @Widget(valueProvider = MyValueProvider.class)
            String m_valueUpdateSetting;

        }
        final Map<String, Class<? extends WidgetGroup>> settings = Map.of("test", TestSettings.class);

        final var response = buildUiSchema(settings);

        assertThatJson(response).inPath("$").isObject().doesNotContainKey("globalUpdates");
        assertThatJson(response).inPath("$.initialUpdates").isArray().hasSize(2);

        assertThatJson(response).inPath("$.initialUpdates").isArray().anySatisfy(initialUpdate -> {
            assertThatJson(initialUpdate).inPath("$.path").isString()
                .isEqualTo("#/properties/test/properties/valueUpdateSetting");
            assertThatJson(initialUpdate).inPath("$.value").isString().isEqualTo(TestSettings.MyValueProvider.RESULT);
        });

        assertThatJson(response).inPath("$.initialUpdates").isArray().anySatisfy(initialUpdate -> {
            assertThatJson(initialUpdate).inPath("$.id").isString()
                .isEqualTo(TestSettings.MyInitialFileExtensionProvider.class.getName());
            assertThatJson(initialUpdate).inPath("$.value").isString()
                .isEqualTo(TestSettings.MyInitialFileExtensionProvider.RESULT);
        });
    }

    @Test
    void testThrowsOnUpdateBeforeOpenDialogWithDependencies() {

        class TestSettings implements DefaultNodeSettings {
            static final class MyValueRef implements ValueRef<String> {

            }

            static final class MyValueProvider implements StateProvider<String> {

                Supplier<String> m_valueSupplier;

                @Override
                public void init(final StateProviderInitializer initializer) {
                    m_valueSupplier = initializer.getValueSupplier(MyValueRef.class);
                    initializer.computeBeforeOpenDiaog();
                }

                @Override
                public String computeState() {
                    return m_valueSupplier.get();
                }

            }

            @Widget(valueProvider = MyValueProvider.class, valueRef = MyValueRef.class)
            String m_valueUpdateSetting;

        }
        final Map<String, Class<? extends WidgetGroup>> settings = Map.of("test", TestSettings.class);

        assertThrows(UiSchemaGenerationException.class, () -> buildUiSchema(settings));

    }

    @Test
    void testUpdateAfterOpenDialog() {
        class TestSettings implements DefaultNodeSettings {

            static final class MyInitialFileExtensionProvider implements FileExtensionProvider {

                @Override
                public void init(final StateProviderInitializer initializer) {
                    initializer.computeAfterOpenDialog();
                }

                public static final String RESULT = "txt";

                @Override
                public String computeState() {
                    return RESULT;
                }

            }

            @Widget
            @LocalFileWriterWidget(fileExtensionProvider = MyInitialFileExtensionProvider.class)
            String m_localFileWriter;

            static final class MyValueProvider implements StateProvider<String> {

                @Override
                public void init(final StateProviderInitializer initializer) {
                    initializer.computeAfterOpenDialog();
                }

                public static final String RESULT = "updated string";

                @Override
                public String computeState() {
                    return RESULT;
                }

            }

            @Widget(valueProvider = MyValueProvider.class)
            String m_valueUpdateSetting;

        }
        final Map<String, Class<? extends WidgetGroup>> settings = Map.of("test", TestSettings.class);

        final var response = buildUiSchema(settings);

        assertThatJson(response).inPath("$").isObject().doesNotContainKey("initialUpdates");
        assertThatJson(response).inPath("$.globalUpdates").isArray().hasSize(1);

        assertThatJson(response).inPath("$.globalUpdates[0].trigger").isObject().doesNotContainKey("scope");
        assertThatJson(response).inPath("$.globalUpdates[0].trigger.triggerInitially").isBoolean().isTrue();
        assertThatJson(response).inPath("$.globalUpdates[0].trigger.id").isString().isEqualTo("after-open-dialog");
        assertThatJson(response).inPath("$.globalUpdates[0].dependencies").isArray().hasSize(0);
    }
}
