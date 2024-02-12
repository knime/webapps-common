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
 *   May 5, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema;

import static net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson;
import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.JsonFormsUiSchemaUtilTest.buildTestUiSchema;

import java.util.concurrent.ExecutionException;
import java.util.stream.IntStream;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.knime.core.data.DataColumnSpec;
import org.knime.core.data.DataColumnSpecCreator;
import org.knime.core.data.DataTableSpec;
import org.knime.core.data.def.DoubleCell;
import org.knime.core.data.def.StringCell;
import org.knime.core.node.BufferedDataTable;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.node.port.PortType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeDialogTest;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.schema.JsonFormsSchemaUtil;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnfilter.ColumnFilter;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnselection.ColumnSelection;
import org.knime.core.webui.node.dialog.defaultdialog.widget.AsyncChoicesProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ColumnChoicesProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.LocalFileReaderWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.ChoicesUpdateHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.IdAndText;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.PossibleColumnValue;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.impl.AsyncChoicesHolder;
import org.knime.core.webui.node.dialog.defaultdialog.widget.handler.WidgetHandlerException;

/**
 *
 * This tests the functionality of the {@link JsonFormsSchemaUtil} to set default options depending on types of fields
 * as well as options coming from widget annotations.
 *
 * @author Paul Bärnreuther
 */
@SuppressWarnings("java:S2698") // we accept assertions without messages
class ChoicesWidgetUiSchemaOptionsTest {

    @Test
    void testFormatForChoicesWidget() {

        @SuppressWarnings("unused")
        class SeveralChoicesSettings implements DefaultNodeSettings {
            @Widget
            @ChoicesWidget(choices = TestChoicesProvider.class)
            ColumnSelection m_columnSelection;

            @Widget
            @ChoicesWidget(choices = TestChoicesProvider.class)
            ColumnFilter m_columnFilter;

            @Widget
            @ChoicesWidget(choices = TestChoicesProvider.class)
            String[] m_stringArray;

            @Widget
            @ChoicesWidget(choices = TestChoicesProvider.class)
            String m_string;

            enum MyEnum {
                    A, B, C
            }

            @Widget
            @ChoicesWidget(choices = TestChoicesProvider.class)
            MyEnum m_foo;
        }

        var response = buildTestUiSchema(SeveralChoicesSettings.class, null);
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("columnSelection");
        assertThatJson(response).inPath("$.elements[0].options.format").isString().isEqualTo("columnSelection");
        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("columnFilter");
        assertThatJson(response).inPath("$.elements[1].options.format").isString().isEqualTo("columnFilter");
        assertThatJson(response).inPath("$.elements[2].scope").isString().contains("stringArray");
        assertThatJson(response).inPath("$.elements[2].options.format").isString().isEqualTo("twinList");
        assertThatJson(response).inPath("$.elements[3].scope").isString().contains("string");
        assertThatJson(response).inPath("$.elements[3].options.format").isString().isEqualTo("dropDown");
        assertThatJson(response).inPath("$.elements[4].scope").isString().contains("foo");
        assertThatJson(response).inPath("$.elements[4].options.format").isString().isEqualTo("dropDown");
    }

    static class TestColumnChoicesProvider implements ColumnChoicesProvider {

        @Override
        public DataColumnSpec[] columnChoices(final DefaultNodeSettingsContext context) {
            return ((DataTableSpec)context.getPortObjectSpec(0).get()).stream().toArray(DataColumnSpec[]::new);
        }
    }

    static class TestChoicesProvider implements ChoicesProvider {

        @Override
        public String[] choices(final DefaultNodeSettingsContext context) {
            return new String[]{"column1", "column2"};
        }
    }

    static class TestChoicesProviderWithIdAndText implements ChoicesProvider {

        @Override
        public IdAndText[] choicesWithIdAndText(final DefaultNodeSettingsContext context) {
            return new IdAndText[]{new IdAndText("id1", "text1"), new IdAndText("id2", "text2")};
        }
    }

    class ChoicesSettings implements DefaultNodeSettings {

        @Widget
        @ChoicesWidget(showNoneColumn = true, choices = TestColumnChoicesProvider.class)
        ColumnSelection m_foo;

        @Widget
        @ChoicesWidget(choices = TestChoicesProvider.class)
        String m_bar;

        @Widget
        @ChoicesWidget(choices = TestChoicesProviderWithIdAndText.class)
        String m_idAndText;

    }

    private static DataColumnSpec[] columnSpecs =
        new DataColumnSpec[]{new DataColumnSpecCreator("column1", StringCell.TYPE).createSpec(), //
            new DataColumnSpecCreator("column2", DoubleCell.TYPE).createSpec()};

