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
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.JsonFormsUiSchemaUtilTest.buildTestUiSchema;
import static org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.JsonFormsUiSchemaUtilTest.buildUiSchema;

import java.time.LocalDate;
import java.util.LinkedHashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.knime.core.data.DataColumnSpec;
import org.knime.core.data.DataColumnSpecCreator;
import org.knime.core.data.DataTableSpec;
import org.knime.core.data.def.DoubleCell;
import org.knime.core.data.def.StringCell;
import org.knime.core.node.port.PortObjectSpec;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.JsonFormsConsts.UiSchema.Format;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.schema.JsonFormsSchemaUtil;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.TestButtonActionHandler.TestStates;
import org.knime.core.webui.node.dialog.defaultdialog.layout.LayoutGroup;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnfilter.ColumnFilter;
import org.knime.core.webui.node.dialog.defaultdialog.setting.columnselection.ColumnSelection;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ArrayWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ChoicesWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ColumnChoicesProvider;
import org.knime.core.webui.node.dialog.defaultdialog.widget.DateTimeWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.DateWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.RadioButtonsWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.RichTextInputWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.ValueSwitchWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonChange;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonUpdateHandler;
import org.knime.core.webui.node.dialog.defaultdialog.widget.button.ButtonWidget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.handler.DeclaringDefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.widget.handler.WidgetHandlerException;

/**
 *
 * This tests the functionality of the {@link JsonFormsSchemaUtil} to set default options depending on types of fields
 * as well as options coming from widget annotations.
 *
 * @author Paul Bärnreuther
 */
@SuppressWarnings("java:S2698") // we accept assertions without messages
class JsonFormsUiSchemaUtilOptionsTest {

    @Test
    void testDefaultFormats() {
        class DefaultStylesSettings implements DefaultNodeSettings {
            String m_string;

            boolean m_boolean;

            enum MyEnum {
                    A, B, C
            }

            MyEnum m_enum;

            ColumnFilter m_columnFilter;

            ColumnSelection m_columnSelection;

            LocalDate m_localDate;
        }
        var response = buildTestUiSchema(DefaultStylesSettings.class);
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("string");
        assertThatJson(response).inPath("$.elements[0]").isObject().doesNotContainKey("options");
        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("boolean");
        assertThatJson(response).inPath("$.elements[1].options.format").isString().isEqualTo("checkbox");
        assertThatJson(response).inPath("$.elements[2].scope").isString().contains("enum");
        assertThatJson(response).inPath("$.elements[2]").isObject().doesNotContainKey("options");
        assertThatJson(response).inPath("$.elements[3].scope").isString().contains("columnFilter");
        assertThatJson(response).inPath("$.elements[3].options.format").isString().isEqualTo("columnFilter");
        assertThatJson(response).inPath("$.elements[4].scope").isString().contains("columnSelection");
        assertThatJson(response).inPath("$.elements[4].options.format").isString().isEqualTo("columnSelection");
        assertThatJson(response).inPath("$.elements[5].scope").isString().contains("localDate");
        assertThatJson(response).inPath("$.elements[5].options.format").isString().isEqualTo("date-time");
        assertThatJson(response).inPath("$.elements[5].options.showTime").isBoolean().isFalse();
        assertThatJson(response).inPath("$.elements[5].options.showSeconds").isBoolean().isFalse();
        assertThatJson(response).inPath("$.elements[5].options.showMilliseconds").isBoolean().isFalse();
    }

