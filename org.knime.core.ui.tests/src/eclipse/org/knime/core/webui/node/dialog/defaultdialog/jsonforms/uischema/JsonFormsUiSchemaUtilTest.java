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
package org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema;

import static net.javacrumbs.jsonunit.assertj.JsonAssertions.assertThatJson;
import static org.junit.jupiter.api.Assertions.assertThrows;

import java.util.LinkedHashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.knime.core.webui.node.dialog.SettingsType;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings.DefaultNodeSettingsContext;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.JsonFormsUiSchemaUtilTest.SuperclassAnnotationTestLayout.AfterCenterLayout;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.JsonFormsUiSchemaUtilTest.SuperclassAnnotationTestLayout.BeforeCenterLayout;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.JsonFormsUiSchemaUtilTest.SuperclassAnnotationTestLayout.CenterLayoutExtended;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.TestLayout.FirstSection;
import org.knime.core.webui.node.dialog.defaultdialog.jsonforms.uischema.TestLayout.SecondSection;
import org.knime.core.webui.node.dialog.defaultdialog.layout.After;
import org.knime.core.webui.node.dialog.defaultdialog.layout.Before;
import org.knime.core.webui.node.dialog.defaultdialog.layout.CheckboxesWithVennDiagram;
import org.knime.core.webui.node.dialog.defaultdialog.layout.HorizontalLayout;
import org.knime.core.webui.node.dialog.defaultdialog.layout.Inside;
import org.knime.core.webui.node.dialog.defaultdialog.layout.Layout;
import org.knime.core.webui.node.dialog.defaultdialog.layout.Section;
import org.knime.core.webui.node.dialog.defaultdialog.layout.VerticalLayout;
import org.knime.core.webui.node.dialog.defaultdialog.layout.WidgetGroup;
import org.knime.core.webui.node.dialog.defaultdialog.persistence.PersistableSettings;
import org.knime.core.webui.node.dialog.defaultdialog.widget.Widget;
import org.knime.core.webui.node.dialog.defaultdialog.widget.choices.impl.AsyncChoicesHolder;
import org.knime.core.webui.node.dialog.defaultdialog.widgettree.WidgetTreeFactory;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 *
 * @author Paul Bärnreuther
 */
@SuppressWarnings("java:S2698") // we accept assertions without messages
class JsonFormsUiSchemaUtilTest {

    static ObjectNode buildUiSchema(final Map<SettingsType, Class<? extends WidgetGroup>> settings) {
        return buildUiSchema(settings, null, new AsyncChoicesHolder());
    }

    static ObjectNode buildUiSchema(final Map<SettingsType, Class<? extends WidgetGroup>> settings,
        final DefaultNodeSettingsContext context, final AsyncChoicesHolder asyncChoicesHolder) {
        return JsonFormsUiSchemaUtil.buildUISchema(settings.entrySet().stream()
            .map(e -> new WidgetTreeFactory().createTree(e.getValue(), e.getKey())).toList(), context,
            asyncChoicesHolder);
    }

    static ObjectNode buildTestUiSchema(final Class<? extends DefaultNodeSettings> settingsClass) {
        return buildUiSchema(Map.of(SettingsType.MODEL, settingsClass));
    }

    static ObjectNode buildTestUiSchema(final Class<? extends DefaultNodeSettings> settingsClass,
        final DefaultNodeSettingsContext context) {
        return buildTestUiSchema(settingsClass, context, new AsyncChoicesHolder());
    }

    static ObjectNode buildTestUiSchema(final Class<? extends DefaultNodeSettings> settingsClass,
        final DefaultNodeSettingsContext context, final AsyncChoicesHolder asyncChoicesHolder) {
        return buildUiSchema(Map.of(SettingsType.MODEL, settingsClass), context, asyncChoicesHolder);
    }

    interface TestSettingsLayout {
        @Section
        interface Section1 {
        }

        @Section(title = "Test section title", description = "Test section description", advanced = true)
        interface Section2 {
            @Section(title = "Nested section title")
            interface NestedSection {
            }
        }
    }

    @Layout(TestSettingsLayout.class)
    class DummySettings implements DefaultNodeSettings {

        @Widget(title = "", description = "")
        @Layout(TestSettingsLayout.Section1.class)
        String m_setting1;

        @Widget(title = "", description = "")
        @Layout(TestSettingsLayout.Section2.NestedSection.class)
        String m_setting2;
    }