    private static DefaultNodeSettingsContext createDefaultNodeSettingsContext() {
        DefaultNodeSettingsContext defaultNodeSettingsContext = DefaultNodeDialogTest.createDefaultNodeSettingsContext(
            new PortType[]{BufferedDataTable.TYPE}, new PortObjectSpec[]{new DataTableSpec(columnSpecs)}, null, null);
        return defaultNodeSettingsContext;
    }

    @Test
    void testChoicesWidget() {

        DefaultNodeSettingsContext defaultNodeSettingsContext = createDefaultNodeSettingsContext();

        var response = buildTestUiSchema(ChoicesSettings.class, defaultNodeSettingsContext);
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("foo");
        assertThatJson(response).inPath("$.elements[0].options.showNoneColumn").isBoolean().isTrue();
        assertThatJson(response).inPath("$.elements[0].options.possibleValues").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].options.possibleValues[0].id").isString().isEqualTo("column1");
        assertThatJson(response).inPath("$.elements[0].options.possibleValues[1].id").isString().isEqualTo("column2");
        assertThatJson(response).inPath("$.elements[0].options.possibleValues[0].text").isString().isEqualTo("column1");
        assertThatJson(response).inPath("$.elements[0].options.possibleValues[1].text").isString().isEqualTo("column2");
        assertThatJson(response).inPath("$.elements[0].options.possibleValues[0].type.id").isString()
            .isEqualTo("org.knime.core.data.StringValue");
        assertThatJson(response).inPath("$.elements[0].options.possibleValues[1].type.id").isString()
            .isEqualTo("org.knime.core.data.DoubleValue");
        assertThatJson(response).inPath("$.elements[0].options.possibleValues[0].type.text").isString()
            .isEqualTo("String");
        assertThatJson(response).inPath("$.elements[0].options.possibleValues[1].type.text").isString()
            .isEqualTo("Number (double)");
        assertThatJson(response).inPath("$.elements[0].options.possibleValues[0].compatibleTypes").isArray()
            .contains("org.knime.core.data.NominalValue");
        assertThatJson(response).inPath("$.elements[0].options.possibleValues[1].compatibleTypes").isArray()
            .contains("org.knime.core.data.BoundedValue");

        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("bar");
        assertThatJson(response).inPath("$.elements[1].options.possibleValues").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[1].options.possibleValues[0].id").isString().isEqualTo("column1");
        assertThatJson(response).inPath("$.elements[1].options.possibleValues[1].id").isString().isEqualTo("column2");
        assertThatJson(response).inPath("$.elements[1].options.possibleValues[0].text").isString().isEqualTo("column1");
        assertThatJson(response).inPath("$.elements[1].options.possibleValues[1].text").isString().isEqualTo("column2");

