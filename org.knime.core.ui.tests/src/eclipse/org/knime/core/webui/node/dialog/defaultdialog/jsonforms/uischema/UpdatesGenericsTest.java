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
 *   Sep 25, 2024 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema;

import static net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.JsonFormsUiSchemaUtilTest.buildTestUiSchema;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.UpdatesUtilTest.buildUpdates;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.function.Supplier;

import org.junit.jupiter.api.Test;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.Reference;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.StateProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.updates.ValueReference;

class UpdatesGenericsTest {
    static final class MyReference implements Reference<List<String>> {
    }

    static final class MyProvider implements StateProvider<List<String>> {

        private Supplier<List<String>> m_valueSupplier;

        @Override
        public void init(final StateProviderInitializer initializer) {
            initializer.computeBeforeOpenDialog();
            m_valueSupplier = initializer.getValueSupplier(MyReference.class);
        }

        @Override
        public List<String> computeState(final DefaultNodeSettingsContext context) {
            return m_valueSupplier.get();
        }

    }

    @Test
    void testWithGenerics() {

        class TestSettings implements DefaultNodeSettings {

            @ValueReference(MyReference.class)
            List<String> m_list = List.of("a", "b");

            @ValueProvider(MyProvider.class)
            List<String> m_updatedList;
        }

        final var response = buildUpdates(new TestSettings());
        assertThatJson(response).inPath("$.initialUpdates[0].values[0].value").isArray().isEqualTo(List.of("a", "b"));

    }

    /**
     * We are currently not able to detect wrong generics in the settings class.
     */
    @Test
    void testWithWrongGenerics() {
        class WrongGenericTestSettings implements DefaultNodeSettings {

            @ValueReference(MyReference.class)
            List<Integer> m_list = List.of(1, 2);

            @ValueProvider(MyProvider.class)
            List<String> m_updatedList;
        }

        final var settings = new WrongGenericTestSettings();
        final var response = buildUpdates(settings);
        assertThatJson(response).inPath("$.initialUpdates[0].values[0].value").isArray().isEqualTo(List.of("1", "2"));

    }

    @Test
    void testWithWrongRawClass() {
        class WrongRawClassTestSettings implements DefaultNodeSettings {

            @ValueReference(MyReference.class)
            Map<String, String> m_list;

        }
        final var settings = new WrongRawClassTestSettings();
        assertThat(assertThrows(UiSchemaGenerationException.class, () -> buildUpdates(settings)).getMessage())
            .isEqualTo("The generic type \"List\" of the Reference \"MyReference\" does not "
                + "match the type \"Map\" of the annotated field");
    }

    @Test
    void testValueReferenceWithTypeReference() {
        class WildcardTestSettings implements DefaultNodeSettings {

            static final class MyWildcardReference implements Reference<Optional<?>> {
            }

            static final class ExtractFromOptional implements StateProvider<String> {
                private Supplier<Optional<String>> m_valueSupplier;

                @Override
                public void init(final StateProviderInitializer initializer) {
                    initializer.computeBeforeOpenDialog();
                    m_valueSupplier =
                        initializer.getValueSupplier(MyWildcardReference.class, new TypeReference<Optional<String>>() {
                        });
                }

                @Override
                public String computeState(final DefaultNodeSettingsContext context) {
                    return m_valueSupplier.get().get();
                }
            }

            @ValueReference(MyWildcardReference.class)
            Optional<String> m_list = Optional.of("a");

            @ValueProvider(ExtractFromOptional.class)
            String m_updatedList;
        }

        final var response = buildUpdates(new WildcardTestSettings());
        assertThatJson(response).inPath("$.initialUpdates[0].values[0].value").isString().isEqualTo("a");
    }

    /**
     * This test ensures, that during traversal of fields, not only the raw class is respected, but also the generics.
     */
    @Test
    void testWidgetGroupInsideParameterizedWidgetGroup() {

        class EmptySettings implements WidgetGroup {
        }

        class MiddleSettings<C extends EmptySettings> implements WidgetGroup {
            C m_widgetGroup;
        }
        class AbstractTestSettings<C extends EmptySettings> implements DefaultNodeSettings {
            MiddleSettings<C> m_middleSettings;
        }

        class WidgetGroupSettings extends EmptySettings {
            @Widget(description = "", title = "")
            String m_list;
        }

        class TestSettings extends AbstractTestSettings<WidgetGroupSettings> {

        }

        final var response = buildTestUiSchema(TestSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(1);
    }
}