    @Test
    void testChoicesWidgetFormats() {
        class ChoicesWidgetFormatSettings {
            @ChoicesWidget
            String m_stringDropDown;

            @ChoicesWidget
            ColumnSelection m_columnSelectDropDown;

            @ChoicesWidget
            ColumnFilter m_columnFilterDropDown;
        }

        var response = buildTestUiSchema(ChoicesWidgetFormatSettings.class);

        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("stringDropDown");
        assertThatJson(response).inPath("$.elements[0].options").isObject().containsKey("format");
        assertThatJson(response).inPath("$.elements[0].options.format").isString().isEqualTo(Format.DROP_DOWN);

        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("columnSelectDropDown");
        assertThatJson(response).inPath("$.elements[1].options").isObject().containsKey("format");
        assertThatJson(response).inPath("$.elements[1].options.format").isString().isEqualTo(Format.COLUMN_SELECTION);

        assertThatJson(response).inPath("$.elements[2].scope").isString().contains("columnFilterDropDown");
        assertThatJson(response).inPath("$.elements[2].options").isObject().containsKey("format");
        assertThatJson(response).inPath("$.elements[2].options.format").isString().isEqualTo(Format.COLUMN_FILTER);
    }

    @Test
    void testAdvancedSettings() {
        class AdvancedSettings implements DefaultNodeSettings {

            @Widget(advanced = true)
            ColumnSelection m_foo;

            @Widget()
            ColumnSelection m_bar;

        }
        var response = buildTestUiSchema(AdvancedSettings.class);
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("foo");
        assertThatJson(response).inPath("$.elements[0].options.isAdvanced").isBoolean().isTrue();
        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("bar");
        assertThatJson(response).inPath("$.elements[1]").isObject().doesNotContainKey("isAdvanced");
    }

    @Test
    void testRadioButtonWidget() {
        class RadioButtonsSettings implements DefaultNodeSettings {

            enum MyEnum {
                    A, B, C
            }

            @RadioButtonsWidget()
            MyEnum m_foo;

            @RadioButtonsWidget(horizontal = true)
            MyEnum m_bar;

            @RadioButtonsWidget(horizontal = false)
            MyEnum m_baz;

        }
        var response = buildTestUiSchema(RadioButtonsSettings.class);
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("foo");
        assertThatJson(response).inPath("$.elements[0].options.format").isString().isEqualTo("radio");
        assertThatJson(response).inPath("$.elements[0].options.radioLayout").isString().isEqualTo("vertical");
        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("bar");
        assertThatJson(response).inPath("$.elements[1].options.format").isString().isEqualTo("radio");
        assertThatJson(response).inPath("$.elements[1].options.radioLayout").isString().isEqualTo("horizontal");
        assertThatJson(response).inPath("$.elements[2].scope").isString().contains("baz");
        assertThatJson(response).inPath("$.elements[2].options.format").isString().isEqualTo("radio");
        assertThatJson(response).inPath("$.elements[2].options.radioLayout").isString().isEqualTo("vertical");
    }

    @Test
    void testValueSwitchWidget() {
        class ValueSwitchSettings implements DefaultNodeSettings {

            enum MyEnum {
                    A, B, C
            }

            @ValueSwitchWidget
            MyEnum m_foo;
        }

        var response = buildTestUiSchema(ValueSwitchSettings.class);
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("foo");
        assertThatJson(response).inPath("$.elements[0].options.format").isString().isEqualTo("valueSwitch");
    }

    static class TestColumnChoicesProvider implements ColumnChoicesProvider {

        @Override
        public DataColumnSpec[] columnChoices(final DefaultNodeSettingsContext context) {
            return ((DataTableSpec)context.getPortObjectSpec(0).get()).stream().toArray(DataColumnSpec[]::new);
        }
    }

    static class TestChoicesProvider implements ChoicesProvider {
        /**
         * {@inheritDoc}
         */
        @Override
        public String[] choices(final DefaultNodeSettingsContext context) {
            return new String[]{"column1", "column2"};
        }
    }

    class ChoicesSettings implements DefaultNodeSettings {

        @ChoicesWidget(showNoneColumn = true, choices = TestColumnChoicesProvider.class)
        ColumnSelection m_foo;

        @ChoicesWidget(choices = TestChoicesProvider.class)
        String m_bar;

    }