        assertThatJson(response).inPath("$.elements[2].scope").isString().contains("idAndText");
        assertThatJson(response).inPath("$.elements[2].options.possibleValues").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[2].options.possibleValues[0].id").isString().isEqualTo("id1");
        assertThatJson(response).inPath("$.elements[2].options.possibleValues[1].id").isString().isEqualTo("id2");
        assertThatJson(response).inPath("$.elements[2].options.possibleValues[0].text").isString().isEqualTo("text1");
        assertThatJson(response).inPath("$.elements[2].options.possibleValues[1].text").isString().isEqualTo("text2");

    }

    @Test
    void testChoicesWidgetWithoutDefaultNodeSettingsContext() {

        var response = buildTestUiSchema(ChoicesSettings.class, null);
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("foo");
        assertThatJson(response).inPath("$.elements[0].options.showNoneColumn").isBoolean().isTrue();
        assertThatJson(response).inPath("$.elements[0].options.possibleValues").isArray().isEmpty();
        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("bar");
        assertThatJson(response).inPath("$.elements[1].options.possibleValues").isArray().isEmpty();

    }

    @Nested
    class AsynchChoicesTest {

        static class TestAsyncColumnChoicesProvider implements ColumnChoicesProvider, AsyncChoicesProvider {

            @Override
            public DataColumnSpec[] columnChoices(final DefaultNodeSettingsContext context) {
                return ((DataTableSpec)context.getPortObjectSpec(0).get()).stream().toArray(DataColumnSpec[]::new);
            }
        }

        static class TestAsyncChoicesProvider implements ChoicesProvider, AsyncChoicesProvider {

            @Override
            public IdAndText[] choicesWithIdAndText(final DefaultNodeSettingsContext context) {
                return new IdAndText[]{new IdAndText("id1", "text1"), new IdAndText("id2", "text2")};
            }
        }

        static class TestChoicesProviderWithManyChoices implements ChoicesProvider {

            static final IdAndText[] manyChoices =
                IntStream.range(0, 101).mapToObj(String::valueOf).map(IdAndText::fromId).toArray(IdAndText[]::new);

            @Override
            public IdAndText[] choicesWithIdAndText(final DefaultNodeSettingsContext context) {
                return manyChoices;
            }
        }

        class AsyncChoicesSettings implements DefaultNodeSettings {

            @Widget
            @ChoicesWidget(showNoneColumn = true, choices = TestAsyncColumnChoicesProvider.class)
            ColumnSelection m_foo;

            @Widget
            @ChoicesWidget(choices = TestAsyncChoicesProvider.class)
            String m_bar;

            @Widget
            @ChoicesWidget(choices = TestAsyncChoicesProvider.class)
            String m_baz;

            @Widget
            @ChoicesWidget(choices = TestChoicesProviderWithManyChoices.class)
            String m_manyChoices;

        }

        @Test
        void testChoicesWidgetWithAsyncChoicesProvider() throws InterruptedException, ExecutionException {
            DefaultNodeSettingsContext defaultNodeSettingsContext = createDefaultNodeSettingsContext();
            final var asyncChoicesHolder = new AsyncChoicesHolder();

            var response =
                buildTestUiSchema(AsyncChoicesSettings.class, defaultNodeSettingsContext, asyncChoicesHolder);
            assertThatJson(response).inPath("$.elements[0].scope").isString().contains("foo");
            assertThatJson(response).inPath("$.elements[0].options.showNoneColumn").isBoolean().isTrue();
            assertThatJson(response).inPath("$.elements[0].options").isObject().doesNotContainKey("possibleValues");
            assertThatJson(response).inPath("$.elements[0].options.choicesProviderClass").isString()
                .isEqualTo(TestAsyncColumnChoicesProvider.class.getName());
            assertThatJson(response).inPath("$.elements[1].scope").isString().contains("bar");
            assertThatJson(response).inPath("$.elements[1].options").isObject().doesNotContainKey("possibleValues");
            assertThatJson(response).inPath("$.elements[1].options.choicesProviderClass").isString()
                .isEqualTo(TestAsyncChoicesProvider.class.getName());
            assertThatJson(response).inPath("$.elements[2].scope").isString().contains("baz");
            assertThatJson(response).inPath("$.elements[2].options").isObject().doesNotContainKey("possibleValues");
            assertThatJson(response).inPath("$.elements[2].options.choicesProviderClass").isString()
                .isEqualTo(TestAsyncChoicesProvider.class.getName());
            assertThatJson(response).inPath("$.elements[3].scope").isString().contains("manyChoices");
            assertThatJson(response).inPath("$.elements[3].options").isObject().doesNotContainKey("possibleValues");
            assertThatJson(response).inPath("$.elements[3].options.choicesProviderClass").isString()
                .isEqualTo(TestChoicesProviderWithManyChoices.class.getName());

            for (int i = 0; i < 2; i++) {
                assertThat(asyncChoicesHolder.getChoices(TestAsyncChoicesProvider.class.getName()).get())
                    .isEqualTo(new IdAndText[]{new IdAndText("id1", "text1"), new IdAndText("id2", "text2")});
            }

            final var testAsyncChoicesProvider = TestAsyncChoicesProvider.class.getName();
            assertThrows(NullPointerException.class, () -> asyncChoicesHolder.getChoices(testAsyncChoicesProvider));

            final var testAsyncColumnChoicesProvider = TestAsyncColumnChoicesProvider.class.getName();
            assertThat(asyncChoicesHolder.getChoices(testAsyncColumnChoicesProvider).get())
                .isEqualTo(IntStream.range(0, columnSpecs.length).mapToObj(i -> columnSpecs[i])
                    .map(PossibleColumnValue::fromColSpec).toArray(PossibleColumnValue[]::new));

            assertThrows(NullPointerException.class,
                () -> asyncChoicesHolder.getChoices(testAsyncColumnChoicesProvider));

            final var testChoicesProviderWithManyChoices = TestChoicesProviderWithManyChoices.class.getName();
            assertThat(asyncChoicesHolder.getChoices(testChoicesProviderWithManyChoices).get())
                .isEqualTo(TestChoicesProviderWithManyChoices.manyChoices);

            assertThrows(NullPointerException.class,
                () -> asyncChoicesHolder.getChoices(testChoicesProviderWithManyChoices));

        }

        static class TestAsyncChoicesProviderForArrayLayout extends TestAsyncChoicesProvider {
        }

        class ArrayLayoutElementWithChoices implements WidgetGroup {

            @Widget
            @ChoicesWidget(choices = TestAsyncChoicesProviderForArrayLayout.class)
            String m_elementChoices;

        }

        class AsyncChoicesArrayLayoutSettings implements DefaultNodeSettings {

            @Widget
            ArrayLayoutElementWithChoices[] m_withinArrayLayout;
        }

        @Test
        void testChoicesWidgetWithAsyncChoicesProviderWithinArrayLayout()
            throws InterruptedException, ExecutionException {
            DefaultNodeSettingsContext defaultNodeSettingsContext = createDefaultNodeSettingsContext();
            final var asyncChoicesHolder = new AsyncChoicesHolder();

            var response = buildTestUiSchema(AsyncChoicesArrayLayoutSettings.class, defaultNodeSettingsContext,
                asyncChoicesHolder);

            assertThatJson(response).inPath("$.elements[0].scope").isString().contains("withinArrayLayout");

            /**
             * Although there is only one field, fields within an array layout will never throw an exception
             */
            for (int i = 0; i < 5; i++) {
                assertThat(asyncChoicesHolder.getChoices(TestAsyncChoicesProviderForArrayLayout.class.getName()).get())
                    .isEqualTo(new IdAndText[]{new IdAndText("id1", "text1"), new IdAndText("id2", "text2")});
            }

        }

    }

    @Test
    void testChoicesWidgetShowNoneColumn() {
        class ChoicesWidgetTestSettings implements DefaultNodeSettings {

            @Widget
            @ChoicesWidget(choices = TestChoicesProvider.class, showNoneColumn = true)
            ColumnSelection m_foo;

            @Widget
            @ChoicesWidget(choices = TestChoicesProvider.class)
            ColumnSelection m_bar;

        }
        var response = buildTestUiSchema(ChoicesWidgetTestSettings.class);
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("foo");
        assertThatJson(response).inPath("$.elements[0].options.showNoneColumn").isBoolean().isTrue();
        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("bar");
        assertThatJson(response).inPath("$.elements[1].options.showNoneColumn").isBoolean().isFalse();
    }

    @Test
    void testChoicesWidgetShowRowKeys() {
        class ChoicesWidgetTestSettings implements DefaultNodeSettings {

            @Widget
            @ChoicesWidget(choices = TestChoicesProvider.class, showRowKeysColumn = true)
            ColumnSelection m_foo;

            @Widget
            @ChoicesWidget(choices = TestChoicesProvider.class)
            ColumnSelection m_bar;

        }
        var response = buildTestUiSchema(ChoicesWidgetTestSettings.class);
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("foo");
        assertThatJson(response).inPath("$.elements[0].options.showRowKeys").isBoolean().isTrue();
        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("bar");
        assertThatJson(response).inPath("$.elements[1].options.showRowKeys").isBoolean().isFalse();
    }

    @Test
    void testChoicesWidgetHideSearch() {
        class ChoicesWidgetTestSettings implements DefaultNodeSettings {

            @Widget
            @ChoicesWidget(choices = TestChoicesProvider.class, showSearch = false)
            ColumnSelection m_foo;

            @Widget
            @ChoicesWidget(choices = TestChoicesProvider.class)
            ColumnSelection m_bar;

        }
        var response = buildTestUiSchema(ChoicesWidgetTestSettings.class);
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("foo");
        assertThatJson(response).inPath("$.elements[0].options.showSearch").isBoolean().isFalse();
        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("bar");
        assertThatJson(response).inPath("$.elements[1].options.showSearch").isBoolean().isTrue();
    }

    @Test
    void testChoicesWidgetHideMode() {
        class ChoicesWidgetTestSettings implements DefaultNodeSettings {

            @Widget
            @ChoicesWidget(choices = TestChoicesProvider.class, showMode = false)
            ColumnSelection m_foo;

            @Widget
            @ChoicesWidget(choices = TestChoicesProvider.class)
            ColumnSelection m_bar;

        }
        var response = buildTestUiSchema(ChoicesWidgetTestSettings.class);
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("foo");
        assertThatJson(response).inPath("$.elements[0].options.showMode").isBoolean().isFalse();
        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("bar");
        assertThatJson(response).inPath("$.elements[1].options.showMode").isBoolean().isTrue();
    }

    @Test
    void testChoicesWidgetIncludedLabel() {
        class ChoicesWidgetTestSettings implements DefaultNodeSettings {

            @Widget
            @ChoicesWidget(choices = TestChoicesProvider.class, includedLabel = "Label for included columns.")
            ColumnFilter m_foo;

            @Widget
            @ChoicesWidget(choices = TestChoicesProvider.class)
            ColumnFilter m_bar;

        }
        var response = buildTestUiSchema(ChoicesWidgetTestSettings.class);
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("foo");
        assertThatJson(response).inPath("$.elements[0].options.includedLabel").isString()
            .isEqualTo("Label for included columns.");
        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("bar");
        assertThatJson(response).inPath("$.elements[1].options.includedLabel").isAbsent();
    }

    @Test
    void testChoicesWidgetExcludedLabel() {
        class ChoicesWidgetTestSettings implements DefaultNodeSettings {

            @Widget
            @ChoicesWidget(choices = TestChoicesProvider.class, excludedLabel = "Label for excluded columns.")
            ColumnFilter m_foo;

            @Widget
            @ChoicesWidget(choices = TestChoicesProvider.class)
            ColumnFilter m_bar;

        }
        var response = buildTestUiSchema(ChoicesWidgetTestSettings.class);
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("foo");
        assertThatJson(response).inPath("$.elements[0].options.excludedLabel").isString()
            .isEqualTo("Label for excluded columns.");
        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("bar");
        assertThatJson(response).inPath("$.elements[1].options.excludedLabel").isAbsent();
    }

    @Test
    void testThrowsIfNoChoicesAndNoChoicesUpdateHandlerIsDefined() {
        class ChoicesWidgetTestSettings implements DefaultNodeSettings {

            @Widget
            @ChoicesWidget
            ColumnFilter m_foo;

        }
        assertThrows(UiSchemaGenerationException.class, () -> buildTestUiSchema(ChoicesWidgetTestSettings.class));
    }

    @Test
    void testChoicesUpdateHandler() {
        @SuppressWarnings("unused")
        final class ChoicesWidgetTestSettings implements DefaultNodeSettings {

            @Widget
            Integer m_dependency;

            static final class Dependency {
                Integer m_dependency;
            }

            static class MyChoicesUpdateHandler implements ChoicesUpdateHandler<Dependency> {

                @Override
                public IdAndText[] update(final Dependency settings, final DefaultNodeSettingsContext context)
                    throws WidgetHandlerException {
                    throw new RuntimeException("Should not be called in this test");
                }

            }

            @Widget
            @ChoicesWidget(choicesUpdateHandler = MyChoicesUpdateHandler.class)
            ColumnFilter m_columnFilter;

        }
        var response = buildTestUiSchema(ChoicesWidgetTestSettings.class);
        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("columnFilter");
        assertThatJson(response).inPath("$.elements[1].options.choicesUpdateHandler").isString()
            .isEqualTo(ChoicesWidgetTestSettings.MyChoicesUpdateHandler.class.getName());
        assertThatJson(response).inPath("$.elements[1].options.dependencies").isArray().hasSize(1);
        assertThatJson(response).inPath("$.elements[1].options.setFirstValueOnUpdate").isBoolean().isTrue();
    }

    @Test
    void testChoicesUpdateHandlerWithoutSetFirstValue() {
        @SuppressWarnings("unused")
        final class ChoicesWidgetTestSettings implements DefaultNodeSettings {

            @Widget
            Integer m_dependency;

            static final class Dependency {
                Integer m_dependency;
            }

            static class MyChoicesUpdateHandlerWithoutSetFirstValue implements ChoicesUpdateHandler<Dependency> {

                @Override
                public boolean setFirstValueOnUpdate() {
                    return false;
                }

                @Override
                public IdAndText[] update(final Dependency settings, final DefaultNodeSettingsContext context)
                    throws WidgetHandlerException {
                    throw new RuntimeException("Should not be called in this test");
                }

            }

            @Widget
            @ChoicesWidget(choicesUpdateHandler = MyChoicesUpdateHandlerWithoutSetFirstValue.class)
            ColumnFilter m_columnFilter;

        }
        var response = buildTestUiSchema(ChoicesWidgetTestSettings.class);
        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("columnFilter");
        assertThatJson(response).inPath("$.elements[1].options.choicesUpdateHandler").isString()
            .isEqualTo(ChoicesWidgetTestSettings.MyChoicesUpdateHandlerWithoutSetFirstValue.class.getName());
        assertThatJson(response).inPath("$.elements[1].options.dependencies").isArray().hasSize(1);
        assertThatJson(response).inPath("$.elements[1].options.setFirstValueOnUpdate").isBoolean().isFalse();
    }

}