    @Test
    void testSection() throws JsonProcessingException {
        final var response = buildTestUiSchema(DummySettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[0].label").isString().isEqualTo("");
        assertThatJson(response).inPath("$.elements[0]").isObject().doesNotContainKey("description");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[1].label").isString().isEqualTo("Test section title");
        assertThatJson(response).inPath("$.elements[1].description").isString().isEqualTo("Test section description");
        assertThatJson(response).inPath("$.elements[1].options.isAdvanced").isBoolean().isTrue();
        assertThatJson(response).inPath("$.elements[1].elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[1].elements[0].label").isString().isEqualTo("Nested section title");
    }

    class TestLayoutViewSettings implements DefaultNodeSettings {
        @Widget(title = "", description = "")
        @Layout(TestSettingsLayout.Section1.class)
        String m_testViewSetting1;

        @Widget(title = "", description = "")
        @Layout(TestSettingsLayout.Section2.class)
        String m_testViewSetting2;
    }

    class TestLayoutModelSettings implements DefaultNodeSettings {
        @Widget(title = "", description = "")
        @Layout(TestSettingsLayout.Section1.class)
        String m_testModelSetting1;

        @Widget(title = "", description = "")
        @Layout(TestSettingsLayout.Section2.NestedSection.class)
        String m_nestedModelSetting;
    }

    @Test
    void testLayout() throws JsonProcessingException {
        final var settings = new LinkedHashMap<SettingsType, Class<? extends WidgetGroup>>();
        settings.put(SettingsType.MODEL, TestLayoutModelSettings.class);
        settings.put(SettingsType.VIEW, TestLayoutViewSettings.class);
        final var response = buildUiSchema(settings);
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

    class ClusterOfSettings implements WidgetGroup {
        @Widget(title = "", description = "")
        String m_sub1;

        @Widget(title = "", description = "")
        String m_sub2;
    }

    class ControlSetting {
        String m_sub1;

        String m_sub2;
    }

    class TestControlSettings implements DefaultNodeSettings {
        @Widget(title = "", description = "")
        String m_normalSetting;

        ClusterOfSettings m_settingWithNestedUiElements;

        @Widget(title = "", description = "")
        ControlSetting m_customSetting;
    }

    @Test
    void testAddsControlsWithCorrectScope() throws JsonProcessingException {
        final var response = buildTestUiSchema(TestControlSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(4);
        assertThatJson(response).inPath("$.elements[0].scope").isString()
            .isEqualTo("#/properties/model/properties/normalSetting");
        assertThatJson(response).inPath("$.elements[1].scope").isString()
            .isEqualTo("#/properties/model/properties/settingWithNestedUiElements/properties/sub1");
        assertThatJson(response).inPath("$.elements[2].scope").isString()
            .isEqualTo("#/properties/model/properties/settingWithNestedUiElements/properties/sub2");
        assertThatJson(response).inPath("$.elements[3].scope").isString()
            .isEqualTo("#/properties/model/properties/customSetting");
    }

    @Test
    void testHiddenSettings() throws JsonProcessingException {
        @SuppressWarnings("unused")
        class TestHiddenSettings implements DefaultNodeSettings {
            @Widget(title = "", description = "")
            String m_normalSetting;

            String m_hiddenSetting;

        }
        final var response = buildTestUiSchema(TestHiddenSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(1);
        assertThatJson(response).inPath("$.elements[0].scope").isString()
            .isEqualTo("#/properties/model/properties/normalSetting");
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
        @Widget(title = "", description = "")
        String m_defaultParentSetting;

        @Widget(title = "", description = "")
        @Layout(TestDefaultParentLayout.Section1.class)
        String m_sectionSetting;

        ClusterOfSettings m_clusterOfSettingsDefaultParent;

        @Layout(TestDefaultParentLayout.Section1.class)
        ClusterOfSettings m_clusterOfSettingsInSection;
    }

    @Test
    void testDefaultParent() throws JsonProcessingException {
        final var response = buildTestUiSchema(TestDefaultParentSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        //Default Section
        assertThatJson(response).inPath("$.elements[0].elements").isArray().hasSize(3);
        assertThatJson(response).inPath("$.elements[0].elements[0].scope").isString()
            .isEqualTo("#/properties/model/properties/defaultParentSetting");
        assertThatJson(response).inPath("$.elements[0].elements[1].scope").isString()
            .isEqualTo("#/properties/model/properties/clusterOfSettingsDefaultParent/properties/sub1");
        assertThatJson(response).inPath("$.elements[0].elements[2].scope").isString()
            .isEqualTo("#/properties/model/properties/clusterOfSettingsDefaultParent/properties/sub2");
        //Section1
        assertThatJson(response).inPath("$.elements[1].elements").isArray().hasSize(3);
        assertThatJson(response).inPath("$.elements[1].elements[0].scope").isString()
            .isEqualTo("#/properties/model/properties/sectionSetting");
        assertThatJson(response).inPath("$.elements[1].elements[1].scope").isString()
            .isEqualTo("#/properties/model/properties/clusterOfSettingsInSection/properties/sub1");
        assertThatJson(response).inPath("$.elements[1].elements[2].scope").isString()
            .isEqualTo("#/properties/model/properties/clusterOfSettingsInSection/properties/sub2");
    }

    interface TestDefaultParentOnSuperClassLayout {

        @Section
        interface DefaultSection {
        }

        @Section
        interface FieldSection {
        }

        @Section
        interface SuperClassDefaultSection {
        }

        @Section
        interface SuperClassFieldSection {
        }
    }

    @Layout(TestDefaultParentOnSuperClassLayout.SuperClassDefaultSection.class)
    class SuperClassWithDefaultParent implements DefaultNodeSettings {

        @Widget(title = "", description = "")
        String m_defaultParentSuperClassSetting;

        @Widget(title = "", description = "")
        @Layout(TestDefaultParentOnSuperClassLayout.SuperClassFieldSection.class)
        String m_superClassSetting;

    }

    @Layout(TestDefaultParentOnSuperClassLayout.DefaultSection.class)
    class TestDefaultParentOnSuperClassSettings extends SuperClassWithDefaultParent {

        @Widget(title = "", description = "")
        String m_defaultParentSetting;

        @Widget(title = "", description = "")
        @Layout(TestDefaultParentOnSuperClassLayout.FieldSection.class)
        String m_setting;

    }

    @Test
    void testDefaultParentOnSuperclass() throws JsonProcessingException {
        final var response = buildTestUiSchema(TestDefaultParentOnSuperClassSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(4);
        // DefaultSection
        assertThatJson(response).inPath("$.elements[0].elements").isArray().hasSize(1);
        assertThatJson(response).inPath("$.elements[0].elements[0].scope").isString()
            .isEqualTo("#/properties/model/properties/defaultParentSetting");
        // FieldSection
        assertThatJson(response).inPath("$.elements[1].elements").isArray().hasSize(1);
        assertThatJson(response).inPath("$.elements[1].elements[0].scope").isString()
            .isEqualTo("#/properties/model/properties/setting");
        // SuperClassDefaultSection
        assertThatJson(response).inPath("$.elements[2].elements").isArray().hasSize(1);
        assertThatJson(response).inPath("$.elements[2].elements[0].scope").isString()
            .isEqualTo("#/properties/model/properties/defaultParentSuperClassSetting");
        // SuperClassFieldSection
        assertThatJson(response).inPath("$.elements[3].elements").isArray().hasSize(1);
        assertThatJson(response).inPath("$.elements[3].elements[0].scope").isString()
            .isEqualTo("#/properties/model/properties/superClassSetting");
    }

    interface TestNoLayoutAnnotationLayout {

        @Section
        interface Section1 {
        }
    }

    class TestNoLayoutAnnotationSettings implements DefaultNodeSettings {

        @Widget(title = "", description = "")
        String m_rootSetting;

        @Widget(title = "", description = "")
        @Layout(TestNoLayoutAnnotationLayout.Section1.class)
        String m_sectionSetting;

    }

    @Test
    void testNoLayoutAnnotation() throws JsonProcessingException {
        final var response = buildTestUiSchema(TestNoLayoutAnnotationSettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].scope").isString()
            .isEqualTo("#/properties/model/properties/rootSetting");
        //Section1
        assertThatJson(response).inPath("$.elements[1].elements").isArray().hasSize(1);
        assertThatJson(response).inPath("$.elements[1].elements[0].scope").isString()
            .isEqualTo("#/properties/model/properties/sectionSetting");
    }

    static class TestLayoutWithinSettingsSettings implements DefaultNodeSettings {
        @Section(title = "first")
        static interface Section1 {
        }

        @Section(title = "second")
        static interface Section2 {
        }

        @Widget(title = "", description = "")
        @Layout(Section1.class)
        String m_foo;

        @Widget(title = "", description = "")
        @Layout(Section2.class)
        String m_bar;
    }

    @Test
    void testLayoutWithinSettings() {
        final var response = buildTestUiSchema(TestLayoutWithinSettingsSettings.class);

        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);

        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[0].label").isString().isEqualTo("first");
        assertThatJson(response).inPath("$.elements[0].elements").isArray().hasSize(1);
        assertThatJson(response).inPath("$.elements[0].elements[0].scope").isString()
            .isEqualTo("#/properties/model/properties/foo");

        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[1].label").isString().isEqualTo("second");
        assertThatJson(response).inPath("$.elements[1].elements").isArray().hasSize(1);
        assertThatJson(response).inPath("$.elements[1].elements[0].scope").isString()
            .isEqualTo("#/properties/model/properties/bar");
    }

    static class NoRootForSectionSettings implements DefaultNodeSettings {
        @Widget(title = "", description = "")
        @Layout(SectionWithoutEnclosingClass.class)
        String m_foo;
    }

    @Test
    void testSingleLayoutPartWithoutRoot() {
        var response = buildTestUiSchema(NoRootForSectionSettings.class);

        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[0].elements[0].type").isString().isEqualTo("Control");
        assertThatJson(response).inPath("$.elements[0].elements[0].scope").isString()
            .isEqualTo("#/properties/model/properties/foo");
    }

    static class TestMultipleRootsOne implements DefaultNodeSettings {
        @Section
        static interface Section1 {
        }

        @Widget(title = "", description = "")
        @Layout(Section1.class)
        String m_foo;
    }

    static class TestMultipleRootsTwo implements DefaultNodeSettings {

        @Widget(title = "", description = "")
        @Layout(GeneralTestLayout.GeneralSection1.class)
        String m_bar;
    }

    @Test
    void testThrowsIfMultipleLayoutRootsAreDetected() {
        final Map<SettingsType, Class<? extends WidgetGroup>> settings =
            Map.of(SettingsType.MODEL, TestMultipleRootsOne.class, SettingsType.VIEW, TestMultipleRootsTwo.class);
        assertThrows(UiSchemaGenerationException.class, () -> buildUiSchema(settings));
    }

    static class TestFieldWithTwoLayoutAnnotationsSettings implements DefaultNodeSettings {

        @Section
        interface Section1 {
        }

        @Section
        interface Section2 {
        }

        @Layout(Section1.class)
        class TwoAnnotationsFieldClass implements WidgetGroup {

        }

        @Layout(Section2.class)
        TwoAnnotationsFieldClass m_settingWithTowAnnotations;
    }

    @Test
    void testThrowsIfThereIsAFieldAndAFieldClassAnnotationForAField() {
        assertThrows(IllegalStateException.class,
            () -> buildTestUiSchema(TestFieldWithTwoLayoutAnnotationsSettings.class));
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
            @Widget(title = "", description = "")
            @Layout(TestVirtualSectionLayout.Section1.class)
            String m_setting1;

            @Widget(title = "", description = "")
            @Layout(TestVirtualSectionLayout.Section2.class)
            String m_setting2;

            @Widget(title = "", description = "")
            @Layout(TestVirtualSectionLayout.Section3.class)
            String m_setting3;
        }

        final var response = buildTestUiSchema(VirtualLayoutSettings.class);

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
            @Widget(title = "", description = "")
            @Layout(TestEmptySectionLayout.Section1.class)
            String m_setting1;
        }

        final var response = buildTestUiSchema(TestEmptySectionSettings.class);

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
            @Widget(title = "", description = "")
            @Layout(TestHorizontalLayout.HorizontalGroup.class)
            String m_setting1;

            @Widget(title = "", description = "")
            @Layout(TestHorizontalLayout.HorizontalGroup.class)
            String m_setting2;
        }

        final var response = buildTestUiSchema(TestHorizontalLayoutSettings.class);

        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("HorizontalLayout");
        assertThatJson(response).inPath("$.elements[0].elements[0].scope").isString()
            .isEqualTo("#/properties/model/properties/setting1");
        assertThatJson(response).inPath("$.elements[0].elements[1].scope").isString()
            .isEqualTo("#/properties/model/properties/setting2");
    }

    @Test
    void testVerticalLayout() {

        class TestHorizontalLayoutSettings implements DefaultNodeSettings {

            //   [ ] Use hour   [ ] Use minute
            //   Hours          Minutes
            //   12             45
            @HorizontalLayout
            interface HoursMinutes {

                @VerticalLayout
                interface Hours {
                }

                @After(Hours.class)
                @VerticalLayout
                interface Minutes {
                }
            }

            @Layout(HoursMinutes.Hours.class)
            @Widget(title = "Use hour", description = "")
            boolean m_useHour;

            @Layout(HoursMinutes.Hours.class)
            @Widget(title = "Hours", description = "")
            int m_hour = 0;

            @Layout(HoursMinutes.Minutes.class)
            @Widget(title = "Use minute", description = "")
            boolean m_useMinute;

            @Layout(HoursMinutes.Minutes.class)
            @Widget(title = "Minutes", description = "")
            int m_minute = 0;
        }

        final var response = buildTestUiSchema(TestHorizontalLayoutSettings.class);

        // Assertions for the outer structure
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("HorizontalLayout");

        // Assertions for the first VerticalLayout
        assertThatJson(response).inPath("$.elements[0].elements[0].type").isString().isEqualTo("VerticalLayout");
        assertThatJson(response).inPath("$.elements[0].elements[0].elements[0].scope").isString()
            .isEqualTo("#/properties/model/properties/useHour");
        assertThatJson(response).inPath("$.elements[0].elements[0].elements[1].scope").isString()
            .isEqualTo("#/properties/model/properties/hour");

        // Assertions for the second VerticalLayout
        assertThatJson(response).inPath("$.elements[0].elements[1].type").isString().isEqualTo("VerticalLayout");
        assertThatJson(response).inPath("$.elements[0].elements[1].elements[0].scope").isString()
            .isEqualTo("#/properties/model/properties/useMinute");
        assertThatJson(response).inPath("$.elements[0].elements[1].elements[1].scope").isString()
            .isEqualTo("#/properties/model/properties/minute");
    }

    @Test
    void testVennDiagram() {
        interface TestVennDiagramLayout {

            @CheckboxesWithVennDiagram
            interface Venn {
            }
        }

        class TestHorizontalLayoutSettings implements DefaultNodeSettings {
            @Widget(title = "", description = "")
            @Layout(TestVennDiagramLayout.Venn.class)
            String m_inner;

            @Widget(title = "", description = "")
            @Layout(TestVennDiagramLayout.Venn.class)
            String m_left;

            @Widget(title = "", description = "")
            @Layout(TestVennDiagramLayout.Venn.class)
            String m_right;
        }

        final var response = buildTestUiSchema(TestHorizontalLayoutSettings.class);

        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("VennDiagram");
        assertThatJson(response).inPath("$.elements[0].elements[0].scope").isString()
            .isEqualTo("#/properties/model/properties/inner");
        assertThatJson(response).inPath("$.elements[0].elements[1].scope").isString()
            .isEqualTo("#/properties/model/properties/left");
        assertThatJson(response).inPath("$.elements[0].elements[2].scope").isString()
            .isEqualTo("#/properties/model/properties/right");
    }

    @Inside(FirstSection.class)
    interface SuperclassAnnotationTestLayout {

        abstract class CenterLayout implements PersistableSettings, WidgetGroup {
            @HorizontalLayout()
            interface CenterLayoutInnerLayout {
            }
        }

        class CenterLayoutExtended extends CenterLayout {
            @Widget(title = "", description = "")
            @Layout(CenterLayoutInnerLayout.class)
            String centerLayoutElement1;

            @Widget(title = "", description = "")
            @Layout(CenterLayoutInnerLayout.class)
            String centerLayoutElement2;
        }

        @Before(CenterLayout.class)
        interface BeforeCenterLayout {
        }

        @After(CenterLayout.class)
        interface AfterCenterLayout {
        }
    }

    @Test
    void testLayoutAnnotationsOnSuperclass() {

        class TestSettings implements DefaultNodeSettings {

            @Widget(title = "", description = "")
            @Layout(BeforeCenterLayout.class)
            int intBeforeCenterLayout;

            CenterLayoutExtended secondSection = new CenterLayoutExtended();

            @Widget(title = "", description = "")
            @Layout(AfterCenterLayout.class)
            String stringAfterCenterLayout;

            @Widget(title = "", description = "")
            @Layout(SecondSection.class)
            String stringInSecondSection;
        }

        final var response = buildTestUiSchema(TestSettings.class);

        assertThatJson(response).inPath("$.elements[0].label").isString().isEqualTo("First");
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[0].elements").isArray().hasSize(3);
        assertThatJson(response).inPath("$.elements[0].elements[0].scope").isString().contains("intBeforeCenterLayout");
        assertThatJson(response).inPath("$.elements[0].elements[1].type").isEqualTo("HorizontalLayout");
        assertThatJson(response).inPath("$.elements[0].elements[1].elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].elements[1].elements[0].scope").isString()
            .contains("centerLayoutElement1");
        assertThatJson(response).inPath("$.elements[0].elements[1].elements[1].scope").isString()
            .contains("centerLayoutElement2");
        assertThatJson(response).inPath("$.elements[0].elements[2].scope").isString()
            .contains("stringAfterCenterLayout");

        assertThatJson(response).inPath("$.elements[1].label").isString().isEqualTo("Second");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[1].elements[0].scope").isString().contains("stringInSecondSection");

    }

}