    @Test
    void testChoicesWidget() {

        DefaultNodeSettingsContext DefaultNodeSettingsContext = new DefaultNodeSettingsContext(
            new PortObjectSpec[]{new DataTableSpec(new DataColumnSpecCreator("column1", StringCell.TYPE).createSpec(), //
                new DataColumnSpecCreator("column2", DoubleCell.TYPE).createSpec())},
            null, null);

        var response = buildTestUiSchema(ChoicesSettings.class, DefaultNodeSettingsContext);
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
    }

    @Test
    void testChoicesWidgetWitoutDefaultNodeSettingsContext() {

        var response = buildTestUiSchema(ChoicesSettings.class, null);
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("foo");
        assertThatJson(response).inPath("$.elements[0].options.showNoneColumn").isBoolean().isTrue();
        assertThatJson(response).inPath("$.elements[0].options.possibleValues").isArray().isEmpty();
        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("bar");
        assertThatJson(response).inPath("$.elements[1].options.possibleValues").isArray().isEmpty();

    }

    @Test
    void testFormatForChoicesWidget() {

        @SuppressWarnings("unused")
        class SeveralChoicesSettings implements DefaultNodeSettings {
            @ChoicesWidget
            ColumnSelection m_columnSelection;

            @ChoicesWidget
            ColumnFilter m_columnFilter;

            @ChoicesWidget
            String[] m_stringArray;

            @ChoicesWidget
            String m_string;

            enum MyEnum {
                    A, B, C
            }

            @ChoicesWidget
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

    @Test
    void testChoicesWidgetShowNoneColumn() {
        class ChoicesWidgetTestSettings implements DefaultNodeSettings {

            @ChoicesWidget(showNoneColumn = true)
            ColumnSelection m_foo;

            @ChoicesWidget()
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

            @ChoicesWidget(showRowKeysColumn = true)
            ColumnSelection m_foo;

            @ChoicesWidget()
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

            @ChoicesWidget(showSearch = false)
            ColumnSelection m_foo;

            @ChoicesWidget()
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

            @ChoicesWidget(showMode = false)
            ColumnSelection m_foo;

            @ChoicesWidget()
            ColumnSelection m_bar;

        }
        var response = buildTestUiSchema(ChoicesWidgetTestSettings.class);
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("foo");
        assertThatJson(response).inPath("$.elements[0].options.showMode").isBoolean().isFalse();
        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("bar");
        assertThatJson(response).inPath("$.elements[1].options.showMode").isBoolean().isTrue();
    }

    @Test
    void testThrowsIfIsNotApplicable() {
        class NonApplicableStyleSettings implements DefaultNodeSettings {
            @RadioButtonsWidget()
            String m_prop;
        }
        assertThrows(UiSchemaGenerationException.class, () -> buildTestUiSchema(NonApplicableStyleSettings.class));
    }

    @Test
    void testShowSortButtonsTest() {
        class ArrayElement {
            String m_field1;

            int m_field2;
        }

        class ShowSortButtonsTestSettings {
            @ArrayWidget
            ArrayElement[] m_arrayElementNoSortButtons;

            @ArrayWidget(showSortButtons = true)
            ArrayElement[] m_arrayElementWithSortButtons;
        }

        var response = buildTestUiSchema(ShowSortButtonsTestSettings.class);
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("arrayElementNoSortButtons");
        assertThatJson(response).inPath("$.elements[0].options").isObject().doesNotContainKey("showSortButtons");
        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("arrayElementWithSortButtons");
        assertThatJson(response).inPath("$.elements[1].options").isObject().containsKey("showSortButtons");
        assertThatJson(response).inPath("$.elements[1].options.showSortButtons").isBoolean().isTrue();
    }

    @Test
    void testHideTitle() {
        class HideTitleSettings {
            @Widget(title = "foo1")
            String m_foo1;

            @Widget(title = "foo2", hideTitle = true)
            String m_foo2;
        }

        var response = buildTestUiSchema(HideTitleSettings.class);
        assertThatJson(response).inPath("$.elements[0]").isObject().doesNotContainKey("label");
        assertThatJson(response).inPath("$.elements[1]").isObject().containsKey("label");
        assertThatJson(response).inPath("$.elements[1].label").isString().isEqualTo("");
    }

    static class EmptyButtonTestSettings {

    }

    static class ButtonActionHandlerWithoutDependencies extends TestButtonActionHandler<EmptyButtonTestSettings> {

    }

    @Test
    void testDefaultButtonWidgetOptions() {
        class ButtonWidgetDefaultTestSettings {

            @ButtonWidget(actionHandler = ButtonActionHandlerWithoutDependencies.class)
            String m_foo;
        }

        var response = buildTestUiSchema(ButtonWidgetDefaultTestSettings.class);
        assertThatJson(response).inPath("$.elements[0]").isObject().containsKey("options");
        assertThatJson(response).inPath("$.elements[0].options.actionHandler").isString()
            .isEqualTo(ButtonActionHandlerWithoutDependencies.class.getName());
        assertThatJson(response).inPath("$.elements[0].options.format").isString().isEqualTo("button");
        assertThatJson(response).inPath("$.elements[0].options.states").isArray().hasSize(3);
        assertThatJson(response).inPath("$.elements[0].options.displayErrorMessage").isBoolean().isTrue();
        assertThatJson(response).inPath("$.elements[0].options.showTitleAndDescription").isBoolean().isTrue();
        assertThatJson(response).inPath("$.elements[0].options.dependencies").isArray().hasSize(0);
    }

    @Test
    void testButtonWidgetOptions() {
        class ButtonWidgetOptionsTestSettings {
            @ButtonWidget(actionHandler = ButtonActionHandlerWithoutDependencies.class, displayErrorMessage = false,
                showTitleAndDescription = false)
            String m_foo;
        }
        var response = buildTestUiSchema(ButtonWidgetOptionsTestSettings.class);
        assertThatJson(response).inPath("$.elements[0]").isObject().containsKey("options");
        assertThatJson(response).inPath("$.elements[0].options.actionHandler").isString()
            .isEqualTo(ButtonActionHandlerWithoutDependencies.class.getName());
        assertThatJson(response).inPath("$.elements[0].options.format").isString().isEqualTo("button");
        assertThatJson(response).inPath("$.elements[0].options.states").isArray().hasSize(3);
        assertThatJson(response).inPath("$.elements[0].options.displayErrorMessage").isBoolean().isFalse();
        assertThatJson(response).inPath("$.elements[0].options.showTitleAndDescription").isBoolean().isFalse();
        assertThatJson(response).inPath("$.elements[0].options.dependencies").isArray().hasSize(0);
        assertThatJson(response).inPath("$.elements[0].options").isObject().doesNotContainKey("updateOptions");
    }

    @Test
    void testButtonStates() {
        class ButtonWidgetDefaultTestSettings {
            @ButtonWidget(actionHandler = ButtonActionHandlerWithoutDependencies.class)
            String m_foo;
        }

        var response = buildTestUiSchema(ButtonWidgetDefaultTestSettings.class);
        assertThatJson(response).inPath("$.elements[0].options.states").isArray().hasSize(3);

        assertThatJson(response).inPath("$.elements[0].options.states[0]").isObject().containsKey("id")
            .containsKey("disabled").containsKey("primary").containsKey("nextState").containsKey("text");
        assertThatJson(response).inPath("$.elements[0].options.states[0].id").isString()
            .isEqualTo(TestStates.READY.toString());
        assertThatJson(response).inPath("$.elements[0].options.states[0].disabled").isBoolean().isTrue();
        assertThatJson(response).inPath("$.elements[0].options.states[0].primary").isBoolean().isFalse();
        assertThatJson(response).inPath("$.elements[0].options.states[0].nextState").isString()
            .isEqualTo(TestStates.CANCEL.toString());
        // Test fallback to defaultText() in @ButtonState
        assertThatJson(response).inPath("$.elements[0].options.states[0].text").isString().isEqualTo("Ready");

        assertThatJson(response).inPath("$.elements[0].options.states[1]").isObject().containsKey("id")
            .containsKey("disabled").containsKey("primary").containsKey("text").doesNotContainKey("nextState");
        assertThatJson(response).inPath("$.elements[0].options.states[1].id").isString()
            .isEqualTo(TestStates.CANCEL.toString());
        assertThatJson(response).inPath("$.elements[0].options.states[1].disabled").isBoolean().isFalse();
        assertThatJson(response).inPath("$.elements[0].options.states[1].primary").isBoolean().isFalse();
        assertThatJson(response).inPath("$.elements[0].options.states[1].text").isString().isEqualTo("Cancel Text");

        assertThatJson(response).inPath("$.elements[0].options.states[2]").isObject().containsKey("id")
            .containsKey("disabled").containsKey("primary").containsKey("text").doesNotContainKey("nextState");
        assertThatJson(response).inPath("$.elements[0].options.states[2].id").isString()
            .isEqualTo(TestStates.DONE.toString());
        assertThatJson(response).inPath("$.elements[0].options.states[2].disabled").isBoolean().isTrue();
        assertThatJson(response).inPath("$.elements[0].options.states[2].primary").isBoolean().isTrue();
        assertThatJson(response).inPath("$.elements[0].options.states[2].text").isString().isEqualTo("Done Text");
    }

    static class GroupOfSettings implements LayoutGroup {
        String m_sub1;

        String m_sub2;
    }

    class ButtonWidgetWithDependenciesTestSettings {
        @ButtonWidget(actionHandler = ButtonActionHandlerWithDependencies.class,
            updateHandler = ButtonUpdateHandlerWithDependencies.class)
        String m_foo;

        Boolean m_otherSetting1;

        ColumnFilter m_otherSetting2;

        GroupOfSettings m_otherSetting3;

        String m_otherSetting4;
    }

    static class OtherGroupOfSettings implements LayoutGroup {
        String m_sub2;
    }

    static class OtherSettings {
        String m_foo;

        Boolean m_otherSetting1;

        ColumnFilter m_otherSetting2;

        OtherGroupOfSettings m_otherSetting3;

    }

    static class ButtonActionHandlerWithDependencies extends TestButtonActionHandler<OtherSettings> {

    }

    static class ButtonUpdateHandlerWithDependencies
        implements ButtonUpdateHandler<String, OtherSettings, TestButtonActionHandler.TestStates> {

        @Override
        public ButtonChange<String, TestStates> update(final OtherSettings settings,
            final DefaultNodeSettingsContext context) throws WidgetHandlerException {
            return null;
        }

    }

    @Test
    void testButtonWidgetDependencies() {
        var response = buildTestUiSchema(ButtonWidgetWithDependenciesTestSettings.class);
        assertThatJson(response).inPath("$.elements[0]").isObject().containsKey("options");
        assertThatJson(response).inPath("$.elements[0].options.dependencies").isArray().hasSize(3);
        assertThatJson(response).inPath("$.elements[0].options.dependencies[0]").isString()
            .isEqualTo("#/properties/test/properties/otherSetting1");
        assertThatJson(response).inPath("$.elements[0].options.dependencies[1]").isString()
            .isEqualTo("#/properties/test/properties/otherSetting2");
        assertThatJson(response).inPath("$.elements[0].options.dependencies[2]").isString()
            .isEqualTo("#/properties/test/properties/otherSetting3/properties/sub2");
    }

    @Test
    void testButtonWidgetUpdateDependencies() {
        var response = buildTestUiSchema(ButtonWidgetWithDependenciesTestSettings.class);
        assertThatJson(response).inPath("$.elements[0]").isObject().containsKey("options");
        assertThatJson(response).inPath("$.elements[0].options.updateOptions.updateHandler").isString()
            .isEqualTo(ButtonUpdateHandlerWithDependencies.class.getName());
        assertThatJson(response).inPath("$.elements[0].options.updateOptions.dependencies").isArray().hasSize(3);

    }

    class ButtonWidgetWithMissingDependenciesTestSettings {
        @ButtonWidget(actionHandler = ButtonActionHandlerWithMissingDependencies.class)
        String m_foo;

        Boolean m_otherSetting1;
    }

    static class OtherSettingsWithMissing {
        Boolean m_otherSetting1;

        ColumnFilter m_missingSetting;

    }

    static class ButtonActionHandlerWithMissingDependencies extends TestButtonActionHandler<OtherSettingsWithMissing> {

    }

    @Test
    void testThrowsForButtonWidgetWithMissingDependencies() {
        assertThrows(UiSchemaGenerationException.class,
            () -> buildTestUiSchema(ButtonWidgetWithMissingDependenciesTestSettings.class));
    }

    class ButtonWidgetWithAmbigousDependenciesTestSettings implements DefaultNodeSettings {
        @ButtonWidget(actionHandler = ButtonActionHandlerWithAmbiguousDependencies.class)
        String m_foo;

        Boolean m_otherSetting1;
    }

    class SecondSettings implements DefaultNodeSettings {

        Boolean m_otherSetting1;
    }

    static class OtherSettingsWithAmbigous {
        Boolean m_otherSetting1;

    }

    static class ButtonActionHandlerWithAmbiguousDependencies
        extends TestButtonActionHandler<OtherSettingsWithAmbigous> {

    }

    @Test
    void testThrowsForButtonWidgetWithAmbigousDependencies() {
        final Map<String, Class<?>> settingsClasses =
            Map.of("foo", ButtonWidgetWithAmbigousDependenciesTestSettings.class, "bar", SecondSettings.class);
        assertThrows(UiSchemaGenerationException.class, () -> buildUiSchema(settingsClasses));
    }

    class ButtonWidgetWithDisAmbigousDependenciesTestSettings {
        @ButtonWidget(actionHandler = TestButtonActionHandlerWithDisAmbiguousDependencies.class)
        String m_foo;

        Boolean m_otherSetting1;
    }

    static class OtherSettingsWithSpecification {

        @DeclaringDefaultNodeSettings(SecondSettings.class)
        Boolean m_otherSetting1;

    }

    static class TestButtonActionHandlerWithDisAmbiguousDependencies
        extends TestButtonActionHandler<OtherSettingsWithSpecification> {

    }

    @Test
    void testButtonWidgetWithAmbigousDependenciesUsingSpecifyingContainingClass() {
        final var settingsClasses = new LinkedHashMap<String, Class<?>>();
        settingsClasses.put("foo", ButtonWidgetWithDisAmbigousDependenciesTestSettings.class);
        settingsClasses.put("bar", SecondSettings.class);
        var response = buildUiSchema(settingsClasses);
        assertThatJson(response).inPath("$.elements[0]").isObject().containsKey("options");
        assertThatJson(response).inPath("$.elements[0].options.dependencies").isArray().hasSize(1);
        assertThatJson(response).inPath("$.elements[0].options.dependencies[0]").isString()
            .isEqualTo("#/properties/bar/properties/otherSetting1");
    }

    class ButtonWidgetWithWrongTypeDependenciesTestSettings {
        @ButtonWidget(actionHandler = TestButtonActionHandlerWithWrongType.class)
        String m_foo;

        Boolean m_otherSetting1;
    }

    static class OtherSettingsWithWrongType {
        String m_otherSetting1;
    }

    static class TestButtonActionHandlerWithWrongType extends TestButtonActionHandler<OtherSettingsWithWrongType> {

    }

    @Test
    void testThrowForButtonWidgetWithDependenciesWithConflictingTypes() {
        assertThrows(UiSchemaGenerationException.class,
            () -> buildTestUiSchema(ButtonWidgetWithWrongTypeDependenciesTestSettings.class));
    }

    @Test
    void testDateTimeWidgetDefaultOptions() {
        class DateTimeDefaultTestSettings {

            @DateTimeWidget
            String m_dateTime;
        }

        var response = buildTestUiSchema(DateTimeDefaultTestSettings.class);
        assertThatJson(response).inPath("$.elements[0]").isObject().containsKey("options");
        assertThatJson(response).inPath("$.elements[0].options.format").isString().isEqualTo("date-time");
        assertThatJson(response).inPath("$.elements[0].options.showTime").isBoolean().isFalse();
        assertThatJson(response).inPath("$.elements[0].options.showSeconds").isBoolean().isFalse();
        assertThatJson(response).inPath("$.elements[0].options.showMilliseconds").isBoolean().isFalse();
        assertThatJson(response).inPath("$.elements[0].options").isObject().doesNotContainKey("dateFormat");
        assertThatJson(response).inPath("$.elements[0].options").isObject().doesNotContainKey("timezone");
        assertThatJson(response).inPath("$.elements[0].options").isObject().doesNotContainKey("minimum");
        assertThatJson(response).inPath("$.elements[0].options").isObject().doesNotContainKey("maximum");
    }

    @Test
    void testDateTimeWidgetCustomOptions() {
        class DateTimeDefaultTestSettings {

            @DateTimeWidget(showTime = true, showSeconds = true, showMilliseconds = true, minDate = "2023-06-12",
                maxDate = "2023-06-14", timezone = "America/Dawson_Creek")
            String m_dateTime;
        }

        var response = buildTestUiSchema(DateTimeDefaultTestSettings.class);
        assertThatJson(response).inPath("$.elements[0]").isObject().containsKey("options");
        assertThatJson(response).inPath("$.elements[0].options.format").isString().isEqualTo("date-time");
        assertThatJson(response).inPath("$.elements[0].options.showTime").isBoolean().isTrue();
        assertThatJson(response).inPath("$.elements[0].options.showSeconds").isBoolean().isTrue();
        assertThatJson(response).inPath("$.elements[0].options.showMilliseconds").isBoolean().isTrue();
        assertThatJson(response).inPath("$.elements[0].options.timezone").isString().isEqualTo("America/Dawson_Creek");
        assertThatJson(response).inPath("$.elements[0].options.minimum").isString().isEqualTo("2023-06-12");
        assertThatJson(response).inPath("$.elements[0].options.maximum").isString().isEqualTo("2023-06-14");
    }

    @Test
    void testDateWidgetOptions() {
        class DateTimeDefaultTestSettings {

            @DateWidget(minDate = "2023-06-12", maxDate = "2023-06-14")
            LocalDate m_date;
        }

        var response = buildTestUiSchema(DateTimeDefaultTestSettings.class);
        assertThatJson(response).inPath("$.elements[0]").isObject().containsKey("options");
        assertThatJson(response).inPath("$.elements[0].options.minimum").isString().isEqualTo("2023-06-12");
        assertThatJson(response).inPath("$.elements[0].options.maximum").isString().isEqualTo("2023-06-14");
    }

    @Test
    void testRichTextInputWidget() {
        class RichTextInputWidgetSettings {
            @RichTextInputWidget
            String m_richTextContent;
        }

        var response = buildTestUiSchema(RichTextInputWidgetSettings.class);
        assertThatJson(response).inPath("$.elements[0]").isObject().containsKey("options");
        assertThatJson(response).inPath("$.elements[0].options.format").isString().isEqualTo("richTextInput");
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("richTextContent");
    }

}
