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
 *   Mar 21, 2023 (Paul Bärnreuther): created
 */
package org.knime.core.webui.node.dialog.impl;

import static net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.LinkedHashMap;

import org.junit.jupiter.api.Test;
import org.knime.core.webui.node.dialog.ui.HorizontalLayout;
import org.knime.core.webui.node.dialog.ui.Layout;
import org.knime.core.webui.node.dialog.ui.LayoutGroup;
import org.knime.core.webui.node.dialog.ui.Section;
import org.knime.core.webui.node.dialog.ui.style.BooleanStyleProvider;
import org.knime.core.webui.node.dialog.ui.style.Style;

import com.fasterxml.jackson.core.JsonProcessingException;

/**
 *
 * @author Paul Bärnreuther
 */
@SuppressWarnings("java:S2698") // we accept assertions without messages
class JsonFormsUiSchemaUtilTest {
    interface TestSettingsLayout {
        @Section
        interface Section1 {
        }

        @Section(title = "Test section title", advanced = true)
        interface Section2 {
            @Section(title = "Nested section title")
            interface NestedSection {
            }
        }
    }

    @Layout(TestSettingsLayout.class)
    class DummySettings implements DefaultNodeSettings {

        @Layout(TestSettingsLayout.Section1.class)
        String m_setting1;

        @Layout(TestSettingsLayout.Section2.NestedSection.class)
        String m_setting2;
    }

