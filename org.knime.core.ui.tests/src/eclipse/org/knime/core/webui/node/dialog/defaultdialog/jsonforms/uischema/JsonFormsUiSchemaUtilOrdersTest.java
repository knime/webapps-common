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

import java.util.Map;

import org.junit.jupiter.api.Test;
import org.knime.core.webui.node.dialog.defaultdialog.DefaultNodeSettings;
import org.knime.core.webui.node.dialog.defaultdialog.layout.After;
import org.knime.core.webui.node.dialog.defaultdialog.layout.Before;
import org.knime.core.webui.node.dialog.defaultdialog.layout.Inside;
import org.knime.core.webui.node.dialog.defaultdialog.layout.Layout;
import org.knime.core.webui.node.dialog.defaultdialog.layout.Section;

/**
 * Test ordering layout parts in the UI schema with the {@link Before} and {@link After} annotations.
 *
 * @author Benjamin Wilhelm, KNIME GmbH, Konstanz, Germany
 * @author Paul Bärnreuther
 */
@SuppressWarnings("java:S2698") // we accept assertions without messages
class JsonFormsUiSchemaUtilOrdersTest {

    @Test
    void testOrder() {
        interface TestOrderLayout {
            // Expected order: Section2, Section3, Section1

            @Section(title = "Section1")
            @After(Section3.class)
            interface Section1 {
            }

            @Section(title = "Section2")
            @Before(Section1.class)
            interface Section2 {
            }

            @Section(title = "Section3")
            interface Section3 {
            }
        }

        class DummySettings implements DefaultNodeSettings {
            @Layout(TestOrderLayout.Section1.class)
            String m_setting1;

            @Layout(TestOrderLayout.Section2.class)
            String m_setting2;

            @Layout(TestOrderLayout.Section3.class)
            String m_setting3;
        }

        final var response = JsonFormsUiSchemaUtilTest.buildTestUiSchema(DummySettings.class);

        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[0].label").isString().isEqualTo("Section2");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[1].label").isString().isEqualTo("Section3");
        assertThatJson(response).inPath("$.elements[2].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[2].label").isString().isEqualTo("Section1");
    }

    @Test
    void testOrderWithUnnecessaryButValidAnnotations() {
        interface TestOrderLayout {
            // Expected order: Section4, Section3, Section2, Section1

            @Section(title = "Section1")
            @After(Section2.class)
            interface Section1 {
            }

            @Section(title = "Section2")
            @Before(Section1.class)
            @After(Section3.class)
            interface Section2 {
            }

            @Section(title = "Section3")
            @Before(Section1.class)
            @After(Section4.class)
            interface Section3 {
            }

            @Section(title = "Section4")
            @Before(Section1.class)
            interface Section4 {
            }
        }

        class DummySettings implements DefaultNodeSettings {
            @Layout(TestOrderLayout.Section1.class)
            String m_setting1;

            @Layout(TestOrderLayout.Section2.class)
            String m_setting2;

            @Layout(TestOrderLayout.Section3.class)
            String m_setting3;

            @Layout(TestOrderLayout.Section4.class)
            String m_setting4;
        }

        final var response = JsonFormsUiSchemaUtilTest.buildTestUiSchema(DummySettings.class);

        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[0].label").isString().isEqualTo("Section4");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[1].label").isString().isEqualTo("Section3");
        assertThatJson(response).inPath("$.elements[2].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[2].label").isString().isEqualTo("Section2");
        assertThatJson(response).inPath("$.elements[3].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[3].label").isString().isEqualTo("Section1");
    }

    @Test
    void testAlphabeticOrdering() {
        interface TestOrderLayout {
            // Expected order: Section2, Section1, Section3
            // NOTE:
            // Section1 should come after Section2 by the @After annotation
            // Section3 should come after Section1 by alphabetic order

            @Section(title = "Section3")
            interface Section3 {
            }

            @Section(title = "Section1")
            @After(Section2.class)
            interface Section1 {
            }

            @Section(title = "Section2")
            interface Section2 {
            }

        }

        class DummySettings implements DefaultNodeSettings {
            @Layout(TestOrderLayout.Section1.class)
            String m_setting1;

            @Layout(TestOrderLayout.Section2.class)
            String m_setting2;

            @Layout(TestOrderLayout.Section3.class)
            String m_setting3;
        }

        final var response = JsonFormsUiSchemaUtilTest.buildTestUiSchema(DummySettings.class);

        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[0].label").isString().isEqualTo("Section2");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[1].label").isString().isEqualTo("Section1");
        assertThatJson(response).inPath("$.elements[2].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[2].label").isString().isEqualTo("Section3");
    }

    @Test
    void testOrderBetweenSectionsWithDifferentRoots() {

        interface SpecializedLayout {
            // Adds SpecialSection1 between GeneralSection2 and GeneralSection1
            //  and SpecialSection2 before SpecialSection1 (after GeneralSection* because of alphabetic ordering)

            @Section(title = "SpecialSection1")
            @After(GeneralTestLayout.GeneralSection2.class)
            @Before(GeneralTestLayout.GeneralSection1.class)
            interface SpecialSection1 {
            }

            @Section(title = "SpecialSection2")
            @Before(SpecialSection1.class)
            interface SpecialSection2 {
            }
        }

        class DummySettings implements DefaultNodeSettings {
            @Layout(GeneralTestLayout.GeneralSection1.class)
            String m_setting1;

            @Layout(GeneralTestLayout.GeneralSection2.class)
            String m_setting2;

            @Layout(GeneralTestLayout.GeneralSection3.class)
            String m_setting3;

            @Layout(SpecializedLayout.SpecialSection1.class)
            String m_setting4;

            @Layout(SpecializedLayout.SpecialSection2.class)
            String m_setting5;
        }

        final var response = JsonFormsUiSchemaUtilTest.buildTestUiSchema(DummySettings.class);

        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[0].label").isString().isEqualTo("GeneralSection3");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[1].label").isString().isEqualTo("GeneralSection2");
        assertThatJson(response).inPath("$.elements[2].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[2].label").isString().isEqualTo("SpecialSection2");
        assertThatJson(response).inPath("$.elements[3].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[3].label").isString().isEqualTo("SpecialSection1");
        assertThatJson(response).inPath("$.elements[4].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[4].label").isString().isEqualTo("GeneralSection1");
    }

    @Test
    void testComplexOrderBetweenSectionsWithDifferentRoots() {

        interface SpecializedLayout {

            @Section(title = "SpecialSection1")
            @Before(GeneralTestLayout.GeneralSection1.class)
            interface SpecialSection1 {
                interface SubPartOfSpecialSection1 {

                }
            }

            @Section(title = "SpecialSection2")
            @Before(SpecialSection1.class)
            @Before(GeneralTestLayout.GeneralSection2.class)
            interface SpecialSection2 {
            }

            @Section(title = "SpecialSection3")
            @Before(SpecialSection2.class)
            @After(GeneralTestLayout.GeneralSection3.class)
            interface SpecialSection3 {
                interface SubPartOfSpecialSection3 {

                }
            }
        }

        class DummySettings implements DefaultNodeSettings {
            @Layout(GeneralTestLayout.GeneralSection1.class)
            String m_setting1;

            @Layout(SpecializedLayout.SpecialSection1.SubPartOfSpecialSection1.class)
            String m_specialSetting1;

            @Layout(SpecializedLayout.SpecialSection2.class)
            String m_specialSetting2;

            @Layout(SpecializedLayout.SpecialSection3.SubPartOfSpecialSection3.class)
            String m_specialSetting3;

            @Layout(GeneralTestLayout.GeneralSection2.class)
            String m_setting2;

            @Layout(GeneralTestLayout.GeneralSection3.class)
            String m_setting3;
        }

        final var response = JsonFormsUiSchemaUtilTest.buildTestUiSchema(DummySettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(6);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[0].label").isString().isEqualTo("GeneralSection3");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[1].label").isString().isEqualTo("SpecialSection3");
        assertThatJson(response).inPath("$.elements[2].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[2].label").isString().isEqualTo("SpecialSection2");
        assertThatJson(response).inPath("$.elements[3].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[3].label").isString().isEqualTo("GeneralSection2");
        assertThatJson(response).inPath("$.elements[4].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[4].label").isString().isEqualTo("SpecialSection1");
        assertThatJson(response).inPath("$.elements[5].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[5].label").isString().isEqualTo("GeneralSection1");
    }

    @Test
    void testThrowsIfCycleByBefore() {
        interface TestBeforeCycleLayout {

            @Section(title = "Section1")
            @Before(Section2.class)
            interface Section1 {
            }

            @Section(title = "Section2")
            @Before(Section1.class)
            interface Section2 {
            }
        }

        class DummySettings implements DefaultNodeSettings {
            @Layout(TestBeforeCycleLayout.Section1.class)
            String m_setting1;

            @Layout(TestBeforeCycleLayout.Section2.class)
            String m_setting2;
        }

        final Map<String, Class<?>> settings = Map.of("test", DummySettings.class);
        assertThrows(UiSchemaGenerationException.class, () -> JsonFormsUiSchemaUtilTest.buildUiSchema(settings));
    }

    @Test
    void testThrowsIfCycleByAfter() {
        interface TestAfterCycleLayout {

            @Section(title = "Section1")
            @After(Section2.class)
            interface Section1 {
            }

            @Section(title = "Section2")
            @After(Section1.class)
            interface Section2 {
            }
        }

        class DummySettings implements DefaultNodeSettings {
            @Layout(TestAfterCycleLayout.Section1.class)
            String m_setting1;

            @Layout(TestAfterCycleLayout.Section2.class)
            String m_setting2;
        }

        final Map<String, Class<?>> settings = Map.of("test", DummySettings.class);
        assertThrows(UiSchemaGenerationException.class, () -> JsonFormsUiSchemaUtilTest.buildUiSchema(settings));
    }

    @Test
    void testThrowsIfComplexCycle() {
        interface TestComplexOrderCycleLayout {
            // Cycle: Section1 before Section2, Section2 before Section3, Section3 before Section1

            @Section(title = "Section1")
            interface Section1 {
            }

            @Section(title = "Section2")
            @After(Section1.class)
            @Before(Section3.class)
            interface Section2 {
            }

            @Section(title = "Section3")
            @Before(Section1.class)
            interface Section3 {
            }
        }

        class DummySettings implements DefaultNodeSettings {
            @Layout(TestComplexOrderCycleLayout.Section1.class)
            String m_setting1;

            @Layout(TestComplexOrderCycleLayout.Section2.class)
            String m_setting2;

            @Layout(TestComplexOrderCycleLayout.Section3.class)
            String m_setting3;
        }

        final Map<String, Class<?>> settings = Map.of("test", DummySettings.class);
        assertThrows(UiSchemaGenerationException.class, () -> JsonFormsUiSchemaUtilTest.buildUiSchema(settings));
    }

    @Test
    void testThrowsIfReferenceNonNestSiblingsBefore() {

        interface TestNonSiblingsReferenceLayout {
            // InnerSection references Section1 via the @Before annotation but they are not on the same level

            @Section(title = "Section1")
            interface Section1 {
            }

            @Section(title = "Section2")
            interface Section2 {

                @Section(title = "InnerSection")
                @Before(Section1.class)
                interface InnerSection {

                }
            }
        }

        class DummySettings implements DefaultNodeSettings {
            @Layout(TestNonSiblingsReferenceLayout.Section1.class)
            String m_setting1;

            @Layout(TestNonSiblingsReferenceLayout.Section2.InnerSection.class)
            String m_setting3;
        }

        assertThrows(UiSchemaGenerationException.class,
            () -> JsonFormsUiSchemaUtilTest.buildTestUiSchema(DummySettings.class));
    }

    @Test
    void testThrowsIfReferenceNonNestSiblingsInside() {

        interface TestNonSiblingsReferenceLayout {

            @Section(title = "Section1")
            interface Section1 {
            }

            @Section(title = "Section2")
            interface Section2 {

                @Section(title = "InnerSection")
                @Inside(Section1.class)
                interface InnerSection {

                }
            }
        }

        class DummySettings implements DefaultNodeSettings {
            @Layout(TestNonSiblingsReferenceLayout.Section1.class)
            String m_setting1;

            @Layout(TestNonSiblingsReferenceLayout.Section2.InnerSection.class)
            String m_setting3;
        }

        assertThrows(UiSchemaGenerationException.class,
            () -> JsonFormsUiSchemaUtilTest.buildTestUiSchema(DummySettings.class));
    }

    @Test
    void testAfterRepeatable() {
        interface TestAfterRepeatableLayout {

            @After(Section2.class)
            @After(Section3.class)
            @Section(title = "Section1")
            interface Section1 {
            }

            @Section(title = "Section2")
            interface Section2 {
            }

            @Section(title = "Section3")
            interface Section3 {
            }
        }

        class DummySettings implements DefaultNodeSettings {
            @Layout(TestAfterRepeatableLayout.Section1.class)
            String m_setting1;

            @Layout(TestAfterRepeatableLayout.Section2.class)
            String m_setting2;

            @Layout(TestAfterRepeatableLayout.Section3.class)
            String m_setting3;
        }

        final var response = JsonFormsUiSchemaUtilTest.buildTestUiSchema(DummySettings.class);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[0].label").isString().isEqualTo("Section2");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[1].label").isString().isEqualTo("Section3");
        assertThatJson(response).inPath("$.elements[2].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[2].label").isString().isEqualTo("Section1");
    }

    @Test
    void testBeforeRepeatable() {
        interface TestBeforeRepeatableLayout {

            @Section(title = "Section1")
            interface Section1 {
            }

            @Section(title = "Section2")
            interface Section2 {
            }

            @Before(Section1.class)
            @Before(Section2.class)
            @Section(title = "Section3")
            interface Section3 {
            }
        }

        class DummySettings implements DefaultNodeSettings {
            @Layout(TestBeforeRepeatableLayout.Section1.class)
            String m_setting1;

            @Layout(TestBeforeRepeatableLayout.Section2.class)
            String m_setting2;

            @Layout(TestBeforeRepeatableLayout.Section3.class)
            String m_setting3;
        }

        final var response = JsonFormsUiSchemaUtilTest.buildTestUiSchema(DummySettings.class);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[0].label").isString().isEqualTo("Section3");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[1].label").isString().isEqualTo("Section1");
        assertThatJson(response).inPath("$.elements[2].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[2].label").isString().isEqualTo("Section2");
    }

    @Test
    void testOrderingByInvisibleSections() {
        interface TestOrderByInvisibleSectionsLayout {

            @Section(title = "Section1")
            interface Section1 {
            }

            @Before(Section1.class)
            @Section(title = "Section2")
            interface Section2 {
            }

            @Before(Section2.class)
            @Section(title = "Section3")
            interface Section3 {
            }
        }

        class DummySettings implements DefaultNodeSettings {
            @Layout(TestOrderByInvisibleSectionsLayout.Section1.class)
            String m_setting1;

            @Layout(TestOrderByInvisibleSectionsLayout.Section3.class)
            String m_setting3;
        }

        final var response = JsonFormsUiSchemaUtilTest.buildTestUiSchema(DummySettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[0].label").isString().isEqualTo("Section3");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[1].label").isString().isEqualTo("Section1");
    }

    @Test
    void testDifferentPointToLocationsForSiblings() {
        interface TestDifferentLocationsForSiblingsLayout {
            @Section(title = "Section1")
            @After(GeneralTestLayout.GeneralSection1.class)
            interface Section1 {
            }

            @Section(title = "Section2")
            @After(GeneralTestLayout.GeneralSection3.Sub.class)
            interface Section2 {
            }

        }
        class DummySettings implements DefaultNodeSettings {
            @Layout(TestDifferentLocationsForSiblingsLayout.Section1.class)
            String m_setting1;

            @Layout(TestDifferentLocationsForSiblingsLayout.Section2.class)
            String m_setting2;
        }

        final var response = JsonFormsUiSchemaUtilTest.buildTestUiSchema(DummySettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[0].label").isString().isEqualTo("GeneralSection3");
        assertThatJson(response).inPath("$.elements[0].elements").isArray().hasSize(1);
        assertThatJson(response).inPath("$.elements[0].elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[0].elements[0].label").isString().isEqualTo("Section2");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[1].label").isString().isEqualTo("Section1");
    }

    @Test
    void testInside() {
        interface TestInsideLayout {

            @Section(title = "Section1")
            @Inside(GeneralTestLayout.GeneralSection1.class)
            interface Section1 {
            }

            @Before(Section1.class)
            @Section(title = "Section2")
            interface Section2 {
            }

            @Inside(GeneralTestLayout.GeneralSection2.class)
            @Section(title = "Section3")
            interface Section3 {
            }
        }

        class DummySettings implements DefaultNodeSettings {
            @Layout(TestInsideLayout.Section1.class)
            String m_setting1;

            @Layout(TestInsideLayout.Section2.class)
            String m_setting2;

            @Layout(TestInsideLayout.Section3.class)
            String m_setting3;
        }

        final var response = JsonFormsUiSchemaUtilTest.buildTestUiSchema(DummySettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[0].label").isString().isEqualTo("GeneralSection2");
        assertThatJson(response).inPath("$.elements[0].elements").isArray().hasSize(1);
        assertThatJson(response).inPath("$.elements[0].elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[0].elements[0].label").isString().isEqualTo("Section3");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[1].label").isString().isEqualTo("GeneralSection1");
        assertThatJson(response).inPath("$.elements[1].elements").isArray().hasSize(2);
        assertThatJson(response).inPath("$.elements[1].elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[1].elements[0].label").isString().isEqualTo("Section2");
        assertThatJson(response).inPath("$.elements[1].elements[1].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[1].elements[1].label").isString().isEqualTo("Section1");
    }

    @Test
    void throwsOnConflictingOrderAnnotations() {
        interface TestConflictingAnnotationsLayout {

            /**
             * conflict because Section2 is inside OtherGeneralSection1 but also references Section1 as a sibling which
             * points to GeneralSection1
             */

            @Section(title = "Section1")
            @After(GeneralTestLayout.GeneralSection1.class)
            interface Section1 {
            }

            @Before(Section1.class)
            @Inside(OtherGeneralTestLayout.OtherGeneralSection1.class)
            @Section(title = "Section2")
            interface Section2 {
            }
        }

        class DummySettings implements DefaultNodeSettings {
            @Layout(TestConflictingAnnotationsLayout.Section1.class)
            String m_setting1;

            @Layout(TestConflictingAnnotationsLayout.Section2.class)
            String m_setting2;
        }

        final Map<String, Class<?>> settings = Map.of("test", DummySettings.class);
        assertThrows(UiSchemaGenerationException.class, () -> JsonFormsUiSchemaUtilTest.buildUiSchema(settings));
    }

    @Test
    void testResolvesTransitivePointers() {
        interface TestTransitiveAnnotationsLayout {

            /**
             * no conflict because while Section2 references OtherGeneralSection2 and also references Section1 as a
             * sibling which points to GeneralSection1, OtherGeneralSection2 also points to GeneralSection1
             */

            @Section(title = "Section1")
            @After(GeneralTestLayout.GeneralSection1.class)
            interface Section1 {
            }

            @Before(Section1.class)
            @Before(OtherGeneralTestLayout.OtherGeneralSection2.class)
            @Section(title = "Section2")
            interface Section2 {
            }
        }

        class DummySettings implements DefaultNodeSettings {
            @Layout(TestTransitiveAnnotationsLayout.Section1.class)
            String m_setting1;

            @Layout(TestTransitiveAnnotationsLayout.Section2.class)
            String m_setting2;

            @Layout(GeneralTestLayout.GeneralSection1.class)
            String m_generalSetting;

            @Layout(OtherGeneralTestLayout.OtherGeneralSection2.class)
            String m_otherGeneralSetting;
        }

        final var response = JsonFormsUiSchemaUtilTest.buildTestUiSchema(DummySettings.class);
        assertThatJson(response).inPath("$.elements").isArray().hasSize(4);
        assertThatJson(response).inPath("$.elements[0].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[0].label").isString().isEqualTo("GeneralSection1");
        assertThatJson(response).inPath("$.elements[1].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[1].label").isString().isEqualTo("Section2");
        assertThatJson(response).inPath("$.elements[2].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[2].label").isString().isEqualTo("OtherGeneralSection2");
        assertThatJson(response).inPath("$.elements[3].type").isString().isEqualTo("Section");
        assertThatJson(response).inPath("$.elements[3].label").isString().isEqualTo("Section1");
    }

    @Test
    void throwsIfThereAreCircularDependenciesOfReferencesToNonSiblings() {

        class DummySettings implements DefaultNodeSettings {
            @Layout(OtherGeneralTestLayout.CircularSection.class)
            String m_setting1;

        }

        final Map<String, Class<?>> settings = Map.of("test", DummySettings.class);
        assertThrows(UiSchemaGenerationException.class, () -> JsonFormsUiSchemaUtilTest.buildUiSchema(settings));

    }
}