    @Test
    void testSection() throws JsonProcessingException {
        final var settings = new LinkedHashMap<String, Class<? extends DefaultNodeSettings>>();
        settings.put("test", DummySettings.class);
        final var response = JsonFormsUiSchemaUtil.buildUISchema(settings);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[0].label").isString().isEqualTo("");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[1].label").isString().isEqualTo("Test section title");
        assertThatJson(response).inPath("$.elements[1].options.isAdvanced").isBoolean().isTrue();
        assertThatJson(response).inPath("$.elements[1].elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[1].elements[0].label").isString().isEqualTo("Nested section title");
    }

    class TestLayoutViewSettings implements DefaultNodeSettings {
        @Layout(TestSettingsLayout.Section1.class)
        String m_testViewSetting1;

        @Layout(TestSettingsLayout.Section2.class)
        String m_testViewSetting2;
    }

    class TestLayoutModelSettings implements DefaultNodeSettings {
        @Layout(TestSettingsLayout.Section1.class)
        String m_testModelSetting1;

        @Layout(TestSettingsLayout.Section2.NestedSection.class)
        String m_nestedModelSetting;
    }

    @Test
    void testLayout() throws JsonProcessingException {
        final var settings = new LinkedHashMap<String, Class<? extends DefaultNodeSettings>>();
        settings.put("model", TestLayoutModelSettings.class);
        settings.put("view", TestLayoutViewSettings.class);
        final var response = JsonFormsUiSchemaUtil.buildUISchema(settings);
        assertThatJson(response).inPath("$.elements[0].elements").isArray().hasSize(2);
        //Section1
        assertThatJson(response).inPath("$.elements[0].elements[0].scope").isString()
            .isEqualTo("#/properties/model/properties/testModelSetting1");
        assertThatJson(response).inPath("$.elements[0].elements[1].scope").isString()
            .isEqualTo("#/properties/view/properties/testViewSetting1");
        //Section2
        assertThatJson(response).inPath("$.elements[1].elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[1].elements[0].scope").isString()
            .isEqualTo("#/properties/view/properties/testViewSetting2");
        //NestedSection
        assertThatJson(response).inPath("$.elements[1].elements[1].elements").isArray().hasSize(1);
        assertThatJson(response).inPath("$.elements[1].elements[1].elements[0].scope").isString()
            .isEqualTo("#/properties/model/properties/nestedModelSetting");
    }

    class ClusterOfSettings implements LayoutGroup {
        String m_sub1;

        String m_sub2;
    }

    class ControlSetting {
        String m_sub1;

        String m_sub2;
    }

    class TestControlSettings implements DefaultNodeSettings {
        String m_normalSetting;

        ClusterOfSettings m_settingWithNestedUiElements;

        ControlSetting m_customSetting;
    }

    @Test
    void testAddsControlsWithCorrectScope() throws JsonProcessingException {
        final var settings = new LinkedHashMap<String, Class<? extends DefaultNodeSettings>>();
        settings.put("test", TestControlSettings.class);
        final var response = JsonFormsUiSchemaUtil.buildUISchema(settings);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(4);
        assertThatJson(response).inPath("$.elements[0].scope").isString()
            .isEqualTo("#/properties/test/properties/normalSetting");
        assertThatJson(response).inPath("$.elements[1].scope").isString()
            .isEqualTo("#/properties/test/properties/settingWithNestedUiElements/properties/sub1");
        assertThatJson(response).inPath("$.elements[2].scope").isString()
            .isEqualTo("#/properties/test/properties/settingWithNestedUiElements/properties/sub2");
        assertThatJson(response).inPath("$.elements[3].scope").isString()
            .isEqualTo("#/properties/test/properties/customSetting");
    }

    interface TestDefaultParentLayout {
        @Section
        interface DefaultSection {
        }

        @Section
        interface Section1 {
        }
    }

    @Layout(TestDefaultParentLayout.DefaultSection.class)
    class TestDefaultParentSettings implements DefaultNodeSettings {
        String m_defaultParentSetting;

        @Layout(TestDefaultParentLayout.Section1.class)
        String m_sectionSetting;

        ClusterOfSettings m_clusterOfSettingsDefaultParent;

        @Layout(TestDefaultParentLayout.Section1.class)
        ClusterOfSettings m_clusterOfSettingsInSection;
    }

    @Test
    void testDefaultParent() throws JsonProcessingException {
        final var settings = new LinkedHashMap<String, Class<? extends DefaultNodeSettings>>();
        settings.put("test", TestDefaultParentSettings.class);
        final var response = JsonFormsUiSchemaUtil.buildUISchema(settings);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        //Default Section
        assertThatJson(response).inPath("$.elements[0].elements").isArray().hasSize(3);
        assertThatJson(response).inPath("$.elements[0].elements[0].scope").isString()
            .isEqualTo("#/properties/test/properties/defaultParentSetting");
        assertThatJson(response).inPath("$.elements[0].elements[1].scope").isString()
            .isEqualTo("#/properties/test/properties/clusterOfSettingsDefaultParent/properties/sub1");
        assertThatJson(response).inPath("$.elements[0].elements[2].scope").isString()
            .isEqualTo("#/properties/test/properties/clusterOfSettingsDefaultParent/properties/sub2");
        //Section1
        assertThatJson(response).inPath("$.elements[1].elements").isArray().hasSize(3);
        assertThatJson(response).inPath("$.elements[1].elements[0].scope").isString()
            .isEqualTo("#/properties/test/properties/sectionSetting");
        assertThatJson(response).inPath("$.elements[1].elements[1].scope").isString()
            .isEqualTo("#/properties/test/properties/clusterOfSettingsInSection/properties/sub1");
        assertThatJson(response).inPath("$.elements[1].elements[2].scope").isString()
            .isEqualTo("#/properties/test/properties/clusterOfSettingsInSection/properties/sub2");
    }

    interface TestNoLayoutAnnotationLayout {

        @Section
        interface Section1 {
        }
    }

    class TestNoLayoutAnnotationSettings implements DefaultNodeSettings {

        String m_rootSetting;

        @Layout(TestNoLayoutAnnotationLayout.Section1.class)
        String m_sectionSetting;

    }

    @Test
    void testNoLayoutAnnotation() throws JsonProcessingException {
        final var settings = new LinkedHashMap<String, Class<? extends DefaultNodeSettings>>();
        settings.put("test", TestNoLayoutAnnotationSettings.class);
        final var response = JsonFormsUiSchemaUtil.buildUISchema(settings);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].scope").isString()
            .isEqualTo("#/properties/test/properties/rootSetting");
        //Section1
        assertThatJson(response).inPath("$.elements[1].elements").isArray().hasSize(1);
        assertThatJson(response).inPath("$.elements[1].elements[0].scope").isString()
            .isEqualTo("#/properties/test/properties/sectionSetting");
    }

    static class TestLayoutWithinSettingsSettings implements DefaultNodeSettings {
        @Section(title = "first")
        static interface Section1 {
        }

        @Section(title = "second")
        static interface Section2 {
        }

        @Layout(Section1.class)
        String m_foo;

        @Layout(Section2.class)
        String m_bar;
    }

    @Test
    void testLayoutWithinSettings() {
        final var settings = new LinkedHashMap<String, Class<? extends DefaultNodeSettings>>();
        settings.put("test", TestLayoutWithinSettingsSettings.class);
        final var response = JsonFormsUiSchemaUtil.buildUISchema(settings);

        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);

        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[0].label").isString().isEqualTo("first");
        assertThatJson(response).inPath("$.elements[0].elements").isArray().hasSize(1);
        assertThatJson(response).inPath("$.elements[0].elements[0].scope").isString()
            .isEqualTo("#/properties/test/properties/foo");

        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[1].label").isString().isEqualTo("second");
        assertThatJson(response).inPath("$.elements[1].elements").isArray().hasSize(1);
        assertThatJson(response).inPath("$.elements[1].elements[0].scope").isString()
            .isEqualTo("#/properties/test/properties/bar");
    }

    static class NoRootForSectionSettings implements DefaultNodeSettings {
        @Layout(SectionWithoutEnclosingClass.class)
        String m_foo;
    }

    @Test
    void testSingleLayoutPartWithoutRoot() {
        final var settings = new LinkedHashMap<String, Class<? extends DefaultNodeSettings>>();
        settings.put("test", NoRootForSectionSettings.class);
        var response = JsonFormsUiSchemaUtil.buildUISchema(settings);

        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[0].elements[0].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[0].elements[0].scope").isString()
            .isEqualTo("#/properties/test/properties/foo");
    }

    static class TestMultipleRootsOne implements DefaultNodeSettings {
        @Section
        static interface Section1 {
        }

        @Layout(Section1.class)
        String m_foo;
    }

    static class TestMultipleRootsTwo implements DefaultNodeSettings {

        @Layout(GeneralTestLayout.GeneralSection1.class)
        String m_bar;
    }

    @Test
    void testThrowsIfMultipleLayoutRootsAreDetected() {
        final var settings = new LinkedHashMap<String, Class<? extends DefaultNodeSettings>>();
        settings.put("model", TestMultipleRootsOne.class);
        settings.put("view", TestMultipleRootsTwo.class);
        assertThrows(UiSchemaGenerationException.class, () -> JsonFormsUiSchemaUtil.buildUISchema(settings));
    }

    static class TestFieldWithTwoLayoutAnnotationsSettings implements DefaultNodeSettings {

        @Section
        interface Section1 {
        }

        @Section
        interface Section2 {
        }

        @Layout(Section1.class)
        class SettingsType implements LayoutGroup {

        }

        @Layout(Section2.class)
        SettingsType m_settingWithTowAnnotations;
    }

    @Test
    void testThrowsIfThereIsAFieldAndAFieldClassAnnotationForAField() {
        final var settings = new LinkedHashMap<String, Class<? extends DefaultNodeSettings>>();
        settings.put("test", TestFieldWithTwoLayoutAnnotationsSettings.class);
        assertThrows(UiSchemaGenerationException.class, () -> JsonFormsUiSchemaUtil.buildUISchema(settings));
    }

    class DefaultStylesSettings implements DefaultNodeSettings {
        String m_string;

        boolean m_boolean;

        enum MyEnum {
                A, B, C
        }

        MyEnum m_enum;
    }

    @Test
    void testDefaultStyles() {
        final var settings = new LinkedHashMap<String, Class<? extends DefaultNodeSettings>>();
        settings.put("test", DefaultStylesSettings.class);
        final var response = JsonFormsUiSchemaUtil.buildUISchema(settings);
        assertThatJson(response).inPath("$.elements[0].scope").isString().contains("string");
        assertThatJson(response).inPath("$.elements[0]").isObject().doesNotContainKey("options");
        assertThatJson(response).inPath("$.elements[1].scope").isString().contains("boolean");
        assertThatJson(response).inPath("$.elements[1].options.format").isString().isEqualTo("checkbox");
        assertThatJson(response).inPath("$.elements[2].scope").isString().contains("enum");
        assertThatJson(response).inPath("$.elements[2].options.format").isString().isEqualTo("valueSwitch");
    }

    public static class OverridingBooleanStyleProvider extends BooleanStyleProvider {

        record Format(String format) {
        }

        @Override
        public Object getStyleObject() {
            return new Format("custom");
        }
    }

    public static class ExtendingBooleanStyleProvider extends BooleanStyleProvider {

        class OtherStyle {
            boolean m_otherOption = true;
        }

        @Override
        public Object getStyleObject() {
            return new OtherStyle();
        }

    }

    class StylesSettings implements DefaultNodeSettings {
        boolean m_bool;

        @Style({OverridingBooleanStyleProvider.class})
        boolean m_overriding;

        @Style({ExtendingBooleanStyleProvider.class})
        boolean m_extending;

        @Style({OverridingBooleanStyleProvider.class, ExtendingBooleanStyleProvider.class})
        boolean m_both;
    }

    @Test
    void testCustomStyles() {
        final var settings = new LinkedHashMap<String, Class<? extends DefaultNodeSettings>>();
        settings.put("test", StylesSettings.class);
        final var response = JsonFormsUiSchemaUtil.buildUISchema(settings);
        assertThatJson(response).inPath("$.elements[0].scope").isString()
            .isEqualTo("#/properties/test/properties/bool");
        assertThatJson(response).inPath("$.elements[0].options.format").isString().isEqualTo("checkbox");
        assertThatJson(response).inPath("$.elements[1].scope").isString()
            .isEqualTo("#/properties/test/properties/overriding");
        assertThatJson(response).inPath("$.elements[1].options.format").isString().isEqualTo("custom");
        assertThatJson(response).inPath("$.elements[2].scope").isString()
            .isEqualTo("#/properties/test/properties/extending");
        assertThatJson(response).inPath("$.elements[2].options.format").isString().isEqualTo("checkbox");
        assertThatJson(response).inPath("$.elements[2].options.otherOption").isBoolean().isTrue();
        assertThatJson(response).inPath("$.elements[3].scope").isString()
            .isEqualTo("#/properties/test/properties/both");
        assertThatJson(response).inPath("$.elements[3].options.format").isString().isEqualTo("custom");
        assertThatJson(response).inPath("$.elements[3].options.otherOption").isBoolean().isTrue();
    }

    class NonApplicableStyleSettings implements DefaultNodeSettings {
        @Style({ExtendingBooleanStyleProvider.class})
        String m_prop;
    }

    @Test
    void testThrowsIfCustomStyleIsNotApplicable() {
        final var settings = new LinkedHashMap<String, Class<? extends DefaultNodeSettings>>();
        settings.put("test", NonApplicableStyleSettings.class);
        assertThrows(UiSchemaGenerationException.class, () -> JsonFormsUiSchemaUtil.buildUISchema(settings));
    }

    static class MergeNestedStylesSettings implements DefaultNodeSettings {

        static class InnerClass {
            String m_foo;

            String m_bar;

            public InnerClass(final String foo, final String bar) {
                m_foo = foo;
                m_bar = bar;
            }
        }

        static class DeepStyleClass {
            InnerClass m_merged;
        }

        static class FirstDeepStyleProvider extends BooleanStyleProvider {
            @Override
            public Object getStyleObject() {
                final var styleObject = new DeepStyleClass();
                styleObject.m_merged = new InnerClass("foo", null);
                return styleObject;
            }

        }

        static class SecondDeepStyleProvider extends BooleanStyleProvider {
            @Override
            public Object getStyleObject() {
                final var styleObject = new DeepStyleClass();
                styleObject.m_merged = new InnerClass(null, "bar");
                return styleObject;
            }

        }

        @Style({FirstDeepStyleProvider.class, SecondDeepStyleProvider.class})
        boolean m_setting;
    }

    @Test
    void testMergeNestedStyles() {
        final var settings = new LinkedHashMap<String, Class<? extends DefaultNodeSettings>>();
        settings.put("test", MergeNestedStylesSettings.class);
        final var response = JsonFormsUiSchemaUtil.buildUISchema(settings);
        assertThatJson(response).inPath("$.elements[0].scope").isString()
            .isEqualTo("#/properties/test/properties/setting");
        assertThatJson(response).inPath("$.elements[0].options.merged.foo").isString().isEqualTo("foo");
        assertThatJson(response).inPath("$.elements[0].options.merged.bar").isString().isEqualTo("bar");
    }

    @Test
    void testVirtualSections() throws JsonProcessingException {
        interface TestVirtualSectionLayout {
            @Section(title = "Section1")
            interface Section1 {
            }

            interface Section2 { // A virtual section
            }

            @Section(title = "Section3")
            interface Section3 {
            }
        }

        class VirtualLayoutSettings implements DefaultNodeSettings {
            @Layout(TestVirtualSectionLayout.Section1.class)
            String m_setting1;

            @Layout(TestVirtualSectionLayout.Section2.class)
            String m_setting2;

            @Layout(TestVirtualSectionLayout.Section3.class)
            String m_setting3;
        }

        final var settings = new LinkedHashMap<String, Class<? extends DefaultNodeSettings>>();
        settings.put("test", VirtualLayoutSettings.class);
        final var response = JsonFormsUiSchemaUtil.buildUISchema(settings);

        assertThatJson(response).inPath("$.elements").isArray().hasSize(3);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[0].label").isString().isEqualTo("Section1");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[2].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[2].label").isString().isEqualTo("Section3");
    }

    @Test
    void testEmptySection() throws JsonProcessingException {
        interface TestEmptySectionLayout {
            @Section(title = "Section1")
            interface Section1 {
            }

            @Section(title = "Section2")
            interface Section2 {
            }
        }

        class TestEmptySectionSettings implements DefaultNodeSettings {
            @Layout(TestEmptySectionLayout.Section1.class)
            String m_setting1;
        }

        final var settings = new LinkedHashMap<String, Class<? extends DefaultNodeSettings>>();
        settings.put("test", TestEmptySectionSettings.class);
        final var response = JsonFormsUiSchemaUtil.buildUISchema(settings);

        assertThatJson(response).inPath("$.elements").isArray().hasSize(1);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[0].label").isString().isEqualTo("Section1");
    }

    @Test
    void testHorizontalLayout() {
        interface TestHorizontalLayout {

            @HorizontalLayout
            interface HorizontalGroup {
            }
        }

        class TestHorizontalLayoutSettings implements DefaultNodeSettings {
            @Layout(TestHorizontalLayout.HorizontalGroup.class)
            String m_setting1;

            @Layout(TestHorizontalLayout.HorizontalGroup.class)
            String m_setting2;
        }

        final var settings = new LinkedHashMap<String, Class<? extends DefaultNodeSettings>>();
        settings.put("test", TestHorizontalLayoutSettings.class);
        final var response = JsonFormsUiSchemaUtil.buildUISchema(settings);

        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("HorizontalLayout");
        assertThatJson(response).inPath("$.elements[0].elements[0].scope").isString()
            .isEqualTo("#/properties/test/properties/setting1");
        assertThatJson(response).inPath("$.elements[0].elements[1].scope").isString()
            .isEqualTo("#/properties/test/properties/setting2");
    }
}